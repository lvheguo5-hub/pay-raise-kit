# Pay Raise Kit Launch Checklist

Last updated: 2026-08-01
Canonical production URL: `https://payraisekit.com`

This file records observed launch evidence. A checked box means the named
verification was completed against the stated source. An indexing request is
never recorded as confirmed indexing.

## Release identity

- [x] Deployed source commit recorded:
      `5a7c2db13a80083c3ade7da1b50b3ea5987843fa`
- [x] Product worktree clean before the launch-record update
- [x] GitHub repository verified as `lvheguo5-hub/pay-raise-kit`
- [x] Cloudflare Pages project verified as `pay-raise-kit`

## Automated verification

- [x] Typecheck passed on 2026-08-01
- [x] ESLint passed on 2026-08-01 with zero warnings
- [x] Vitest passed on 2026-08-01: 35 tests, zero failures
- [x] Next.js production build passed on 2026-08-01
- [x] Static-output verifier passed for seven routes, crawl files, metadata,
      favicon assets, security headers, the Pay Raise Kit GA4 identity and
      privacy flags, and tracked-source secret signatures
- [x] `git diff --check` passed

## Browser acceptance

### Local static export

- [x] Desktop homepage percentage-raise flow
- [x] Desktop homepage fixed-amount flow
- [x] Mobile homepage hourly flow
- [x] Reverse calculator increase flow
- [x] Reverse calculator pay-cut flow
- [x] Salary growth five-year flow
- [x] Invalid input or boundary state on each calculator
- [x] All navigation and trust links
- [x] No mobile horizontal overflow
- [x] No blocking browser console errors

### Production custom domain

- [x] Repeat representative flows for all three calculators on
      `payraisekit.com`
- [x] Verify all seven sitemap URLs return HTTP 200 without login
- [x] Verify HTTPS
- [x] Verify apex canonical tags on the three calculator pages
- [x] Verify `www` returns HTTP 301 to the apex equivalent path and preserves
      the query string
- [x] Verify `robots.txt` returns HTTP 200 and permits search indexing
- [x] Verify `sitemap.xml` returns HTTP 200 and lists seven canonical URLs
- [x] Verify all eight favicon and manifest assets return HTTP 200 and exactly
      match the deployed source; verify homepage icon links are present
- [ ] Verify `hello@payraisekit.com` delivery

## Deployment evidence

- Pages deployment URL:
  `https://b4c9b53c.pay-raise-kit.pages.dev`
- Pages deployment identifier: `b4c9b53c-d1bc-4e5f-9ab2-e4efd5de1eda`
- Deployment commit: `5a7c2db13a80083c3ade7da1b50b3ea5987843fa`
- Pages verification result: project URL and production custom domain loaded
  successfully; both contained the Pay Raise Kit GA4 tag and neither contained
  another product's Measurement ID. The production Privacy page disclosed the
  active GA4 behavior.
- Previous rollback deployment: `cc6cdef7-b47f-4a61-827d-ed772dc597a7`
  (`https://cc6cdef7.pay-raise-kit.pages.dev`), source
  `1ecd928cc12e9d88a13899c60cf31bc2de2f4c69`.

## GA4 production verification

- Verification date: 2026-08-01
- GA4 account: `Web Chuhai`
- GA4 Property: `Pay Raise Kit` (`548132775`)
- Web Stream: `Pay Raise Kit Web` (`15361831297`),
  `https://payraisekit.com`, Enhanced Measurement enabled
- Measurement ID: `G-BNKWB2NT8J`
- Deployed source commit: `5a7c2db13a80083c3ade7da1b50b3ea5987843fa`
- Cloudflare deployment: `b4c9b53c-d1bc-4e5f-9ab2-e4efd5de1eda`,
  `https://b4c9b53c.pay-raise-kit.pages.dev`
- Custom-domain source/runtime: exactly one Google tag used the confirmed ID;
  the page main world exposed `dataLayer` and `gtag`.
- Network receipt: `googletagmanager.com/gtag/js` returned HTTP 200; the GA4
  `page_view` request carried `tid=G-BNKWB2NT8J` and returned HTTP 204.
- Google-side receipt: Realtime showed one active user in both the 30-minute
  and 5-minute windows, the Pay Raise Kit homepage title, and two `page_view`
  events. The initial setup banner lagged behind the Realtime report.
- Privacy: `/privacy/` discloses Google Analytics 4, analytics cookies or
  similar technologies, disabled Google Signals and ad-personalization
  signals, Google's partner-site explanation, and the opt-out add-on.
- Data boundary: calculator values and email content are not sent to GA4; no
  calculator-specific or other custom analytics events were added.
- Browser note: the user's Chrome content blocker rejected the external Google
  tag with `ERR_BLOCKED_BY_CONTENT_BLOCKER`; an unblocked Codex browser produced
  the successful Google request and Realtime receipt above.

## DNS inventory

### Before change

- Registrar: Namecheap
- Authoritative nameservers:
  - `dns1.registrar-servers.com`
  - `dns2.registrar-servers.com`
- Web records:
  - apex currently resolves to the Namecheap parking service
  - `www` CNAME currently points to `parkingpage.namecheap.com`
- Mail records:
  - Namecheap email-forwarding MX records observed at priorities
    `10, 10, 10, 15, 20`
  - SPF observed: `v=spf1 include:spf.efwd.registrar-servers.com ~all`
- Exact record inventory captured in the launch session before nameserver
  delegation

### After change

- Cloudflare-assigned nameservers:
  - `becky.ns.cloudflare.com`
  - `rex.ns.cloudflare.com`
- The five imported Namecheap forwarding MX records and the imported Namecheap
  SPF record were removed from the Cloudflare zone after Cloudflare Email
  Routing reported them as conflicting records.
- Cloudflare Email Routing provisioned three managed MX records plus its SPF and
  DKIM TXT records; the Cloudflare dashboard showed those records locked and the
  routing service enabled.
- The destination Gmail address is verified and the
  `hello@payraisekit.com` routing rule is active.
- Mail delivery is not yet marked verified: an external test message was sent
  to `hello@payraisekit.com`, but it had not reached the destination inbox by
  2026-07-30 22:42 CST. Public `.com` delegation and direct DNS probes had not
  fully converged on the new mail records at that time.
- Namecheap parking records replaced inside the Cloudflare zone: verified
- Namecheap control panel shows the two Cloudflare nameservers saved
- Public `.com` delegation still returned the former Namecheap nameservers at
  2026-07-30 22:38 CST; global nameserver propagation remains pending
- Cloudflare dashboard zone status: active
- Apex custom domain: active, SSL enabled
- `www` custom domain: active, SSL enabled
- `www` to apex redirect: active Cloudflare Single Redirect, HTTP 301
- Google ownership TXT record: added through Cloudflare authorization

## Google Search Console

- Property: `sc-domain:payraisekit.com`, ownership verified
- Sitemap submission: `https://payraisekit.com/sitemap.xml`, successful
- GSC discovered-page count: 7
- Homepage indexing request: submitted
- Raise percentage page indexing request: submitted
- Salary growth page indexing request: submitted
- Confirmed indexed pages: Unconfirmed

## SEO Agent post-launch audit

- Audit scope: the deployed homepage, both supporting calculators, crawl files,
  About, and Contact
- Verdict: `CHECK -> GO`, confidence 92%
- P0 blockers: none
- [x] P1 before observation completed on 2026-07-30: all six child pages now
  export their own Open Graph and Twitter title, description, and canonical
  sharing URL instead of inheriting the homepage values
- P1 not allowed to delay observation: add the two exact homepage synonym
  phrases naturally in the lede; consider breadcrumb structured data
- Explicit stop line: no blog batch, no new calculator, no tax/CPI/state scope,
  and no Title churn during the initial observation window

## Operations handoff

- Registry entry: written to `web-chuhai-ops/sites/registry.yaml`
- Observation start: pending global DNS delegation
- Next DNS review: 2026-08-01
- Current stage: DNS propagation

## Rollback

- DNS rollback: restore the two recorded Namecheap nameservers if the
  Cloudflare delegation causes a production-blocking problem.
- Deployment rollback: restore the last verified Cloudflare Pages deployment.
- Source rollback: revert the smallest production commit and redeploy the
  resulting verified static export.
- Do not delete the pre-change DNS inventory after launch.

## Internal analytics exclusion

- Enable on every internal browser: `https://payraisekit.com/?internal=1`
- Disable only for a controlled analytics test: `https://payraisekit.com/?internal=0`
- Internal mode is valid only after the address bar no longer contains
  `internal=1` and the browser stores `prk_internal=1`.
- With internal mode enabled, verify that neither `googletagmanager.com` nor
  GA4 `g/collect` is requested.
- After any controlled GA4 test, re-enable internal mode before normal browsing
  or development continues.

### Release evidence — 2026-08-03

- Deployed source commit: `463292f6378dbf4ca05496e36086f5e0ffbbaca2`
- Cloudflare Pages deployment:
  `c5fdce68-d0cd-48b4-b301-11a7673857c3`
- Deployment URL: `https://c5fdce68.pay-raise-kit.pages.dev`
- Rollback deployment retained:
  `b4c9b53c-d1bc-4e5f-9ab2-e4efd5de1eda`
- Production HTTP: all seven sitemap routes, `robots.txt`, and `sitemap.xml`
  returned HTTP 200.
- Closed-by-default proof: production homepage HTML contained zero eager
  `googletagmanager.com/gtag/js` references.
- Controlled ordinary-mode proof: the Google tag for `G-BNKWB2NT8J` returned
  HTTP 200 and its GA4 `page_view` request returned HTTP 204.
- Enabling-visit proof: `?internal=1` was removed from the visible URL and no
  Google tag or GA4 collection request was made on that visit.
- Persistence proof: reloading after internal mode was enabled made no Google
  tag or GA4 collection request.
- Cleanup: internal mode was re-enabled on both browsers used for production
  verification after the single controlled ordinary-mode test.
- Browser note: the user's Chrome content blocker still returns
  `ERR_BLOCKED_BY_CONTENT_BLOCKER`; the unblocked Codex browser supplied the
  successful GA4 request/response proof.
- Google association: GA4 property `Pay Raise Kit` is linked to Search Console
  domain resource `payraisekit.com` through web stream `Pay Raise Kit Web`.
