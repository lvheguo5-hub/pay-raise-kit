import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Terms of Use | Pay Raise Kit",
  },
  description:
    "Review the calculation assumptions, permitted use, disclaimers, and limitations for Pay Raise Kit.",
  alternates: {
    canonical: "/terms/",
  },
};

export default function TermsPage() {
  return (
    <>
      <section className="hero compact shell">
        <p className="eyebrow">Effective July 30, 2026</p>
        <h1>Terms of Use</h1>
        <p className="lede">
          These terms explain the limits of the free calculations provided by
          Pay Raise Kit.
        </p>
      </section>
      <section className="section">
        <div className="shell prose">
          <h2>General information only</h2>
          <p>
            Pay Raise Kit provides mathematical estimates for general
            information. It does not provide tax, legal, financial,
            accounting, payroll, or employment advice.
          </p>

          <h2>Your inputs and assumptions</h2>
          <p>
            Results depend entirely on the numbers and pay periods you enter.
            Unless a page explicitly says otherwise, results represent gross
            pay before taxes, benefits, retirement contributions, bonuses,
            overtime, and other deductions or additions.
          </p>

          <h2>Accuracy and decisions</h2>
          <p>
            The formulas are designed to be transparent and reproducible, but
            the site cannot confirm your employer&apos;s payroll practices or
            local rules. Check important compensation decisions against
            official payroll records or an appropriate professional.
          </p>

          <h2>Acceptable use</h2>
          <p>
            You may use the public calculators for lawful personal,
            educational, or business purposes. Do not interfere with site
            operation, attempt unauthorized access, or misrepresent the
            calculator output as an official payroll statement.
          </p>

          <h2>Availability and changes</h2>
          <p>
            The site may correct formulas, explanations, or technical errors
            and may change or discontinue features. Material changes to these
            terms will be reflected on this page.
          </p>
        </div>
      </section>
    </>
  );
}
