import type { Metadata } from "next";
import Link from "next/link";
import { CJ_BRAND, getCjCategories, getDoors, getIndustries, getProductsByBrand } from "@/lib/data";
import { t } from "@/lib/locale";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { IconBlueprint, IconRig } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description: "About technicalparts.com, BB Group's enquiry-led website for C&J packages and EPC packages.",
};

const doorIcons: Record<string, typeof IconRig> = {
  cj: IconBlueprint,
  epc: IconRig,
};

const steps = [
  { title: "Browse", copy: "Find the package you need, or search by name or industry." },
  { title: "Send your requirement", copy: "Add packages to your RFQ, or upload your drawings and BOQ." },
  { title: "We respond", copy: "Our team reviews your requirement and gets back to you." },
];

export default async function AboutPage() {
  const [products, categories] = await Promise.all([getProductsByBrand(CJ_BRAND), getCjCategories()]);
  const industries = getIndustries();
  const doors = getDoors();

  const stats = [
    { value: products.length, label: "C&J packages" },
    { value: categories.length, label: "Categories" },
    { value: industries.length, label: "Industries served" },
  ].filter((s) => s.value > 0);

  return (
    <>
      <PageHero title={t.about.title} subtitle={t.about.intro} />

      {stats.length > 0 && (
        <section className="container-tp -mt-8 relative z-10">
          <div className="card shadow-lg grid grid-cols-3 divide-x divide-[var(--tp-neutral-200)]">
            {stats.map((s) => (
              <div key={s.label} className="p-5 md:p-7 text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-tp-blue font-[family-name:var(--font-heading)]">
                  {s.value}
                </p>
                <p className="text-xs md:text-sm text-[var(--tp-neutral-600)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="container-tp">
          <SectionHeading eyebrow="What we offer" title="Two divisions" center />
          <div className="grid md:grid-cols-2 gap-6">
            {doors.map((door) => {
              const Icon = doorIcons[door.id] ?? IconBlueprint;
              return (
                <Link key={door.id} href={door.path} className="card card-hover p-7 flex flex-col">
                  <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-tp-blue to-tp-navy text-white flex items-center justify-center mb-4 shadow-md">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-extrabold text-tp-navy mb-2">{door.title}</h3>
                  <p className="text-sm text-[var(--tp-neutral-600)] flex-1">{door.intro}</p>
                  <span className="link-blue text-sm mt-5">View {door.title} &rarr;</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y bg-[var(--tp-neutral-50)]">
        <div className="container-tp">
          <SectionHeading eyebrow="How it works" title="From enquiry to response" center />
          <ol className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <li key={step.title} className="card p-7">
                <span className="h-10 w-10 rounded-full bg-tp-accent text-tp-navy-dark font-extrabold flex items-center justify-center mb-4">
                  {i + 1}
                </span>
                <h3 className="font-extrabold text-tp-navy mb-1">{step.title}</h3>
                <p className="text-sm text-[var(--tp-neutral-600)]">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
