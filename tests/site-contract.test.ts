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
});
