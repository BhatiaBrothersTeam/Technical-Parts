import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/locale";
import { IconShieldCheck, IconGlobe, IconHeadset, IconTool } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description: "About technicalparts.com — BB Group's enquiry-led website for oil and gas EPC fabricated packages and C&J fabrication.",
};

const points = [
  { icon: IconTool, title: "Built to Your Drawings", copy: "Fabrication to your drawings, data sheets and project specifications." },
  { icon: IconShieldCheck, title: "Wide Package Range", copy: "Piping, process vessels, skids, manifolds, tanks and flare systems." },
  { icon: IconHeadset, title: "End-to-End Support", copy: "From the first enquiry through fabrication and delivery." },
  { icon: IconGlobe, title: "Regional Reach", copy: "Supporting projects across the Middle East and beyond." },
];

export default function AboutPage() {
  return (
    <div className="container-tp section-y">
      <h1 className="text-3xl font-bold mb-4">{t.about.title}</h1>
      <p className="text-[var(--tp-neutral-700)] max-w-2xl mb-2">{t.about.intro}</p>
      <span className="badge-sample mb-10 inline-flex">{t.about.sampleNotice}</span>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {points.map((point) => (
          <div key={point.title} className="text-center">
            <div className="h-12 w-12 rounded-full bg-tp-blue-light text-tp-blue flex items-center justify-center mx-auto mb-3">
              <point.icon className="h-6 w-6" />
            </div>
            <p className="font-semibold text-tp-navy">{point.title}</p>
            <p className="text-sm text-[var(--tp-neutral-600)]">{point.copy}</p>
          </div>
        ))}
      </div>

      <div className="card p-8 bg-tp-navy text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1 text-white">Need technical support or have a question?</h2>
          <p className="text-white/75">Our team is here to help — send us your requirement.</p>
        </div>
        <Link href="/contact" className="btn btn-outline shrink-0">
          {t.header.contactUs}
        </Link>
      </div>
    </div>
  );
}
