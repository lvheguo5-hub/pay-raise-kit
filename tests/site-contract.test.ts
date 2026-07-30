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

  it("renders a crawlable shell without launch-excluded tracking", async () => {
    const layout = await readFile("app/layout.tsx", "utf8");

    expect(layout).toContain("metadataBase");
    expect(layout).toContain("<SiteHeader");
    expect(layout).toContain("<SiteFooter");
    expect(layout).not.toContain("gtag");
    expect(layout).not.toContain("googletagmanager");
  });

  it("links every approved calculator and trust route", async () => {
    const header = await readFile("components/SiteHeader.tsx", "utf8");
    const footer = await readFile("components/SiteFooter.tsx", "utf8");

    expect(header).toContain("toolRoutes");
    expect(footer).toContain("toolRoutes");
    expect(footer).toContain("trustRoutes");
  });

  it("keeps the homepage focused on the primary pay raise task", async () => {
    const page = await readFile("app/page.tsx", "utf8");

    expect(page).toContain("Pay Raise Calculator");
    expect(page).toContain("PayRaiseCalculator");
    expect(page).toContain("/raise-percentage-calculator/");
    expect(page).toContain("/salary-growth-calculator/");
    expect(page).not.toContain("<RaisePercentageCalculator");
    expect(page).not.toContain("<SalaryGrowthCalculator");
  });

  it("gives the reverse calculator its own intent and canonical", async () => {
    const page = await readFile(
      "app/raise-percentage-calculator/page.tsx",
      "utf8",
    );

    expect(page).toContain("Raise Percentage Calculator");
    expect(page).toContain(
      'canonical: "/raise-percentage-calculator/"',
    );
    expect(page).toContain("Find Your Salary Increase Rate");
  });
});
