import type { Metadata } from "next";
import { t } from "@/lib/locale";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact technicalparts.com for EPC package, C&J fabrication or RFQ enquiries.",
};

const details = [
  { label: "Address", value: "BB Group, Dubai, United Arab Emirates, P.O. Box 12345" },
  { label: "Phone", value: "+971 4 123 4567" },
  { label: "Email", value: "info@technicalparts.com" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={t.contact.title}
        subtitle={t.contact.intro}
        crumbs={[{ label: t.contact.title }]}
      />
      <div className="container-tp section-y">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-extrabold text-tp-navy mb-2">{t.contact.detailsHeading}</h2>
            <span className="badge-sample mb-5 inline-flex">{t.contact.placeholderNotice}</span>
            <dl className="space-y-3">
              {details.map((d) => (
                <div key={d.label} className="card p-4">
                  <dt className="text-xs font-bold uppercase tracking-wider text-tp-blue">{d.label}</dt>
                  <dd className="text-[var(--tp-neutral-700)] mt-1">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-3">
            <EnquiryForm
              leadType="general_enquiry"
              heading={t.contact.formHeading}
              showEnquiryType
              submitLabel="Send Message"
            />
          </div>
        </div>
      </div>
    </>
  );
}
