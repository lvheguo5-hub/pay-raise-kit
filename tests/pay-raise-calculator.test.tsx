// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import { PayRaiseCalculator } from "@/components/calculators/PayRaiseCalculator";
import { RaisePercentageCalculator } from "@/components/calculators/RaisePercentageCalculator";
import { SalaryGrowthCalculator } from "@/components/calculators/SalaryGrowthCalculator";

afterEach(cleanup);

describe("PayRaiseCalculator", () => {
  it("clears a calculated result when the raise mode changes", async () => {
    const user = userEvent.setup();
    render(<PayRaiseCalculator />);

    await user.click(
      screen.getByRole("button", { name: "Calculate my new pay" }),
    );
    expect(screen.getAllByText("$63,000").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Fixed amount" }));

    expect(screen.queryAllByText("$63,000")).toHaveLength(0);
    expect(
      screen.getByRole("heading", {
        name: "See the raise in every pay period",
      }),
    ).toBeTruthy();
  });

  it("clears a calculated result when a pay input changes", async () => {
    const user = userEvent.setup();
    render(<PayRaiseCalculator />);

    await user.click(
      screen.getByRole("button", { name: "Calculate my new pay" }),
    );
    expect(screen.getAllByText("$63,000").length).toBeGreaterThan(0);

    await user.type(screen.getByRole("spinbutton", { name: "Current pay" }), "0");

    expect(screen.queryAllByText("$63,000")).toHaveLength(0);
  });
});

describe("RaisePercentageCalculator", () => {
  it("clears a calculated result when a comparison input changes", async () => {
    const user = userEvent.setup();
    render(<RaisePercentageCalculator />);

    await user.click(
      screen.getByRole("button", { name: "Calculate raise percentage" }),
    );
    expect(screen.getByText("5%")).toBeTruthy();

    await user.type(screen.getByRole("spinbutton", { name: "New pay" }), "0");

    expect(screen.queryByText("5%")).toBeNull();
  });
});

describe("SalaryGrowthCalculator", () => {
  it("clears a projection when an assumption changes", async () => {
    const user = userEvent.setup();
    render(<SalaryGrowthCalculator />);

    await user.click(
      screen.getByRole("button", { name: "Project salary growth" }),
    );
    expect(screen.getAllByText("$69,556.44").length).toBeGreaterThan(0);

    await user.type(
      screen.getByRole("spinbutton", { name: "Number of years" }),
      "0",
    );

    expect(screen.queryByText("$69,556.44")).toBeNull();
  });
});
