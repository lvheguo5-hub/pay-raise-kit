import Script from "next/script";

type GoogleAnalyticsProps = {
  measurementId?: string;
};

const measurementIdPattern = /^G-[A-Z0-9]+$/;

export function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  if (!measurementId || !measurementIdPattern.test(measurementId)) {
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
