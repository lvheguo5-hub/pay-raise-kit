export type InternalAnalyticsAction = "enable" | "disable";

const cookieName = "prk_internal";

export function getInternalAnalyticsAction(
  search: string,
): InternalAnalyticsAction | null {
  const value = new URLSearchParams(search).get("internal");

  if (value === "1") return "enable";
  if (value === "0") return "disable";
  return null;
}

export function hasInternalAnalyticsCookie(cookieHeader: string): boolean {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === `${cookieName}=1`);
}

export function getInternalAnalyticsCookie(
  action: InternalAnalyticsAction,
): string {
  const value = action === "enable" ? "1" : "";
  const maxAge = action === "enable" ? 31536000 : 0;

  return `${cookieName}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
}

export function removeInternalAnalyticsQuery(href: string): string {
  const url = new URL(href);
  const rawSearch = url.search.startsWith("?") ? url.search.slice(1) : "";
  const remainingSearch = rawSearch
    .split("&")
    .filter((pair) => !isInternalQueryPair(pair))
    .join("&");
  const search = remainingSearch ? `?${remainingSearch}` : "";

  return `${url.pathname}${search}${url.hash}`;
}

function isInternalQueryPair(pair: string): boolean {
  const rawKey = pair.split("=", 1)[0];

  try {
    return decodeURIComponent(rawKey.replaceAll("+", " ")) === "internal";
  } catch {
    return rawKey === "internal";
  }
}
