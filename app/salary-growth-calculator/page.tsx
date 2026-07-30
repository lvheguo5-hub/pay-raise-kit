import type { Metadata } from "next";

import { FaqList } from "@/components/FaqList";
import { SalaryGrowthCalculator } from "@/components/calculators/SalaryGrowthCalculator";
import { ToolLinkCard } from "@/components/ToolLinkCard";

export const metadata: Metadata = {
  title: {
    absolute:
      "Salary Growth Calculator – Project Future Earnings by Year | Pay Raise Kit",
  },
  description:
    "Project salary growth over multiple years with an annual raise rate, year-by-year table, and final earnings estimate.",
  alternates: {
    canonical: "/salary-growth-calculator/",
  },
};

const faqs = [
  {
    question: "How is future salary growth calculated?",
    answer:
      "The calculator compounds the same annual rate each year: starting salary × (1 + annual rate) raised to the number of years.",
  },
  {
    question: "Why is compound growth different from simple growth?",
    answer:
      "Each new raise is applied to the previous year's higher salary. The increase therefore grows over time instead of adding the same dollar amount every year.",
  },
  {
    question: "Can I enter a negative salary growth rate?",
    answer:
      "Yes. Rates down to -100% can model repeated salary reductions. Negative results are projections, not recommendations or predictions.",
  },
  {
    question: "Does the projection account for inflation or taxes?",
    answer:
      "No. It shows nominal gross salary based only on the annual rate and does not model inflation, taxes, benefits, bonuses, or deductions.",
  },
] as const;

export default function SalaryGrowthPage() {
  return (
    <>
      <section className="hero compact shell">
        <p className="eyebrow">Annual raises over time</p>
        <h1>Salary Growth Calculator</h1>
        <p className="lede">
          Project Future Earnings by Year with a recurring annual raise and a
          clear year-by-year salary table.
        </p>
      </section>

      <section
        className="calculator-wrap shell"
        aria-label="Salary growth tool"
      >
        <SalaryGrowthCalculator />
      </section>

      <section className="section soft">
        <div className="shell prose">
          <p className="eyebrow">Formula and example</p>
          <h2>Salary growth formula</h2>
          <p>
            Use <strong>future salary = starting salary × (1 + annual rate ÷
            100)<sup>years</sup></strong>. The exponent matters because each
            raise builds on the salary from the previous year.
          </p>
          <p>
            Example: $60,000 growing by 3% each year becomes $61,800 after
            year one and $63,654 after year two. The second increase is based
            on $61,800 rather than the original salary.
          </p>
          <p className="disclaimer">
            Projections are mathematical estimates before taxes, inflation,
            and deductions. They are not tax, legal, financial, or employment
            advice.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Keep calculating</p>
            <h2>Calculate a single raise or reverse the percentage</h2>
          </div>
          <div className="tool-card-grid">
            <ToolLinkCard
              cta="Calculate new pay"
              description="Apply one percentage or fixed-dollar raise and compare every pay period."
              eyebrow="Single raise"
              href="/"
              title="Pay Raise Calculator"
            />
            <ToolLinkCard
              cta="Find the percentage"
              description="Compare old and new pay when you need to reverse-calculate the change rate."
              eyebrow="Reverse calculation"
              href="/raise-percentage-calculator/"
              title="Raise Percentage Calculator"
            />
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Common questions</p>
            <h2>Salary growth FAQ</h2>
          </div>
          <FaqList faqs={faqs} />
        </div>
      </section>
    </>
  );
}
