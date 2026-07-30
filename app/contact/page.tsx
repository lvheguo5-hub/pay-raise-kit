import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Pay Raise Kit",
  },
  description:
    "Contact Pay Raise Kit to report a calculation issue, suggest an improvement, or ask about the site.",
  alternates: {
    canonical: "/contact/",
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
