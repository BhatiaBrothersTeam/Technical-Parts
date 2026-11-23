import type { Metadata } from "next";
import { t } from "@/lib/locale";
import { EnquiryForm } from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact technicalparts.com for EPC package, C&J fabrication or RFQ enquiries.",
};

export default function ContactPage() {
  return (
    <div className="container-tp section-y">
      <h1 className="text-3xl font-bold mb-2">{t.contact.title}</h1>
      <p className="text-[var(--tp-neutral-600)] max-w-2xl mb-10">{t.contact.intro}</p>

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-tp-navy mb-1">{t.contact.detailsHeading}</h2>
          <span className="badge-sample mb-4 inline-flex">{t.contact.placeholderNotice}</span>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-tp-navy">Address</dt>
              <dd className="text-[var(--tp-neutral-600)]">BB Group, Dubai, United Arab Emirates — P.O. Box 12345</dd>
            </div>
            <div>
              <dt className="font-semibold text-tp-navy">Phone</dt>
              <dd className="text-[var(--tp-neutral-600)]">+971 4 123 4567</dd>
            </div>
            <div>
              <dt className="font-semibold text-tp-navy">Email</dt>
              <dd className="text-[var(--tp-neutral-600)]">info@technicalparts.com</dd>
            </div>
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
  );
}
