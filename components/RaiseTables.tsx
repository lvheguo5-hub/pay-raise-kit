import { calculateRaisePercentage } from "@/lib/calculations";
import { formatCurrency, formatPercent } from "@/lib/format";

const SALARIES = [40_000, 50_000, 60_000, 75_000, 100_000];
const HOURLY = [15, 20, 25, 30];
const RATES = [3, 4, 5, 10];

function raised(pay: number, rate: number) {
  return Math.round(pay * (1 + rate / 100) * 100) / 100;
}

export function RaiseLookupTables() {
  return (
    <div className="raise-tables">
      <div className="table-scroll">
        <table className="result-table">
          <caption>New annual salary after a raise</caption>
          <thead>
            <tr>
              <th scope="col">Current salary</th>
              {RATES.map((rate) => (
                <th key={rate} scope="col">{rate}% raise</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SALARIES.map((salary) => (
              <tr key={salary}>
                <th scope="row">{formatCurrency(salary)}</th>
                {RATES.map((rate) => (
                  <td key={rate}>{formatCurrency(raised(salary, rate))}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-scroll">
        <table className="result-table">
          <caption>New hourly wage after a raise</caption>
          <thead>
            <tr>
              <th scope="col">Current wage</th>
              {RATES.map((rate) => (
                <th key={rate} scope="col">{rate}% raise</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURLY.map((wage) => (
              <tr key={wage}>
                <th scope="row">{formatCurrency(wage)}/hr</th>
                {RATES.map((rate) => (
                  <td key={rate}>{formatCurrency(raised(wage, rate))}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PERCENT_EXAMPLES: Array<[number, number, string]> = [
  [15, 16, "/hr"],
  [18, 20, "/hr"],
  [22.5, 24, "/hr"],
  [48_000, 50_000, ""],
  [62_000, 65_000, ""],
  [85_000, 92_000, ""],
];

export function RaisePercentageExamples() {
  return (
    <div className="table-scroll">
      <table className="result-table">
        <caption>Raise percentage examples</caption>
        <thead>
          <tr>
            <th scope="col">Old pay</th>
            <th scope="col">New pay</th>
            <th scope="col">Increase</th>
            <th scope="col">Raise %</th>
          </tr>
        </thead>
        <tbody>
          {PERCENT_EXAMPLES.map(([oldPay, newPay, unit]) => {
            const result = calculateRaisePercentage(oldPay, newPay);
            return (
              <tr key={`${oldPay}-${newPay}`}>
                <th scope="row">{formatCurrency(oldPay)}{unit}</th>
                <td>{formatCurrency(newPay)}{unit}</td>
                <td>{formatCurrency(result.change)}</td>
                <td>{formatPercent(result.percentage)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
