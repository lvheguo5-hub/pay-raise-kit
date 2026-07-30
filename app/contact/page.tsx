import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

const pageTitle = "Contact Pay Raise Kit";
const pageDescription =
  "Contact Pay Raise Kit to report a calculation issue, suggest an improvement, or ask about the site.";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
  description: pageDescription,
  alternates: {
    canonical: "/contact/",
  },
  openGraph: {
    type: "website",
    siteName: "Pay Raise Kit",
    url: "/contact/",
    title: pageTitle,
    description: pageDescription,
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="hero compact shell">
        <p className="eyebrow">Questions and corrections</p>
        <h1>Contact Pay Raise Kit</h1>
        <p className="lede">
          Report a calculation issue or share feedback about one of the
          tools.
        </p>
      </section>
      <section className="section">
        <div className="shell prose">
          <div className="content-card">
            <h2>Email</h2>
            <p>
              Write to{" "}
              <a href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
              .
            </p>
            <p>
              For a calculation issue, include the calculator name, the
              numbers you entered, and the result you expected. Do not send
              pay stubs, tax records, government identifiers, passwords, or
              other private documents.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
