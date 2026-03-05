import type { CovenantResults } from "@/types";

/**
 * Port: fetch pre-computed covenant results (from API, file, or mock).
 * Adapters implement this; core/service depends on the interface only.
 */
export interface ICovenantSource {
  getCovenantResults(): Promise<CovenantResults>;
}
