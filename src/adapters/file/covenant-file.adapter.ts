import type { ICovenantSource } from "@/ports";
import type { CovenantResults } from "@/types";

export interface CovenantFileAdapterOptions {
  /** Base path to data directory (e.g. project root or public path). */
  basePath: string;
}

/**
 * Adapter: loads covenant results from the filesystem.
 * Swap for an HTTP adapter (e.g. fetch(apiUrl + '/covenant-results')) when using real APIs.
 */
export class CovenantFileAdapter implements ICovenantSource {
  private readonly basePath: string;

  constructor(options: CovenantFileAdapterOptions) {
    this.basePath = options.basePath;
  }

  async getCovenantResults(): Promise<CovenantResults> {
    const path = await import("path");
    const fs = await import("fs/promises");
    const filePath = path.join(this.basePath, "data", "covenant_results.json");
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as CovenantResults;
  }
}
