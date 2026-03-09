import type { IPortfolioSource } from "@/ports";
import type { PortfolioAsset } from "@/types";

export interface PortfolioHttpAdapterOptions {
  /**
   * Array of portfolio URLs (one per facility). Order must match facilityIds.
   */
  urls: string[];
  /**
   * Facility ids in the same order as urls: urls[i] is the endpoint for facilityIds[i].
   */
  facilityIds: string[];
}

/**
 * Adapter: loads portfolio data from HTTP. Takes an array of URL variables;
 * fetches from the URL that corresponds to the requested facilityId.
 */
export class PortfolioHttpAdapter implements IPortfolioSource {
  private readonly urlByFacility: Map<string, string>;

  constructor(options: PortfolioHttpAdapterOptions) {
    const { urls, facilityIds } = options;
    if (urls.length !== facilityIds.length) {
      throw new Error("urls and facilityIds must have the same length");
    }
    this.urlByFacility = new Map(facilityIds.map((id, i) => [id, urls[i]]));
  }

  async getPortfolio(facilityId: string): Promise<PortfolioAsset[]> {
    const url = this.urlByFacility.get(facilityId);
    if (url == null) {
      return [];
    }
    if (!url) {
      throw new Error(`Portfolio URL for facility "${facilityId}" is not configured`);
    }
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`Portfolio API error (${facilityId}): ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (data == null || !Array.isArray(data)) return [];
    return data as PortfolioAsset[];
  }
}
