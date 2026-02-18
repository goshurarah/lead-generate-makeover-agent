import { type NextRequest, NextResponse } from "next/server";
import {
  generatePersonalizedOutreach,
  outreachTemplates,
  calculateOutreachROI,
} from "@/lib/outreach-system";

export async function POST(request: NextRequest) {
  try {
    const {
      businesses,
      includeOutreach = true,
      includeAnalysis = true,
      niche = "",
      location = "",
    } = await request.json();

    if (!businesses || !Array.isArray(businesses)) {
      return NextResponse.json(
        { success: false, error: "Invalid businesses data" },
        { status: 400 }
      );
    }

    // Calculate ROI potential
    const roiData = calculateOutreachROI(businesses);

    // Create comprehensive CSV headers
    const headers = [
      // Basic Business Info
      "Business Name",
      "Website",
      "Phone",
      "Email",
      "Address",
      "Rating",
      "Review Count",

      // Website Analysis
      "Website Score",
      "Priority Level",
      "Issues Found",
      "Recommendations",
      "Traffic Increase Potential",
      "Lead Increase Potential",
      "Conversion Increase Potential",

      // Technical Analysis
      "Has SSL",
      "Mobile Responsive",
      "Load Time (ms)",
      "Has Contact Info",
      "Has Call to Action",

      // Redesign Info
      "Needs Redesign",
      "Redesign URL",

      // Outreach Messages
      "Email Subject",
      "Email Message",
      "WhatsApp Message",
      "SMS Message",

      // Campaign Data
      "Best Contact Method",
      "Outreach Priority",
      "Estimated Project Value",
      "Notes",
    ];

    // Create CSV rows with comprehensive data
    const rows = businesses.map((business: any) => {
      // Generate personalized outreach messages
      const emailTemplate =
        business.website && !business.website.includes("No website")
          ? outreachTemplates.find((t) => t.id === "email-low-score")
          : outreachTemplates.find((t) => t.id === "email-no-website");

      const whatsappTemplate = outreachTemplates.find(
        (t) => t.id === "whatsapp-follow-up"
      );
      const smsTemplate = outreachTemplates.find((t) => t.id === "sms-urgent");

      const additionalData = { niche, location, roi: business.roi };

      const emailMessage = emailTemplate
        ? generatePersonalizedOutreach(business, emailTemplate, additionalData)
        : business.outreachMessages?.email || "";
      const whatsappMessage = whatsappTemplate
        ? generatePersonalizedOutreach(
            business,
            whatsappTemplate,
            additionalData
          )
        : business.outreachMessages?.whatsapp || "";
      const smsMessage = smsTemplate
        ? generatePersonalizedOutreach(business, smsTemplate, additionalData)
        : business.outreachMessages?.sms || "";

      // Determine best contact method
      const bestContactMethod =
        business.email && business.email !== "Not available"
          ? "Email"
          : business.phone && business.phone !== "Not available"
          ? "Phone"
          : "Website Contact";

      // Determine outreach priority
      const outreachPriority =
        business.score < 50 ? "High" : business.score < 70 ? "Medium" : "Low";

      // Estimate project value
      const estimatedValue =
        business.score < 50
          ? "$3000-5000"
          : business.score < 70
          ? "$2000-3000"
          : "$1000-2000";

      return [
        // Basic Business Info
        business.name || "",
        business.website || "",
        business.phone || "",
        business.email || "",
        business.address || "",
        business.rating || "",
        business.reviewCount || "",

        // Website Analysis
        business.score || 0,
        business.priority || "medium",
        (business.issues || []).join("; "),
        (business.recommendations || []).join("; "),
        business.roi?.trafficIncrease || "",
        business.roi?.leadIncrease || "",
        business.roi?.conversionIncrease || "",

        // Technical Analysis
        business.websiteAnalysis?.hasSSL ? "Yes" : "No",
        business.websiteAnalysis?.isMobileResponsive ? "Yes" : "No",
        business.websiteAnalysis?.loadTime || "",
        business.websiteAnalysis?.hasContactInfo ? "Yes" : "No",
        business.websiteAnalysis?.hasCallToAction ? "Yes" : "No",

        // Redesign Info
        business.score < 70 ? "Yes" : "No",
        business.redesignUrl || "",

        // Outreach Messages
        emailTemplate?.subject?.replace(/{{businessName}}/g, business.name) ||
          "",
        `"${emailMessage.replace(/"/g, '""')}"`, // Escape quotes for CSV
        `"${whatsappMessage.replace(/"/g, '""')}"`,
        `"${smsMessage.replace(/"/g, '""')}"`,

        // Campaign Data
        bestContactMethod,
        outreachPriority,
        estimatedValue,
        business.score < 50
          ? "High priority - website needs major improvements"
          : business.score < 70
          ? "Good opportunity - moderate improvements needed"
          : "Low priority - minor optimizations only",
      ];
    });

    // Add summary row at the top
    const summaryRow = [
      `CAMPAIGN SUMMARY: ${businesses.length} businesses analyzed`,
      `Location: ${location}`,
      `Niche: ${niche}`,
      `Low Score Businesses: ${roiData.lowScoreBusinesses}`,
      `No Website: ${roiData.noWebsiteBusinesses}`,
      `Potential Revenue: ${roiData.potentialRevenue}`,
      `Conversion Rate: ${roiData.estimatedConversionRate}`,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    const emptyRow = Array(headers.length).fill("");

    // Combine all data
    const csvContent = [summaryRow, emptyRow, headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `leadgen-${location.replace(
      /[^a-zA-Z0-9]/g,
      "-"
    )}-${niche.replace(/[^a-zA-Z0-9]/g, "-")}-${timestamp}.csv`;

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export CSV",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
