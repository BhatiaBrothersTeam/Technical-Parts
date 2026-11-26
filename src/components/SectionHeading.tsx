import Link from "next/link";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  copy?: string;
  linkHref?: string;
  linkLabel?: string;
  center?: boolean;
}

export function SectionHeading({ eyebrow, title, copy, linkHref, linkLabel, center }: SectionHeadingProps) {
  return (
    <div className={`mb-10 flex flex-col gap-3 ${center ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {copy && <p className="mt-3 text-[var(--tp-neutral-600)]">{copy}</p>}
      </div>
      {linkHref && linkLabel && (
        <Link href={linkHref} className="link-blue text-sm shrink-0 inline-flex items-center gap-1">
          {linkLabel} <span aria-hidden>&rarr;</span>
        </Link>
      )}
    </div>
  );
}
