import { CovenantHttpAdapter } from "./covenant-http.adapter";
import { PortfolioHttpAdapter } from "./portfolio-http.adapter";
import { COVENANT_URL, PORTFOLIO_URLS, FACILITY_IDS } from "@/config/urls";

/**
 * Creates HTTP adapters using URLs from @/config/urls.
 * Use when switching from file adapters to real API.
 */
export function createHttpAdaptersFromUrls() {
  return {
    covenant: new CovenantHttpAdapter(COVENANT_URL),
    portfolio: new PortfolioHttpAdapter({
      urls: PORTFOLIO_URLS,
      facilityIds: [...FACILITY_IDS],
    }),
  };
}
