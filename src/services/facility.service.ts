import type {
  NormalizedOverview,
  NormalizedFacilitySummary,
  NormalizedFacilityDetail,
  NormalizedCovenant,
} from "@/domain/types";
import type { ICovenantSource, IPortfolioSource } from "@/ports";
import { normalizePortfolio } from "./normalization";

/**
 * Facility service: orchestrates covenant + portfolio data, normalizes for UI.
 * Depends only on ports (no direct file or API access); adapters are injected.
 */
export class FacilityService {
  constructor(
    private readonly covenantSource: ICovenantSource,
    private readonly portfolioSource: IPortfolioSource
  ) {}

  /**
   * Returns overview for hero + facility cards (total exposure, one summary per facility).
   */
  async getOverview(): Promise<NormalizedOverview> {
    const covenant = await this.covenantSource.getCovenantResults();
    const totalExposureByCurrency: Record<string, number> = {};
    let totalExposure = 0;
    const facilities: NormalizedFacilitySummary[] = [];

    for (const f of covenant.facilities) {
      const facilityId = f.facility_id;
      const portfolio = await this.portfolioSource.getPortfolio(facilityId);
      const normalized = normalizePortfolio(portfolio, f.excluded_assets);
      const exposure = normalized.reduce((sum, row) => sum + row.outstandingAmount, 0);

      totalExposureByCurrency[f.currency] = (totalExposureByCurrency[f.currency] ?? 0) + exposure;
      totalExposure += exposure;

      facilities.push({
        facilityId,
        name: f.name,
        assetClass: f.asset_class,
        currency: f.currency,
        covenantStatus: f.covenant.status,
        exposure,
        covenantRate: f.covenant.computed_rate,
        covenantThreshold: f.covenant.threshold,
        covenantMetric: f.covenant.metric,
      });
    }

    return {
      computedAt: covenant.computed_at,
      totalExposureByCurrency,
      totalExposure,
      facilities,
    };
  }

  /**
   * Returns full detail for one facility (covenant + summary + portfolio table with normalized rows).
   */
  async getFacilityDetail(facilityId: string): Promise<NormalizedFacilityDetail | null> {
    const covenant = await this.covenantSource.getCovenantResults();
    const f = covenant.facilities.find((x) => x.facility_id === facilityId);
    if (!f) return null;

    const portfolio = await this.portfolioSource.getPortfolio(facilityId);
    const normalizedPortfolio = normalizePortfolio(portfolio, f.excluded_assets);
    const exposure = normalizedPortfolio.reduce((sum, row) => sum + row.outstandingAmount, 0);

    const covenantNormalized: NormalizedCovenant = {
      metric: f.covenant.metric,
      computedRate: f.covenant.computed_rate,
      threshold: f.covenant.threshold,
      operator: f.covenant.operator,
      status: f.covenant.status,
      breachConsequence: f.covenant.breach_consequence,
    };

    return {
      facilityId: f.facility_id,
      name: f.name,
      assetClass: f.asset_class,
      currency: f.currency,
      covenant: covenantNormalized,
      summary: {
        totalAssets: f.summary.total_assets,
        included: f.summary.included,
        excluded: f.summary.excluded,
      },
      includedAssetIds: f.included_assets,
      excludedWithReasons: f.excluded_assets,
      portfolio: normalizedPortfolio,
      exposure,
    };
  }
}
