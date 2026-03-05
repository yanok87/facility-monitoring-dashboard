import { CovenantFileAdapter } from "@/adapters/file/covenant-file.adapter";
import { NextResponse } from "next/server";

/**
 * Returns raw covenant results (for use by HTTP adapters or external clients).
 * Same data as used by the file adapter, exposed over HTTP for testing / real API parity.
 */
export async function GET() {
  try {
    const basePath = process.cwd();
    const adapter = new CovenantFileAdapter({ basePath });
    const data = await adapter.getCovenantResults();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Covenant results API error:", error);
    return NextResponse.json(
      { error: "Failed to load covenant results" },
      { status: 500 }
    );
  }
}
