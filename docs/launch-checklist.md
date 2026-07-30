# Pay Raise Kit Launch Checklist

Last updated: 2026-07-30  
Canonical production URL: `https://payraisekit.com`

This file records observed launch evidence. A checked box means the named
verification was completed against the stated source. An indexing request is
never recorded as confirmed indexing.

## Release identity

- [ ] Final local commit recorded
- [ ] Product worktree clean
- [ ] GitHub repository verified as `lvheguo5-hub/pay-raise-kit`
- [ ] Cloudflare Pages project verified as `pay-raise-kit`

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

- [ ] Repeat all representative calculator flows on `payraisekit.com`
- [ ] Verify every sitemap URL without login
- [ ] Verify HTTPS
- [ ] Verify apex is canonical
- [ ] Verify `www` permanently redirects to the apex equivalent path
- [ ] Verify `robots.txt`
- [ ] Verify `sitemap.xml`
- [ ] Verify `hello@payraisekit.com` delivery

## Deployment evidence

- Pages deployment URL: Not created
- Pages deployment identifier: Not created
- Deployment commit: Not deployed
- Pages verification result: Not run

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
  - Namecheap email-forwarding MX records observed
  - SPF observed: `v=spf1 include:spf.efwd.registrar-servers.com ~all`
- Complete record screenshot or export: Not captured

### After change

- Cloudflare-assigned nameservers: Not assigned
- Existing MX records recreated before activation: Not verified
- Existing SPF recreated before activation: Not verified
- Parking records removed: Not verified
- Cloudflare zone status: Not created

## Google Search Console

- Property: Not created or verified
- Sitemap submission: Not submitted
- GSC discovered-page count: Unconfirmed
- Homepage indexing request: Not requested
- Raise percentage page indexing request: Not requested
- Salary growth page indexing request: Not requested
- Confirmed indexed pages: Unconfirmed

## Operations handoff

- Registry entry: Not written
- Observation start: Not started
- Next review: Not scheduled
- Current stage: pre-launch

## Rollback

- DNS rollback: restore the two recorded Namecheap nameservers if the
  Cloudflare delegation causes a production-blocking problem.
- Deployment rollback: restore the last verified Cloudflare Pages deployment.
- Source rollback: revert the smallest production commit and redeploy the
  resulting verified static export.
- Do not delete the pre-change DNS inventory after launch.
