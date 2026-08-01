import { access, readFile, stat } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("static site baseline", () => {
  it("uses a static Next.js export with the production domain", async () => {
    const nextConfig = await readFile("next.config.mjs", "utf8");
    const siteConfig = await readFile("lib/site.ts", "utf8");

    expect(nextConfig).toContain('output: "export"');
    expect(nextConfig).toContain("trailingSlash: true");
    expect(siteConfig).toContain("https://payraisekit.com");
  });

  it("renders a crawlable shell", async () => {
    const layout = await readFile("app/layout.tsx", "utf8");

    expect(layout).toContain("metadataBase");
    expect(layout).toContain("<SiteHeader");
    expect(layout).toContain("<SiteFooter");
  });

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
      await Promise.all(
        [
          "PayRaiseCalculator.tsx",
          "RaisePercentageCalculator.tsx",
          "SalaryGrowthCalculator.tsx",
        ].map((file) =>
          readFile(`components/calculators/${file}`, "utf8"),
        ),
      )
    ).join("\n");

    expect(calculatorSource).not.toContain("gtag");
    expect(calculatorSource).not.toContain("GoogleAnalytics");
  });

  it("links every approved calculator and trust route", async () => {
    const header = await readFile("components/SiteHeader.tsx", "utf8");
    const footer = await readFile("components/SiteFooter.tsx", "utf8");

    expect(header).toContain("toolRoutes");
    expect(footer).toContain("toolRoutes");
    expect(footer).toContain("trustRoutes");
  });

  it("keeps every calculator link visible in the mobile header", async () => {
    const styles = await readFile("app/globals.css", "utf8");

    expect(styles).toContain("flex-wrap: wrap;");
    expect(styles).toContain("white-space: normal;");
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
    expect(privacy).toContain("Google Analytics 4");
    expect(privacy).toContain("Google Signals");
    expect(privacy).toContain("calculator inputs");
    expect(privacy).toContain(
      "https://policies.google.com/technologies/partner-sites",
    );
    expect(privacy).toContain(
      "https://tools.google.com/dlpage/gaoptout",
    );
  });

  it("gives every child page its own social sharing metadata", async () => {
    for (const route of [
      "raise-percentage-calculator",
      "salary-growth-calculator",
      "about",
      "contact",
      "privacy",
      "terms",
    ]) {
      const page = await readFile(`app/${route}/page.tsx`, "utf8");

      expect(page).toContain("openGraph:");
      expect(page).toContain("twitter:");
      expect(page).toContain(`url: "/${route}/"`);
    }
  });

  it("ships a complete Pay Raise Kit favicon contract", async () => {
    const requiredAssets = [
      "public/favicon-source.svg",
      "public/favicon.ico",
      "public/favicon-16x16.png",
      "public/favicon-32x32.png",
      "public/apple-touch-icon.png",
      "public/android-chrome-192x192.png",
      "public/android-chrome-512x512.png",
      "public/site.webmanifest",
    ];

    for (const asset of requiredAssets) {
      await expect(access(asset)).resolves.toBeUndefined();
    }

    const layout = await readFile("app/layout.tsx", "utf8");
    expect(layout).toContain('manifest: "/site.webmanifest"');
    expect(layout).toContain('url: "/favicon.ico"');
    expect(layout).toContain('url: "/apple-touch-icon.png"');

    const manifest = JSON.parse(
      await readFile("public/site.webmanifest", "utf8"),
    ) as {
      name: string;
      short_name: string;
      icons: Array<{ src: string; sizes: string; type: string }>;
      theme_color: string;
      background_color: string;
      display: string;
    };

    expect(manifest).toMatchObject({
      name: "Pay Raise Kit",
      short_name: "Pay Raise Kit",
      theme_color: "#0d766e",
      background_color: "#f5f7f2",
      display: "standalone",
    });
    expect(manifest.icons).toEqual([
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ]);
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
    expect(verifier).toContain("PAY_RAISE_KIT_GA_MEASUREMENT_ID");
    expect(verifier).toContain("googletagmanager.com/gtag/js?id=");
    expect(verifier).toContain("allow_google_signals");
  });

  it("runs the full release verification in CI", async () => {
    const workflow = await readFile(".github/workflows/verify.yml", "utf8");
    const vitestConfig = await readFile("vitest.config.ts", "utf8");

    expect(workflow).toContain("actions/checkout@v6");
    expect(workflow).toContain("npm ci");
    expect(workflow).toContain("npm run verify");
    expect(workflow).not.toContain("CLOUDFLARE_API_TOKEN");
    expect(vitestConfig).toContain('".worktrees/**"');
  });

  it("keeps an auditable production handoff checklist", async () => {
    const checklist = await readFile("docs/launch-checklist.md", "utf8");

    expect(checklist).toContain("Automated verification");
    expect(checklist).toContain("Browser acceptance");
    expect(checklist).toContain("DNS inventory");
    expect(checklist).toContain("Google Search Console");
    expect(checklist).toContain("Rollback");
  });
});
