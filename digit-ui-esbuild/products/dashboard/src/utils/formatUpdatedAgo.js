/**
 * Relative freshness label for the dashboard tile stamp (#2047).
 * Parts are pure so tests do not depend on React or i18n.
 */

export function updatedAgoParts(asOfMs, nowMs = Date.now()) {
  if (asOfMs == null || !Number.isFinite(asOfMs)) return null;
  const deltaMs = Math.max(0, nowMs - asOfMs);
  const mins = Math.floor(deltaMs / 60_000);
  if (mins < 1) return { unit: "justNow", n: 0 };
  if (mins < 60) return { unit: "min", n: mins };
  const hrs = Math.floor(mins / 60);
  // Issue asks for min/hrs; keep hours past a day so "48 hrs ago" stays readable
  // without introducing a separate day unit unless the stamp is very old.
  if (hrs < 72) return { unit: "hrs", n: hrs };
  return { unit: "days", n: Math.floor(hrs / 24) };
}

/**
 * @param {number} asOfMs
 * @param {(key: string, seed: string) => string} t
 * @param {number} [nowMs]
 */
export function formatUpdatedAgoLabel(asOfMs, t, nowMs = Date.now()) {
  const parts = updatedAgoParts(asOfMs, nowMs);
  if (!parts) return null;
  const fill = (seed, key) =>
    String(t(key, seed)).replace(/\{\{\s*n\s*\}\}/g, String(parts.n));
  if (parts.unit === "justNow")
    return t("DASHBOARD_COMMON_UPDATED_JUST_NOW", "just now");
  if (parts.unit === "min")
    return fill("{{n}} min ago", "DASHBOARD_COMMON_UPDATED_MIN_AGO");
  if (parts.unit === "hrs")
    return fill("{{n}} hrs ago", "DASHBOARD_COMMON_UPDATED_HRS_AGO");
  return fill("{{n}} days ago", "DASHBOARD_COMMON_UPDATED_DAYS_AGO");
}
