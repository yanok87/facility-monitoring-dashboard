import type { NormalizedStatus } from "@/domain/types";

/**
 * Normalizes originator-specific status strings to a single vocabulary
 * for consistent table display across facilities.
 * Handles real-world inconsistencies: "open" / "Open" / "OPEN" → same bucket.
 */
const STATUS_MAP: Record<string, NormalizedStatus> = {
  // Educa / loan-style
  open: "current",
  Open: "current",
  OPEN: "current",
  current: "current",
  closed: "closed",
  delinquent: "delinquent",
  written_off: "written_off",
  // PayEarly
  performing: "performing",
  Performing: "performing",
  PERFORMING: "performing",
  defaulted: "defaulted",
  repaid: "repaid",
  // Nomina
  active: "active",
  ACTIVE: "active",
  past_due: "past_due",
  settled: "settled",
};

export function normalizeStatus(raw: string | null | undefined): NormalizedStatus {
  if (raw == null || raw === "") return "unknown";
  const normalized = STATUS_MAP[raw];
  return normalized ?? "unknown";
}
