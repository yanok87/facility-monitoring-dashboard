import type { ICovenantSource } from "@/ports";
import type { CovenantResults } from "@/types";

/**
 * Adapter: loads covenant results from an HTTP API.
 * Takes the covenant URL from config (e.g. COVENANT_URL from @/config/urls).
 */
export class CovenantHttpAdapter implements ICovenantSource {
  constructor(private readonly url: string) {}

  async getCovenantResults(): Promise<CovenantResults> {
    if (!this.url) {
      throw new Error("Covenant URL is not configured");
    }
    const res = await fetch(this.url);
    if (!res.ok) {
      throw new Error(`Covenant API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<CovenantResults>;
  }
}
