import type { Metadata } from "next";
import Link from "next/link";
import { CJ_BRAND, getCjCategories, getDoors, getProductsByBrand } from "@/lib/data";
import { DoorPageHero } from "@/components/DoorPageHero";
import { IconBlueprint, IconShieldCheck, IconTool } from "@/components/icons";
import { t } from "@/lib/locale";

export const metadata: Metadata = {
  title: "C&J Fabrication",
  description:
    "C&J fabricated packages for oil and gas and industrial projects. Browse the packages, then send your RFQ or drawing for review.",
};

export default async function FabricationPage() {
  const door = getDoors().find((d) => d.id === "cj")!;
  // Only C&J products (brand match) are listed here; EPC packages stay on /epc.
  const [products, categories] = await Promise.all([getProductsByBrand(CJ_BRAND), getCjCategories()]);

  return (
    <>
      <DoorPageHero
        title={door.title}
        intro={door.intro}
        points={door.points}
        leadType={door.leadType}
        ctaLabel={door.ctaLabel}
        showProjectFields
        showTechnicalFields
        products={products}
        categories={categories}
        productsHeading="C&J Fabrication Packages"
      />

      <section className="section-y">
        <div className="container-tp">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card card-hover p-7">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-tp-blue to-tp-navy text-white flex items-center justify-center mb-4 shadow-md">
                <IconTool className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-extrabold text-tp-navy mb-3">{t.fabrication.capabilityHeading}</h2>
              <ul className="text-sm text-[var(--tp-neutral-700)] space-y-2 list-disc ps-5 mb-4">
                {t.fabrication.capabilityItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <span className="badge-sample">{t.common.sample}</span>
              <p className="text-xs text-[var(--tp-neutral-600)] mt-2">{t.fabrication.capabilityPlaceholder}</p>
            </div>

            <div className="card card-hover p-7">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-tp-blue to-tp-navy text-white flex items-center justify-center mb-4 shadow-md">
                <IconBlueprint className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-extrabold text-tp-navy mb-3">{t.fabrication.referenceHeading}</h2>
              <span className="badge-sample">{t.common.sample}</span>
              <p className="text-xs text-[var(--tp-neutral-600)] mt-2">{t.fabrication.referencePlaceholder}</p>
            </div>

            <div className="card card-hover p-7">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-tp-blue to-tp-navy text-white flex items-center justify-center mb-4 shadow-md">
                <IconShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-extrabold text-tp-navy mb-3">{t.fabrication.codesHeading}</h2>
              <span className="badge-sample">{t.common.sample}</span>
              <p className="text-xs text-[var(--tp-neutral-600)] mt-2">{t.fabrication.codesPlaceholder}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/rfq" className="link-blue">
              {t.fabrication.uploadCta} &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
