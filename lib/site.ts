export const siteConfig = {
  name: "Pay Raise Kit",
  url: "https://payraisekit.com",
  description:
    "Free calculators for pay raises, salary increase percentages, and long-term salary growth.",
  contactEmail: "hello@payraisekit.com",
} as const;

export const toolRoutes = [
  { href: "/", label: "Pay Raise Calculator" },
  {
    href: "/raise-percentage-calculator/",
    label: "Raise Percentage Calculator",
  },
  {
    href: "/salary-growth-calculator/",
    label: "Salary Growth Calculator",
  },
] as const;

export const trustRoutes = [
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy" },
  { href: "/terms/", label: "Terms" },
] as const;
