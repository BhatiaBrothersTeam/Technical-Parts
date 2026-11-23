import type { Metadata } from "next";
import Link from "next/link";
import { IconBlueprint } from "@/components/icons";
import { t } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Projects",
  description: "Reference projects for EPC fabricated packages and C&J fabrication.",
};

export default function ProjectsPage() {
  return (
    <div className="container-tp section-y">
      <h1 className="text-3xl font-bold mb-2">{t.projects.title}</h1>
      <p className="text-[var(--tp-neutral-600)] max-w-2xl mb-3">{t.projects.intro}</p>
      <span className="badge-sample mb-8 inline-flex">{t.projects.sampleNotice}</span>

      <div className="card p-8 max-w-2xl flex items-start gap-4">
        <div className="h-11 w-11 rounded-lg bg-tp-blue-light text-tp-blue flex items-center justify-center shrink-0">
          <IconBlueprint className="h-6 w-6" />
        </div>
        <p className="text-[var(--tp-neutral-700)]">{t.projects.placeholder}</p>
      </div>

      <Link href="/contact" className="btn btn-primary mt-8">
        {t.projects.cta}
      </Link>
    </div>
  );
}
