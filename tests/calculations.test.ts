import { describe, expect, it } from "vitest";

import {
  calculateRaise,
  calculateRaisePercentage,
  projectSalaryGrowth,
  toAnnualPay,
} from "@/lib/calculations";
import { formatCurrency, formatPercent } from "@/lib/format";

describe("pay period conversion", () => {
  it("annualizes hourly pay using supplied weekly hours", () => {
    expect(toAnnualPay(25, "hourly", 40)).toBe(52_000);
  });

  it("annualizes each non-hourly pay period", () => {
    expect(toAnnualPay(1_000, "weekly", 40)).toBe(52_000);
    expect(toAnnualPay(2_000, "biweekly", 40)).toBe(52_000);
    expect(toAnnualPay(5_000, "monthly", 40)).toBe(60_000);
    expect(toAnnualPay(60_000, "annual", 40)).toBe(60_000);
  });

  it("rejects impossible pay and hourly schedules", () => {
    expect(() => toAnnualPay(0, "annual", 40)).toThrow(
      "Pay must be greater than zero.",
    );
    expect(() => toAnnualPay(25, "hourly", 0)).toThrow(
      "Hours per week must be between 1 and 168.",
    );
    expect(() => toAnnualPay(25, "hourly", 169)).toThrow(
      "Hours per week must be between 1 and 168.",
    );
  });
});

describe("pay raise calculator", () => {
  it("calculates a percentage raise and all period outputs", () => {
    const result = calculateRaise({
      currentPay: 60_000,
      period: "annual",
      mode: "percentage",
      raiseValue: 5,
      hoursPerWeek: 40,
    });

    expect(result.newAnnualPay).toBe(63_000);
    expect(result.increaseAnnual).toBe(3_000);
    expect(result.currentByPeriod.monthly).toBe(5_000);
    expect(result.newByPeriod.monthly).toBe(5_250);
    expect(result.increaseByPeriod.hourly).toBeCloseTo(1.4423, 4);
  });

  it("calculates a fixed raise in the selected period", () => {
    const result = calculateRaise({
      currentPay: 25,
      period: "hourly",
      mode: "fixed",
      raiseValue: 2,
      hoursPerWeek: 40,
    });

    expect(result.currentAnnualPay).toBe(52_000);
    expect(result.increaseAnnual).toBe(4_160);
    expect(result.newAnnualPay).toBe(56_160);
  });

  it("accepts a zero raise without producing invalid output", () => {
    const result = calculateRaise({
      currentPay: 60_000,
      period: "annual",
      mode: "fixed",
      raiseValue: 0,
      hoursPerWeek: 40,
    });

    expect(result.newAnnualPay).toBe(60_000);
    expect(result.increaseByPeriod.annual).toBe(0);
  });

  it("rejects negative or non-finite raises", () => {
    expect(() =>
      calculateRaise({
        currentPay: 60_000,
        period: "annual",
        mode: "percentage",
        raiseValue: -1,
        hoursPerWeek: 40,
      }),
    ).toThrow("Raise must be zero or greater.");
  });
});

describe("raise percentage calculator", () => {
  it("calculates an increase", () => {
    expect(calculateRaisePercentage(50_000, 55_000)).toEqual({
      change: 5_000,
      percentage: 10,
      direction: "increase",
    });
  });

  it("distinguishes a pay cut and no change", () => {
    expect(calculateRaisePercentage(50_000, 45_000).direction).toBe(
      "decrease",
    );
    expect(calculateRaisePercentage(50_000, 50_000).direction).toBe("same");
  });

  it("rejects invalid old and new pay", () => {
    expect(() => calculateRaisePercentage(0, 50_000)).toThrow(
      "Old pay must be greater than zero.",
    );
    expect(() => calculateRaisePercentage(50_000, -1)).toThrow(
      "New pay must be zero or greater.",
    );
  });
});

describe("salary growth calculator", () => {
  it("projects compound salary growth from year zero", () => {
    const result = projectSalaryGrowth(50_000, 3, 2);

    expect(result.rows.map((row) => row.salary)).toEqual([
      50_000, 51_500, 53_045,
    ]);
    expect(result.finalSalary).toBe(53_045);
    expect(result.totalGrowth).toBe(3_045);
    expect(result.totalPercentage).toBeCloseTo(6.09, 5);
  });

  it("supports a negative growth rate down to minus one hundred percent", () => {
    const result = projectSalaryGrowth(50_000, -10, 2);
    expect(result.rows.map((row) => row.salary)).toEqual([
      50_000, 45_000, 40_500,
    ]);
    expect(projectSalaryGrowth(50_000, -100, 1).finalSalary).toBe(0);
  });

  it("rejects invalid salary, rate, and year values", () => {
    expect(() => projectSalaryGrowth(0, 3, 5)).toThrow(
      "Starting salary must be greater than zero.",
    );
    expect(() => projectSalaryGrowth(50_000, 101, 5)).toThrow(
      "Growth rate must be between -100 and 100.",
    );
    expect(() => projectSalaryGrowth(50_000, 3, 0)).toThrow(
      "Years must be a whole number from 1 to 50.",
    );
    expect(() => projectSalaryGrowth(50_000, 3, 2.5)).toThrow(
      "Years must be a whole number from 1 to 50.",
    );
  });
});

describe("safe display formatting", () => {
  it("formats finite values and refuses invalid numbers", () => {
    expect(formatCurrency(5_250)).toBe("$5,250");
    expect(formatCurrency(25.5)).toBe("$25.50");
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe("—");
    expect(formatPercent(5)).toBe("5%");
    expect(formatPercent(5.125)).toBe("5.13%");
    expect(formatPercent(Number.NaN)).toBe("—");
  });
});
