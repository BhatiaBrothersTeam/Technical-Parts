import type { Metadata } from "next";
import Link from "next/link";
import { getIndustries } from "@/lib/data";
import { t } from "@/lib/locale";
import { PageHero } from "@/components/PageHero";
import { IconRig, IconFlask, IconBolt, IconDroplet, IconFactory, IconAnchor } from "@/components/icons";

export const metadata: Metadata = {
  title: "Industries",
  description: "Industries served by technicalparts.com: Oil & Gas, Petrochemical, Power, Water & Wastewater, Manufacturing and Marine.",
};

const industryIcons = {
  "oil-gas": IconRig,
  petrochemical: IconFlask,
  power: IconBolt,
  "water-wastewater": IconDroplet,
  manufacturing: IconFactory,
  marine: IconAnchor,
};

const industryCopy: Record<string, string> = {
  "oil-gas": "Separators, manifolds, skids, tanks and flare systems for upstream, midstream and downstream facilities.",
  petrochemical: "Fabricated vessels, skids and piping packages for petrochemical plants and process units.",
  power: "Piping, structural and utility packages supporting power generation and utilities.",
  "water-wastewater": "Tanks, mortar-lined piping and treatment packages for water and wastewater.",
  manufacturing: "Fabricated structures, piping and equipment packages for industrial plants.",
  marine: "Mooring buoys, sinkers and fabricated packages for marine and offshore applications.",
};

export default function IndustriesPage() {
  const industries = getIndustries();

  return (
    <>
      <PageHero
        eyebrow="Sectors"
        title="Industries We Serve"
        subtitle="Solutions for demanding industries, backed by technical expertise and a trusted supply chain."
        crumbs={[{ label: "Industries" }]}
      />
      <div className="container-tp section-y">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {industries.map((industry) => {
            const Icon = industryIcons[industry.slug as keyof typeof industryIcons];
            return (
              <div key={industry.id} id={industry.slug} className="card card-hover p-7 scroll-mt-40">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-tp-blue to-tp-navy text-white flex items-center justify-center mb-5 shadow-md">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-extrabold text-tp-navy mb-2">{industry.name}</h2>
                <p className="text-sm text-[var(--tp-neutral-600)]">{industryCopy[industry.slug]}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl p-8 bg-tp-blue-light border border-tp-blue/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-tp-navy font-bold text-lg">Don&apos;t see your industry? We can still help.</p>
          <Link href="/contact" className="btn btn-primary shrink-0">
            {t.header.contactUs}
          </Link>
        </div>
      </div>
    </>
  );
}
