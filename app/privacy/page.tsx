import type { Metadata } from "next";

const pageTitle = "Privacy Policy | Pay Raise Kit";
const pageDescription =
  "Read how Pay Raise Kit handles calculator inputs, hosting data, contact emails, and future policy changes.";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
  description: pageDescription,
  alternates: {
    canonical: "/privacy/",
  },
  openGraph: {
    type: "website",
    siteName: "Pay Raise Kit",
    url: "/privacy/",
    title: pageTitle,
    description: pageDescription,
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="hero compact shell">
        <p className="eyebrow">Effective August 1, 2026</p>
        <h1>Privacy Policy</h1>
        <p className="lede">
          The first release is designed to answer salary questions without
          collecting your calculator inputs.
        </p>
      </section>
      <section className="section">
        <div className="shell prose">
          <h2>Calculator inputs</h2>
          <p>
            <strong>Calculations stay in your browser.</strong> The pay
            amounts, percentages, hours, and years you enter are processed on
            your device and are not submitted to a Pay Raise Kit database.
          </p>

          <h2>Accounts, advertising, and analytics</h2>
          <p>
            The site has no user accounts, saved calculation history, or
            advertising network. We use Google Analytics 4 to understand page
            visits, referring pages, approximate region, and general browser
            and device information. Google Analytics may use analytics cookies
            or similar technologies for this measurement.
          </p>
          <p>
            Google Signals and advertising-personalization signals are disabled
            in our site configuration. We do not send calculator inputs, salary
            or wage amounts, raise percentages, hours, years, or email content
            to Google Analytics. Google explains{" "}
            <a href="https://policies.google.com/technologies/partner-sites">
              how it uses information from sites that use its services
            </a>
            . You can also use the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout">
              Google Analytics opt-out browser add-on
            </a>
            .
          </p>

          <h2>Hosting information</h2>
          <p>
            As with most websites, the hosting provider may process ordinary
            request information needed to deliver and secure the site, such
            as IP address, browser details, requested URL, time, and security
            signals. Pay Raise Kit does not use that information to build
            personal salary profiles.
          </p>

          <h2>Email</h2>
          <p>
            If you contact the site, the email service processes your address
            and message so the communication can be delivered. Do not send
            payroll documents or sensitive personal identifiers.
          </p>

          <h2>Policy changes</h2>
          <p>
            If the site later adds advertising, accounts, saved data,
            personalized analytics, or other data processing, this policy will
            be updated before those features are described as active.
          </p>
        </div>
      </section>
    </>
  );
}
