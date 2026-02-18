// Business scraping utilities
export interface BusinessData {
  name: string
  website: string
  phone: string
  email: string
  address: string
  placeId?: string
  rating?: number
  reviewCount?: number
}

export interface ScrapedWebsiteData {
  title: string
  description: string
  hasSSL: boolean
  loadTime: number
  isMobileResponsive: boolean
  hasContactInfo: boolean
  hasCallToAction: boolean
  metaDescription: string
  headings: string[]
  images: number
  links: number
  brokenLinks: number
}

// Google Places API integration - REAL DATA ONLY
export async function findBusinessesWithPlaces(location: string, niche: string): Promise<BusinessData[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    throw new Error(
      "Google Places API key is required. Please add GOOGLE_PLACES_API_KEY to your environment variables.",
    )
  }

  try {
    const searchQuery = `${niche} businesses in ${location}`
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}&type=establishment`

    console.log(`Searching for: ${searchQuery}`)
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (searchData.status !== "OK") {
      throw new Error(`Google Places API error: ${searchData.status} - ${searchData.error_message || "Unknown error"}`)
    }

    if (!searchData.results || searchData.results.length === 0) {
      throw new Error(`No ${niche} businesses found in ${location}. Try a different location or niche.`)
    }

    // Get detailed information for each place
    const businesses: BusinessData[] = []
    const places = searchData.results.slice(0, 10) // Limit to 10 results

    console.log(`Found ${places.length} businesses, fetching details...`)

    for (const place of places) {
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,business_status,opening_hours&key=${apiKey}`

        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()

        if (detailsData.status === "OK" && detailsData.result) {
          const result = detailsData.result

          if (result.business_status === "OPERATIONAL" || !result.business_status) {
            businesses.push({
              name: result.name || place.name,
              website: result.website || "",
              phone: result.formatted_phone_number || "",
              email: "", // Will be scraped from website
              address: result.formatted_address || place.formatted_address,
              placeId: place.place_id,
              rating: result.rating || 0,
              reviewCount: result.user_ratings_total || 0,
            })
          }
        }
      } catch (error) {
        console.error(`Error fetching details for place ${place.place_id}:`, error)
        // Continue with other businesses instead of failing completely
      }
    }

    if (businesses.length === 0) {
      throw new Error(`No operational ${niche} businesses found in ${location} with complete data.`)
    }

    console.log(`Successfully found ${businesses.length} businesses`)
    return businesses
  } catch (error) {
    console.error("Error with Google Places API:", error)
    throw error // Don't fall back to mock data, throw the error
  }
}

export async function scrapeWebsiteData(url: string): Promise<ScrapedWebsiteData> {
  const defaultData: ScrapedWebsiteData = {
    title: "",
    description: "",
    hasSSL: false,
    loadTime: 0,
    isMobileResponsive: false,
    hasContactInfo: false,
    hasCallToAction: false,
    metaDescription: "",
    headings: [],
    images: 0,
    links: 0,
    brokenLinks: 0,
  }

  if (!url || !url.startsWith("http")) {
    return defaultData
  }

  try {
    const startTime = Date.now()

    let html = ""
    let response: Response

    try {
      // Method 1: Direct fetch (works for CORS-enabled sites)
      response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          DNT: "1",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        mode: "cors",
      })

      if (response.ok) {
        html = await response.text()
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (directError) {
      console.log(`Direct fetch failed for ${url}, trying proxy...`)

      // Method 2: CORS proxy fallback
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      response = await fetch(proxyUrl)

      if (!response.ok) {
        throw new Error(`Proxy fetch failed: HTTP ${response.status}`)
      }

      const data = await response.json()
      html = data.contents
    }

    const loadTime = Date.now() - startTime

    // Parse HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    const title = doc.querySelector("title")?.textContent?.trim() || ""
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || ""
    const hasSSL = url.startsWith("https://")

    // Check for mobile responsiveness
    const viewport = doc.querySelector('meta[name="viewport"]')
    const isMobileResponsive = !!viewport && viewport.getAttribute("content")?.includes("width=device-width")

    // Extract headings with better filtering
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"))
      .map((h) => h.textContent?.trim() || "")
      .filter((h) => h.length > 0 && h.length < 200) // Filter out empty and overly long headings

    // Count images and links with better validation
    const images = Array.from(doc.querySelectorAll("img")).filter(
      (img) => img.src && !img.src.includes("data:image") && img.src.length > 10,
    ).length

    const links = Array.from(doc.querySelectorAll("a[href]")).filter(
      (link) => link.href && link.href.startsWith("http") && !link.href.includes("javascript:"),
    ).length

    const bodyText = doc.body?.textContent?.toLowerCase() || ""
    const hasContactInfo =
      /contact\s+(us|info|details)|phone|email|call\s+(us|now)|reach\s+out|get\s+in\s+touch/i.test(bodyText) ||
      doc.querySelector('a[href^="tel:"], a[href^="mailto:"], .contact, #contact') !== null ||
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(bodyText) // Phone number pattern

    const ctaKeywords =
      /book\s+(now|appointment)|order\s+(now|online)|buy\s+now|contact\s+(us|now)|call\s+(now|today)|get\s+(quote|started)|learn\s+more|sign\s+up|schedule|reserve|purchase|shop\s+now/i
    const hasCallToAction =
      ctaKeywords.test(bodyText) ||
      doc.querySelector("button, .btn, .cta, .call-to-action, input[type='submit']") !== null ||
      Array.from(doc.querySelectorAll("a")).some(
        (link) =>
          ctaKeywords.test(link.textContent || "") ||
          link.className.toLowerCase().includes("btn") ||
          link.className.toLowerCase().includes("cta"),
      )

    // Get page description from content
    const description =
      metaDescription ||
      doc.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
      bodyText.substring(0, 300).replace(/\s+/g, " ").trim()

    return {
      title,
      description,
      hasSSL,
      loadTime,
      isMobileResponsive,
      hasContactInfo,
      hasCallToAction,
      metaDescription,
      headings: headings.slice(0, 10),
      images,
      links,
      brokenLinks: 0, // Would need additional checking
    }
  } catch (error) {
    console.error(`Error scraping website ${url}:`, error)
    return {
      ...defaultData,
      title: "Unable to analyze website",
      description: `Website analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export function extractEmailFromContent(content: string): string {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const matches = content.match(emailRegex)

  if (matches && matches.length > 0) {
    // Filter out common non-business emails and prioritize business emails
    const businessEmails = matches.filter(
      (email) =>
        !email.includes("noreply") &&
        !email.includes("no-reply") &&
        !email.includes("example.com") &&
        !email.includes("test.com") &&
        !email.includes("placeholder") &&
        !email.includes("yoursite.com") &&
        email.length > 5,
    )

    // Prioritize info@, contact@, hello@ emails
    const priorityEmails = businessEmails.filter((email) =>
      /^(info|contact|hello|enquiries|sales|support)@/i.test(email),
    )

    return priorityEmails[0] || businessEmails[0] || matches[0]
  }

  return ""
}

// Fallback mock data function
function getMockBusinesses(niche: string): BusinessData[] {
  const mockBusinesses: Record<string, BusinessData[]> = {
    restaurants: [
      {
        name: "The Ivy Harrogate Brasserie",
        website: "https://theivyharrogate.com",
        phone: "+44 1423 202100",
        email: "harrogate@theivyrestaurants.com",
        address: "18 Parliament St, Harrogate HG1 2QU",
        rating: 4.5,
        reviewCount: 1250,
      },
      {
        name: "Drum & Monkey",
        website: "https://drumandmonkey.co.uk",
        phone: "+44 1423 502650",
        email: "info@drumandmonkey.co.uk",
        address: "5 Montpellier Gardens, Harrogate HG1 2TF",
        rating: 4.3,
        reviewCount: 890,
      },
      {
        name: "Van Zeller Restaurant",
        website: "https://vanzeller.co.uk",
        phone: "+44 1423 508762",
        email: "info@vanzeller.co.uk",
        address: "8 Montpellier St, Harrogate HG1 2TQ",
        rating: 4.7,
        reviewCount: 456,
      },
      {
        name: "Clocktower Cafe",
        website: "https://clocktowercafe.co.uk",
        phone: "+44 1423 567891",
        email: "hello@clocktowercafe.co.uk",
        address: "34 Parliament St, Harrogate HG1 2RL",
        rating: 4.2,
        reviewCount: 234,
      },
      {
        name: "Harrogate Brasserie",
        website: "https://harrogatebrass.co.uk",
        phone: "+44 1423 505041",
        email: "bookings@harrogatebrass.co.uk",
        address: "28-30 Cheltenham Crescent, Harrogate HG1 1DH",
        rating: 4.4,
        reviewCount: 678,
      },
    ],
    dentists: [
      {
        name: "Harrogate Dental Practice",
        website: "https://harrogatedental.co.uk",
        phone: "+44 1423 504123",
        email: "reception@harrogatedental.co.uk",
        address: "12 Kings Rd, Harrogate HG1 5JX",
        rating: 4.8,
        reviewCount: 156,
      },
      {
        name: "Smile Studio Harrogate",
        website: "https://smilestudioharrogate.com",
        phone: "+44 1423 567234",
        email: "info@smilestudioharrogate.com",
        address: "45 Parliament St, Harrogate HG1 2RL",
        rating: 4.6,
        reviewCount: 203,
      },
      {
        name: "Knaresborough Road Dental",
        website: "https://knaresboroughdental.co.uk",
        phone: "+44 1423 501789",
        email: "appointments@knaresboroughdental.co.uk",
        address: "78 Knaresborough Rd, Harrogate HG2 7DX",
        rating: 4.5,
        reviewCount: 89,
      },
    ],
    plumbers: [
      {
        name: "Yorkshire Plumbing Services",
        website: "https://yorkshireplumbing.co.uk",
        phone: "+44 1423 789456",
        email: "info@yorkshireplumbing.co.uk",
        address: "Unit 5, Harrogate Business Park, HG3 1DH",
        rating: 4.3,
        reviewCount: 145,
      },
      {
        name: "Harrogate Emergency Plumbers",
        website: "https://harrogateemergencyplumbers.com",
        phone: "+44 1423 654321",
        email: "emergency@harrogateemergencyplumbers.com",
        address: "23 Station Parade, Harrogate HG1 1UE",
        rating: 4.1,
        reviewCount: 78,
      },
    ],
  }

  return mockBusinesses[niche.toLowerCase()] || mockBusinesses.restaurants
}
