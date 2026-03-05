import { PortfolioFileAdapter } from "@/adapters/file/portfolio-file.adapter";
import { DEFAULT_FACILITY_FILE_MAP } from "@/adapters/file/facility-file.config";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ facilityId: string }> };

/**
 * Returns raw portfolio data for a facility (for use by HTTP adapters or external clients).
 * Same data as used by the file adapter, exposed over HTTP for testing / real API parity.
 */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { facilityId } = await params;
    const basePath = process.cwd();
    const adapter = new PortfolioFileAdapter({
      basePath,
      facilityFileMap: DEFAULT_FACILITY_FILE_MAP,
    });
    const data = await adapter.getPortfolio(facilityId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Portfolio API error:", error);
    return NextResponse.json(
      { error: "Failed to load portfolio" },
      { status: 500 }
    );
  }
}
