import type { Metadata } from "next";
import Link from "next/link";

const pageTitle = "About Pay Raise Kit";
const pageDescription =
  "Learn what Pay Raise Kit calculates, how the formulas work, and what the free tools intentionally leave out.";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
  description: pageDescription,
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    type: "website",
    siteName: "Pay Raise Kit",
    url: "/about/",
    title: pageTitle,
    description: pageDescription,
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="hero compact shell">
        <p className="eyebrow">Clear math, useful answers</p>
        <h1>About Pay Raise Kit</h1>
        <p className="lede">
          Pay Raise Kit turns common salary questions into transparent,
          browser-based calculations.
        </p>
      </section>
      <section className="section">
        <div className="shell prose">
          <h2>What this site does</h2>
          <p>
            The site provides three focused tools: a{" "}
            <Link href="/">pay raise calculator</Link>, a{" "}
            <Link href="/raise-percentage-calculator/">
              raise percentage calculator
            </Link>
            , and a{" "}
            <Link href="/salary-growth-calculator/">
              salary growth calculator
            </Link>
            . Each tool shows its formula and a worked example so you can
            understand the result instead of treating it as a black box.
          </p>

          <h2>How calculations work</h2>
          <p>
            Calculations use deterministic arithmetic. Pay-period conversion
            uses 52 weeks, 26 biweekly periods, or 12 months per year. Hourly
            calculations use the weekly hours you provide. Multi-year salary
            growth compounds the entered rate once per year.
          </p>

          <h2>What this site does not do</h2>
          <p>
            Pay Raise Kit does not calculate taxes, benefits, inflation,
            overtime rules, or local employment requirements. It does not
            predict whether an employer will offer a raise. Results are
            mathematical estimates based only on the values you enter.
          </p>

          <h2>Corrections and feedback</h2>
          <p>
            If a formula, explanation, or result appears wrong, please{" "}
            <Link href="/contact/">contact Pay Raise Kit</Link> with the
            inputs you used. Do not include private payroll documents or
            personal identifiers.
          </p>
        </div>
      </section>
    </>
  );
}
