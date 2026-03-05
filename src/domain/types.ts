/**
 * Domain types: normalized models consumed by the UI.
 * Facility ids are strings to support N facilities (not limited to 3).
 */

/** Normalized status for table display (consistent across facilities) */
export type NormalizedStatus =
  | "current"
  | "delinquent"
  | "past_due"
  | "closed"
  | "written_off"
  | "defaulted"
  | "repaid"
  | "settled"
  | "performing"
  | "active"
  | "unknown";

/** One row in the portfolio table: same columns for every facility */
export interface NormalizedAssetRow {
  id: string;
  amount: number;
  outstandingAmount: number;
  status: NormalizedStatus;
  isEligible: boolean;
  daysPastDue: number;
  /** True if this asset was excluded from the covenant calculation */
  isExcludedFromCovenant: boolean;
  /** Reasons for exclusion (only when isExcludedFromCovenant is true) */
  exclusionReasons: string[];
  /**
   * Facility-specific fields for the expandable row (key-value or raw).
   * UI can render this in the expanded section without knowing the schema.
   */
  rawDetail: Record<string, unknown>;
}

/** Covenant block for facility detail view */
export interface NormalizedCovenant {
  metric: string;
  computedRate: number;
  threshold: number;
  operator: "below" | "above" | "equals";
  status: "COMPLIANT" | "BREACH";
  breachConsequence: string;
}

/** Full detail for one facility tab (covenant + summary + portfolio table data) */
export interface NormalizedFacilityDetail {
  facilityId: string;
  name: string;
  assetClass: string;
  currency: string;
  covenant: NormalizedCovenant;
  summary: {
    totalAssets: number;
    included: number;
    excluded: number;
  };
  includedAssetIds: string[];
  excludedWithReasons: Array<{ id: string; reasons: string[] }>;
  portfolio: NormalizedAssetRow[];
  /** Total exposure for this facility (sum of outstanding amounts) */
  exposure: number;
}

/** One facility in the overview (hero + cards) */
export interface NormalizedFacilitySummary {
  facilityId: string;
  name: string;
  assetClass: string;
  currency: string;
  covenantStatus: "COMPLIANT" | "BREACH";
  exposure: number;
  covenantRate: number;
  covenantThreshold: number;
  covenantMetric: string;
}

/** Overview payload: hero (total exposure) + facility cards */
export interface NormalizedOverview {
  computedAt: string;
  /** Total exposure by currency (e.g. { EUR: 12345, USD: 6789 }) */
  totalExposureByCurrency: Record<string, number>;
  /** Grand total in a single number (if multi-currency, one currency or summed — UI can display by currency) */
  totalExposure: number;
  facilities: NormalizedFacilitySummary[];
}
