import Link from "next/link";

import { toolRoutes } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Pay Raise Kit home">
          <span className="brand-mark" aria-hidden="true">
            ↑
          </span>
          <span>Pay Raise Kit</span>
        </Link>
        <nav className="primary-nav" aria-label="Calculator navigation">
          {toolRoutes.map((route) => (
            <Link href={route.href} key={route.href}>
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
