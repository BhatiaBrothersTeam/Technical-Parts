import type { Metadata } from "next";
import Link from "next/link";
import { getDoors, getProductsBySlugs } from "@/lib/data";
import { DoorPageHero } from "@/components/DoorPageHero";
import { IconBlueprint, IconShieldCheck, IconTool } from "@/components/icons";
import { t } from "@/lib/locale";

export const metadata: Metadata = {
  title: "C&J Fabrication",
  description:
    "Capability-led fabrication for EPC and industrial projects. Review our capability, then send your RFQ or drawing for review.",
};

const relatedSlugs = [
  "structural-module-work",
  "pipe-rack-plant-shelter",
  "process-power-underground-piping-packages",
  "heat-exchangers",
];

export default async function FabricationPage() {
  const door = getDoors().find((d) => d.id === "cj")!;
  const products = await getProductsBySlugs(relatedSlugs, 4);

  return (
    <>
      <DoorPageHero
        icon={IconBlueprint}
        title={door.title}
        intro={door.intro}
        points={door.points}
        leadType={door.leadType}
        ctaLabel={door.ctaLabel}
        showProjectFields
        showTechnicalFields
        products={products}
        productsHeading="Related EPC packages"
      />

      <section className="bg-[var(--tp-neutral-50)] section-y">
        <div className="container-tp grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="h-10 w-10 rounded-lg bg-tp-blue-light text-tp-blue flex items-center justify-center mb-3">
              <IconTool className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-tp-navy mb-2">{t.fabrication.capabilityHeading}</h2>
            <ul className="text-sm text-[var(--tp-neutral-700)] space-y-1.5 list-disc ps-5 mb-3">
              {t.fabrication.capabilityItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <span className="badge-sample">{t.common.sample}</span>
            <p className="text-xs text-[var(--tp-neutral-600)] mt-2">{t.fabrication.capabilityPlaceholder}</p>
          </div>

          <div className="card p-6">
            <div className="h-10 w-10 rounded-lg bg-tp-blue-light text-tp-blue flex items-center justify-center mb-3">
              <IconBlueprint className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-tp-navy mb-2">{t.fabrication.referenceHeading}</h2>
            <span className="badge-sample">{t.common.sample}</span>
            <p className="text-xs text-[var(--tp-neutral-600)] mt-2">{t.fabrication.referencePlaceholder}</p>
          </div>

          <div className="card p-6">
            <div className="h-10 w-10 rounded-lg bg-tp-blue-light text-tp-blue flex items-center justify-center mb-3">
              <IconShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-tp-navy mb-2">{t.fabrication.codesHeading}</h2>
            <span className="badge-sample">{t.common.sample}</span>
            <p className="text-xs text-[var(--tp-neutral-600)] mt-2">{t.fabrication.codesPlaceholder}</p>
          </div>
        </div>

        <div className="container-tp mt-8">
          <Link href="/rfq" className="link-blue text-sm">
            {t.fabrication.uploadCta} &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
