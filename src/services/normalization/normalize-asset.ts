import type { NormalizedAssetRow } from "@/domain/types";
import type {
  EducaCapitalAsset,
  PayEarlyEwaAsset,
  NominaSalaryAdvanceAsset,
  PortfolioAsset,
} from "@/types";
import { normalizeStatus } from "./normalize-status";

/**
 * Builds a map of asset id → exclusion reasons from covenant excluded_assets.
 */
export function buildExcludedMap(
  excludedWithReasons: Array<{ id: string; reasons: string[] }>
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const { id, reasons } of excludedWithReasons) {
    map.set(id, reasons);
  }
  return map;
}

function isEducaAsset(asset: PortfolioAsset): asset is EducaCapitalAsset {
  return "student_id" in asset;
}

function isPayEarlyAsset(asset: PortfolioAsset): asset is PayEarlyEwaAsset {
  return "employee_id" in asset && "employer_id" in asset;
}

function isNominaAsset(asset: PortfolioAsset): asset is NominaSalaryAdvanceAsset {
  return "employer_tax_id" in asset && "advance_amount" in asset;
}

/**
 * Extracts a stable "amount" and "outstanding" for table display from any asset schema.
 * Normalizes to one column value for consistency (exposure = outstanding).
 */
function getAmounts(asset: PortfolioAsset): { amount: number; outstandingAmount: number } {
  if (isEducaAsset(asset)) {
    return { amount: asset.amount, outstandingAmount: asset.outstanding_amount };
  }
  if (isPayEarlyAsset(asset)) {
    return {
      amount: asset.amount,
      outstandingAmount: asset.outstanding_principal_amount,
    };
  }
  if (isNominaAsset(asset)) {
    return { amount: asset.amount, outstandingAmount: asset.outstanding_amount };
  }
  return { amount: 0, outstandingAmount: 0 };
}

/**
 * Picks the main status field for normalization (facility-specific field names).
 */
function getStatusRaw(asset: PortfolioAsset): string {
  if (isEducaAsset(asset)) return asset.loan_status ?? asset.status;
  if (isPayEarlyAsset(asset) || isNominaAsset(asset)) return asset.status;
  return (asset as Record<string, unknown>).status as string;
}

/**
 * Converts a raw portfolio asset to a normalized row for the table.
 * Handles heterogeneous schemas and attaches exclusion info from covenant.
 */
export function normalizeAsset(
  asset: PortfolioAsset,
  excludedMap: Map<string, string[]>
): NormalizedAssetRow {
  const id = asset.external_id;
  const exclusionReasons = excludedMap.get(id) ?? [];
  const isExcludedFromCovenant = exclusionReasons.length > 0;
  const { amount, outstandingAmount } = getAmounts(asset);
  const statusRaw = getStatusRaw(asset);

  const rawDetail: Record<string, unknown> = { ...asset };

  return {
    id,
    amount,
    outstandingAmount,
    status: normalizeStatus(statusRaw),
    isEligible: asset.is_eligible,
    daysPastDue: asset.days_past_due ?? 0,
    isExcludedFromCovenant,
    exclusionReasons,
    rawDetail,
  };
}

/**
 * Normalizes a full portfolio and attaches exclusion data.
 */
export function normalizePortfolio(
  assets: PortfolioAsset[],
  excludedWithReasons: Array<{ id: string; reasons: string[] }>
): NormalizedAssetRow[] {
  const excludedMap = buildExcludedMap(excludedWithReasons);
  return assets.map((asset) => normalizeAsset(asset, excludedMap));
}
