// @vitest-environment jsdom

import { cleanup, render, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GoogleAnalytics } from "@/components/GoogleAnalytics";

vi.mock("next/script", () => ({
  default: ({
    children,
    id,
    src,
  }: {
    children?: React.ReactNode;
    id?: string;
    src?: string;
  }) => (
    <script data-testid={id ?? "google-analytics-loader"} src={src}>
      {children}
    </script>
  ),
}));

beforeEach(() => {
  window.history.replaceState({}, "", "/");
  document.cookie =
    "prk_internal=; Path=/; Max-Age=0; SameSite=Lax; Secure";
});

afterEach(cleanup);

describe("GoogleAnalytics", () => {
  it("loads GA4 after an ordinary browser is known to be trackable", async () => {
    const { container } = render(
      <GoogleAnalytics measurementId="G-BNKWB2NT8J" />,
    );

    await waitFor(() => {
      expect(
        container.querySelector(
          'script[src="https://www.googletagmanager.com/gtag/js?id=G-BNKWB2NT8J"]',
        ),
      ).not.toBeNull();
    });
  });

  it("sets internal mode without loading GA4 on the enabling visit", async () => {
    window.history.replaceState(
      {},
      "",
      "/?internal=1&utm_source=codex#result",
    );
    const { container } = render(
      <GoogleAnalytics measurementId="G-BNKWB2NT8J" />,
    );

    await waitFor(() => {
      expect(document.cookie).toContain("prk_internal=1");
      expect(
        window.location.pathname +
          window.location.search +
          window.location.hash,
      ).toBe("/?utm_source=codex#result");
    });
    expect(container.querySelector("script")).toBeNull();
  });

  it("keeps a previously marked internal browser out of GA4", () => {
    document.cookie =
      "prk_internal=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure";

    const { container } = render(
      <GoogleAnalytics measurementId="G-BNKWB2NT8J" />,
    );

    expect(container.querySelectorAll("script")).toHaveLength(0);
  });

  it("clears internal mode and restores GA4", async () => {
    document.cookie =
      "prk_internal=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure";
    window.history.replaceState({}, "", "/?internal=0");
    const { container } = render(
      <GoogleAnalytics measurementId="G-BNKWB2NT8J" />,
    );

    await waitFor(() => {
      expect(document.cookie).not.toContain("prk_internal=1");
      expect(container.querySelectorAll("script")).toHaveLength(2);
    });
    expect(window.location.pathname + window.location.search).toBe("/");
  });

  it("keeps invalid measurement IDs disabled", async () => {
    const { container } = render(
      <GoogleAnalytics measurementId="not-a-ga-id" />,
    );
    await Promise.resolve();
    expect(container.querySelector("script")).toBeNull();
  });
});
