/**
 * Returns milliseconds until the next midnight UTC.
 * Use as staleTime so data is considered "fresh" for the rest of the current calendar day.
 */
export function getStaleTimeUntilMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return midnight.getTime() - now.getTime();
}
