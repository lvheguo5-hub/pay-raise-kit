"use client";

import { type FormEvent, useState } from "react";

import { PayBreakdown } from "@/components/calculators/PayBreakdown";
import {
  calculateRaise,
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
  raisePercentage: "5",
};

type CalculationMode = "reverse" | "forward";

type ReverseResult = ReturnType<typeof calculateRaisePercentage> & {
  oldAnnualPay: number;
  newAnnualPay: number;
  annualChange: number;
};

type ForwardResult = ReturnType<typeof calculateRaise>;

export function RaisePercentageCalculator() {
  const [mode, setMode] = useState<CalculationMode>("reverse");
  const [oldPay, setOldPay] = useState(defaults.oldPay);
  const [newPay, setNewPay] = useState(defaults.newPay);
  const [raisePercentage, setRaisePercentage] = useState(
    defaults.raisePercentage,
  );
  const [period, setPeriod] = useState<PayPeriod>(defaults.period);
  const [hoursPerWeek, setHoursPerWeek] = useState(defaults.hoursPerWeek);
  const [reverseResult, setReverseResult] = useState<ReverseResult | null>(
    null,
  );
  const [forwardResult, setForwardResult] = useState<ForwardResult | null>(
    null,
  );
  const [error, setError] = useState("");

  function clearOutput() {
    setReverseResult(null);
    setForwardResult(null);
    setError("");
  }

  function changeMode(nextMode: CalculationMode) {
    setMode(nextMode);
    clearOutput();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const parsedOldPay = Number(oldPay);
      const parsedHours = Number(hoursPerWeek);

      if (mode === "forward") {
        setForwardResult(
          calculateRaise({
            currentPay: parsedOldPay,
            period,
            mode: "percentage",
            raiseValue: Number(raisePercentage),
            hoursPerWeek: parsedHours,
          }),
        );
        setReverseResult(null);
        return;
      }

      const parsedNewPay = Number(newPay);
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

      setReverseResult({
        ...changeResult,
        oldAnnualPay,
        newAnnualPay,
        annualChange: newAnnualPay - oldAnnualPay,
      });
      setForwardResult(null);
    } catch (caught) {
      setReverseResult(null);
      setForwardResult(null);
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
    setRaisePercentage(defaults.raisePercentage);
    setPeriod(defaults.period);
    setHoursPerWeek(defaults.hoursPerWeek);
    setReverseResult(null);
    setForwardResult(null);
    setError("");
  }

  const directionLabel =
    reverseResult?.direction === "increase"
      ? "Pay increase"
      : reverseResult?.direction === "decrease"
        ? "Pay decrease"
        : "No pay change";

  const activeResult =
    mode === "reverse" ? reverseResult : forwardResult;

  return (
    <div className="calculator-card">
      <form className="calculator-form" onSubmit={handleSubmit} noValidate>
        <div className="field full">
          <span className="fieldset-label">What do you want to find?</span>
          <div
            aria-label="Calculation type"
            className="segmented"
            role="group"
          >
            <button
              aria-pressed={mode === "reverse"}
              onClick={() => changeMode("reverse")}
              type="button"
            >
              Calculate Raise %
            </button>
            <button
              aria-pressed={mode === "forward"}
              onClick={() => changeMode("forward")}
              type="button"
            >
              Check New Salary
            </button>
          </div>
        </div>
        <p className="eyebrow">
          {mode === "reverse" ? "Reverse calculation" : "Salary check"}
        </p>
        <h2>
          {mode === "reverse"
            ? "Compare old and new pay"
            : "Check your new salary"}
        </h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="old-pay">
              {mode === "reverse" ? "Old pay" : "Current pay"}
            </label>
            <input
              id="old-pay"
              inputMode="decimal"
              min="0.01"
              onChange={(event) => {
                setOldPay(event.target.value);
                clearOutput();
              }}
              step="0.01"
              type="number"
              value={oldPay}
            />
          </div>
          {mode === "reverse" ? (
            <div className="field">
              <label htmlFor="new-pay">New pay</label>
              <input
                id="new-pay"
                inputMode="decimal"
                min="0"
                onChange={(event) => {
                  setNewPay(event.target.value);
                  clearOutput();
                }}
                step="0.01"
                type="number"
                value={newPay}
              />
            </div>
          ) : (
            <div className="field">
              <label htmlFor="raise-percentage">Raise percentage</label>
              <input
                id="raise-percentage"
                inputMode="decimal"
                min="0"
                onChange={(event) => {
                  setRaisePercentage(event.target.value);
                  clearOutput();
                }}
                step="0.01"
                type="number"
                value={raisePercentage}
              />
            </div>
          )}
          <div className="field full">
            <label htmlFor="comparison-period">Pay period</label>
            <select
              id="comparison-period"
              onChange={(event) => {
                setPeriod(event.target.value as PayPeriod);
                clearOutput();
              }}
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
                onChange={(event) => {
                  setHoursPerWeek(event.target.value);
                  clearOutput();
                }}
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
            {mode === "reverse"
              ? "Calculate raise percentage"
              : "Calculate new salary"}
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
        className={`calculator-results${activeResult ? "" : " placeholder"}`}
      >
        {mode === "reverse" && reverseResult ? (
          <div>
            <p className="result-kicker">{directionLabel}</p>
            <p className="result-value">
              {formatPercent(reverseResult.percentage)}
            </p>
            <p className="result-summary">
              Your selected-period pay changed by{" "}
              <strong>{formatCurrency(reverseResult.change)}</strong>.
            </p>
            <div className="metric-grid">
              <div className="metric">
                <span>Old annual pay</span>
                <strong>{formatCurrency(reverseResult.oldAnnualPay)}</strong>
              </div>
              <div className="metric">
                <span>New annual pay</span>
                <strong>{formatCurrency(reverseResult.newAnnualPay)}</strong>
              </div>
              <div className="metric">
                <span>Annual difference</span>
                <strong>{formatCurrency(reverseResult.annualChange)}</strong>
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
              {formatPercent(reverseResult.percentage)}
            </p>
          </div>
        ) : mode === "forward" && forwardResult ? (
          <div>
            <p className="result-kicker">New annual pay</p>
            <p className="result-value">
              {formatCurrency(forwardResult.newAnnualPay)}
            </p>
            <p className="result-summary">
              A {formatPercent(Number(raisePercentage))} raise adds{" "}
              <strong>{formatCurrency(forwardResult.increaseAnnual)}</strong>{" "}
              per year.
            </p>
            <PayBreakdown
              current={forwardResult.currentByPeriod}
              increase={forwardResult.increaseByPeriod}
              next={forwardResult.newByPeriod}
            />
            <p className="formula-box">
              {formatCurrency(forwardResult.currentAnnualPay)} × (1 +{" "}
              {raisePercentage} ÷ 100) ={" "}
              {formatCurrency(forwardResult.newAnnualPay)}
            </p>
          </div>
        ) : (
          <div className="result-placeholder">
            <p className="eyebrow">Your result</p>
            <h2>
              {mode === "reverse"
                ? "Find the exact change rate"
                : "Verify your salary after a raise"}
            </h2>
            <p>
              {mode === "reverse"
                ? "Enter two pay amounts from the same period to see the percentage increase, decrease, or no change."
                : "Enter your current pay and raise percentage to see the new amount across every common pay period."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
