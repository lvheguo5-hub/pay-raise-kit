import { describe, expect, it } from "vitest";

import {
  getInternalAnalyticsAction,
  getInternalAnalyticsCookie,
  hasInternalAnalyticsCookie,
  removeInternalAnalyticsQuery,
} from "@/lib/internal-analytics";

describe("internal analytics policy", () => {
  it("recognizes only the supported query toggles", () => {
    expect(getInternalAnalyticsAction("?internal=1")).toBe("enable");
    expect(getInternalAnalyticsAction("?internal=0")).toBe("disable");
    expect(getInternalAnalyticsAction("?internal=yes")).toBeNull();
    expect(getInternalAnalyticsAction("?utm_source=test")).toBeNull();
  });

  it("matches only the exact first-party cookie", () => {
    expect(hasInternalAnalyticsCookie("prk_internal=1")).toBe(true);
    expect(
      hasInternalAnalyticsCookie("theme=dark; prk_internal=1; x=2"),
    ).toBe(true);
    expect(hasInternalAnalyticsCookie("prk_internal=0")).toBe(false);
    expect(hasInternalAnalyticsCookie("other_prk_internal=1")).toBe(false);
  });

  it("serializes reversible secure cookie commands", () => {
    expect(getInternalAnalyticsCookie("enable")).toBe(
      "prk_internal=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure",
    );
    expect(getInternalAnalyticsCookie("disable")).toBe(
      "prk_internal=; Path=/; Max-Age=0; SameSite=Lax; Secure",
    );
  });

  it("removes only the internal parameter and preserves the rest of the URL", () => {
    expect(
      removeInternalAnalyticsQuery(
        "https://payraisekit.com/raise-percentage-calculator/?query=pay%20raise&internal=1&utm_source=codex#result",
      ),
    ).toBe(
      "/raise-percentage-calculator/?query=pay%20raise&utm_source=codex#result",
    );
  });
});
