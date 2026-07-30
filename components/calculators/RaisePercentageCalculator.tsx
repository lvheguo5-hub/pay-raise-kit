"use client";

import { type FormEvent, useState } from "react";

import {
  calculateRaisePercentage,
  type PayPeriod,
  toAnnualPay,
} from "@/lib/calculations";
import { formatCurrency, formatPercent } from "@/lib/format";

const defaults = {
  oldPay: "60000",
  newPay: "63000",
  period: "annual" as PayPeriod,
  hoursPerWeek: "40",
};

type ReverseResult = ReturnType<typeof calculateRaisePercentage> & {
  oldAnnualPay: number;
  newAnnualPay: number;
  annualChange: number;
};

export function RaisePercentageCalculator() {
  const [oldPay, setOldPay] = useState(defaults.oldPay);
  const [newPay, setNewPay] = useState(defaults.newPay);
  const [period, setPeriod] = useState<PayPeriod>(defaults.period);
  const [hoursPerWeek, setHoursPerWeek] = useState(defaults.hoursPerWeek);
  const [result, setResult] = useState<ReverseResult | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const parsedOldPay = Number(oldPay);
      const parsedNewPay = Number(newPay);
      const parsedHours = Number(hoursPerWeek);
      const changeResult = calculateRaisePercentage(
        parsedOldPay,
        parsedNewPay,
      );
      const oldAnnualPay = toAnnualPay(
        parsedOldPay,
        period,
        parsedHours,
      );
      const newAnnualPay =
        parsedNewPay === 0
          ? 0
          : toAnnualPay(parsedNewPay, period, parsedHours);

      setResult({
        ...changeResult,
        oldAnnualPay,
        newAnnualPay,
        annualChange: newAnnualPay - oldAnnualPay,
      });
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
    setOldPay(defaults.oldPay);
    setNewPay(defaults.newPay);
    setPeriod(defaults.period);
    setHoursPerWeek(defaults.hoursPerWeek);
    setResult(null);
    setError("");
  }

  const directionLabel =
    result?.direction === "increase"
      ? "Pay increase"
      : result?.direction === "decrease"
        ? "Pay decrease"
        : "No pay change";

  return (
    <div className="calculator-card">
      <form className="calculator-form" onSubmit={handleSubmit} noValidate>
        <p className="eyebrow">Reverse calculation</p>
        <h2>Compare old and new pay</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="old-pay">Old pay</label>
            <input
              id="old-pay"
              inputMode="decimal"
              min="0.01"
              onChange={(event) => setOldPay(event.target.value)}
              step="0.01"
              type="number"
              value={oldPay}
            />
          </div>
          <div className="field">
            <label htmlFor="new-pay">New pay</label>
            <input
              id="new-pay"
              inputMode="decimal"
              min="0"
              onChange={(event) => setNewPay(event.target.value)}
              step="0.01"
              type="number"
              value={newPay}
            />
          </div>
          <div className="field full">
            <label htmlFor="comparison-period">Pay period</label>
            <select
              id="comparison-period"
              onChange={(event) =>
                setPeriod(event.target.value as PayPeriod)
              }
              value={period}
            >
              <option value="hourly">Hourly</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          {period === "hourly" ? (
            <div className="field full">
              <label htmlFor="comparison-hours">Hours per week</label>
              <input
                id="comparison-hours"
                inputMode="decimal"
                max="168"
                min="1"
                onChange={(event) => setHoursPerWeek(event.target.value)}
                step="0.5"
                type="number"
                value={hoursPerWeek}
              />
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="form-actions">
          <button className="button primary" type="submit">
            Calculate raise percentage
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
            <p className="result-kicker">{directionLabel}</p>
            <p className="result-value">
              {formatPercent(result.percentage)}
            </p>
            <p className="result-summary">
              Your selected-period pay changed by{" "}
              <strong>{formatCurrency(result.change)}</strong>.
            </p>
            <div className="metric-grid">
              <div className="metric">
                <span>Old annual pay</span>
                <strong>{formatCurrency(result.oldAnnualPay)}</strong>
              </div>
              <div className="metric">
                <span>New annual pay</span>
                <strong>{formatCurrency(result.newAnnualPay)}</strong>
              </div>
              <div className="metric">
                <span>Annual difference</span>
                <strong>{formatCurrency(result.annualChange)}</strong>
              </div>
              <div className="metric">
                <span>Direction</span>
                <strong>{directionLabel}</strong>
              </div>
            </div>
            <p className="formula-box">
              ({formatCurrency(Number(newPay))} −{" "}
              {formatCurrency(Number(oldPay))}) ÷{" "}
              {formatCurrency(Number(oldPay))} × 100 ={" "}
              {formatPercent(result.percentage)}
            </p>
          </div>
        ) : (
          <div className="result-placeholder">
            <p className="eyebrow">Your result</p>
            <h2>Find the exact change rate</h2>
            <p>
              Enter two pay amounts from the same period to see the percentage
              increase, decrease, or no change.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
