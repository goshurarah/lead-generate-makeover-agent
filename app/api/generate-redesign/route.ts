import { type NextRequest, NextResponse } from "next/server";
import {
  generateRedesignTemplate,
  saveRedesignTemplate,
} from "@/lib/ai-redesign-generator";

export async function POST(request: NextRequest) {
  try {
    const { business, websiteScore, niche } = await request.json();

    if (!business || !websiteScore || !niche) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Generate the redesign template
    console.log(`Generating redesign for ${business.name}`);
    const template = await generateRedesignTemplate(
      business,
      websiteScore,
      niche
    );

    // Save the template (in a real app, this would save to file system/cloud)
    const templateUrl = await saveRedesignTemplate(template);

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        businessName: template.businessName,
        url: templateUrl,
        improvements: template.improvements,
        designNotes: template.designNotes,
        aiGeneratedCopy: template.aiGeneratedCopy,
      },
    });
  } catch (error) {
    console.error("Error generating redesign:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate redesign",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
