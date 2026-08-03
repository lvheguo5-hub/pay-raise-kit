"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import {
  getInternalAnalyticsAction,
  getInternalAnalyticsCookie,
  hasInternalAnalyticsCookie,
  removeInternalAnalyticsQuery,
} from "@/lib/internal-analytics";

type GoogleAnalyticsProps = {
  measurementId?: string;
};

const measurementIdPattern = /^G-[A-Z0-9]+$/;

export function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  const [trackingAllowed, setTrackingAllowed] = useState(false);

  useEffect(() => {
    const action = getInternalAnalyticsAction(window.location.search);
    let isInternal = hasInternalAnalyticsCookie(document.cookie);

    if (action) {
      document.cookie = getInternalAnalyticsCookie(action);
      isInternal = action === "enable";
      window.history.replaceState(
        window.history.state,
        "",
        removeInternalAnalyticsQuery(window.location.href),
      );
    }

    setTrackingAllowed(!isInternal);
  }, []);

  if (
    !trackingAllowed ||
    !measurementId ||
    !measurementIdPattern.test(measurementId)
  ) {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}', {
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});`}
      </Script>
    </>
  );
}
