import type { PortfolioAsset } from "@/types";

/**
 * Port: fetch raw portfolio data for a facility (from API, file, or mock).
 * One “API” per facility; facilityId identifies which endpoint/source to use.
 * Adapters implement this; core/service depends on the interface only.
 */
export interface IPortfolioSource {
  /**
   * Returns raw portfolio assets for the given facility.
   * Shape varies by facility (Educa vs PayEarly vs Nomina, etc.).
   */
  getPortfolio(facilityId: string): Promise<PortfolioAsset[]>;
}
