import type { ReactNode } from "react";
import { PageHero } from "@/components/PageHero";

interface LegalPageProps {
  title: string;
  updated: string;
  children: ReactNode;
}

/** Shared shell for the privacy policy and terms pages. */
export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <>
      <PageHero title={title} subtitle={`Last updated ${updated}`} />
      <div className="container-tp section-y">
        <div className="max-w-3xl space-y-8 text-[var(--tp-neutral-700)] leading-relaxed">{children}</div>
      </div>
    </>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-extrabold text-tp-navy mb-2">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
