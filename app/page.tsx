import type { Metadata } from "next";

import { FaqList } from "@/components/FaqList";
import { PayRaiseCalculator } from "@/components/calculators/PayRaiseCalculator";
import { ToolLinkCard } from "@/components/ToolLinkCard";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute:
      "Pay Raise Calculator – Free Salary & Wage Increase Tool | Pay Raise Kit",
  },
  description:
    "Calculate your new salary or hourly wage after a percentage or fixed-dollar raise. See increases by hour, week, month, and year.",
  alternates: {
    canonical: "/",
  },
};

const faqs = [
  {
    question: "How do I calculate a pay raise?",
    answer:
      "Multiply your current pay by the raise percentage, then add that increase to your current pay. A 5% raise on $60,000 adds $3,000 for a new annual salary of $63,000.",
  },
  {
    question: "Can I calculate a raise for hourly pay?",
    answer:
      "Yes. Choose Hourly, enter your hourly wage and weekly hours, then enter either a percentage raise or a fixed hourly increase.",
  },
  {
    question: "What is the difference between a raise percentage and a raise amount?",
    answer:
      "A percentage raise scales with your current pay. A fixed raise adds a specific dollar amount in the pay period you selected.",
  },
  {
    question: "Does this calculator include taxes or deductions?",
    answer:
      "No. Results are gross pay estimates before taxes, benefits, retirement contributions, and other payroll deductions.",
  },
] as const;

const webApplicationData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pay Raise Calculator",
  url: siteConfig.url,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: metadata.description,
};

export default function HomePage() {
  return (
    <>
      <section className="hero shell">
        <p className="eyebrow">Free salary and wage tool</p>
        <h1>Pay Raise Calculator</h1>
        <p className="lede">
          Turn a percentage or fixed-dollar raise into your new hourly,
          weekly, monthly, and annual pay.
        </p>
      </section>

      <section className="calculator-wrap shell" aria-label="Pay raise tool">
        <PayRaiseCalculator />
      </section>

      <section className="section soft">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Related calculators</p>
            <h2>Answer the next salary question</h2>
            <p>
              Reverse the calculation when you know the old and new pay, or
              project recurring raises over several years.
            </p>
          </div>
          <div className="tool-card-grid">
            <ToolLinkCard
              cta="Find my raise percentage"
              description="Compare old pay with new pay to find the exact percentage increase or decrease."
              eyebrow="Reverse calculation"
              href="/raise-percentage-calculator/"
              title="Raise Percentage Calculator"
            />
            <ToolLinkCard
              cta="Project salary growth"
              description="See how a recurring annual raise compounds into a year-by-year salary forecast."
              eyebrow="Long-term planning"
              href="/salary-growth-calculator/"
              title="Salary Growth Calculator"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>One raise, translated into every pay period</h2>
            <p>
              Employers may describe the same increase as a pay raise, wage
              increase, salary increase, or pay increase. The arithmetic is
              the same: normalize the current pay, apply the raise, and
              convert the result back into useful periods.
            </p>
          </div>
          <div className="content-grid">
            <article className="content-card">
              <p className="eyebrow">Step 1</p>
              <h3>Start with current pay</h3>
              <p>
                Enter hourly, weekly, biweekly, monthly, or annual pay. Hourly
                calculations also use your weekly hours.
              </p>
            </article>
            <article className="content-card">
              <p className="eyebrow">Step 2</p>
              <h3>Apply the raise</h3>
              <p>
                Use a percentage such as 5%, or enter a fixed dollar increase
                in the same pay period.
              </p>
            </article>
            <article className="content-card">
              <p className="eyebrow">Step 3</p>
              <h3>Compare before and after</h3>
              <p>
                Review the increase and new gross pay by hour, week, two
                weeks, month, and year.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="shell prose">
          <p className="eyebrow">Formula and example</p>
          <h2>Pay raise formula</h2>
          <p>
            For a percentage raise: <strong>new pay = current pay × (1 +
            raise percentage ÷ 100)</strong>.
          </p>
          <p>
            Example: a 5% raise on a $60,000 salary is $60,000 × 0.05 =
            $3,000. Add the increase to the original salary for a new annual
            salary of $63,000, or $5,250 per month before deductions.
          </p>
          <p className="disclaimer">
            Pay Raise Kit provides mathematical estimates for general
            information. Results are gross pay before taxes and deductions
            and are not tax, legal, financial, or employment advice.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Common questions</p>
            <h2>Pay raise calculator FAQ</h2>
          </div>
          <FaqList faqs={faqs} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationData),
        }}
      />
    </>
  );
}
