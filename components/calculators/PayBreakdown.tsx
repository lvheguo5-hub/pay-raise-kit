import type { PayBreakdown as PayBreakdownValues } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";

const periodLabels = {
  hourly: "Hourly",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
  annual: "Annual",
} as const;

type PayBreakdownProps = {
  current: PayBreakdownValues;
  increase: PayBreakdownValues;
  next: PayBreakdownValues;
};

export function PayBreakdown({
  current,
  increase,
  next,
}: PayBreakdownProps) {
  return (
    <div className="table-scroll">
      <table className="result-table">
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">Before</th>
            <th scope="col">Increase</th>
            <th scope="col">After</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(periodLabels).map(([period, label]) => {
            const key = period as keyof PayBreakdownValues;
            return (
              <tr key={period}>
                <th scope="row">{label}</th>
                <td>{formatCurrency(current[key])}</td>
                <td>+{formatCurrency(increase[key])}</td>
                <td>{formatCurrency(next[key])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
