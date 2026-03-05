import { CovenantFileAdapter } from "@/adapters/file/covenant-file.adapter";
import { NextResponse } from "next/server";

/**
 * Returns raw covenant results. Always reads from file (data/covenant_results.json).
 *
 * Where it’s used:
 * - When the app uses HTTP adapters and COVENANT_URL points here (e.g. for local
 *   testing): CovenantHttpAdapter fetches this route, which reads the file and returns JSON.
 * - External clients that need raw covenant JSON can call this route directly.
 *
 * File vs real API: The data source choice is in facility-service.server.ts (file
 * adapters vs HTTP adapters). This route does not switch—it only serves file-backed
 * data over HTTP. For a real API, set COVENANT_URL to the backend; then this route
 * is unused.
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
