export type PayPeriod =
  | "hourly"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "annual";

export type RaiseMode = "percentage" | "fixed";

export type PayBreakdown = Record<PayPeriod, number>;

export type RaiseCalculationInput = {
  currentPay: number;
  period: PayPeriod;
  mode: RaiseMode;
  raiseValue: number;
  hoursPerWeek: number;
};

const annualFactors: Record<Exclude<PayPeriod, "hourly">, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  annual: 1,
};

export function toAnnualPay(
  amount: number,
  period: PayPeriod,
  hoursPerWeek = 40,
): number {
  assertFinitePositive(amount, "Pay must be greater than zero.");

  if (period === "hourly") {
    assertHoursPerWeek(hoursPerWeek);
    return amount * hoursPerWeek * 52;
  }

  return amount * annualFactors[period];
}

export function fromAnnualPay(
  annualPay: number,
  hoursPerWeek = 40,
): PayBreakdown {
  assertFiniteNonNegative(annualPay, "Annual pay must be zero or greater.");
  assertHoursPerWeek(hoursPerWeek);

  return {
    hourly: annualPay / (hoursPerWeek * 52),
    weekly: annualPay / 52,
    biweekly: annualPay / 26,
    monthly: annualPay / 12,
    annual: annualPay,
  };
}

export function calculateRaise(input: RaiseCalculationInput) {
  if (!Number.isFinite(input.raiseValue) || input.raiseValue < 0) {
    throw new Error("Raise must be zero or greater.");
  }

  const currentAnnualPay = toAnnualPay(
    input.currentPay,
    input.period,
    input.hoursPerWeek,
  );
  const increaseAnnual =
    input.mode === "percentage"
      ? currentAnnualPay * (input.raiseValue / 100)
      : toAnnualIncrease(
          input.raiseValue,
          input.period,
          input.hoursPerWeek,
        );
  const newAnnualPay = currentAnnualPay + increaseAnnual;

  return {
    currentAnnualPay,
    newAnnualPay,
    increaseAnnual,
    currentByPeriod: fromAnnualPay(
      currentAnnualPay,
      input.hoursPerWeek,
    ),
    newByPeriod: fromAnnualPay(newAnnualPay, input.hoursPerWeek),
    increaseByPeriod: fromAnnualPay(
      increaseAnnual,
      input.hoursPerWeek,
    ),
  };
}

export function calculateRaisePercentage(oldPay: number, newPay: number) {
  assertFinitePositive(oldPay, "Old pay must be greater than zero.");
  assertFiniteNonNegative(newPay, "New pay must be zero or greater.");

  const change = newPay - oldPay;

  return {
    change,
    percentage: (change / oldPay) * 100,
    direction:
      change > 0 ? "increase" : change < 0 ? "decrease" : "same",
  } as const;
}

export function projectSalaryGrowth(
  startingSalary: number,
  rate: number,
  years: number,
) {
  assertFinitePositive(
    startingSalary,
    "Starting salary must be greater than zero.",
  );

  if (!Number.isFinite(rate) || rate < -100 || rate > 100) {
    throw new Error("Growth rate must be between -100 and 100.");
  }

  if (!Number.isInteger(years) || years < 1 || years > 50) {
    throw new Error("Years must be a whole number from 1 to 50.");
  }

  const rows = Array.from({ length: years + 1 }, (_, year) => ({
    year,
    salary: startingSalary * (1 + rate / 100) ** year,
  }));
  const finalSalary = rows.at(-1)?.salary ?? startingSalary;

  return {
    rows,
    finalSalary,
    totalGrowth: finalSalary - startingSalary,
    totalPercentage:
      ((finalSalary - startingSalary) / startingSalary) * 100,
  };
}

function toAnnualIncrease(
  amount: number,
  period: PayPeriod,
  hoursPerWeek: number,
): number {
  if (amount === 0) {
    return 0;
  }

  return toAnnualPay(amount, period, hoursPerWeek);
}

function assertHoursPerWeek(hoursPerWeek: number): void {
  if (
    !Number.isFinite(hoursPerWeek) ||
    hoursPerWeek < 1 ||
    hoursPerWeek > 168
  ) {
    throw new Error("Hours per week must be between 1 and 168.");
  }
}

function assertFinitePositive(value: number, message: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(message);
  }
}

function assertFiniteNonNegative(value: number, message: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(message);
  }
}
