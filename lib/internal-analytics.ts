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
  url.searchParams.delete("internal");
  return `${url.pathname}${url.search}${url.hash}`;
}
