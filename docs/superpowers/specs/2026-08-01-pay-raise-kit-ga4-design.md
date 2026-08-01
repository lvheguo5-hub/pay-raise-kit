# Pay Raise Kit GA4 Integration Design

Date: 2026-08-01
Status: approved direction, pending written-spec review

## Goal

Connect `https://payraisekit.com` to its own Google Analytics 4 Web Stream,
deploy through the existing Cloudflare Pages project, and prove that the
production site sends basic page-view data that appears in Google
Realtime/DebugView.

This change must not alter calculator behavior, URLs, titles, H1s, canonicals,
or the current seven-page sitemap.

## Current state

- The repository and production HTML contain no Google tag, `dataLayer`, or
  `gtag` runtime.
- The current contract tests intentionally reject analytics code.
- The Privacy Policy truthfully states that the first release has no behavioral
  analytics script.
- The Web Chuhai registry records Pay Raise Kit as `analytics-pending` with an
  unconfirmed Measurement ID.

## Chosen approach

Use the same direct-load pattern as Free Couple Games, without a consent
banner. This is the simpler implementation dazhi approved after comparing the
two existing sites.

The site will:

- load one GA4 Google tag after the page becomes interactive;
- use a Pay Raise Kit-specific `G-...` Measurement ID;
- set `allow_google_signals: false`;
- set `allow_ad_personalization_signals: false`;
- send only GA4's basic automatic page-view measurement;
- never send salary, wage, hours, raise percentage, fixed raise, years,
  inflation, email, or any other calculator/form value;
- add no custom analytics events in this task;
- disclose the actual analytics behavior in the Privacy Policy.

There will be no CMP, geo lookup, consent banner, or local-storage consent
state in this release. This matches the current operating pattern of the two
reference sites but is not the most conservative consent posture for every
country. If a stricter regional consent policy is later required, it will be a
separate reviewed change.

## Google account and stream identity

Before changing production code, inspect the authenticated Google Analytics
account:

1. Reuse an existing Property and Web Stream only if its identity and website
   URL clearly match Pay Raise Kit and `https://payraisekit.com`.
2. If no matching resource exists, create one Pay Raise Kit Property/Web
   Stream. Do not create duplicates.
3. Record the public Measurement ID only. Never store account credentials,
   cookies, OTPs, private destination details, or browser state in Git.
4. Stop for dazhi if Google requires CAPTCHA, OTP, account selection with
   ambiguous ownership, or a material legal/consent choice.

The GA4 Measurement ID is a public site configuration value, so the verified
ID will be passed explicitly from the shared layout to the reusable analytics
component. No Cloudflare secret is needed.

## Code structure and data flow

Create `components/GoogleAnalytics.tsx` using `next/script` and a guarded
`G-[A-Z0-9]+` Measurement ID contract. `app/layout.tsx` will render it once,
after the existing footer, so every static route receives the same tag.

On each full page load:

1. Next.js renders the static page.
2. After interaction readiness, the Google tag script loads.
3. The inline configuration initializes `dataLayer` and `gtag`.
4. GA4 receives the normal page-view request for the current canonical page.

Calculator components remain isolated from analytics. They do not import the
analytics component and do not call `gtag`.

## Privacy update

Update `/privacy/` before analytics is described as active. The policy will:

- preserve the statement that calculator inputs stay in the browser;
- disclose Google Analytics 4 and its use of cookies or similar technology;
- describe basic page, referrer, approximate region, browser, and device data;
- state that Google Signals and advertising-personalization signals are
  disabled in site configuration;
- state that calculator values and email content are not sent to GA4;
- link to Google's partner-site privacy explanation and opt-out information;
- keep the hosting and email disclosures unchanged.

## Test-first implementation

Modify the existing site contract before production code so it fails because
GA4 is missing. The contract will require:

- one guarded `GoogleAnalytics` component;
- the confirmed Pay Raise Kit Measurement ID in the shared layout;
- both privacy-preserving GA configuration flags;
- updated Privacy Policy disclosure;
- no Google tag import or event call inside calculator components;
- no other product's Measurement ID.

After the failing contract is observed, add the minimum implementation and run
the full `npm run verify` gate.

## Release and evidence

Use the existing `lvheguo5-hub/pay-raise-kit` repository and existing
Cloudflare Pages project. Record in `docs/launch-checklist.md`:

- source commit;
- Cloudflare deployment ID and preview URL;
- production custom-domain verification;
- confirmed Measurement ID;
- runtime `dataLayer`/`gtag` evidence;
- Analytics network-request evidence;
- Google Realtime/DebugView receipt or the exact remaining blocker.

Update the central registry only after production evidence is known:

- keep `analytics-pending` until all four evidence layers pass;
- change to `analytics-verified` only after Google-side receipt is visible.

## Verification and rollback

Completion requires:

1. Correct Pay Raise Kit Property/Web Stream/Measurement ID.
2. Production HTML and runtime expose the expected Google tag, `dataLayer`, and
   `gtag` once.
3. A GA4 collection request carries the same Measurement ID.
4. Google Realtime/DebugView shows the production visit.
5. All existing product and static-site checks remain green.

If analytics breaks the site or the wrong identity is deployed, revert the
small GA4 commit, redeploy the last verified Cloudflare deployment, and restore
the prior truthful Privacy text. Do not delete the Google Property as an
automatic rollback action.

## Explicit exclusions

- No consent banner or regional geo service.
- No Google Ads connection, remarketing, Signals, or personalization.
- No custom conversion, click, calculator, salary, or form events.
- No new page, metadata, SEO copy, calculator feature, account, database, or
  advertising work.
- No duplicate GA4, GSC, Cloudflare, GitHub, or DNS resource.
