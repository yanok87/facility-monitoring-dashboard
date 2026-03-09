import type {
  NormalizedOverview,
  NormalizedFacilitySummary,
  NormalizedFacilityDetail,
  NormalizedCovenant,
  CovenantStatus,
} from "@/domain/types";
import type { ICovenantSource, IPortfolioSource } from "@/ports";
import { normalizePortfolio } from "./normalization";
import type { CovenantResults } from "@/types";

function safeNum(value: unknown): number {
  if (value == null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function safeCovenantResults(data: unknown): CovenantResults {
  if (data == null || typeof data !== "object") {
    return { computed_at: "", facilities: [] };
  }
  const d = data as Record<string, unknown>;
  const facilities = Array.isArray(d.facilities) ? d.facilities : [];
  return {
    computed_at: typeof d.computed_at === "string" ? d.computed_at : "",
    facilities,
  };
}

/**
 * Facility service: orchestrates covenant + portfolio data, normalizes for UI.
 * Depends only on ports (no direct file or API access); adapters are injected.
 * Handles null/undefined or partial data from adapters (e.g. API returning null or missing fields).
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
    const raw = await this.covenantSource.getCovenantResults();
    const covenant = safeCovenantResults(raw);
    const totalExposureByCurrency: Record<string, number> = {};
    let totalExposure = 0;
    const facilities: NormalizedFacilitySummary[] = [];

    for (const f of covenant.facilities) {
      const entry = f && typeof f === "object" ? (f as unknown as Record<string, unknown>) : null;
      if (!entry) continue;

      const facilityId = entry.facility_id != null ? String(entry.facility_id) : "";
      const portfolio = await this.portfolioSource.getPortfolio(facilityId);
      const excludedAssets = Array.isArray(entry.excluded_assets) ? entry.excluded_assets : [];
      const normalized = normalizePortfolio(portfolio, excludedAssets);
      const exposure = normalized.reduce((sum, row) => sum + row.outstandingAmount, 0);

      const currency = entry.currency != null ? String(entry.currency) : "";
      totalExposureByCurrency[currency] = (totalExposureByCurrency[currency] ?? 0) + exposure;
      totalExposure += exposure;

      const c = entry.covenant && typeof entry.covenant === "object" ? (entry.covenant as Record<string, unknown>) : {};
      facilities.push({
        facilityId,
        name: entry.name != null ? String(entry.name) : "Unknown",
        assetClass: entry.asset_class != null ? String(entry.asset_class) : "",
        currency,
        covenantStatus: (c.status === "BREACH" ? "BREACH" : "COMPLIANT") as CovenantStatus,
        exposure,
        covenantRate: safeNum(c.computed_rate),
        covenantThreshold: safeNum(c.threshold),
        covenantMetric: c.metric != null ? String(c.metric) : "",
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
    const raw = await this.covenantSource.getCovenantResults();
    const covenant = safeCovenantResults(raw);
    const f = covenant.facilities.find((x) => {
      const o = x && typeof x === "object" ? (x as unknown as Record<string, unknown>) : null;
      return o?.facility_id != null && String(o.facility_id) === facilityId;
    });
    if (!f || typeof f !== "object") return null;

    const entry = f as unknown as Record<string, unknown>;
    const portfolio = await this.portfolioSource.getPortfolio(facilityId);
    const excludedAssets = Array.isArray(entry.excluded_assets) ? entry.excluded_assets : [];
    const normalizedPortfolio = normalizePortfolio(portfolio, excludedAssets);
    const exposure = normalizedPortfolio.reduce((sum, row) => sum + row.outstandingAmount, 0);

    const c = entry.covenant && typeof entry.covenant === "object" ? (entry.covenant as Record<string, unknown>) : {};
    const s = entry.summary && typeof entry.summary === "object" ? (entry.summary as Record<string, unknown>) : {};
    const covenantNormalized: NormalizedCovenant = {
      metric: c.metric != null ? String(c.metric) : "",
      computedRate: safeNum(c.computed_rate),
      threshold: safeNum(c.threshold),
      operator: (c.operator === "above" || c.operator === "equals" ? c.operator : "below") as NormalizedCovenant["operator"],
      status: (c.status === "BREACH" ? "BREACH" : "COMPLIANT") as CovenantStatus,
      breachConsequence: c.breach_consequence != null ? String(c.breach_consequence) : "",
    };

    const includedAssets = Array.isArray(entry.included_assets) ? entry.included_assets : [];
    const excludedWithReasons: Array<{ id: string; reasons: string[] }> = excludedAssets
      .filter((item): item is Record<string, unknown> => item != null && typeof item === "object")
      .map((item) => ({
        id: item.id != null ? String(item.id) : "",
        reasons: Array.isArray(item.reasons) ? item.reasons.map((r) => (r != null ? String(r) : "")) : [],
      }))
      .filter((x) => x.id !== "");

    return {
      facilityId,
      name: entry.name != null ? String(entry.name) : "Unknown",
      assetClass: entry.asset_class != null ? String(entry.asset_class) : "",
      currency: entry.currency != null ? String(entry.currency) : "",
      covenant: covenantNormalized,
      summary: {
        totalAssets: safeNum(s.total_assets),
        included: safeNum(s.included),
        excluded: safeNum(s.excluded),
      },
      includedAssetIds: includedAssets.map((id) => (id != null ? String(id) : "")).filter(Boolean),
      excludedWithReasons,
      portfolio: normalizedPortfolio,
      exposure,
    };
  }
}
