import { getFacilityServiceInstance } from "@/server/facility-service.server";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ facilityId: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { facilityId } = await params;
    const service = getFacilityServiceInstance();
    const detail = await service.getFacilityDetail(facilityId);
    if (!detail) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(detail);
  } catch (error) {
    console.error("Facility detail API error:", error);
    return NextResponse.json(
      { error: "Failed to load facility detail" },
      { status: 500 }
    );
  }
}
