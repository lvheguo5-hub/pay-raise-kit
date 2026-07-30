# Pay Raise Kit Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, and publicly launch `payraisekit.com` as a static three-calculator SEO site, then hand it to GSC and the two-week observation process.

**Architecture:** Next.js App Router statically exports seven public routes to Cloudflare Pages. Three client-side calculator components call one pure TypeScript calculation module, while server-rendered page shells provide crawlable metadata, explanations, FAQs, and internal links. There is no backend, account system, database, advertising, or runtime data dependency.

**Tech Stack:** Next.js 14, React 18, TypeScript 5, Vitest, CSS, GitHub, Cloudflare Pages, Google Search Console.

---

## File structure

| File | Responsibility |
|---|---|
| `package.json` | Scripts and pinned runtime dependencies |
| `next.config.mjs` | Static export, trailing-slash, and image configuration |
| `tsconfig.json` | Strict TypeScript project settings |
| `vitest.config.ts` | Unit-test configuration and `@/` alias |
| `app/layout.tsx` | Global metadata, shell, header, and footer |
| `app/globals.css` | Responsive visual system and all component styles |
| `app/page.tsx` | Crawlable homepage and primary calculator |
| `app/raise-percentage-calculator/page.tsx` | Reverse percentage page |
| `app/salary-growth-calculator/page.tsx` | Multi-year growth page |
| `app/about/page.tsx` | Product and calculation-method trust page |
| `app/contact/page.tsx` | Public contact route |
| `app/privacy/page.tsx` | Production-accurate privacy policy |
| `app/terms/page.tsx` | Usage terms and calculation disclaimer |
| `app/robots.ts` | Production robots policy |
| `app/sitemap.ts` | Seven-route production sitemap |
| `app/not-found.tsx` | Crawlable custom 404 |
| `components/SiteHeader.tsx` | Primary navigation |
| `components/SiteFooter.tsx` | Tool and trust-page footer links |
| `components/ToolLinkCard.tsx` | Homepage and cross-tool navigation card |
| `components/FaqList.tsx` | Visible FAQ content and matching JSON-LD |
| `components/calculators/PayRaiseCalculator.tsx` | Homepage calculator state and rendering |
| `components/calculators/RaisePercentageCalculator.tsx` | Reverse calculator state and rendering |
| `components/calculators/SalaryGrowthCalculator.tsx` | Growth calculator state and rendering |
| `components/calculators/PayBreakdown.tsx` | Shared pay-period result table |
| `lib/calculations.ts` | Pure period conversion and calculation functions |
| `lib/format.ts` | Safe currency and percentage formatting |
| `lib/site.ts` | Brand, production URL, navigation, and route constants |
| `public/_headers` | Cloudflare security headers |
| `scripts/verify-static.mjs` | Static output, SEO, domain, and secret checks |
| `tests/calculations.test.ts` | Formula, conversion, validation, and boundary tests |
| `tests/site-contract.test.ts` | Source-level URL, metadata, navigation, and exclusion contract |
| `.github/workflows/verify.yml` | Pull/push verification without production secrets |
| `docs/launch-checklist.md` | Production, DNS, GSC, and rollback evidence |

### Task 1: Establish the static project baseline

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `.eslintrc.json`
- Create: `.gitignore`
- Create: `vitest.config.ts`
- Create: `lib/site.ts`
- Test: `tests/site-contract.test.ts`

- [ ] **Step 1: Write the failing baseline contract test**

```ts
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("static site baseline", () => {
  it("uses a static Next.js export with the production domain", async () => {
    const nextConfig = await readFile("next.config.mjs", "utf8");
    const siteConfig = await readFile("lib/site.ts", "utf8");

    expect(nextConfig).toContain('output: "export"');
    expect(nextConfig).toContain("trailingSlash: true");
    expect(siteConfig).toContain("https://payraisekit.com");
  });
});
```

- [ ] **Step 2: Run the test and verify the missing-project failure**

Run:

```bash
npm test -- --run tests/site-contract.test.ts
```

Expected: failure because `package.json`, Vitest, and the referenced project files do not exist.

- [ ] **Step 3: Create the pinned package and compiler configuration**

`package.json`:

```json
{
  "name": "pay-raise-kit",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "verify:static": "node scripts/verify-static.mjs",
    "verify": "npm run typecheck && npm run lint && npm test && npm run build && npm run verify:static"
  },
  "dependencies": {
    "next": "14.2.35",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@types/node": "20.19.24",
    "@types/react": "18.3.27",
    "@types/react-dom": "18.3.7",
    "eslint": "8.57.1",
    "eslint-config-next": "14.2.35",
    "typescript": "5.9.3",
    "vitest": "3.2.4"
  }
}
```

`next.config.mjs`:

```js
/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: { environment: "node" },
});
```

`.eslintrc.json`:

```json
{
  "extends": "next/core-web-vitals"
}
```

`.gitignore`:

```text
node_modules/
.next/
out/
.env
.env.local
.DS_Store
*.log
```

`next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file is generated and maintained by Next.js.
```

`lib/site.ts`:

```ts
export const siteConfig = {
  name: "Pay Raise Kit",
  url: "https://payraisekit.com",
  description:
    "Free calculators for pay raises, salary increase percentages, and long-term salary growth.",
  contactEmail: "hello@payraisekit.com",
} as const;

export const toolRoutes = [
  { href: "/", label: "Pay Raise Calculator" },
  { href: "/raise-percentage-calculator/", label: "Raise Percentage Calculator" },
  { href: "/salary-growth-calculator/", label: "Salary Growth Calculator" },
] as const;

export const trustRoutes = [
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy" },
  { href: "/terms/", label: "Terms" },
] as const;
```

- [ ] **Step 4: Install dependencies and rerun the baseline test**

Run:

```bash
npm install
npm test -- --run tests/site-contract.test.ts
```

Expected: one passing baseline test.

- [ ] **Step 5: Commit the baseline**

```bash
git add package.json package-lock.json next.config.mjs tsconfig.json next-env.d.ts .eslintrc.json .gitignore vitest.config.ts lib/site.ts tests/site-contract.test.ts
git commit -m "chore: establish static site baseline"
```

### Task 2: Build and test the calculation engine

**Files:**
- Create: `lib/calculations.ts`
- Create: `lib/format.ts`
- Create: `tests/calculations.test.ts`

- [ ] **Step 1: Write formula and boundary tests**

```ts
import { describe, expect, it } from "vitest";
import {
  calculateRaise,
  calculateRaisePercentage,
  projectSalaryGrowth,
  toAnnualPay,
} from "@/lib/calculations";

describe("pay calculations", () => {
  it("annualizes hourly pay using supplied weekly hours", () => {
    expect(toAnnualPay(25, "hourly", 40)).toBe(52_000);
  });

  it("calculates a percentage raise and all period outputs", () => {
    const result = calculateRaise({
      currentPay: 60_000,
      period: "annual",
      mode: "percentage",
      raiseValue: 5,
      hoursPerWeek: 40,
    });
    expect(result.newAnnualPay).toBe(63_000);
    expect(result.increaseAnnual).toBe(3_000);
    expect(result.newByPeriod.monthly).toBe(5_250);
  });

  it("calculates a fixed raise in the selected period", () => {
    const result = calculateRaise({
      currentPay: 25,
      period: "hourly",
      mode: "fixed",
      raiseValue: 2,
      hoursPerWeek: 40,
    });
    expect(result.newAnnualPay).toBe(56_160);
  });

  it("calculates reverse percentage and a pay cut", () => {
    expect(calculateRaisePercentage(50_000, 55_000).percentage).toBe(10);
    expect(calculateRaisePercentage(50_000, 45_000).direction).toBe("decrease");
  });

  it("projects compound salary growth from year zero", () => {
    const result = projectSalaryGrowth(50_000, 3, 2);
    expect(result.rows.map((row) => row.salary)).toEqual([50_000, 51_500, 53_045]);
    expect(result.finalSalary).toBe(53_045);
  });

  it("rejects invalid values instead of returning non-finite output", () => {
    expect(() => toAnnualPay(0, "annual", 40)).toThrow("Pay must be greater than zero.");
    expect(() => projectSalaryGrowth(50_000, 3, 0)).toThrow(
      "Years must be a whole number from 1 to 50.",
    );
  });
});
```

- [ ] **Step 2: Run the test and verify missing-module failure**

Run:

```bash
npm test -- --run tests/calculations.test.ts
```

Expected: failure because `lib/calculations.ts` does not exist.

- [ ] **Step 3: Implement pure calculations**

```ts
export type PayPeriod = "hourly" | "weekly" | "biweekly" | "monthly" | "annual";
export type RaiseMode = "percentage" | "fixed";

const annualFactors: Record<Exclude<PayPeriod, "hourly">, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  annual: 1,
};

export function toAnnualPay(amount: number, period: PayPeriod, hoursPerWeek = 40) {
  assertFinitePositive(amount, "Pay must be greater than zero.");
  if (period === "hourly") {
    if (!Number.isFinite(hoursPerWeek) || hoursPerWeek < 1 || hoursPerWeek > 168) {
      throw new Error("Hours per week must be between 1 and 168.");
    }
    return amount * hoursPerWeek * 52;
  }
  return amount * annualFactors[period];
}

export function fromAnnualPay(annualPay: number, hoursPerWeek = 40) {
  return {
    hourly: annualPay / (hoursPerWeek * 52),
    weekly: annualPay / 52,
    biweekly: annualPay / 26,
    monthly: annualPay / 12,
    annual: annualPay,
  };
}

export function calculateRaise(input: {
  currentPay: number;
  period: PayPeriod;
  mode: RaiseMode;
  raiseValue: number;
  hoursPerWeek: number;
}) {
  if (!Number.isFinite(input.raiseValue) || input.raiseValue < 0) {
    throw new Error("Raise must be zero or greater.");
  }
  const currentAnnualPay = toAnnualPay(input.currentPay, input.period, input.hoursPerWeek);
  const raiseAnnual =
    input.mode === "percentage"
      ? currentAnnualPay * (input.raiseValue / 100)
      : toAnnualIncrease(input.raiseValue, input.period, input.hoursPerWeek);
  const newAnnualPay = currentAnnualPay + raiseAnnual;
  return {
    currentAnnualPay,
    newAnnualPay,
    increaseAnnual: raiseAnnual,
    currentByPeriod: fromAnnualPay(currentAnnualPay, input.hoursPerWeek),
    newByPeriod: fromAnnualPay(newAnnualPay, input.hoursPerWeek),
    increaseByPeriod: fromAnnualPay(raiseAnnual, input.hoursPerWeek),
  };
}

export function calculateRaisePercentage(oldPay: number, newPay: number) {
  assertFinitePositive(oldPay, "Old pay must be greater than zero.");
  if (!Number.isFinite(newPay) || newPay < 0) {
    throw new Error("New pay must be zero or greater.");
  }
  const change = newPay - oldPay;
  return {
    change,
    percentage: (change / oldPay) * 100,
    direction: change > 0 ? "increase" : change < 0 ? "decrease" : "same",
  } as const;
}

export function projectSalaryGrowth(startingSalary: number, rate: number, years: number) {
  assertFinitePositive(startingSalary, "Starting salary must be greater than zero.");
  if (!Number.isFinite(rate) || rate < -100 || rate > 100) {
    throw new Error("Growth rate must be between -100 and 100.");
  }
  if (!Number.isInteger(years) || years < 1 || years > 50) {
    throw new Error("Years must be a whole number from 1 to 50.");
  }
  const rows = Array.from({ length: years + 1 }, (_, year) => ({
    year,
    salary: startingSalary * (1 + rate / 100) ** year,
  }));
  const finalSalary = rows.at(-1)!.salary;
  return {
    rows,
    finalSalary,
    totalGrowth: finalSalary - startingSalary,
    totalPercentage: ((finalSalary - startingSalary) / startingSalary) * 100,
  };
}

function toAnnualIncrease(amount: number, period: PayPeriod, hoursPerWeek: number) {
  if (amount === 0) return 0;
  return toAnnualPay(amount, period, hoursPerWeek);
}

function assertFinitePositive(value: number, message: string) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(message);
}
```

`lib/format.ts`:

```ts
export function formatCurrency(value: number, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(2).replace(/\\.00$/, "")}%`;
}
```

- [ ] **Step 4: Run calculation tests**

Run:

```bash
npm test -- --run tests/calculations.test.ts
```

Expected: all six calculation tests pass.

- [ ] **Step 5: Commit the calculation engine**

```bash
git add lib/calculations.ts lib/format.ts tests/calculations.test.ts
git commit -m "feat: add tested pay calculation engine"
```

### Task 3: Create the crawlable site shell and navigation

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `components/SiteHeader.tsx`
- Create: `components/SiteFooter.tsx`
- Create: `components/ToolLinkCard.tsx`
- Create: `components/FaqList.tsx`

- [ ] **Step 1: Extend the site contract test**

Add assertions that the global layout contains `metadataBase`, the production description, Header/Footer components, and no analytics script.

```ts
it("renders a crawlable shell without launch-excluded tracking", async () => {
  const layout = await readFile("app/layout.tsx", "utf8");
  expect(layout).toContain("metadataBase");
  expect(layout).toContain("<SiteHeader");
  expect(layout).toContain("<SiteFooter");
  expect(layout).not.toContain("gtag");
  expect(layout).not.toContain("googletagmanager");
});
```

- [ ] **Step 2: Run the contract test and verify failure**

Run:

```bash
npm test -- --run tests/site-contract.test.ts
```

Expected: failure because the shell files do not exist.

- [ ] **Step 3: Implement global metadata and semantic navigation**

`app/layout.tsx` must export metadata with:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Pay Raise Kit",
    template: "%s | Pay Raise Kit",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
  },
};
```

The rendered body must contain a skip link, `<SiteHeader />`, `<main id="main-content">`, and `<SiteFooter />`.

`SiteHeader.tsx` uses a text logo linking to `/` plus all three `toolRoutes`. `SiteFooter.tsx` repeats the tool routes, includes all four `trustRoutes`, and prints the current year. `ToolLinkCard.tsx` renders a semantic linked card. `FaqList.tsx` renders visible question-and-answer pairs plus matching `FAQPage` JSON-LD.

- [ ] **Step 4: Add the approved responsive visual system**

Implement CSS variables for navy text, off-white canvas, white cards, teal actions, green result emphasis, muted text, borders, focus rings, form grids, result tables, FAQ details, navigation, and mobile stacking. Include `prefers-reduced-motion` and a visible keyboard focus state.

- [ ] **Step 5: Run typecheck, lint, and contract tests**

```bash
npm run typecheck
npm run lint
npm test -- --run tests/site-contract.test.ts
```

Expected: all commands pass.

- [ ] **Step 6: Commit the site shell**

```bash
git add app/layout.tsx app/globals.css components/SiteHeader.tsx components/SiteFooter.tsx components/ToolLinkCard.tsx components/FaqList.tsx tests/site-contract.test.ts
git commit -m "feat: add accessible site shell"
```

### Task 4: Implement the canonical homepage calculator

**Files:**
- Create: `components/calculators/PayBreakdown.tsx`
- Create: `components/calculators/PayRaiseCalculator.tsx`
- Create: `app/page.tsx`
- Modify: `tests/site-contract.test.ts`

- [ ] **Step 1: Add homepage intent and exclusion assertions**

```ts
it("keeps the homepage focused on the primary pay raise task", async () => {
  const page = await readFile("app/page.tsx", "utf8");
  expect(page).toContain("Pay Raise Calculator");
  expect(page).toContain("PayRaiseCalculator");
  expect(page).toContain("/raise-percentage-calculator/");
  expect(page).toContain("/salary-growth-calculator/");
  expect(page).not.toContain("<RaisePercentageCalculator");
  expect(page).not.toContain("<SalaryGrowthCalculator");
});
```

- [ ] **Step 2: Run the contract test and verify failure**

```bash
npm test -- --run tests/site-contract.test.ts
```

Expected: failure because the homepage does not exist.

- [ ] **Step 3: Implement the client calculator**

`PayRaiseCalculator.tsx` must:

- initialize annual pay `60000`, percentage mode, raise `5`, and `40` hours;
- expose period, mode, pay, raise, and conditional weekly-hours controls;
- calculate only after form submission;
- render field-level or form-level errors in an `aria-live` region;
- render `PayBreakdown` after success;
- reset to the documented defaults;
- show the substituted formula for the selected mode.

`PayBreakdown.tsx` renders rows for Hourly, Weekly, Biweekly, Monthly, and Annual with Before, Increase, and After columns.

- [ ] **Step 4: Implement the server-rendered homepage**

The homepage exports:

```ts
export const metadata: Metadata = {
  title: {
    absolute: "Pay Raise Calculator – Free Salary & Wage Increase Tool | Pay Raise Kit",
  },
  description:
    "Calculate your new salary or hourly wage after a percentage or fixed-dollar raise. See increases by hour, week, month, and year.",
  alternates: { canonical: "/" },
};
```

It renders:

- H1 `Pay Raise Calculator`;
- one-sentence task promise;
- `<PayRaiseCalculator />`;
- formula and worked example;
- natural synonym coverage;
- linked cards to the two child calculators;
- four visible page-specific FAQs;
- the browser-side/pretax disclaimer.

- [ ] **Step 5: Run targeted and full local checks**

```bash
npm run typecheck
npm run lint
npm test
```

Expected: all commands pass.

- [ ] **Step 6: Commit the homepage**

```bash
git add app/page.tsx components/calculators/PayRaiseCalculator.tsx components/calculators/PayBreakdown.tsx tests/site-contract.test.ts
git commit -m "feat: add canonical pay raise calculator"
```

### Task 5: Implement the reverse percentage page

**Files:**
- Create: `components/calculators/RaisePercentageCalculator.tsx`
- Create: `app/raise-percentage-calculator/page.tsx`
- Modify: `tests/site-contract.test.ts`

- [ ] **Step 1: Add route and metadata assertions**

```ts
it("gives the reverse calculator its own intent and canonical", async () => {
  const page = await readFile(
    "app/raise-percentage-calculator/page.tsx",
    "utf8",
  );
  expect(page).toContain("Raise Percentage Calculator");
  expect(page).toContain('canonical: "/raise-percentage-calculator/"');
  expect(page).toContain("Find Your Salary Increase Rate");
});
```

- [ ] **Step 2: Run the test and verify failure**

```bash
npm test -- --run tests/site-contract.test.ts
```

Expected: failure because the route does not exist.

- [ ] **Step 3: Implement the reverse form and result states**

The component defaults to old annual pay `60000` and new annual pay `63000`. It calculates percentage, selected-period change, annualized values, and direction. It renders distinct language for an increase, no change, and a decrease and never describes a negative result as a raise.

- [ ] **Step 4: Implement crawlable page support**

Add the exact approved Title as an absolute metadata value so the layout template cannot append the brand twice:

```ts
export const metadata: Metadata = {
  title: {
    absolute:
      "Raise Percentage Calculator – Find Your Salary Increase Rate | Pay Raise Kit",
  },
  description:
    "Enter old and new pay to calculate the exact raise percentage and dollar increase across common pay periods.",
  alternates: { canonical: "/raise-percentage-calculator/" },
};
```

Add H1 `Raise Percentage Calculator`, the formula, a `$60,000 → $63,000 = 5%` example, three to five FAQs, and links to the homepage and salary growth page.

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck
npm run lint
npm test
git add app/raise-percentage-calculator/page.tsx components/calculators/RaisePercentageCalculator.tsx tests/site-contract.test.ts
git commit -m "feat: add raise percentage calculator"
```

Expected: all checks pass and the commit succeeds.

### Task 6: Implement the salary growth page

**Files:**
- Create: `components/calculators/SalaryGrowthCalculator.tsx`
- Create: `app/salary-growth-calculator/page.tsx`
- Modify: `tests/site-contract.test.ts`

- [ ] **Step 1: Add route and metadata assertions**

```ts
it("gives salary growth its own time-based intent and canonical", async () => {
  const page = await readFile("app/salary-growth-calculator/page.tsx", "utf8");
  expect(page).toContain("Salary Growth Calculator");
  expect(page).toContain('canonical: "/salary-growth-calculator/"');
  expect(page).toContain("Project Future Earnings by Year");
});
```

- [ ] **Step 2: Run the test and verify failure**

```bash
npm test -- --run tests/site-contract.test.ts
```

Expected: failure because the route does not exist.

- [ ] **Step 3: Implement the growth form and year table**

The component defaults to `$60,000`, `3%`, and `5` years; validates the documented ranges; and renders final salary, total growth, total percentage growth, and a table from year 0 through the final year.

- [ ] **Step 4: Implement crawlable page support**

Add the exact approved Title as an absolute metadata value:

```ts
export const metadata: Metadata = {
  title: {
    absolute:
      "Salary Growth Calculator – Project Future Earnings by Year | Pay Raise Kit",
  },
  description:
    "Project salary growth over multiple years with an annual raise rate, year-by-year table, and final earnings estimate.",
  alternates: { canonical: "/salary-growth-calculator/" },
};
```

Add H1 `Salary Growth Calculator`, the compound-growth formula, worked example, FAQs, disclaimer, and links to the other calculators.

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck
npm run lint
npm test
git add app/salary-growth-calculator/page.tsx components/calculators/SalaryGrowthCalculator.tsx tests/site-contract.test.ts
git commit -m "feat: add salary growth calculator"
```

Expected: all checks pass and the commit succeeds.

### Task 7: Add trust pages, crawl controls, and static-output verification

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/contact/page.tsx`
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `app/not-found.tsx`
- Create: `public/_headers`
- Create: `scripts/verify-static.mjs`
- Modify: `tests/site-contract.test.ts`

- [ ] **Step 1: Add seven-route, privacy, and exclusion tests**

```ts
it("publishes exactly the approved sitemap routes", async () => {
  const sitemap = await readFile("app/sitemap.ts", "utf8");
  for (const route of [
    "/",
    "/raise-percentage-calculator/",
    "/salary-growth-calculator/",
    "/about/",
    "/contact/",
    "/privacy/",
    "/terms/",
  ]) {
    expect(sitemap).toContain(route);
  }
});

it("keeps first-release exclusions out of the product", async () => {
  const packageJson = await readFile("package.json", "utf8");
  expect(packageJson).not.toContain("firebase");
  expect(packageJson).not.toContain("stripe");
  expect(packageJson).not.toContain("gtag");
});
```

- [ ] **Step 2: Run tests and verify the missing-route failure**

```bash
npm test -- --run tests/site-contract.test.ts
```

Expected: failure because trust and crawl-control files do not exist.

- [ ] **Step 3: Implement truthful trust pages**

- About explains the three tools, deterministic formulas, and browser-side calculations.
- Contact exposes `hello@payraisekit.com` without a fake form or fake response-time promise.
- Privacy states that the first release has no accounts, calculation submission, advertising, or behavioral tracking, while acknowledging ordinary hosting request logs.
- Terms state that results are estimates before taxes/deductions and are not tax, legal, financial, or employment advice.
- Every trust page exports a unique absolute Title, matching H1, description, and self-canonical from the approved URL map.

- [ ] **Step 4: Implement robots, sitemap, 404, and headers**

`robots.ts` allows `/` and points to `https://payraisekit.com/sitemap.xml`. `sitemap.ts` emits the seven approved routes. `_headers` sets:

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN
```

- [ ] **Step 5: Implement deterministic static verification**

`scripts/verify-static.mjs` must:

- verify the expected exported HTML files exist;
- verify every page contains `payraisekit.com` and no `example.com` or old-project brand;
- verify `robots.txt`, `sitemap.xml`, and `_headers`;
- verify the sitemap has exactly seven production URLs;
- scan tracked source and output for common secret signatures;
- fail with a nonzero exit code and specific message on any violation.

- [ ] **Step 6: Build and verify**

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run verify:static
git diff --check
```

Expected: every command passes and `out/` contains all approved pages.

- [ ] **Step 7: Commit trust and crawl foundations**

```bash
git add app/about app/contact app/privacy app/terms app/robots.ts app/sitemap.ts app/not-found.tsx public/_headers scripts/verify-static.mjs tests/site-contract.test.ts
git commit -m "feat: add trust and crawl foundations"
```

### Task 8: Add continuous verification and local browser acceptance

**Files:**
- Create: `.github/workflows/verify.yml`
- Create: `docs/launch-checklist.md`

- [ ] **Step 1: Create a secret-free verification workflow**

```yaml
name: Verify

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run verify
```

- [ ] **Step 2: Create the evidence checklist**

The checklist records:

- local commit SHA and clean worktree;
- typecheck/lint/test/build/static-verifier results;
- desktop and mobile flows for all calculators;
- one invalid-input flow per calculator;
- browser console status;
- Pages deployment URL;
- pre-change DNS inventory;
- Cloudflare nameservers;
- apex and `www` behavior;
- contact-email test;
- GSC property, sitemap discovery count, requested URLs;
- observation start and review dates;
- exact rollback commands or UI paths used.

- [ ] **Step 3: Run the production build locally**

```bash
npm run verify
git diff --check
git status --short
```

Expected: all verification passes; only the workflow and checklist are uncommitted.

- [ ] **Step 4: Serve and test the export**

Run:

```bash
npx serve out
```

In the browser, verify:

- desktop homepage percentage and fixed-amount flows;
- mobile homepage hourly flow;
- reverse increase and pay-cut flows;
- five-year salary growth and invalid-year flow;
- all navigation and trust links;
- no horizontal overflow or blocking console error.

- [ ] **Step 5: Commit verification infrastructure**

```bash
git add .github/workflows/verify.yml docs/launch-checklist.md
git commit -m "ci: verify every static release"
```

### Task 9: Publish the independent repository and Cloudflare Pages project

**Files:**
- Modify: `docs/launch-checklist.md`

- [ ] **Step 1: Verify local release identity**

```bash
git status --short --branch
git log -1 --oneline
gh auth status
npx wrangler whoami
```

Expected: clean `main`, a verified local commit, authenticated GitHub user `lvheguo5-hub`, and the intended Cloudflare account.

- [ ] **Step 2: Create and push the independent public repository**

```bash
gh repo create lvheguo5-hub/pay-raise-kit --public --source=. --remote=origin --push
git remote -v
```

Expected: both remote directions point to `https://github.com/lvheguo5-hub/pay-raise-kit`.

- [ ] **Step 3: Create the Pages project and deploy the verified export**

```bash
npx wrangler pages project create pay-raise-kit --production-branch=main
npx wrangler pages deploy out --project-name=pay-raise-kit --branch=main
```

Expected: a successful production deployment on `pay-raise-kit.pages.dev`.

- [ ] **Step 4: Verify the temporary production URL**

Open every sitemap route on the Pages URL and rerun representative desktop/mobile calculator flows. Record deployment identifier and results in `docs/launch-checklist.md`.

- [ ] **Step 5: Commit deployment evidence**

```bash
git add docs/launch-checklist.md
git commit -m "docs: record initial Pages deployment"
git push origin main
```

### Task 10: Move DNS safely and verify the custom domain

**Files:**
- Modify: `docs/launch-checklist.md`

- [ ] **Step 1: Record the Namecheap DNS inventory**

Record the authoritative nameservers plus every A, AAAA, CNAME, MX, and TXT record, including the current Namecheap email-forwarding MX set and SPF value. Do not change DNS until the inventory is complete.

- [ ] **Step 2: Add the Cloudflare zone and preserve email records**

Add `payraisekit.com` to the intended Cloudflare account. Before changing nameservers, verify the Cloudflare zone contains:

- the five Namecheap email-forwarding MX records with their original priorities;
- the existing SPF TXT value;
- no imported parking record that should survive launch.

- [ ] **Step 3: Change only the nameserver delegation**

In Namecheap, replace the two registrar nameservers with the exact pair assigned by Cloudflare. Do not modify registration ownership, contact details, auto-renew, or transfer lock.

- [ ] **Step 4: Attach the apex and redirect `www`**

Attach `payraisekit.com` to the Pages project, wait for the active certificate state, and configure `www.payraisekit.com` to redirect permanently to the apex equivalent path.

- [ ] **Step 5: Verify production and email**

Verify:

```bash
curl -I https://payraisekit.com/
curl -I https://www.payraisekit.com/
curl -I https://payraisekit.com/robots.txt
curl -I https://payraisekit.com/sitemap.xml
```

Expected: apex and public files return success; `www` redirects permanently to the apex; HTTPS is valid. Send a test message to `hello@payraisekit.com` and verify delivery before marking Contact complete.

- [ ] **Step 6: Run custom-domain browser acceptance**

Repeat the local acceptance matrix against `https://payraisekit.com` in desktop and mobile viewports. Confirm the console has no blocking errors.

- [ ] **Step 7: Record and push production evidence**

```bash
git add docs/launch-checklist.md
git commit -m "docs: record custom domain verification"
git push origin main
```

### Task 11: Complete GSC and operations handoff

**Files:**
- Modify: `docs/launch-checklist.md`
- Modify: `/Users/dazhilv/Downloads/web出海工作区/web-chuhai-ops/sites/registry.yaml`

- [ ] **Step 1: Verify the correct GSC property**

Use or create exactly one `sc-domain:payraisekit.com` property. Verify ownership through the active Cloudflare DNS zone and do not create duplicate URL-prefix properties.

- [ ] **Step 2: Submit the sitemap and sample requests**

Submit `https://payraisekit.com/sitemap.xml`. Record GSC's actual discovered-page count. Request indexing for:

- `https://payraisekit.com/`;
- `https://payraisekit.com/raise-percentage-calculator/`;
- `https://payraisekit.com/salary-growth-calculator/`.

Record them as requested, not indexed.

- [ ] **Step 3: Register the production site**

Append:

```yaml
  - id: pay-raise-kit
    repository: https://github.com/lvheguo5-hub/pay-raise-kit
    production_url: https://payraisekit.com
    deployment_provider: cloudflare-pages
    search_console_property: "sc-domain:payraisekit.com"
    observation_started_on: 2026-07-30
    next_decision_on: 2026-08-13
    stage: two-week-observation
```

Use the actual launch date and date plus 14 days if production completes after 2026-07-30.

- [ ] **Step 4: Verify both repositories are clean**

```bash
git -C /Users/dazhilv/Downloads/web出海工作区/pay-raise-kit status --short --branch
git -C /Users/dazhilv/Downloads/web出海工作区/web-chuhai-ops diff --check
```

Expected: the product repository is clean; the operations repository contains only the intended registry change.

- [ ] **Step 5: Commit and push handoff evidence**

```bash
git -C /Users/dazhilv/Downloads/web出海工作区/pay-raise-kit add docs/launch-checklist.md
git -C /Users/dazhilv/Downloads/web出海工作区/pay-raise-kit commit -m "docs: complete launch and GSC handoff"
git -C /Users/dazhilv/Downloads/web出海工作区/pay-raise-kit push origin main
git -C /Users/dazhilv/Downloads/web出海工作区/web-chuhai-ops add sites/registry.yaml
git -C /Users/dazhilv/Downloads/web出海工作区/web-chuhai-ops commit -m "ops: register Pay Raise Kit launch"
git -C /Users/dazhilv/Downloads/web出海工作区/web-chuhai-ops push origin main
```

- [ ] **Step 6: Stop at the observation line**

Report only:

- production URL;
- repository and final commit;
- seven public routes;
- automated and production interaction results;
- GSC sitemap discovered count and three requested URLs;
- unresolved risks;
- observation start and review dates.

Do not add ads, CPI, tax logic, accounts, negotiation content, or extra synonym pages without new evidence and authorization.
