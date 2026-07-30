import Link from "next/link";

import { siteConfig, toolRoutes, trustRoutes } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              ↑
            </span>
            <span>{siteConfig.name}</span>
          </Link>
          <p className="footer-summary">
            Straightforward calculators for understanding pay raises and
            long-term salary growth.
          </p>
        </div>
        <nav aria-label="Calculator links">
          <p className="footer-heading">Calculators</p>
          <ul className="footer-links">
            {toolRoutes.map((route) => (
              <li key={route.href}>
                <Link href={route.href}>{route.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Information links">
          <p className="footer-heading">Information</p>
          <ul className="footer-links">
            {trustRoutes.map((route) => (
              <li key={route.href}>
                <Link href={route.href}>{route.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.name}</span>
        <span>Calculations run in your browser.</span>
      </div>
    </footer>
  );
}
