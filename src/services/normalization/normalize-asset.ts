import type { NormalizedAssetRow } from "@/domain/types";
import type { PortfolioAsset } from "@/types";
import { normalizeStatus } from "./normalize-status";

/** Asset shape as it may come from APIs (fields can be null/undefined) */
type PortfolioAssetInput = Record<string, unknown> | null | undefined;

/**
 * Builds a map of asset id → exclusion reasons from covenant excluded_assets.
 * Ignores entries with null/undefined id or reasons.
 */
export function buildExcludedMap(
  excludedWithReasons: Array<{ id: string; reasons: string[] }> | null | undefined
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  if (!excludedWithReasons) return map;
  for (const entry of excludedWithReasons) {
    const id = entry?.id;
    const reasons = entry?.reasons;
    if (id != null && Array.isArray(reasons)) map.set(String(id), reasons);
  }
  return map;
}

function hasKey(asset: PortfolioAssetInput, key: string): asset is Record<string, unknown> {
  return asset != null && typeof asset === "object" && key in asset;
}

function isEducaAsset(asset: PortfolioAssetInput): boolean {
  return hasKey(asset, "student_id");
}

function isPayEarlyAsset(asset: PortfolioAssetInput): boolean {
  return hasKey(asset, "employee_id") && hasKey(asset, "employer_id");
}

function isNominaAsset(asset: PortfolioAssetInput): boolean {
  return hasKey(asset, "employer_tax_id") && hasKey(asset, "advance_amount");
}

function toNum(value: unknown): number {
  if (value == null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Extracts a stable "amount" and "outstanding" for table display from any asset schema.
 * Normalizes to one column value for consistency (exposure = outstanding).
 * Uses 0 for null/undefined or invalid numbers.
 */
function getAmounts(asset: PortfolioAssetInput): { amount: number; outstandingAmount: number } {
  const r = asset as Record<string, unknown> | undefined;
  if (!r || typeof r !== "object") return { amount: 0, outstandingAmount: 0 };
  if (isEducaAsset(asset)) {
    return { amount: toNum(r.amount), outstandingAmount: toNum(r.outstanding_amount) };
  }
  if (isPayEarlyAsset(asset)) {
    return {
      amount: toNum(r.amount),
      outstandingAmount: toNum(r.outstanding_principal_amount),
    };
  }
  if (isNominaAsset(asset)) {
    return { amount: toNum(r.amount), outstandingAmount: toNum(r.outstanding_amount) };
  }
  return { amount: toNum(r.amount), outstandingAmount: toNum(r.outstanding_amount) };
}

/**
 * Picks the main status field for normalization (facility-specific field names).
 * Returns empty string if missing so normalizeStatus maps to "unknown".
 */
function getStatusRaw(asset: PortfolioAssetInput): string {
  const r = asset as Record<string, unknown> | undefined;
  if (!r || typeof r !== "object") return "";
  if (isEducaAsset(asset)) {
    const v = r.loan_status ?? r.status;
    return v != null ? String(v) : "";
  }
  if (isPayEarlyAsset(asset) || isNominaAsset(asset)) return r.status != null ? String(r.status) : "";
  return r.status != null ? String(r.status) : "";
}

/**
 * Converts a raw portfolio asset to a normalized row for the table.
 * Handles heterogeneous schemas and attaches exclusion info from covenant.
 * Safe for null/undefined field values from APIs; uses fallbacks (e.g. id, 0, false, "unknown").
 */
export function normalizeAsset(
  asset: PortfolioAssetInput,
  excludedMap: Map<string, string[]>,
  fallbackId?: string
): NormalizedAssetRow {
  const id = asset?.external_id != null ? String(asset.external_id) : (fallbackId ?? "(no id)");
  const exclusionReasons = excludedMap.get(id) ?? [];
  const isExcludedFromCovenant = exclusionReasons.length > 0;
  const { amount, outstandingAmount } = getAmounts(asset);
  const statusRaw = getStatusRaw(asset);

  const rawDetail: Record<string, unknown> = asset && typeof asset === "object" ? { ...asset } : {};

  return {
    id,
    amount,
    outstandingAmount,
    status: normalizeStatus(statusRaw),
    isEligible: asset?.is_eligible === true,
    daysPastDue: toNum(asset?.days_past_due),
    isExcludedFromCovenant,
    exclusionReasons,
    rawDetail,
  };
}

/**
 * Normalizes a full portfolio and attaches exclusion data.
 * Ignores null/undefined entries in assets; safe when assets or excludedWithReasons are null/undefined.
 */
export function normalizePortfolio(
  assets: PortfolioAsset[] | (PortfolioAsset | null | undefined)[] | null | undefined,
  excludedWithReasons: Array<{ id: string; reasons: string[] }> | null | undefined
): NormalizedAssetRow[] {
  const list = Array.isArray(assets) ? assets.filter((a): a is PortfolioAsset => a != null) : [];
  const excludedMap = buildExcludedMap(excludedWithReasons);
  return list.map((asset, index) => normalizeAsset(asset as PortfolioAssetInput, excludedMap, `asset-${index}`));
}
