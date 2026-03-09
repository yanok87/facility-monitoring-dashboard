import { describe, it, expect } from "vitest";
import { buildExcludedMap, normalizeAsset, normalizePortfolio } from "./normalize-asset";

describe("buildExcludedMap", () => {
  it("returns empty map for null or undefined", () => {
    expect(buildExcludedMap(null).size).toBe(0);
    expect(buildExcludedMap(undefined).size).toBe(0);
  });

  it("returns empty map for empty array", () => {
    expect(buildExcludedMap([]).size).toBe(0);
  });

  it("builds id -> reasons map", () => {
    const map = buildExcludedMap([
      { id: "a1", reasons: ["past_due"] },
      { id: "a2", reasons: ["ineligible", "other"] },
    ]);
    expect(map.get("a1")).toEqual(["past_due"]);
    expect(map.get("a2")).toEqual(["ineligible", "other"]);
  });

  it("skips entries with null/undefined id or reasons", () => {
    const map = buildExcludedMap([
      { id: "ok", reasons: ["r1"] },
      { id: null as unknown as string, reasons: ["r2"] },
      { id: "alsoOk", reasons: undefined as unknown as string[] },
    ]);
    expect(map.get("ok")).toEqual(["r1"]);
    expect(map.size).toBe(1);
  });
});

describe("normalizeAsset", () => {
  it("normalizes Educa-style asset", () => {
    const excludedMap = new Map<string, string[]>();
    const asset = {
      external_id: "edu-1",
      student_id: "s1",
      amount: 1000,
      outstanding_amount: 500,
      loan_status: "open",
      status: "current",
      is_eligible: true,
      days_past_due: 0,
    };
    const row = normalizeAsset(asset, excludedMap);
    expect(row.id).toBe("edu-1");
    expect(row.amount).toBe(1000);
    expect(row.outstandingAmount).toBe(500);
    expect(row.status).toBe("current");
    expect(row.isEligible).toBe(true);
    expect(row.daysPastDue).toBe(0);
    expect(row.isExcludedFromCovenant).toBe(false);
    expect(row.exclusionReasons).toEqual([]);
  });

  it("uses fallback id when external_id is missing", () => {
    const excludedMap = new Map<string, string[]>();
    const asset = { student_id: "s1", amount: 0, outstanding_amount: 0 };
    const row = normalizeAsset(asset, excludedMap, "fallback-0");
    expect(row.id).toBe("fallback-0");
  });

  it("attaches exclusion reasons from map", () => {
    const excludedMap = new Map([["asset-1", ["past_due", "ineligible"]]]);
    const asset = { external_id: "asset-1", status: "past_due", amount: 100, outstanding_amount: 50 };
    const row = normalizeAsset(asset, excludedMap);
    expect(row.isExcludedFromCovenant).toBe(true);
    expect(row.exclusionReasons).toEqual(["past_due", "ineligible"]);
  });

  it("handles null/undefined amounts and is_eligible", () => {
    const excludedMap = new Map<string, string[]>();
    const asset = {
      external_id: "x",
      amount: null,
      outstanding_amount: undefined,
      is_eligible: undefined,
      days_past_due: null,
      status: "performing",
    };
    const row = normalizeAsset(asset, excludedMap);
    expect(row.amount).toBe(0);
    expect(row.outstandingAmount).toBe(0);
    expect(row.isEligible).toBe(false);
    expect(row.daysPastDue).toBe(0);
    expect(row.status).toBe("performing");
  });
});

describe("normalizePortfolio", () => {
  it("returns empty array for null or undefined assets", () => {
    expect(normalizePortfolio(null, [])).toEqual([]);
    expect(normalizePortfolio(undefined, [])).toEqual([]);
  });

  it("filters out null/undefined entries in assets array", () => {
    const assets = [
      { external_id: "a1", status: "current", amount: 100, outstanding_amount: 50 },
      null,
      undefined,
    ];
    const result = normalizePortfolio(assets, []);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a1");
  });

  it("normalizes multiple assets and applies excluded map", () => {
    const assets = [
      { external_id: "id1", status: "open", amount: 100, outstanding_amount: 80 },
      { external_id: "id2", status: "closed", amount: 200, outstanding_amount: 0 },
    ];
    const excluded = [{ id: "id2", reasons: ["repaid"] }];
    const result = normalizePortfolio(assets, excluded);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("id1");
    expect(result[0].isExcludedFromCovenant).toBe(false);
    expect(result[1].id).toBe("id2");
    expect(result[1].isExcludedFromCovenant).toBe(true);
    expect(result[1].exclusionReasons).toEqual(["repaid"]);
  });
});
