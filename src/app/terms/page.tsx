import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the technicalparts.com website and sending enquiries.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="27 November 2026">
      <p>By using technicalparts.com you agree to these terms.</p>

      <LegalSection heading="Enquiries, not orders">
        <p>
          This website is for enquiries. It does not take orders or payments. Sending an enquiry or RFQ does not create a
          contract. Any supply is agreed only through a written quotation and order confirmation from us.
        </p>
      </LegalSection>

      <LegalSection heading="Product information">
        <p>
          We take care to keep package descriptions accurate, but they are for general guidance. Specifications, sizes
          and availability can change, and details must be confirmed with us before you rely on them for a project.
        </p>
      </LegalSection>

      <LegalSection heading="What you send us">
        <p>
          Please send only information and files you are entitled to share. Do not upload anything unlawful or harmful.
          We may decline to handle an enquiry that breaks these terms.
        </p>
      </LegalSection>

      <LegalSection heading="Liability">
        <p>
          To the fullest extent the law allows, we are not liable for loss arising from your use of this website or from
          relying on its content without confirming it with us first.
        </p>
      </LegalSection>

      <LegalSection heading="Privacy and contact">
        <p>
          How we handle your details is set out in our{" "}
          <Link href="/privacy" className="link-blue">
            Privacy Policy
          </Link>
          . For anything else, use the{" "}
          <Link href="/contact" className="link-blue">
            contact page
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
