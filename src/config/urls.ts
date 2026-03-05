/**
 * URL configuration for HTTP adapters (real API).
 * Set these to your backend endpoints when not using file adapters.
 */

export const COVENANT_URL = "";

export const PORTFOLIO_URL_1 = "";
export const PORTFOLIO_URL_2 = "";
export const PORTFOLIO_URL_3 = "";

/** Array of portfolio URLs (one per facility). Order matches FACILITY_IDS. */
export const PORTFOLIO_URLS: string[] = [
  PORTFOLIO_URL_1,
  PORTFOLIO_URL_2,
  PORTFOLIO_URL_3,
];

/** Facility id order: PORTFOLIO_URLS[i] is the URL for FACILITY_IDS[i]. */
export const FACILITY_IDS = ["facility_a", "facility_b", "facility_c"] as const;
