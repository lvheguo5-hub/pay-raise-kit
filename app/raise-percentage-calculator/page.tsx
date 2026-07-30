import type { Metadata } from "next";

import { FaqList } from "@/components/FaqList";
import { RaisePercentageCalculator } from "@/components/calculators/RaisePercentageCalculator";
import { ToolLinkCard } from "@/components/ToolLinkCard";

export const metadata: Metadata = {
  title: {
    absolute:
      "Raise Percentage Calculator – Find Your Salary Increase Rate | Pay Raise Kit",
  },
  description:
    "Enter old and new pay to calculate the exact raise percentage and dollar increase across common pay periods.",
  alternates: {
    canonical: "/raise-percentage-calculator/",
  },
};

const faqs = [
  {
    question: "How do I calculate the percentage of a raise?",
    answer:
      "Subtract old pay from new pay, divide the change by old pay, then multiply by 100. Moving from $60,000 to $63,000 is a 5% raise.",
  },
  {
    question: "Can the calculator show a pay decrease?",
    answer:
      "Yes. When new pay is lower than old pay, the result is shown as a negative percentage and clearly labeled as a pay decrease.",
  },
  {
    question: "Do old pay and new pay need the same pay period?",
    answer:
      "Yes. Compare two hourly rates, two monthly salaries, or two annual salaries. Do not compare an hourly figure directly with an annual figure.",
  },
  {
    question: "Does the result include taxes or benefits?",
    answer:
      "No. This calculator compares gross pay amounts and does not model taxes, benefits, bonuses, or payroll deductions.",
  },
] as const;

export default function RaisePercentagePage() {
  return (
    <>
      <section className="hero compact shell">
        <p className="eyebrow">Old pay → new pay</p>
        <h1>Raise Percentage Calculator</h1>
        <p className="lede">
          Compare your old and new pay to find the exact salary increase rate
          and dollar difference.
        </p>
      </section>

      <section
        className="calculator-wrap shell"
        aria-label="Raise percentage tool"
      >
        <RaisePercentageCalculator />
      </section>

      <section className="section soft">
        <div className="shell prose">
          <p className="eyebrow">Formula and example</p>
          <h2>How to calculate a raise percentage</h2>
          <p>
            Use <strong>(new pay − old pay) ÷ old pay × 100</strong>. Both
            amounts must use the same pay period.
          </p>
          <p>
            Example: pay moves from $60,000 to $63,000. The difference is
            $3,000. Divide $3,000 by $60,000 and multiply by 100 to get a 5%
            raise.
          </p>
          <p className="disclaimer">
            Results compare gross pay before taxes and deductions and are not
            tax, legal, financial, or employment advice.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Keep calculating</p>
            <h2>Use the right calculator for your next question</h2>
          </div>
          <div className="tool-card-grid">
            <ToolLinkCard
              cta="Calculate new pay"
              description="Start with a known raise percentage or fixed amount and calculate your new pay."
              eyebrow="Forward calculation"
              href="/"
              title="Pay Raise Calculator"
            />
            <ToolLinkCard
              cta="Project future salary"
              description="Apply the same annual growth rate across several years and see the full table."
              eyebrow="Long-term planning"
              href="/salary-growth-calculator/"
              title="Salary Growth Calculator"
            />
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Common questions</p>
            <h2>Raise percentage FAQ</h2>
          </div>
          <FaqList faqs={faqs} />
        </div>
      </section>
    </>
  );
}
