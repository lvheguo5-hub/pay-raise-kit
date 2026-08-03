# Pay Raise Kit Internal Analytics Exclusion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep Dazhi's and Codex's future Pay Raise Kit visits out of GA4 with a reversible first-party cookie while preserving analytics for ordinary visitors.

**Architecture:** A pure helper module parses the toggle, cookie, and cleaned URL. The existing analytics component becomes a client-side gate that starts closed, applies the toggle in an effect, and renders the existing privacy-safe Google scripts only when tracking is allowed. Static verification changes from requiring an eager Google tag in exported HTML to requiring the source contract and proving exported HTML cannot load GA4 before the browser-level decision.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Vitest, Testing Library, jsdom, Cloudflare Pages, GA4.

---

## File map

- Create `lib/internal-analytics.ts`: pure toggle, cookie, and URL-cleanup contract.
- Create `tests/internal-analytics.test.ts`: unit tests for toggle parsing, cookie matching, cookie serialization, and URL cleanup.
- Create `tests/google-analytics.test.tsx`: browser-level component tests with `next/script` mocked as observable script nodes.
- Modify `components/GoogleAnalytics.tsx`: client-side closed-by-default gate around the current GA4 scripts.
- Modify `tests/site-contract.test.ts`: require the internal analytics gate in the static source contract.
- Modify `scripts/verify-static.mjs`: verify the gate source and reject an eager GA4 tag in exported HTML.
- Modify `docs/launch-checklist.md`: record enable, disable, and production verification instructions.

### Task 1: Pure internal analytics policy

**Files:**
- Create: `tests/internal-analytics.test.ts`
- Create: `lib/internal-analytics.ts`

- [ ] **Step 1: Write the failing helper tests**

```ts
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
    expect(hasInternalAnalyticsCookie("theme=dark; prk_internal=1; x=2")).toBe(true);
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
        "https://payraisekit.com/raise-percentage-calculator/?internal=1&utm_source=codex#result",
      ),
    ).toBe("/raise-percentage-calculator/?utm_source=codex#result");
  });
});
```

- [ ] **Step 2: Run the helper tests and verify RED**

Run: `npm test -- tests/internal-analytics.test.ts`

Expected: FAIL because `@/lib/internal-analytics` does not exist.

- [ ] **Step 3: Implement the pure helper module**

```ts
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
```

- [ ] **Step 4: Run the helper tests and verify GREEN**

Run: `npm test -- tests/internal-analytics.test.ts`

Expected: 4 tests pass.

- [ ] **Step 5: Commit the helper contract**

```bash
git add lib/internal-analytics.ts tests/internal-analytics.test.ts
git commit -m "test: define internal analytics policy"
```

### Task 2: Closed-by-default GA4 client gate

**Files:**
- Create: `tests/google-analytics.test.tsx`
- Modify: `components/GoogleAnalytics.tsx`

- [ ] **Step 1: Write failing component tests**

```tsx
// @vitest-environment jsdom

import { cleanup, render, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GoogleAnalytics } from "@/components/GoogleAnalytics";

vi.mock("next/script", () => ({
  default: ({
    children,
    id,
    src,
  }: {
    children?: React.ReactNode;
    id?: string;
    src?: string;
  }) => (
    <script data-testid={id ?? "google-analytics-loader"} src={src}>
      {children}
    </script>
  ),
}));

beforeEach(() => {
  window.history.replaceState({}, "", "/");
  document.cookie =
    "prk_internal=; Path=/; Max-Age=0; SameSite=Lax; Secure";
});

afterEach(cleanup);

describe("GoogleAnalytics", () => {
  it("loads GA4 after an ordinary browser is known to be trackable", async () => {
    const { container } = render(
      <GoogleAnalytics measurementId="G-BNKWB2NT8J" />,
    );

    await waitFor(() => {
      expect(
        container.querySelector(
          'script[src="https://www.googletagmanager.com/gtag/js?id=G-BNKWB2NT8J"]',
        ),
      ).not.toBeNull();
    });
  });

  it("sets internal mode without loading GA4 on the enabling visit", async () => {
    window.history.replaceState(
      {},
      "",
      "/?internal=1&utm_source=codex#result",
    );
    const { container } = render(
      <GoogleAnalytics measurementId="G-BNKWB2NT8J" />,
    );

    await waitFor(() => {
      expect(document.cookie).toContain("prk_internal=1");
      expect(window.location.pathname + window.location.search + window.location.hash).toBe(
        "/?utm_source=codex#result",
      );
    });
    expect(container.querySelector("script")).toBeNull();
  });

  it("clears internal mode and restores GA4", async () => {
    document.cookie =
      "prk_internal=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure";
    window.history.replaceState({}, "", "/?internal=0");
    const { container } = render(
      <GoogleAnalytics measurementId="G-BNKWB2NT8J" />,
    );

    await waitFor(() => {
      expect(document.cookie).not.toContain("prk_internal=1");
      expect(container.querySelector("script")).not.toBeNull();
    });
    expect(window.location.pathname + window.location.search).toBe("/");
  });

  it("keeps invalid measurement IDs disabled", async () => {
    const { container } = render(
      <GoogleAnalytics measurementId="not-a-ga-id" />,
    );
    await Promise.resolve();
    expect(container.querySelector("script")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the component tests and verify RED**

Run: `npm test -- tests/google-analytics.test.tsx`

Expected: FAIL because the current server component ignores the toggle and cookie.

- [ ] **Step 3: Implement the client gate**

```tsx
"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import {
  getInternalAnalyticsAction,
  getInternalAnalyticsCookie,
  hasInternalAnalyticsCookie,
  removeInternalAnalyticsQuery,
} from "@/lib/internal-analytics";

type GoogleAnalyticsProps = {
  measurementId?: string;
};

const measurementIdPattern = /^G-[A-Z0-9]+$/;

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [trackingAllowed, setTrackingAllowed] = useState(false);

  useEffect(() => {
    const action = getInternalAnalyticsAction(window.location.search);
    let isInternal = hasInternalAnalyticsCookie(document.cookie);

    if (action) {
      document.cookie = getInternalAnalyticsCookie(action);
      isInternal = action === "enable";
      window.history.replaceState(
        window.history.state,
        "",
        removeInternalAnalyticsQuery(window.location.href),
      );
    }

    setTrackingAllowed(!isInternal);
  }, []);

  if (
    !trackingAllowed ||
    !measurementId ||
    !measurementIdPattern.test(measurementId)
  ) {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}', {
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});`}
      </Script>
    </>
  );
}
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm test -- tests/internal-analytics.test.ts tests/google-analytics.test.tsx`

Expected: 8 tests pass.

- [ ] **Step 5: Commit the client gate**

```bash
git add components/GoogleAnalytics.tsx tests/google-analytics.test.tsx
git commit -m "feat: exclude internal analytics visits"
```

### Task 3: Static release contract and operator instructions

**Files:**
- Modify: `tests/site-contract.test.ts`
- Modify: `scripts/verify-static.mjs`
- Modify: `docs/launch-checklist.md`

- [ ] **Step 1: Add failing static contract assertions**

Extend the GA4 site-contract test with:

```ts
const internalAnalytics = await readFile("lib/internal-analytics.ts", "utf8");
const launchChecklist = await readFile("docs/launch-checklist.md", "utf8");
const verifier = await readFile("scripts/verify-static.mjs", "utf8");

expect(analytics).toContain('"use client"');
expect(analytics).toContain("getInternalAnalyticsAction");
expect(analytics).toContain("hasInternalAnalyticsCookie");
expect(internalAnalytics).toContain('const cookieName = "prk_internal"');
expect(internalAnalytics).toContain("Max-Age=31536000");
expect(verifier).toContain("GA4 tag loads before the internal browser decision");
expect(launchChecklist).toContain("## Internal analytics exclusion");
expect(launchChecklist).toContain("https://payraisekit.com/?internal=1");
```

Run: `npm test -- tests/site-contract.test.ts`

Expected: FAIL because the verifier and launch checklist do not yet contain the internal-mode release contract.

- [ ] **Step 2: Change static verification from eager tag to closed gate**

In `scripts/verify-static.mjs`, read the analytics component and helper once:

```js
const analyticsComponent = await readFile(
  "components/GoogleAnalytics.tsx",
  "utf8",
);
const internalAnalytics = await readFile("lib/internal-analytics.ts", "utf8");

for (const requiredSource of [
  "https://www.googletagmanager.com/gtag/js?id=",
  "allow_google_signals",
  "allow_ad_personalization_signals",
]) {
  if (!analyticsComponent.includes(requiredSource)) {
    failures.push(`Missing GA4 source contract: ${requiredSource}`);
  }
}

for (const requiredGate of ["prk_internal", "Max-Age=31536000"]) {
  if (!internalAnalytics.includes(requiredGate)) {
    failures.push(`Missing internal analytics gate: ${requiredGate}`);
  }
}
```

Replace the per-page eager GA4 requirements with:

```js
if (html.includes("https://www.googletagmanager.com/gtag/js?id=")) {
  failures.push(`GA4 tag loads before the internal browser decision in ${page.file}`);
}
```

- [ ] **Step 3: Add the operator instructions**

Append this section to `docs/launch-checklist.md`:

```md
## Internal analytics exclusion

- Enable on every internal browser: `https://payraisekit.com/?internal=1`
- Disable only for a controlled analytics test: `https://payraisekit.com/?internal=0`
- Internal mode is valid only after the address bar no longer contains `internal=1` and the browser stores `prk_internal=1`.
- With internal mode enabled, verify that neither `googletagmanager.com` nor GA4 `g/collect` is requested.
- After any controlled GA4 test, re-enable internal mode before normal browsing or development continues.
```

- [ ] **Step 4: Run the full release gate**

Run: `npm run verify`

Expected: typecheck, lint, all tests, static export, and static verification pass.

- [ ] **Step 5: Commit the release contract**

```bash
git add tests/site-contract.test.ts scripts/verify-static.mjs docs/launch-checklist.md
git commit -m "docs: add internal analytics release controls"
```

### Task 4: Google association, deployment, and production proof

**Files:**
- Modify only if the existing release SOP requires evidence: `docs/launch-checklist.md`

- [ ] **Step 1: Create the authorized Google association**

In GA4 property `Pay Raise Kit` (`548132775`), create one Search Console link from `sc-domain:payraisekit.com` to web stream `Pay Raise Kit Web` (`15361831297`). Do not associate a different property or stream.

Expected: the GA4 Search Console links table contains exactly that resource and stream.

- [ ] **Step 2: Push the verified source**

Run:

```bash
git status --short
git push origin main
```

Expected: clean tracked worktree and `main` pushed successfully.

- [ ] **Step 3: Verify the production deployment**

Expected:

- `https://payraisekit.com/` returns HTTP 200.
- the deployed source matches the pushed commit;
- all seven sitemap routes remain available;
- GA4 and Search Console remain attached to Pay Raise Kit identities only.

- [ ] **Step 4: Prove both analytics modes**

Use an unblocked test browser:

1. Visit `https://payraisekit.com/?internal=0` and verify the Google tag plus one GA4 `g/collect` request.
2. Visit `https://payraisekit.com/?internal=1` and verify the query disappears and `prk_internal=1` exists.
3. Reload the homepage and verify no Google tag or GA4 `g/collect` request occurs.

Expected: ordinary mode sends; internal mode sends nothing.

- [ ] **Step 5: Leave internal mode enabled and record final evidence**

Confirm the working browser remains opted out. Record the final source commit, deployment identifier, production HTTP status, GA4 request result, internal suppression result, and GA4–GSC association result in the existing launch evidence location.
