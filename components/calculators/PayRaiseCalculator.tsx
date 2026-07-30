"use client";

import { type FormEvent, useState } from "react";

import { PayBreakdown } from "@/components/calculators/PayBreakdown";
import {
  calculateRaise,
  type PayPeriod,
  type RaiseMode,
} from "@/lib/calculations";
import { formatCurrency, formatPercent } from "@/lib/format";

const defaults = {
  currentPay: "60000",
  period: "annual" as PayPeriod,
  mode: "percentage" as RaiseMode,
  raiseValue: "5",
  hoursPerWeek: "40",
};

type RaiseResult = ReturnType<typeof calculateRaise>;

export function PayRaiseCalculator() {
  const [currentPay, setCurrentPay] = useState(defaults.currentPay);
  const [period, setPeriod] = useState<PayPeriod>(defaults.period);
  const [mode, setMode] = useState<RaiseMode>(defaults.mode);
  const [raiseValue, setRaiseValue] = useState(defaults.raiseValue);
  const [hoursPerWeek, setHoursPerWeek] = useState(defaults.hoursPerWeek);
  const [result, setResult] = useState<RaiseResult | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const nextResult = calculateRaise({
        currentPay: Number(currentPay),
        period,
        mode,
        raiseValue: Number(raiseValue),
        hoursPerWeek: Number(hoursPerWeek),
      });
      setResult(nextResult);
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
    setCurrentPay(defaults.currentPay);
    setPeriod(defaults.period);
    setMode(defaults.mode);
    setRaiseValue(defaults.raiseValue);
    setHoursPerWeek(defaults.hoursPerWeek);
    setResult(null);
    setError("");
  }

  const raiseLabel =
    mode === "percentage" ? "Raise percentage" : "Raise amount";

  return (
    <div className="calculator-card">
      <form className="calculator-form" onSubmit={handleSubmit} noValidate>
        <p className="eyebrow">Your raise</p>
        <h2>Enter your current pay</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="current-pay">Current pay</label>
            <input
              id="current-pay"
              inputMode="decimal"
              min="0.01"
              onChange={(event) => setCurrentPay(event.target.value)}
              step="0.01"
              type="number"
              value={currentPay}
            />
          </div>
          <div className="field">
            <label htmlFor="pay-period">Pay period</label>
            <select
              id="pay-period"
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
              <label htmlFor="hours-per-week">Hours per week</label>
              <input
                id="hours-per-week"
                inputMode="decimal"
                max="168"
                min="1"
                onChange={(event) => setHoursPerWeek(event.target.value)}
                step="0.5"
                type="number"
                value={hoursPerWeek}
              />
              <span className="field-note">
                Used to convert hourly pay to yearly pay.
              </span>
            </div>
          ) : null}

          <div className="field full">
            <span className="fieldset-label">How is the raise stated?</span>
            <div className="segmented" role="group" aria-label="Raise type">
              <button
                aria-pressed={mode === "percentage"}
                onClick={() => setMode("percentage")}
                type="button"
              >
                Percentage
              </button>
              <button
                aria-pressed={mode === "fixed"}
                onClick={() => setMode("fixed")}
                type="button"
              >
                Fixed amount
              </button>
            </div>
          </div>

          <div className="field full">
            <label htmlFor="raise-value">{raiseLabel}</label>
            <input
              id="raise-value"
              inputMode="decimal"
              min="0"
              onChange={(event) => setRaiseValue(event.target.value)}
              step="0.01"
              type="number"
              value={raiseValue}
            />
            <span className="field-note">
              {mode === "percentage"
                ? "Enter 5 for a 5% raise."
                : `Enter the added amount for the selected ${period} pay period.`}
            </span>
          </div>
        </div>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="form-actions">
          <button className="button primary" type="submit">
            Calculate my new pay
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
            <p className="result-kicker">New annual pay</p>
            <p className="result-value">
              {formatCurrency(result.newAnnualPay)}
            </p>
            <p className="result-summary">
              That is an annual increase of{" "}
              <strong>{formatCurrency(result.increaseAnnual)}</strong>
              {mode === "percentage"
                ? ` (${formatPercent(Number(raiseValue))})`
                : ""}
              .
            </p>
            <PayBreakdown
              current={result.currentByPeriod}
              increase={result.increaseByPeriod}
              next={result.newByPeriod}
            />
            <p className="formula-box">
              {mode === "percentage"
                ? `${formatCurrency(result.currentAnnualPay)} × (1 + ${raiseValue} ÷ 100) = ${formatCurrency(result.newAnnualPay)}`
                : `${formatCurrency(result.currentAnnualPay)} + ${formatCurrency(result.increaseAnnual)} = ${formatCurrency(result.newAnnualPay)}`}
            </p>
          </div>
        ) : (
          <div className="result-placeholder">
            <p className="eyebrow">Your result</p>
            <h2>See the raise in every pay period</h2>
            <p>
              We will show your new hourly, weekly, biweekly, monthly, and
              annual pay side by side.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
