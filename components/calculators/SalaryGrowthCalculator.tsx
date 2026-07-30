"use client";

import { type FormEvent, useState } from "react";

import { projectSalaryGrowth } from "@/lib/calculations";
import { formatCurrency, formatPercent } from "@/lib/format";

const defaults = {
  startingSalary: "60000",
  growthRate: "3",
  years: "5",
};

type GrowthResult = ReturnType<typeof projectSalaryGrowth>;

export function SalaryGrowthCalculator() {
  const [startingSalary, setStartingSalary] = useState(
    defaults.startingSalary,
  );
  const [growthRate, setGrowthRate] = useState(defaults.growthRate);
  const [years, setYears] = useState(defaults.years);
  const [result, setResult] = useState<GrowthResult | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      setResult(
        projectSalaryGrowth(
          Number(startingSalary),
          Number(growthRate),
          Number(years),
        ),
      );
    } catch (caught) {
      setResult(null);
      setError(
        caught instanceof Error
          ? caught.message
          : "Check the values and try again.",
      );
    }
  }

  function handleReset() {
    setStartingSalary(defaults.startingSalary);
    setGrowthRate(defaults.growthRate);
    setYears(defaults.years);
    setResult(null);
    setError("");
  }

  return (
    <div className="calculator-card">
      <form className="calculator-form" onSubmit={handleSubmit} noValidate>
        <p className="eyebrow">Multi-year projection</p>
        <h2>Set your salary growth assumptions</h2>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="starting-salary">Starting annual salary</label>
            <input
              id="starting-salary"
              inputMode="decimal"
              min="0.01"
              onChange={(event) => setStartingSalary(event.target.value)}
              step="0.01"
              type="number"
              value={startingSalary}
            />
          </div>
          <div className="field">
            <label htmlFor="growth-rate">Annual growth rate</label>
            <input
              id="growth-rate"
              inputMode="decimal"
              max="100"
              min="-100"
              onChange={(event) => setGrowthRate(event.target.value)}
              step="0.01"
              type="number"
              value={growthRate}
            />
            <span className="field-note">Enter 3 for 3% each year.</span>
          </div>
          <div className="field">
            <label htmlFor="growth-years">Number of years</label>
            <input
              id="growth-years"
              inputMode="numeric"
              max="50"
              min="1"
              onChange={(event) => setYears(event.target.value)}
              step="1"
              type="number"
              value={years}
            />
          </div>
        </div>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="form-actions">
          <button className="button primary" type="submit">
            Project salary growth
          </button>
          <button
            className="button secondary"
            onClick={handleReset}
            type="button"
          >
            Reset
          </button>
        </div>
      </form>

      <section
        aria-live="polite"
        className={`calculator-results${result ? "" : " placeholder"}`}
      >
        {result ? (
          <div>
            <p className="result-kicker">
              Projected salary after {years} {Number(years) === 1 ? "year" : "years"}
            </p>
            <p className="result-value">
              {formatCurrency(result.finalSalary)}
            </p>
            <p className="result-summary">
              Total change:{" "}
              <strong>{formatCurrency(result.totalGrowth)}</strong>{" "}
              ({formatPercent(result.totalPercentage)}).
            </p>
            <div className="table-scroll">
              <table className="result-table">
                <thead>
                  <tr>
                    <th scope="col">Year</th>
                    <th scope="col">Projected salary</th>
                    <th scope="col">Change from start</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.year}>
                      <th scope="row">
                        {row.year === 0 ? "Starting" : row.year}
                      </th>
                      <td>{formatCurrency(row.salary)}</td>
                      <td>
                        {formatCurrency(
                          row.salary - Number(startingSalary),
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="formula-box">
              {formatCurrency(Number(startingSalary))} × (1 +{" "}
              {growthRate} ÷ 100)<sup>{years}</sup> ={" "}
              {formatCurrency(result.finalSalary)}
            </p>
          </div>
        ) : (
          <div className="result-placeholder">
            <p className="eyebrow">Your projection</p>
            <h2>See salary growth year by year</h2>
            <p>
              Apply the same annual percentage across up to 50 years and
              review the full compound-growth table.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
