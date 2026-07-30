import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Privacy Policy | Pay Raise Kit",
  },
  description:
    "Read how Pay Raise Kit handles calculator inputs, hosting data, contact emails, and future policy changes.",
  alternates: {
    canonical: "/privacy/",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="hero compact shell">
        <p className="eyebrow">Effective July 30, 2026</p>
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
            The first release has no user accounts, saved calculation
            history, advertising network, or behavioral analytics script.
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
            If the site later adds analytics, advertising, accounts, or other
            data processing, this policy will be updated before those
            features are described as active.
          </p>
        </div>
      </section>
    </>
  );
}
