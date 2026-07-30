import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

const routes = [
  "/",
  "/raise-percentage-calculator/",
  "/salary-growth-calculator/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: index < 3 ? "monthly" : "yearly",
    priority: index === 0 ? 1 : index < 3 ? 0.9 : 0.4,
  }));
}
