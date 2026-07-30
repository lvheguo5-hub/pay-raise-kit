import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero compact shell">
      <p className="eyebrow">404</p>
      <h1>That page is not here</h1>
      <p className="lede">
        The link may be outdated. Start with the main pay raise calculator or
        choose another salary tool.
      </p>
      <p>
        <Link className="button primary" href="/">
          Open Pay Raise Calculator
        </Link>
      </p>
    </section>
  );
}
