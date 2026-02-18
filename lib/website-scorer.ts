import type { ScrapedWebsiteData } from "./business-scraper"

export interface WebsiteScore {
  score: number
  issues: string[]
  recommendations: string[]
  categoryScores: {
    performance: number
    seo: number
    accessibility: number
    design: number
    content: number
  }
}

export function scoreWebsite(websiteData: ScrapedWebsiteData, businessName: string): WebsiteScore {
  const issues: string[] = []
  const recommendations: string[] = []
  let totalScore = 100

  // Performance scoring (25 points)
  let performanceScore = 25
  if (websiteData.loadTime > 3000) {
    issues.push("Slow loading speed (>3 seconds)")
    recommendations.push("Optimize images and reduce server response time")
    performanceScore -= 10
    totalScore -= 10
  }
  if (websiteData.loadTime > 5000) {
    issues.push("Very slow loading speed (>5 seconds)")
    performanceScore -= 10
    totalScore -= 10
  }
  if (!websiteData.hasSSL) {
    issues.push("No SSL certificate")
    recommendations.push("Install SSL certificate for security and SEO")
    performanceScore -= 15
    totalScore -= 15
  }

  // SEO scoring (25 points)
  let seoScore = 25
  if (!websiteData.title || websiteData.title.length < 10) {
    issues.push("Missing or poor page title")
    recommendations.push("Add descriptive page titles with business name")
    seoScore -= 8
    totalScore -= 8
  }
  if (!websiteData.metaDescription || websiteData.metaDescription.length < 50) {
    issues.push("Missing or poor meta description")
    recommendations.push("Add compelling meta descriptions for better search results")
    seoScore -= 7
    totalScore -= 7
  }
  if (websiteData.headings.length === 0) {
    issues.push("No heading structure")
    recommendations.push("Use proper heading tags (H1, H2, H3) for content structure")
    seoScore -= 10
    totalScore -= 10
  }

  // Accessibility scoring (20 points)
  let accessibilityScore = 20
  if (!websiteData.isMobileResponsive) {
    issues.push("Not mobile responsive")
    recommendations.push("Implement responsive design for mobile users")
    accessibilityScore -= 15
    totalScore -= 15
  }
  if (websiteData.images > 5 && websiteData.images > websiteData.headings.length * 2) {
    issues.push("Potentially missing alt text for images")
    recommendations.push("Add descriptive alt text to all images")
    accessibilityScore -= 5
    totalScore -= 5
  }

  // Design scoring (15 points)
  let designScore = 15
  if (!websiteData.hasCallToAction) {
    issues.push("No clear call-to-action")
    recommendations.push("Add prominent call-to-action buttons")
    designScore -= 10
    totalScore -= 10
  }
  if (websiteData.links < 5) {
    issues.push("Limited navigation/internal linking")
    recommendations.push("Improve site navigation and internal linking")
    designScore -= 5
    totalScore -= 5
  }

  // Content scoring (15 points)
  let contentScore = 15
  if (!websiteData.hasContactInfo) {
    issues.push("Missing contact information")
    recommendations.push("Add clear contact information and location details")
    contentScore -= 10
    totalScore -= 10
  }
  if (websiteData.description.length < 100) {
    issues.push("Insufficient content")
    recommendations.push("Add more descriptive content about your services")
    contentScore -= 5
    totalScore -= 5
  }

  // Business-specific checks
  if (!websiteData.title.toLowerCase().includes(businessName.toLowerCase().split(" ")[0])) {
    issues.push("Business name not prominent in title")
    recommendations.push("Include business name in page title for better branding")
    totalScore -= 5
  }

  // Ensure minimum scores
  performanceScore = Math.max(0, performanceScore)
  seoScore = Math.max(0, seoScore)
  accessibilityScore = Math.max(0, accessibilityScore)
  designScore = Math.max(0, designScore)
  contentScore = Math.max(0, contentScore)
  totalScore = Math.max(0, totalScore)

  return {
    score: Math.round(totalScore),
    issues,
    recommendations,
    categoryScores: {
      performance: Math.round(performanceScore),
      seo: Math.round(seoScore),
      accessibility: Math.round(accessibilityScore),
      design: Math.round(designScore),
      content: Math.round(contentScore),
    },
  }
}

// Generate improvement priority based on score
export function getImprovementPriority(score: WebsiteScore): "high" | "medium" | "low" {
  if (score.score < 50) return "high"
  if (score.score < 70) return "medium"
  return "low"
}

// Calculate potential ROI improvement
export function calculatePotentialROI(currentScore: number): {
  trafficIncrease: string
  conversionIncrease: string
  leadIncrease: string
} {
  const improvementPotential = Math.max(0, 85 - currentScore)

  return {
    trafficIncrease: `${Math.round(improvementPotential * 0.8)}%`,
    conversionIncrease: `${Math.round(improvementPotential * 0.6)}%`,
    leadIncrease: `${Math.round(improvementPotential * 1.2)}%`,
  }
}
