# Pay Raise Kit Launch Design

Date: 2026-07-30  
Domain: `payraisekit.com`  
Stage: Approved for implementation and public launch

## 1. Decision and authority

- SEO opportunity: `wage increase calculator`, normalized to the canonical homepage task `pay raise calculator`.
- SEO Agent verdict: `STRONG GO` for a standalone investment site in round 56.
- Post-Go verdict: one canonical homepage should serve `pay raise calculator`, `wage increase calculator`, `salary increase calculator`, `pay increase calculator`, and `raise calculator`.
- Dazhi approved the domain purchase, the launch design, and public site production on 2026-07-30.
- SEO Agent launch-architecture review: `GO`, high confidence.
- SEO Agent's one required structural correction: the homepage must contain only the primary pay-raise calculator. Reverse percentage and multi-year growth calculators must live on their own pages and appear on the homepage only as linked feature cards.

## 2. Product goal

Build a fast, trustworthy salary utility that answers three distinct jobs:

1. Calculate new pay after a percentage or fixed-dollar raise.
2. Calculate the raise percentage between old and new pay.
3. Project salary growth over multiple years.

The first release stops at the 80-point launch line: the three calculations work on desktop and mobile, every public page is crawlable and trustworthy, production is verified, and the site is handed to GSC for the two-week observation period.

## 3. Explicit exclusions

The first release does not include:

- after-tax calculations;
- live CPI or inflation data;
- state or country tax rules;
- salary-negotiation advice articles;
- accounts, saved history, payments, ads, or a database;
- synonym pages for `wage increase calculator`, `salary increase calculator`, `pay increase calculator`, or `raise calculator`;
- batch-generated blog or location pages;
- claims that calculator output is financial, tax, legal, or employment advice.

## 4. URL and search-intent map

| URL | Primary keyword | Unique user intent | Title | H1 | Canonical |
|---|---|---|---|---|---|
| `/` | `pay raise calculator` | Calculate new pay after a percentage or fixed-dollar raise | `Pay Raise Calculator – Free Salary & Wage Increase Tool \| Pay Raise Kit` | `Pay Raise Calculator` | `https://payraisekit.com/` |
| `/raise-percentage-calculator/` | `raise percentage calculator` | Calculate the percentage change between old and new pay | `Raise Percentage Calculator – Find Your Salary Increase Rate \| Pay Raise Kit` | `Raise Percentage Calculator` | `https://payraisekit.com/raise-percentage-calculator/` |
| `/salary-growth-calculator/` | `salary growth calculator` | Project salary across several years using a recurring annual growth rate | `Salary Growth Calculator – Project Future Earnings by Year \| Pay Raise Kit` | `Salary Growth Calculator` | `https://payraisekit.com/salary-growth-calculator/` |
| `/about/` | `about Pay Raise Kit` | Understand who the tool is for and how calculations are designed | `About Pay Raise Kit` | `About Pay Raise Kit` | `https://payraisekit.com/about/` |
| `/contact/` | `contact Pay Raise Kit` | Send product feedback or report a calculation issue | `Contact Pay Raise Kit` | `Contact Pay Raise Kit` | `https://payraisekit.com/contact/` |
| `/privacy/` | `Pay Raise Kit privacy` | Understand local calculation and data-handling behavior | `Privacy Policy \| Pay Raise Kit` | `Privacy Policy` | `https://payraisekit.com/privacy/` |
| `/terms/` | `Pay Raise Kit terms` | Understand usage limitations and disclaimer | `Terms of Use \| Pay Raise Kit` | `Terms of Use` | `https://payraisekit.com/terms/` |

Only the three calculator pages appear as primary tool navigation. Trust pages appear in the footer. All seven URLs appear in the sitemap.

## 5. Calculator contracts

### 5.1 Homepage pay raise calculator

Inputs:

- current pay amount;
- current pay period: hourly, weekly, biweekly, monthly, or annual;
- raise mode: percentage or fixed amount;
- raise value;
- hours per week when the selected period is hourly, defaulting to 40.

Calculation:

- normalize current pay to annual pay;
- percentage mode: `newPay = currentPay × (1 + raisePercent / 100)`;
- fixed mode: add the fixed amount in the selected pay period, then normalize to annual pay;
- period factors: hourly uses `hoursPerWeek × 52`, weekly uses `52`, biweekly uses `26`, monthly uses `12`, annual uses `1`.

Outputs:

- new pay and increase for hourly, weekly, biweekly, monthly, and annual periods;
- a before-versus-after comparison;
- formula explanation using the user's values;
- a short note that results are estimates before taxes and deductions.

Validation and boundary states:

- reject empty, non-numeric, zero, or negative current pay;
- reject empty, non-numeric, or negative raise values;
- reject hourly hours-per-week values outside `1–168`;
- accept a zero raise and show no change;
- cap displayed currency values safely and use two decimal places only where meaningful;
- never render `NaN`, `Infinity`, or a misleading blank result.

The homepage contains linked cards for the reverse and growth calculators, not their full forms.

### 5.2 Raise percentage calculator

Inputs:

- old pay;
- new pay;
- one shared pay period.

Calculation:

- `change = newPay - oldPay`;
- `percentageChange = change / oldPay × 100`.

Outputs:

- raise percentage;
- dollar change in the selected period;
- annualized old pay, new pay, and change;
- a plain-language result that distinguishes a raise, no change, and a pay cut.

Validation:

- old pay must be greater than zero;
- new pay must be zero or greater;
- both values must be finite numbers.

### 5.3 Salary growth calculator

Inputs:

- starting annual salary;
- annual growth rate;
- number of years.

Calculation:

- `salaryAtYearN = startingSalary × (1 + rate / 100) ^ N`;
- generate one row per year from year 0 through the selected final year.

Outputs:

- final projected salary;
- total dollar growth;
- total percentage growth;
- year-by-year salary table.

Validation:

- starting salary must be greater than zero;
- growth rate must be between `-100` and `100`;
- years must be a whole number from `1` through `50`.

## 6. Content and internal links

Each calculator page contains:

- the calculator above the fold;
- a concise explanation of what it calculates;
- the formula;
- one worked example;
- three to five page-specific FAQs;
- links to both other calculators;
- a disclaimer that results are estimates and not tax, legal, financial, or employment advice.

The homepage naturally mentions the approved synonym family in explanatory copy without repeating them mechanically. The two long-tail pages do not retarget the homepage synonym family.

FAQ structured data is used only when the visible page contains the same questions and answers. WebSite/WebPage structured data reflects only visible site and page facts.

## 7. Interaction and visual direction

- Tone: calm, practical, and trustworthy rather than corporate or playful.
- Layout: calculation card first, result panel immediately beside it on wide screens and below it on mobile.
- Color: dark navy text, off-white background, teal/green action color, and restrained positive-result highlighting.
- Controls: large labels, clear unit suffixes, keyboard-friendly inputs, visible focus states, and no interaction that depends only on color.
- Results update through an explicit Calculate action, with a Reset action that restores sensible defaults.
- Mobile target: a user can finish every calculation without horizontal scrolling or precision tapping.
- No decorative stock imagery is needed for the first release.

## 8. Technical architecture

- Next.js 14 App Router with TypeScript.
- Static export to `out/`.
- Pure client-side calculation functions; no API, database, or server runtime.
- Shared calculation module for normalization, formatting, raise calculations, and growth projections.
- Page-specific client components call the shared pure functions.
- CSS is local to the site and does not require a runtime design-system dependency.
- Cloudflare Pages hosts the static output.
- GitHub repository and Cloudflare Pages project both use the identifier `pay-raise-kit`.

## 9. Privacy, contact, and accuracy

- Calculations run in the browser and are not sent to a server.
- The first release does not install advertising or behavioral tracking.
- The public contact address is `hello@payraisekit.com`; launch is blocked until that alias is configured and tested.
- Privacy and Terms text must match the actual production behavior.
- Automated tests cover formulas, period conversion, invalid values, rounding, and negative-growth boundaries.

## 10. DNS and production release

Current state:

- the domain is registered at Namecheap;
- authoritative DNS currently uses Namecheap nameservers;
- the web records point to a Namecheap parking page;
- Namecheap email-forwarding MX records and SPF text are present.

Release sequence:

1. Record every existing DNS record before changing anything.
2. Create and verify the Cloudflare Pages deployment on its temporary production URL.
3. Add `payraisekit.com` as a Cloudflare zone.
4. Recreate the existing MX and SPF records in Cloudflare before nameserver activation.
5. Change Namecheap nameservers to the exact Cloudflare-assigned pair.
6. Attach `payraisekit.com` to the Pages project.
7. Make the apex domain canonical and redirect `www` to the apex.
8. Verify HTTPS, web routes, email forwarding, robots, sitemap, and representative calculator flows.

Rollback:

- restore the recorded Namecheap nameservers if Cloudflare activation causes a production-blocking problem;
- retain the last verified Pages deployment for deployment rollback;
- do not delete the recorded pre-launch DNS inventory.

## 11. Launch acceptance

Implementation is complete only when:

- all three calculator flows pass automated tests;
- typecheck, lint, tests, production build, static-output verification, and secret/brand scans pass;
- all seven public URLs return successfully from `https://payraisekit.com`;
- every page source contains its unique Title, H1, canonical, and intended body copy;
- robots and sitemap contain the production host and the correct public routes;
- desktop and mobile complete all three calculators and at least one invalid-input state;
- no blocking console errors are present;
- `www` redirects to the apex and HTTPS is valid;
- `hello@payraisekit.com` is tested;
- the correct GSC property is verified, the sitemap is submitted, and the homepage plus two calculator pages are requested for indexing;
- the operations registry records the repository, deployment, production domain, GSC property, observation start date, and next review date.

An indexing request is recorded as a request only; it is never reported as indexed until GSC confirms indexing.

## 12. Observation and stop line

After Day 0 handoff:

- stop ungrounded visual polishing and feature expansion;
- do not add tax, CPI, ads, accounts, or content matrices without new evidence and approval;
- track discovered and indexed pages, queries, impressions, clicks, CTR, and average position using consistent GSC filters;
- fix crawl, canonical, sitemap, mobile, or calculation blockers immediately;
- review the first 14-day checkpoint on 2026-08-13 if launch completes on 2026-07-30; otherwise set the date to 14 days after the actual production launch.
