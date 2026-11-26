import type { Metadata } from "next";
import Link from "next/link";
import { IconBlueprint } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { t } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Projects",
  description: "Reference projects for C&J fabrication and EPC packages.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Track record"
        title={t.projects.title}
        subtitle={t.projects.intro}
        crumbs={[{ label: t.projects.title }]}
      />
      <div className="container-tp section-y">
        <div className="card p-8 md:p-10 max-w-3xl mx-auto text-center">
          <div className="h-14 w-14 rounded-2xl bg-tp-blue-light text-tp-blue flex items-center justify-center mx-auto mb-4">
            <IconBlueprint className="h-7 w-7" />
          </div>
          <span className="badge-sample mb-4 inline-flex">{t.projects.sampleNotice}</span>
          <p className="text-[var(--tp-neutral-700)] max-w-xl mx-auto">{t.projects.placeholder}</p>
          <Link href="/contact" className="btn btn-primary mt-7">
            {t.projects.cta}
          </Link>
        </div>
      </div>
    </>
  );
}
