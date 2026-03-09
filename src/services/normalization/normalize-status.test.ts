import { describe, it, expect } from "vitest";
import { normalizeStatus } from "./normalize-status";

describe("normalizeStatus", () => {
  it("returns 'unknown' for null and undefined", () => {
    expect(normalizeStatus(null)).toBe("unknown");
    expect(normalizeStatus(undefined)).toBe("unknown");
  });

  it("returns 'unknown' for empty string", () => {
    expect(normalizeStatus("")).toBe("unknown");
  });

  it("normalizes Educa/loan-style statuses (case-insensitive)", () => {
    expect(normalizeStatus("open")).toBe("current");
    expect(normalizeStatus("Open")).toBe("current");
    expect(normalizeStatus("OPEN")).toBe("current");
    expect(normalizeStatus("current")).toBe("current");
    expect(normalizeStatus("closed")).toBe("closed");
    expect(normalizeStatus("delinquent")).toBe("delinquent");
    expect(normalizeStatus("written_off")).toBe("written_off");
  });

  it("normalizes PayEarly statuses", () => {
    expect(normalizeStatus("performing")).toBe("performing");
    expect(normalizeStatus("Performing")).toBe("performing");
    expect(normalizeStatus("PERFORMING")).toBe("performing");
    expect(normalizeStatus("defaulted")).toBe("defaulted");
    expect(normalizeStatus("repaid")).toBe("repaid");
  });

  it("normalizes Nomina statuses", () => {
    expect(normalizeStatus("active")).toBe("active");
    expect(normalizeStatus("ACTIVE")).toBe("active");
    expect(normalizeStatus("past_due")).toBe("past_due");
    expect(normalizeStatus("settled")).toBe("settled");
  });

  it("returns 'unknown' for unmapped status", () => {
    expect(normalizeStatus("unknown_status")).toBe("unknown");
    expect(normalizeStatus("PENDING")).toBe("unknown");
  });
});
