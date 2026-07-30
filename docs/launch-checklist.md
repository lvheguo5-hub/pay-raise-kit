# Pay Raise Kit Launch Checklist

Last updated: 2026-07-30  
Canonical production URL: `https://payraisekit.com`

This file records observed launch evidence. A checked box means the named
verification was completed against the stated source. An indexing request is
never recorded as confirmed indexing.

## Release identity

- [x] Deployed source commit recorded:
      `49eaf778aed5f53cf6382eedb5e274838aab5106`
- [x] Product worktree clean before the launch-record update
- [x] GitHub repository verified as `lvheguo5-hub/pay-raise-kit`
- [x] Cloudflare Pages project verified as `pay-raise-kit`

## Automated verification

- [x] Typecheck passed on 2026-07-30
- [x] ESLint passed on 2026-07-30 with zero warnings
- [x] Vitest passed on 2026-07-30: 32 tests, zero failures
- [x] Next.js production build passed on 2026-07-30
- [x] Static-output verifier passed for seven routes, crawl files, metadata,
      security headers, and tracked-source secret signatures
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
- [ ] Verify `hello@payraisekit.com` delivery

## Deployment evidence

- Pages deployment URL:
  `https://f485d3e4.pay-raise-kit.pages.dev`
- Pages deployment identifier: `f485d3e4-065a-4c0c-ac29-160bc791ac36`
- Deployment commit: `49eaf778aed5f53cf6382eedb5e274838aab5106`
- Pages verification result: project URL and production custom domain loaded
  successfully in Chrome; direct HTTPS checks passed

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
