export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  const hasFraction = Math.abs(value - Math.round(value)) > 0.000_001;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(2).replace(/\.00$/, "")}%`;
}
