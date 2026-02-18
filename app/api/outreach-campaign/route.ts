import { type NextRequest, NextResponse } from "next/server";
import {
  createOutreachCampaign,
  calculateOutreachROI,
  generatePersonalizedOutreach,
  outreachTemplates,
} from "@/lib/outreach-system";

export async function POST(request: NextRequest) {
  try {
    const {
      businesses,
      niche,
      location,
      action = "create",
    } = await request.json();

    if (action === "create") {
      // Create new outreach campaign
      const campaign = createOutreachCampaign(businesses, niche, location);
      const roiData = calculateOutreachROI(businesses);

      return NextResponse.json({
        success: true,
        campaign,
        roi: roiData,
        templates: outreachTemplates,
      });
    }

    if (action === "generate-messages") {
      const {
        businessId,
        templateId,
        additionalData = {},
      } = await request.json();

      const business = businesses.find((b: any) => b.id === businessId);
      const template = outreachTemplates.find((t) => t.id === templateId);

      if (!business || !template) {
        return NextResponse.json(
          { success: false, error: "Business or template not found" },
          { status: 404 }
        );
      }

      const message = generatePersonalizedOutreach(business, template, {
        niche,
        location,
        ...additionalData,
      });

      return NextResponse.json({
        success: true,
        message,
        template: {
          id: template.id,
          name: template.name,
          type: template.type,
          subject: template.subject?.replace(
            /{{businessName}}/g,
            business.name
          ),
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error with outreach campaign:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process outreach campaign",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
