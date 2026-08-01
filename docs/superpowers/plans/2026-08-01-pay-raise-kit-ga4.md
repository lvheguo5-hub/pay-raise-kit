# Pay Raise Kit GA4 Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect Pay Raise Kit to one verified GA4 Web Stream, deploy the privacy-safe direct-load tag, and prove production data reaches Google Realtime/DebugView.

**Architecture:** Reuse the guarded Google Analytics component pattern already proven on Free Couple Games. Keep the public Measurement ID in a normal tracked source configuration file so local, CI, and direct Cloudflare builds are deterministic without committing an `.env` file; render the component once from the shared layout, and keep every calculator isolated from analytics calls. Update the Privacy Policy and release evidence before marking the central registry verified.

**Tech Stack:** Next.js 14 static export, React 18, TypeScript, `next/script`, Vitest, Node static verifier, Cloudflare Pages/Wrangler, Google Analytics 4.

---

## File map

- `lib/analytics.ts`: public Pay Raise Kit GA4 Measurement ID used by every production build.
- `components/GoogleAnalytics.tsx`: validates the ID and loads one privacy-restricted Google tag.
- `app/layout.tsx`: mounts the analytics component once for all seven static routes.
- `app/privacy/page.tsx`: truthful GA4, cookies, disabled-signals, and input-exclusion disclosure.
- `tests/site-contract.test.ts`: source contracts for identity, configuration, Privacy, and calculator isolation.
- `scripts/verify-static.mjs`: exported-HTML contract proving the built tag and ID are present on every route.
- `docs/launch-checklist.md`: source/deployment/runtime/request/Google receipt evidence.
- `/Users/dazhilv/Downloads/web出海工作区/web-chuhai-ops/sites/registry.yaml`: central status, updated only after Google-side receipt.

### Task 1: Resolve the one correct GA4 identity

**Files:**
- Read: `docs/launch-checklist.md`
- External: authenticated Google Analytics account

- [ ] **Step 1: Inspect authenticated Google Analytics resources**

Open Google Analytics Admin and search the current account/property/data-stream
list for an exact Pay Raise Kit match. A valid reuse candidate must show:

- Property or Web Stream name clearly identifying Pay Raise Kit;
- website URL `https://payraisekit.com`;
- a Web Stream Measurement ID matching `^G-[A-Z0-9]+$`.

Do not infer identity from a similar name or another site's Measurement ID.
Never reuse `G-DZ2P1TDW9S` or `G-18QX9022FY`.

- [ ] **Step 2: Create only if no exact match exists**

If there is no exact match, create one GA4 Property and one Web Stream for:

```text
Property name: Pay Raise Kit
Website URL: https://payraisekit.com
Stream name: Pay Raise Kit Web
Enhanced measurement: enabled
```

Do not connect Google Ads or enable Google Signals. Stop for dazhi at OTP,
CAPTCHA, ambiguous Google account ownership, or any new material consent choice.

- [ ] **Step 3: Validate and retain the public ID for implementation**

Validate the exact displayed ID before using it:

```bash
case "$PAY_RAISE_KIT_GA_ID" in
  G-[A-Z0-9]*) ;;
  *) echo "Invalid Pay Raise Kit GA4 Measurement ID" >&2; exit 1 ;;
esac

test "$PAY_RAISE_KIT_GA_ID" != "G-DZ2P1TDW9S"
test "$PAY_RAISE_KIT_GA_ID" != "G-18QX9022FY"
```

Expected: all checks exit 0. Do not print account credentials, cookies, or OTPs.
Every later `$PAY_RAISE_KIT_GA_ID` reference means this resolved `G-...` value;
never write the variable name itself into a product file.

### Task 2: Add the GA4 component test-first

**Files:**
- Create: `lib/analytics.ts`
- Create: `components/GoogleAnalytics.tsx`
- Modify: `app/layout.tsx`
- Modify: `tests/site-contract.test.ts`

- [ ] **Step 1: Replace the old no-analytics shell contract**

In `tests/site-contract.test.ts`, rename the existing shell test and remove the
two assertions that reject `gtag` and `googletagmanager`:

```ts
it("renders a crawlable shell", async () => {
  const layout = await readFile("app/layout.tsx", "utf8");

  expect(layout).toContain("metadataBase");
  expect(layout).toContain("<SiteHeader");
  expect(layout).toContain("<SiteFooter");
});
```

Add `stat` to the existing Node import:

```ts
import { access, readFile, stat } from "node:fs/promises";
```

Then add this contract inside the existing `describe` block:

```ts
it("loads the Pay Raise Kit GA4 tag with privacy-safe defaults", async () => {
  const componentPath = "components/GoogleAnalytics.tsx";
    const analyticsConfigPath = "lib/analytics.ts";

    await expect(stat(componentPath)).resolves.toBeDefined();
    await expect(stat(analyticsConfigPath)).resolves.toBeDefined();

    const [layout, analytics, analyticsConfig] = await Promise.all([
      readFile("app/layout.tsx", "utf8"),
      readFile(componentPath, "utf8"),
      readFile(analyticsConfigPath, "utf8"),
    ]);

    const id = analyticsConfig.match(
      /PAY_RAISE_KIT_GA_MEASUREMENT_ID = "(G-[A-Z0-9]+)"/,
    )?.[1];

  expect(id).toBeTruthy();
  expect(id).not.toBe("G-DZ2P1TDW9S");
  expect(id).not.toBe("G-18QX9022FY");
  expect(layout).toContain('import { GoogleAnalytics }');
    expect(layout).toContain("PAY_RAISE_KIT_GA_MEASUREMENT_ID");
  expect(analytics).toContain(
    "const measurementIdPattern = /^G-[A-Z0-9]+$/;",
  );
  expect(analytics).toContain("allow_google_signals: false");
  expect(analytics).toContain(
    "allow_ad_personalization_signals: false",
  );

  const calculatorSource = (
    await Promise.all([
      "PayRaiseCalculator.tsx",
      "RaisePercentageCalculator.tsx",
      "SalaryGrowthCalculator.tsx",
    ].map((file) => readFile(`components/calculators/${file}`, "utf8")))
  ).join("\n");

  expect(calculatorSource).not.toContain("gtag");
  expect(calculatorSource).not.toContain("GoogleAnalytics");
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- tests/site-contract.test.ts
```

Expected: FAIL because `components/GoogleAnalytics.tsx` and `lib/analytics.ts`
do not exist.

- [ ] **Step 3: Create the public analytics configuration with the verified ID**

Create `lib/analytics.ts` using `apply_patch` with exactly one export containing
the Task 1 ID:

```ts
export const PAY_RAISE_KIT_GA_MEASUREMENT_ID = "$PAY_RAISE_KIT_GA_ID";
```

Resolve the variable before editing so the file contains the actual validated
`G-...` string. The value is public configuration, not a secret. Do not add any
other account or credential field, and do not commit an `.env` file.

- [ ] **Step 4: Create the guarded analytics component**

Create `components/GoogleAnalytics.tsx`:

```tsx
import Script from "next/script";

type GoogleAnalyticsProps = {
  measurementId?: string;
};

const measurementIdPattern = /^G-[A-Z0-9]+$/;

export function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  if (!measurementId || !measurementIdPattern.test(measurementId)) {
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

- [ ] **Step 5: Mount the component once in the shared layout**

Add this import to `app/layout.tsx`:

```tsx
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { PAY_RAISE_KIT_GA_MEASUREMENT_ID } from "@/lib/analytics";
```

Render this once after `<SiteFooter />`:

```tsx
<GoogleAnalytics measurementId={PAY_RAISE_KIT_GA_MEASUREMENT_ID} />
```

- [ ] **Step 6: Run the focused test and verify GREEN**

Run:

```bash
npm test -- tests/site-contract.test.ts
```

Expected: all site-contract tests pass.

- [ ] **Step 7: Commit the GA4 component**

```bash
git add lib/analytics.ts components/GoogleAnalytics.tsx app/layout.tsx tests/site-contract.test.ts
git commit -m "feat: add privacy-safe Pay Raise Kit GA4 tag"
```

### Task 3: Update Privacy Policy test-first

**Files:**
- Modify: `tests/site-contract.test.ts`
- Modify: `app/privacy/page.tsx`

- [ ] **Step 1: Add the failing Privacy contract**

Extend `publishes truthful trust pages with self canonicals` with:

```ts
expect(privacy).toContain("Google Analytics 4");
expect(privacy).toContain("Google Signals");
expect(privacy).toContain("calculator inputs");
expect(privacy).toContain(
  "https://policies.google.com/technologies/partner-sites",
);
expect(privacy).toContain("https://tools.google.com/dlpage/gaoptout");
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- tests/site-contract.test.ts
```

Expected: FAIL because the current policy states there is no analytics script.

- [ ] **Step 3: Replace the obsolete analytics paragraph**

In `app/privacy/page.tsx`, replace the current `Accounts, advertising, and
analytics` paragraph with:

```tsx
<h2>Accounts, advertising, and analytics</h2>
<p>
  The site has no user accounts, saved calculation history, or advertising
  network. We use Google Analytics 4 to understand page visits, referring
  pages, approximate region, and general browser and device information.
  Google Analytics may use analytics cookies or similar technologies for
  this measurement.
</p>
<p>
  Google Signals and advertising-personalization signals are disabled in
  our site configuration. We do not send calculator inputs, salary or wage
  amounts, raise percentages, hours, years, or email content to Google
  Analytics. Google explains{" "}
  <a href="https://policies.google.com/technologies/partner-sites">
    how it uses information from sites that use its services
  </a>
  . You can also use the{" "}
  <a href="https://tools.google.com/dlpage/gaoptout">
    Google Analytics opt-out browser add-on
  </a>
  .
</p>
```

Replace the `Policy changes` paragraph with:

```tsx
<p>
  If the site later adds advertising, accounts, saved data, personalized
  analytics, or other data processing, this policy will be updated before
  those features are described as active.
</p>
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npm test -- tests/site-contract.test.ts
```

Expected: all site-contract tests pass.

- [ ] **Step 5: Commit the Privacy update**

```bash
git add app/privacy/page.tsx tests/site-contract.test.ts
git commit -m "docs: disclose Pay Raise Kit analytics use"
```

### Task 4: Verify the exported GA4 contract

**Files:**
- Modify: `tests/site-contract.test.ts`
- Modify: `scripts/verify-static.mjs`

- [ ] **Step 1: Add a failing verifier contract**

Extend `verifies the exported route, SEO, domain, and secret contracts` with:

```ts
expect(verifier).toContain("PAY_RAISE_KIT_GA_MEASUREMENT_ID");
expect(verifier).toContain("googletagmanager.com/gtag/js?id=");
expect(verifier).toContain("allow_google_signals");
```

- [ ] **Step 2: Run the focused test and verify RED**

```bash
npm test -- tests/site-contract.test.ts
```

Expected: FAIL because the static verifier does not inspect GA4 yet.

- [ ] **Step 3: Add the exported-page verifier**

Near the top of `scripts/verify-static.mjs`, after `failures`, add:

```js
const analyticsConfig = await readFile("lib/analytics.ts", "utf8");
const measurementId = analyticsConfig.match(
  /PAY_RAISE_KIT_GA_MEASUREMENT_ID = "(G-[A-Z0-9]+)"/,
)?.[1];

if (!measurementId) {
  failures.push("Missing valid PAY_RAISE_KIT_GA_MEASUREMENT_ID");
}
if (["G-DZ2P1TDW9S", "G-18QX9022FY"].includes(measurementId)) {
  failures.push("Production uses another product's GA4 Measurement ID");
}
```

Inside the existing exported-page loop, after the wrong-domain check, add:

```js
if (
  measurementId &&
  !html.includes(
    `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
  )
) {
  failures.push(`Missing Pay Raise Kit GA4 tag in ${page.file}`);
}
if (!html.includes("allow_google_signals")) {
  failures.push(`Missing GA4 privacy configuration in ${page.file}`);
}
```

- [ ] **Step 4: Run the full local release gate**

```bash
npm run verify
git diff --check
```

Expected: typecheck, ESLint, all Vitest tests, static build, seven-route static
verification, and diff check pass.

- [ ] **Step 5: Commit the export verifier**

```bash
git add scripts/verify-static.mjs tests/site-contract.test.ts
git commit -m "test: verify exported Pay Raise Kit GA4 identity"
```

### Task 5: Integrate, push, and deploy the verified source

**Files:**
- Verify all product source files
- External: GitHub and existing Cloudflare Pages project

- [ ] **Step 1: Review and verify the feature branch**

```bash
npm ci
npm run verify
git diff --check
git status --short --branch
```

Expected: all checks pass and the feature branch is clean.

- [ ] **Step 2: Merge to `main` and verify again**

Use the finishing-development-branch workflow to fast-forward or merge the
verified branch into `main`. From the merged main checkout run:

```bash
npm ci
npm run verify
git diff --check
```

Expected: the same complete release gate passes on `main`.

- [ ] **Step 3: Push the verified source**

```bash
git push origin main
```

Verify local and remote main point to the same source commit:

```bash
test "$(git rev-parse HEAD)" = "$(git ls-remote origin refs/heads/main | awk '{print $1}')"
```

- [ ] **Step 4: Deploy the existing build to the existing Pages project**

```bash
npx wrangler whoami
npx wrangler pages deploy out --project-name=pay-raise-kit --branch=main
```

Expected: Wrangler reuses `pay-raise-kit`, returns a successful deployment URL,
and prints a deployment identifier. Do not create another Pages project.

- [ ] **Step 5: Preserve the exact rollback points**

Before accepting the new deployment, retain these last verified rollback facts
from the launch checklist:

```text
Previous deployed source: 1ecd928cc12e9d88a13899c60cf31bc2de2f4c69
Previous deployment ID: cc6cdef7-b47f-4a61-827d-ed772dc597a7
Previous deployment URL: https://cc6cdef7.pay-raise-kit.pages.dev
```

If the new custom-domain build is broken or uses the wrong GA4 identity, restore
the previous Pages deployment and revert the smallest GA4 source commit. Do not
delete the GA4 Property as part of automatic rollback.

### Task 6: Prove production and Google-side receipt

**Files:**
- Modify: `docs/launch-checklist.md`
- Modify after verification: `/Users/dazhilv/Downloads/web出海工作区/web-chuhai-ops/sites/registry.yaml`

- [ ] **Step 1: Verify production configuration and runtime**

On `https://payraisekit.com/`, verify:

```js
() => ({
  hasDataLayer: Array.isArray(window.dataLayer),
  hasGtag: typeof window.gtag === "function",
  gaScripts: Array.from(document.scripts)
    .map((script) => script.src)
    .filter((src) => src.includes("googletagmanager.com/gtag/js")),
})
```

Expected: `hasDataLayer` and `hasGtag` are true, and exactly one script contains
the confirmed Pay Raise Kit Measurement ID.

- [ ] **Step 2: Verify the Analytics request**

Reload the custom production domain and inspect network requests for
`googletagmanager`, `google-analytics`, `google.com/g/collect`, or `/collect`.

Expected: the Google tag returns 200 and at least one collection request carries
the same Pay Raise Kit `tid=G-...`. If the local environment blocks one endpoint,
record the exact failure and verify whether the Google fallback endpoint returns
204; do not change the correct ID merely because one local endpoint is blocked.

- [ ] **Step 3: Verify Google Realtime/DebugView**

In the exact Pay Raise Kit GA4 Property/Web Stream, open Realtime or DebugView
and generate a fresh visit to `https://payraisekit.com/`.

Expected: Google shows the production visit under the correct property. Until
this is visible, keep the status `analytics-pending`.

- [ ] **Step 4: Update the product launch checklist**

Add a dated `GA4 production verification` section to `docs/launch-checklist.md`
containing:

- confirmed public Measurement ID;
- deployed source commit;
- Cloudflare deployment ID and preview URL;
- custom-domain runtime evidence;
- collection-request evidence;
- Realtime/DebugView result;
- Privacy disclosure verification;
- explicit statement that calculator values and custom events are excluded.

Commit and push this evidence without claiming the documentation commit was the
deployed source commit:

```bash
git add docs/launch-checklist.md
git commit -m "docs: record Pay Raise Kit GA4 verification"
git push origin main
```

- [ ] **Step 5: Update the central registry only after Google receipt**

If and only if Realtime/DebugView is visible, change the Pay Raise Kit record in
`web-chuhai-ops/sites/registry.yaml` to:

```yaml
analytics_provider: ga4
analytics_status: verified
ga4_measurement_id: $PAY_RAISE_KIT_GA_ID
launch_evidence: docs/launch-checklist.md
```

Write the resolved `G-...` string into YAML, not the variable name.

If Google receipt remains unverified, retain `analytics_status: pending`, record
the confirmed Measurement ID, and document the precise blocker instead.

Run the operations repository tests and commit only that registry fact:

```bash
python3 -m unittest discover -s tests -v
git diff --check
git add sites/registry.yaml
git commit -m "ops: record Pay Raise Kit GA4 status"
git push origin main
```

### Task 7: Final evidence gate

**Files:**
- Verify product and operations repositories

- [ ] **Step 1: Verify product repository state**

```bash
npm run verify
git diff --check
git status --short --branch
git ls-remote origin refs/heads/main
```

Expected: full product verification passes, the checkout is clean, and remote
main contains the final documentation commit.

- [ ] **Step 2: Verify operations state and runtime Skill consistency**

```bash
python3 -m unittest discover -s tests -v
scripts/sync-web-chuhai-site-launch-skill.sh --check
git diff --check
git status --short --branch
```

Expected: operations tests pass, the launch Skill mirror matches, and any
unrelated pre-existing work remains untouched.

- [ ] **Step 3: Report only evidence-backed completion**

Report:

- production URL and confirmed Measurement ID;
- deployed source commit and Cloudflare deployment ID;
- local/build/static verification results;
- runtime and network request results;
- Realtime/DebugView result;
- final registry status;
- any remaining email-delivery or consent-risk item separately from GA4.

Do not call the integration `analytics-verified` without Google-side receipt.
