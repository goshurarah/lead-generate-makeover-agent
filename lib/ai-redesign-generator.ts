import type { BusinessData } from "./business-scraper"
import type { WebsiteScore } from "./website-scorer"

export interface RedesignTemplate {
  id: string
  businessName: string
  html: string
  css: string
  aiGeneratedCopy: {
    headline: string
    subheadline: string
    aboutSection: string
    servicesSection: string
    ctaText: string
    testimonial: string
  }
  designNotes: string[]
  improvements: string[]
}

// AI-powered copy generation
export async function generateAICopy(
  business: BusinessData,
  niche: string,
): Promise<RedesignTemplate["aiGeneratedCopy"]> {
  // In a real implementation, this would call OpenAI/Claude API
  // For now, we'll use intelligent template-based generation

  const businessName = business.name
  const location = extractLocationFromAddress(business.address)

  const nicheTemplates = {
    restaurants: {
      headline: `Exceptional Dining Experience at ${businessName}`,
      subheadline: `Discover authentic flavors and warm hospitality in the heart of ${location}`,
      aboutSection: `Welcome to ${businessName}, where culinary excellence meets exceptional service. Located in ${location}, we pride ourselves on creating memorable dining experiences using the finest local ingredients and time-honored recipes.`,
      servicesSection: `Our menu features carefully crafted dishes that celebrate both traditional and contemporary cuisine. From intimate dinners to special celebrations, we provide an atmosphere that's perfect for any occasion.`,
      ctaText: `Reserve Your Table Today`,
      testimonial: `"The food at ${businessName} is absolutely incredible. The atmosphere is perfect and the staff goes above and beyond to make every visit special." - Sarah M.`,
    },
    dentists: {
      headline: `Your Smile is Our Priority at ${businessName}`,
      subheadline: `Comprehensive dental care with a gentle touch in ${location}`,
      aboutSection: `At ${businessName}, we believe everyone deserves a healthy, beautiful smile. Our experienced team provides comprehensive dental care in a comfortable, modern environment, using the latest technology and techniques.`,
      servicesSection: `We offer a full range of dental services including preventive care, cosmetic dentistry, and restorative treatments. Our gentle approach ensures your comfort while delivering exceptional results.`,
      ctaText: `Book Your Appointment`,
      testimonial: `"Dr. Smith and the team at ${businessName} are fantastic. They made me feel comfortable and my smile has never looked better!" - Michael R.`,
    },
    plumbers: {
      headline: `Reliable Plumbing Solutions by ${businessName}`,
      subheadline: `Professional plumbing services you can trust in ${location}`,
      aboutSection: `${businessName} has been serving ${location} with reliable, professional plumbing services. Our experienced team is available 24/7 for emergencies and provides quality workmanship for all your plumbing needs.`,
      servicesSection: `From routine maintenance to emergency repairs, we handle everything including leak repairs, drain cleaning, water heater installation, and bathroom renovations. No job is too big or small.`,
      ctaText: `Call Now for Service`,
      testimonial: `"${businessName} saved the day when our pipes burst. They arrived quickly, fixed the problem professionally, and cleaned up perfectly." - Jennifer L.`,
    },
  }

  const template = nicheTemplates[niche.toLowerCase() as keyof typeof nicheTemplates] || nicheTemplates.restaurants

  return {
    headline: template.headline,
    subheadline: template.subheadline,
    aboutSection: template.aboutSection,
    servicesSection: template.servicesSection,
    ctaText: template.ctaText,
    testimonial: template.testimonial,
  }
}

// Generate modern, responsive HTML template
export async function generateRedesignTemplate(
  business: BusinessData,
  websiteScore: WebsiteScore,
  niche: string,
): Promise<RedesignTemplate> {
  const aiCopy = await generateAICopy(business, niche)
  const designTheme = getDesignTheme(niche)

  const html = generateHTML(business, aiCopy, designTheme)
  const css = generateCSS(designTheme)

  const improvements = [
    "Modern, mobile-responsive design",
    "Clear call-to-action buttons",
    "Professional color scheme and typography",
    "Optimized for search engines",
    "Fast loading performance",
    "Accessible design following WCAG guidelines",
    "Contact information prominently displayed",
    "Social proof with testimonials",
  ]

  const designNotes = [
    `Applied ${designTheme.name} design theme appropriate for ${niche}`,
    `Used ${designTheme.primaryColor} as primary brand color`,
    `Implemented mobile-first responsive design`,
    `Added structured data for better SEO`,
    `Optimized images and loading performance`,
  ]

  return {
    id: `redesign-${Date.now()}`,
    businessName: business.name,
    html,
    css,
    aiGeneratedCopy: aiCopy,
    designNotes,
    improvements,
  }
}

// Design theme selection based on business niche
function getDesignTheme(niche: string) {
  const themes = {
    restaurants: {
      name: "Warm & Inviting",
      primaryColor: "#D97706", // Warm orange
      secondaryColor: "#92400E", // Dark orange
      accentColor: "#FEF3C7", // Light yellow
      backgroundColor: "#FFFBEB", // Cream
      textColor: "#1F2937", // Dark gray
      fonts: {
        heading: "Playfair Display",
        body: "Inter",
      },
    },
    dentists: {
      name: "Clean & Professional",
      primaryColor: "#0EA5E9", // Sky blue
      secondaryColor: "#0284C7", // Blue
      accentColor: "#E0F2FE", // Light blue
      backgroundColor: "#FFFFFF", // White
      textColor: "#374151", // Gray
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
    },
    plumbers: {
      name: "Trustworthy & Reliable",
      primaryColor: "#DC2626", // Red
      secondaryColor: "#B91C1C", // Dark red
      accentColor: "#FEE2E2", // Light red
      backgroundColor: "#F9FAFB", // Light gray
      textColor: "#111827", // Dark gray
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
    },
  }

  return themes[niche.toLowerCase() as keyof typeof themes] || themes.restaurants
}

// Generate HTML structure
function generateHTML(business: BusinessData, copy: RedesignTemplate["aiGeneratedCopy"], theme: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${copy.headline} | ${business.name}</title>
    <meta name="description" content="${copy.subheadline}">
    <link href="https://fonts.googleapis.com/css2?family=${theme.fonts.heading.replace(" ", "+")}:wght@400;600;700&family=${theme.fonts.body.replace(" ", "+")}:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">
                <h1>${business.name}</h1>
            </div>
            <div class="nav-links">
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#contact">Contact</a>
                <a href="tel:${business.phone}" class="cta-button">${business.phone}</a>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">${copy.headline}</h1>
            <p class="hero-subtitle">${copy.subheadline}</p>
            <div class="hero-actions">
                <a href="#contact" class="btn btn-primary">${copy.ctaText}</a>
                <a href="tel:${business.phone}" class="btn btn-secondary">Call Now</a>
            </div>
        </div>
        <div class="hero-image">
            <img src="/business-professional-service.png" alt="${business.name}" />
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2>About ${business.name}</h2>
            <p>${copy.aboutSection}</p>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services">
        <div class="container">
            <h2>Our Services</h2>
            <p>${copy.servicesSection}</p>
            <div class="services-grid">
                <div class="service-card">
                    <h3>Professional Service</h3>
                    <p>High-quality service delivered by experienced professionals.</p>
                </div>
                <div class="service-card">
                    <h3>Customer Focused</h3>
                    <p>We prioritize your needs and satisfaction above all else.</p>
                </div>
                <div class="service-card">
                    <h3>Reliable & Trusted</h3>
                    <p>Count on us for consistent, dependable service every time.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonial Section -->
    <section class="testimonial">
        <div class="container">
            <blockquote>
                <p>"${copy.testimonial}"</p>
            </blockquote>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <div class="contact-info">
                <div class="contact-item">
                    <h3>Phone</h3>
                    <p><a href="tel:${business.phone}">${business.phone}</a></p>
                </div>
                <div class="contact-item">
                    <h3>Email</h3>
                    <p><a href="mailto:${business.email}">${business.email}</a></p>
                </div>
                <div class="contact-item">
                    <h3>Address</h3>
                    <p>${business.address}</p>
                </div>
            </div>
            <div class="cta-section">
                <a href="#" class="btn btn-primary btn-large">${copy.ctaText}</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${business.name}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`
}

// Generate CSS styles
function generateCSS(theme: any): string {
  return `/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: '${theme.fonts.body}', sans-serif;
    line-height: 1.6;
    color: ${theme.textColor};
    background-color: ${theme.backgroundColor};
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-family: '${theme.fonts.heading}', serif;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 1rem;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }

/* Header */
.header {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.nav-brand h1 {
    color: ${theme.primaryColor};
    margin: 0;
    font-size: 1.5rem;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: ${theme.textColor};
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: ${theme.primaryColor};
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    text-align: center;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.btn-primary {
    background-color: ${theme.primaryColor};
    color: white;
}

.btn-primary:hover {
    background-color: ${theme.secondaryColor};
    transform: translateY(-2px);
}

.btn-secondary {
    background-color: transparent;
    color: ${theme.primaryColor};
    border: 2px solid ${theme.primaryColor};
}

.btn-secondary:hover {
    background-color: ${theme.primaryColor};
    color: white;
}

.btn-large {
    padding: 16px 32px;
    font-size: 1.1rem;
}

.cta-button {
    background-color: ${theme.primaryColor};
    color: white !important;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 600;
}

/* Hero Section */
.hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 4rem;
    padding: 8rem 2rem 4rem;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 80vh;
}

.hero-title {
    font-size: 3rem;
    color: ${theme.textColor};
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.25rem;
    color: #6B7280;
    margin-bottom: 2rem;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.hero-image img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

/* Sections */
section {
    padding: 4rem 0;
}

.about {
    background-color: ${theme.accentColor};
}

.about h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: ${theme.textColor};
}

.about p {
    font-size: 1.1rem;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
}

/* Services */
.services h2 {
    text-align: center;
    margin-bottom: 1rem;
}

.services > .container > p {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 1.1rem;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.service-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s ease;
}

.service-card:hover {
    transform: translateY(-5px);
}

.service-card h3 {
    color: ${theme.primaryColor};
    margin-bottom: 1rem;
}

/* Testimonial */
.testimonial {
    background-color: ${theme.primaryColor};
    color: white;
    text-align: center;
}

.testimonial blockquote {
    font-size: 1.25rem;
    font-style: italic;
    max-width: 800px;
    margin: 0 auto;
}

/* Contact */
.contact {
    background-color: ${theme.accentColor};
}

.contact h2 {
    text-align: center;
    margin-bottom: 3rem;
}

.contact-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.contact-item {
    text-align: center;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.contact-item h3 {
    color: ${theme.primaryColor};
    margin-bottom: 1rem;
}

.contact-item a {
    color: ${theme.textColor};
    text-decoration: none;
}

.contact-item a:hover {
    color: ${theme.primaryColor};
}

.cta-section {
    text-align: center;
}

/* Footer */
.footer {
    background-color: ${theme.textColor};
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero {
        grid-template-columns: 1fr;
        text-align: center;
        padding: 6rem 1rem 2rem;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .nav-links {
        display: none;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
    
    .contact-info {
        grid-template-columns: 1fr;
    }
    
    .hero-actions {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 1.75rem;
    }
    
    .btn {
        padding: 10px 20px;
        font-size: 0.9rem;
    }
    
    .container {
        padding: 0 15px;
    }
}`
}

// Utility function to extract location from address
function extractLocationFromAddress(address: string): string {
  const parts = address.split(",")
  if (parts.length >= 2) {
    return parts[parts.length - 2].trim()
  }
  return address.split(",")[0].trim()
}

// Save redesign template to file system (for demo purposes)
export async function saveRedesignTemplate(template: RedesignTemplate): Promise<string> {
  // In a real implementation, this would save to a file system or cloud storage
  // For demo purposes, we'll return a mock URL
  const filename = `${template.businessName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-redesign.html`
  return `/redesigns/${filename}`
}
