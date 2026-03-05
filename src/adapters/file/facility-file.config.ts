import { CovenantFileAdapter } from "./covenant-file.adapter";
import { PortfolioFileAdapter } from "./portfolio-file.adapter";

/**
 * Default facility id → portfolio filename mapping.
 * Add entries here when adding new facilities (or load from config/env).
 */
export const DEFAULT_FACILITY_FILE_MAP: Record<string, string> = {
  facility_a: "facility_a_educa_isa.json",
  facility_b: "facility_b_payearly_ewa.json",
  facility_c: "facility_c_nomina.json",
};

/**
 * Creates covenant and portfolio file adapters for the given base path
 * (e.g. process.cwd() in Node).
 */
export function createFileAdapters(basePath: string) {
  return {
    covenant: new CovenantFileAdapter({ basePath }),
    portfolio: new PortfolioFileAdapter({
      basePath,
      facilityFileMap: DEFAULT_FACILITY_FILE_MAP,
    }),
  };
}
