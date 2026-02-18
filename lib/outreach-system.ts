// Advanced outreach message generation and management
export interface OutreachTemplate {
  id: string
  name: string
  type: "email" | "whatsapp" | "sms"
  subject?: string
  template: string
  variables: string[]
}

export interface OutreachCampaign {
  id: string
  name: string
  businesses: string[]
  templates: OutreachTemplate[]
  status: "draft" | "active" | "completed"
  createdAt: Date
  stats: {
    sent: number
    opened: number
    replied: number
    converted: number
  }
}

// Pre-built outreach templates
export const outreachTemplates: OutreachTemplate[] = [
  {
    id: "email-low-score",
    name: "Website Improvement - Low Score",
    type: "email",
    subject: "Quick website analysis for {{businessName}} - Found some opportunities",
    template: `Hi {{businessName}} team!

I hope this email finds you well. I recently came across your business and took a quick look at your website.

I noticed a few areas where some improvements could significantly boost your online presence:

{{#issues}}
• {{.}}
{{/issues}}

The good news? These improvements could potentially:
• Increase your website traffic by {{trafficIncrease}}
• Boost lead generation by {{leadIncrease}}
• Improve your search engine rankings

I've actually prepared a free redesign mockup that addresses these issues. Would you be interested in seeing how your website could look with these improvements?

I'd be happy to share it with you - no strings attached. If you like what you see, we can discuss how to implement these changes.

Would you have 10 minutes for a quick call this week?

Best regards,
[Your Name]
[Your Contact Information]

P.S. I've helped similar businesses in {{location}} increase their online leads by an average of {{leadIncrease}}. Happy to share some case studies if you're interested.`,
    variables: ["businessName", "issues", "trafficIncrease", "leadIncrease", "location"],
  },
  {
    id: "email-no-website",
    name: "No Website - Opportunity",
    type: "email",
    subject: "{{businessName}} - Missing out on {{leadIncrease}} potential customers?",
    template: `Hi {{businessName}} team!

I was looking for local {{niche}} services in {{location}} and came across your business. You have great reviews and seem to provide excellent service!

However, I noticed you don't have a website yet. In today's digital world, this could be costing you significant business:

• 97% of consumers search online before making local purchases
• Businesses with websites get 40% more customers on average
• You could be missing out on {{leadIncrease}} more leads per month

I specialize in creating professional websites for local businesses like yours. I've helped other {{niche}} businesses in {{location}} increase their customer base significantly.

Would you be interested in seeing what a professional website could do for {{businessName}}? I can show you some examples and discuss a solution that fits your budget.

No pressure - just thought you might be interested in exploring this opportunity.

Best regards,
[Your Name]
[Your Contact Information]`,
    variables: ["businessName", "niche", "location", "leadIncrease"],
  },
  {
    id: "whatsapp-follow-up",
    name: "WhatsApp Follow-up",
    type: "whatsapp",
    template: `Hi! I'm following up on the website analysis I sent for {{businessName}}. 

I found some quick wins that could boost your online presence by {{leadIncrease}}. 

Would you like me to send you the free redesign mockup I created? It only takes 2 minutes to review.

Thanks!`,
    variables: ["businessName", "leadIncrease"],
  },
  {
    id: "sms-urgent",
    name: "SMS - Urgent Opportunity",
    type: "sms",
    template: `Hi {{businessName}}! Your website needs urgent updates. Missing {{leadIncrease}} potential customers monthly. Free analysis ready. Reply YES to see it.`,
    variables: ["businessName", "leadIncrease"],
  },
]

// Generate personalized outreach messages
export function generatePersonalizedOutreach(
  business: any,
  template: OutreachTemplate,
  additionalData: any = {},
): string {
  let message = template.template

  // Replace variables with actual data
  const variables = {
    businessName: business.name,
    location: extractLocationFromAddress(business.address),
    niche: additionalData.niche || "business",
    trafficIncrease: additionalData.roi?.trafficIncrease || "25%",
    leadIncrease: additionalData.roi?.leadIncrease || "40%",
    conversionIncrease: additionalData.roi?.conversionIncrease || "30%",
    issues: business.issues || [],
    score: business.score || 0,
    phone: business.phone,
    email: business.email,
    website: business.website,
    ...additionalData,
  }

  // Replace simple variables
  Object.entries(variables).forEach(([key, value]) => {
    if (typeof value === "string" || typeof value === "number") {
      message = message.replace(new RegExp(`{{${key}}}`, "g"), String(value))
    }
  })

  // Handle arrays (like issues)
  if (variables.issues && Array.isArray(variables.issues)) {
    const issuesList = variables.issues.map((issue) => `• ${issue}`).join("\n")
    message = message.replace(/{{#issues}}[\s\S]*?{{\/issues}}/g, issuesList)
  }

  return message
}

// Extract location from address
function extractLocationFromAddress(address: string): string {
  const parts = address.split(",")
  if (parts.length >= 2) {
    return parts[parts.length - 2].trim()
  }
  return address.split(",")[0].trim()
}

// Generate outreach campaign
export function createOutreachCampaign(businesses: any[], niche: string, location: string): OutreachCampaign {
  const campaignId = `campaign-${Date.now()}`

  return {
    id: campaignId,
    name: `${niche} businesses in ${location}`,
    businesses: businesses.map((b) => b.id),
    templates: outreachTemplates,
    status: "draft",
    createdAt: new Date(),
    stats: {
      sent: 0,
      opened: 0,
      replied: 0,
      converted: 0,
    },
  }
}

// Calculate outreach ROI potential
export function calculateOutreachROI(businesses: any[]): {
  totalBusinesses: number
  lowScoreBusinesses: number
  noWebsiteBusinesses: number
  potentialRevenue: string
  estimatedConversionRate: string
} {
  const lowScore = businesses.filter((b) => b.score < 70).length
  const noWebsite = businesses.filter((b) => !b.website || b.website.includes("No website")).length

  // Estimate potential revenue (assuming $2000 average project value and 15% conversion rate)
  const potentialProjects = Math.round((lowScore + noWebsite) * 0.15)
  const potentialRevenue = potentialProjects * 2000

  return {
    totalBusinesses: businesses.length,
    lowScoreBusinesses: lowScore,
    noWebsiteBusinesses: noWebsite,
    potentialRevenue: `$${potentialRevenue.toLocaleString()}`,
    estimatedConversionRate: "15%",
  }
}
