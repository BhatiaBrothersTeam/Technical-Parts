import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/locale";
import { PageHero } from "@/components/PageHero";
import { IconShieldCheck, IconGlobe, IconHeadset, IconTool } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description: "About technicalparts.com, BB Group's enquiry-led website for C&J fabricated packages and EPC packages.",
};

const points = [
  { icon: IconTool, title: "Built to Your Drawings", copy: "Fabrication to your drawings, data sheets and project specifications." },
  { icon: IconShieldCheck, title: "Wide Package Range", copy: "Piping, vessels, HVAC, tanks, pipeline rehabilitation and process equipment." },
  { icon: IconHeadset, title: "End-to-End Support", copy: "From the first enquiry through fabrication and delivery." },
  { icon: IconGlobe, title: "Regional Reach", copy: "Supporting projects across the Middle East and beyond." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Who we are" title={t.about.title} subtitle={t.about.intro} crumbs={[{ label: "About" }]}>
        <span className="badge-sample">{t.about.sampleNotice}</span>
      </PageHero>

      <div className="container-tp section-y">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {points.map((point) => (
            <div key={point.title} className="card card-hover p-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-tp-blue to-tp-navy text-white flex items-center justify-center mb-4 shadow-md">
                <point.icon className="h-6 w-6" />
              </div>
              <p className="font-bold text-tp-navy mb-1">{point.title}</p>
              <p className="text-sm text-[var(--tp-neutral-600)]">{point.copy}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8 md:p-10 bg-tp-blue-light border border-tp-blue/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-tp-navy mb-1">
              Need technical support or have a question?
            </h2>
            <p className="text-[var(--tp-neutral-600)]">Our team is here to help. Send us your requirement.</p>
          </div>
          <Link href="/contact" className="btn btn-primary shrink-0">
            {t.header.contactUs}
          </Link>
        </div>
      </div>
    </>
  );
}
