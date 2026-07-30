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

  it("gives salary growth its own time-based intent and canonical", async () => {
    const page = await readFile(
      "app/salary-growth-calculator/page.tsx",
      "utf8",
    );

    expect(page).toContain("Salary Growth Calculator");
    expect(page).toContain('canonical: "/salary-growth-calculator/"');
    expect(page).toContain("Project Future Earnings by Year");
  });

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

    expect(sitemap).not.toContain("/tax");
    expect(sitemap).not.toContain("/inflation");
  });

  it("keeps first-release exclusions out of the product", async () => {
    const packageJson = await readFile("package.json", "utf8");

    expect(packageJson).not.toContain("firebase");
    expect(packageJson).not.toContain("stripe");
    expect(packageJson).not.toContain("gtag");
  });

  it("publishes truthful trust pages with self canonicals", async () => {
    for (const route of ["about", "contact", "privacy", "terms"]) {
      const page = await readFile(`app/${route}/page.tsx`, "utf8");
      expect(page).toContain(`canonical: "/${route}/"`);
    }

    const privacy = await readFile("app/privacy/page.tsx", "utf8");
    expect(privacy).toContain("Calculations stay in your browser");
    expect(privacy).toContain("hosting provider");
  });

  it("ships crawl controls and Cloudflare security headers", async () => {
    const robots = await readFile("app/robots.ts", "utf8");
    const headers = await readFile("public/_headers", "utf8");

    expect(robots).toContain("sitemap.xml");
    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("Referrer-Policy: strict-origin-when-cross-origin");
    expect(headers).toContain(
      "Permissions-Policy: camera=(), microphone=(), geolocation=()",
    );
  });

  it("verifies the exported route, SEO, domain, and secret contracts", async () => {
    const verifier = await readFile("scripts/verify-static.mjs", "utf8");

    expect(verifier).toContain("expectedPages");
    expect(verifier).toContain("sitemap.xml");
    expect(verifier).toContain("payraisekit.com");
    expect(verifier).toContain("PRIVATE KEY");
    expect(verifier).toContain("gh[pousr]_");
  });
});
