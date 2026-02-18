import { type NextRequest, NextResponse } from "next/server";
import {
  findBusinessesWithPlaces,
  scrapeWebsiteData,
  extractEmailFromContent,
  type BusinessData,
} from "@/lib/business-scraper";
import {
  scoreWebsite,
  getImprovementPriority,
  calculatePotentialROI,
} from "@/lib/website-scorer";

export async function POST(request: NextRequest) {
  try {
    const { location, niche } = await request.json();

    if (!location || !niche) {
      return NextResponse.json(
        { success: false, error: "Location and niche are required" },
        { status: 400 }
      );
    }

    console.log(`Searching for ${niche} businesses in ${location}`);

    let businessList: BusinessData[];
    try {
      businessList = await findBusinessesWithPlaces(location, niche);
    } catch (error) {
      console.error("Failed to find businesses:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (errorMessage.includes("Google Places API key is required")) {
        return NextResponse.json(
          {
            success: false,
            error: "Google Places API Setup Required",
            details: errorMessage,
            suggestion:
              "Please set up your Google Places API key to access real business data from Harrogate and other locations.",
            setupRequired: true,
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to find businesses",
          details: errorMessage,
          suggestion:
            "Please check your Google Places API key and try a different location or niche.",
        },
        { status: 500 }
      );
    }

    if (businessList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `No ${niche} businesses found in ${location}`,
          suggestion:
            "Try a different location or niche (e.g., restaurants, dentists, plumbers, cafes, gyms)",
        },
        { status: 404 }
      );
    }

    console.log(`Processing ${businessList.length} businesses...`);
    const businesses = await Promise.all(
      businessList.slice(0, 8).map(async (business, index) => {
        try {
          let websiteData = null;
          let email = business.email;

          if (business.website && business.website.trim() !== "") {
            console.log(`Analyzing website: ${business.website}`);
            websiteData = await scrapeWebsiteData(business.website);

            if (!email && websiteData.description) {
              email = extractEmailFromContent(websiteData.description);
            }
          }

          const scoreResult = websiteData
            ? scoreWebsite(websiteData, business.name)
            : {
                score: 25,
                issues: [
                  "No website found",
                  "Missing online presence",
                  "No digital marketing",
                ],
                recommendations: [
                  "Create a professional website immediately",
                  "Establish online presence with Google My Business",
                  "Set up social media profiles",
                  "Implement basic SEO",
                ],
                categoryScores: {
                  performance: 0,
                  seo: 0,
                  accessibility: 0,
                  design: 0,
                  content: 0,
                },
              };

          const priority = getImprovementPriority(scoreResult);
          const roi = calculatePotentialROI(scoreResult.score);
          const outreachMessages = generateEnhancedOutreachMessages(
            business,
            scoreResult.score,
            roi,
            priority
          );

          return {
            id: `business-${index + 1}`,
            name: business.name,
            website: business.website || "No website found",
            phone: business.phone || "Not available",
            email: email || "Not available",
            address: business.address,
            rating: business.rating || 0,
            reviewCount: business.reviewCount || 0,
            score: scoreResult.score,
            issues: scoreResult.issues,
            recommendations: scoreResult.recommendations,
            categoryScores: scoreResult.categoryScores,
            priority,
            roi,
            redesignUrl:
              scoreResult.score < 70
                ? `/redesigns/business-${index + 1}.html`
                : undefined,
            outreachMessages,
            websiteAnalysis: websiteData
              ? {
                  title: websiteData.title,
                  hasSSL: websiteData.hasSSL,
                  loadTime: websiteData.loadTime,
                  isMobileResponsive: websiteData.isMobileResponsive,
                  hasContactInfo: websiteData.hasContactInfo,
                  hasCallToAction: websiteData.hasCallToAction,
                }
              : null,
          };
        } catch (error) {
          console.error(`Error processing business ${business.name}:`, error);

          return {
            id: `business-${index + 1}`,
            name: business.name,
            website: business.website || "No website found",
            phone: business.phone || "Not available",
            email: business.email || "Not available",
            address: business.address,
            rating: business.rating || 0,
            reviewCount: business.reviewCount || 0,
            score: 30,
            issues: [
              "Website analysis failed",
              "Unable to access website for scoring",
            ],
            recommendations: [
              "Manual website review needed",
              "Check website accessibility",
            ],
            categoryScores: {
              performance: 0,
              seo: 0,
              accessibility: 0,
              design: 0,
              content: 0,
            },
            priority: "high" as const,
            roi: {
              trafficIncrease: "Unknown",
              conversionIncrease: "Unknown",
              leadIncrease: "Unknown",
            },
            outreachMessages: {
              email: `Hi ${business.name}! I'd love to discuss improving your online presence and digital marketing. Based on my initial research, there are significant opportunities to increase your visibility and customer acquisition. Can we schedule a quick 15-minute call this week?`,
              whatsapp: `Hi! I've been researching ${business.name} and found some great opportunities to boost your online presence. Interested in hearing more?`,
              sms: `Hi ${business.name}! I found ways to improve your online visibility. Reply YES for free consultation.`,
            },
          };
        }
      })
    );

    const summary = {
      total: businesses.length,
      needsImprovement: businesses.filter((b) => b.score < 70).length,
      averageScore: Math.round(
        businesses.reduce((sum, b) => sum + b.score, 0) / businesses.length
      ),
      hasWebsites: businesses.filter(
        (b) => b.website && !b.website.includes("No website")
      ).length,
      location,
      niche,
    };

    console.log(
      `Analysis complete: ${summary.total} businesses, ${summary.needsImprovement} need improvement`
    );

    return NextResponse.json({
      success: true,
      businesses,
      location,
      niche,
      summary,
    });
  } catch (error) {
    console.error("Error analyzing businesses:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze businesses",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function generateEnhancedOutreachMessages(
  business: BusinessData,
  score: number,
  roi: any,
  priority: "high" | "medium" | "low"
): any {
  const businessName = business.name;
  const isLowScore = score < 70;
  const hasWebsite =
    business.website && !business.website.includes("No website");

  const urgencyMap = {
    high: "urgent attention",
    medium: "some improvements",
    low: "optimization opportunities",
  };

  const urgency = urgencyMap[priority];

  if (!hasWebsite) {
    return {
      email: `Hi ${businessName} team! I noticed you don't have a website yet. In today's digital world, this could be costing you ${roi.leadIncrease} more leads per month. I'd love to show you how a professional website could transform your business. Would you be interested in a quick 10-minute call this week?`,

      whatsapp: `Hi! I noticed ${businessName} doesn't have a website. This could be costing you customers daily. I can show you a quick solution - interested?`,

      sms: `Hi ${businessName}! Missing website = missing customers. I can help. Reply YES for free consultation.`,
    };
  }

  return {
    email: isLowScore
      ? `Hi ${businessName} team! I analyzed your website and found it needs ${urgency}. The good news? These improvements could increase your traffic by ${roi.trafficIncrease} and leads by ${roi.leadIncrease}. I've prepared a detailed analysis and redesign mockup. Would you be interested in a quick 15-minute call to review the opportunities?`
      : `Hi ${businessName}! Your website looks good, but I've identified ${urgency} that could drive ${roi.leadIncrease} more leads your way. Would you be open to a brief conversation about maximizing your online potential?`,

    whatsapp: isLowScore
      ? `Hi! I analyzed ${businessName}'s website and found ways to increase your leads by ${roi.leadIncrease}. I've created a free improvement plan - can I share it?`
      : `Hello! I found quick wins for ${businessName}'s website that could boost leads by ${roi.leadIncrease}. Interested in seeing what I discovered?`,

    sms: isLowScore
      ? `Hi ${businessName}! Your website needs ${urgency}. I can increase your leads by ${roi.leadIncrease}. Reply YES for free analysis.`
      : `Hi! Quick website tips for ${businessName} = ${roi.leadIncrease} more leads. Reply YES for details.`,
  };
}
