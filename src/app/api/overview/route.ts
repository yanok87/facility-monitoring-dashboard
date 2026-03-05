import { getFacilityServiceInstance } from "@/server/facility-service.server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const service = getFacilityServiceInstance();
    const overview = await service.getOverview();
    return NextResponse.json(overview);
  } catch (error) {
    console.error("Overview API error:", error);
    return NextResponse.json(
      { error: "Failed to load overview" },
      { status: 500 }
    );
  }
}
