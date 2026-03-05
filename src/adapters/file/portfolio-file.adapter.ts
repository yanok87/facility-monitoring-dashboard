import type { IPortfolioSource } from "@/ports";
import type { PortfolioAsset } from "@/types";

export interface PortfolioFileAdapterOptions {
  /** Base path to data directory. */
  basePath: string;
  /**
   * Map facilityId → filename in data/ (e.g. facility_a → facility_a_educa_isa.json).
   * Add entries when adding new facilities.
   */
  facilityFileMap: Record<string, string>;
}

/**
 * Adapter: loads portfolio data from the filesystem, one file per facility.
 * Swap for an HTTP adapter (e.g. fetch(apiUrl + '/portfolios/' + facilityId)) when using real APIs.
 */
export class PortfolioFileAdapter implements IPortfolioSource {
  private readonly basePath: string;
  private readonly facilityFileMap: Record<string, string>;

  constructor(options: PortfolioFileAdapterOptions) {
    this.basePath = options.basePath;
    this.facilityFileMap = options.facilityFileMap;
  }

  async getPortfolio(facilityId: string): Promise<PortfolioAsset[]> {
    const filename = this.facilityFileMap[facilityId];
    if (!filename) {
      return [];
    }
    const path = await import("path");
    const fs = await import("fs/promises");
    const filePath = path.join(this.basePath, "data", filename);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as PortfolioAsset[];
  }
}
