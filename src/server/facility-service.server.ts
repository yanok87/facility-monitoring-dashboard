import { FacilityService } from "@/services/facility.service";
import { createFileAdapters } from "@/adapters/file/facility-file.config";

// -----------------------------------------------------------------------------
// HTTP adapters (real API). Uncomment the block below and comment out the
// file adapter block to use URLs from @/config/urls (COVENANT_URL, PORTFOLIO_URL_1/2/3).
// -----------------------------------------------------------------------------
// import { createHttpAdaptersFromUrls } from "@/adapters/http";

function getFacilityService(): FacilityService {
  // --- File adapters (local JSON): for dev/test without real APIs. Uncomment and comment out the HTTP block below. ---
  const basePath = process.cwd();
  const { covenant, portfolio } = createFileAdapters(basePath);
  return new FacilityService(covenant, portfolio);

  // --- Real API: set COVENANT_URL and PORTFOLIO_URL_1/2/3 in @/config/urls, then: ---
  // const { covenant, portfolio } = createHttpAdaptersFromUrls();
  // return new FacilityService(covenant, portfolio);
}

let instance: FacilityService | null = null;

export function getFacilityServiceInstance(): FacilityService {
  if (!instance) {
    instance = getFacilityService();
  }
  return instance;
}
