import Link from "next/link";

type ToolLinkCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export function ToolLinkCard({
  eyebrow,
  title,
  description,
  href,
  cta,
}: ToolLinkCardProps) {
  return (
    <article className="tool-link-card">
      <p className="eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link className="text-link" href={href}>
        {cta} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
