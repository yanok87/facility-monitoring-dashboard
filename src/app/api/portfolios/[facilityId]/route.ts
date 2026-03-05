import { PortfolioFileAdapter } from "@/adapters/file/portfolio-file.adapter";
import { DEFAULT_FACILITY_FILE_MAP } from "@/adapters/file/facility-file.config";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ facilityId: string }> };

/**
 * Returns raw portfolio data for a facility. Always reads from file (data/*.json).
 *
 * Where it’s used:
 * - When the app uses HTTP adapters and PORTFOLIO_URL_1/2/3 point here (e.g. for local
 *   testing): PortfolioHttpAdapter fetches these routes, which read files and return JSON.
 * - External clients that need raw portfolio JSON can call this route directly.
 *
 * File vs real API: The data source choice is in facility-service.server.ts. This route
 * only serves file-backed data over HTTP. For a real API, set the portfolio URLs in
 * config/urls.ts to the backend; then these routes are unused.
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
