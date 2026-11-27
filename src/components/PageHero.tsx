import Link from "next/link";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
}

/** Dark banner shown at the top of every inner page. */
export function PageHero({ eyebrow, title, subtitle, crumbs, children }: PageHeroProps) {
  return (
    <section className="page-banner">
      <div className="container-tp relative z-10 py-12 md:py-16">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="text-xs text-white/60 mb-4 flex flex-wrap items-center gap-1.5">
            <Link href="/" className="hover:text-white">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <span aria-hidden>/</span>
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">{c.label}</Link>
                ) : (
                  <span className="text-white/90">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow eyebrow-light mb-3">{eyebrow}</p>}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold max-w-3xl break-words">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base md:text-lg text-white/75">{subtitle}</p>}
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
