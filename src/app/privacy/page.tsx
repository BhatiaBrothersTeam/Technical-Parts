import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How technicalparts.com collects and uses the details you send in an enquiry or RFQ.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="27 November 2026">
      <p>
        This policy explains what technicalparts.com, part of BB Group, does with the information you send us through
        this website.
      </p>

      <LegalSection heading="What we collect">
        <p>
          When you send an enquiry, an RFQ or a message, we collect what you type into the form: your name, email,
          phone number, country, company, project details and message. If you upload drawings, BOQs or other files, we
          receive those files too. Your RFQ list is kept in your own browser until you send it.
        </p>
        <p>
          We do not ask for payment details, and this website does not take payments. The site currently does not use
          advertising or analytics cookies.
        </p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>
          We use your details to review your requirement, reply to you and prepare a quotation. We may also use them to
          follow up on that enquiry. We do not sell your information.
        </p>
      </LegalSection>

      <LegalSection heading="Where it is stored">
        <p>
          Enquiries and uploaded files are stored on our own web server and are visible only to the staff who handle
          enquiries. We send a confirmation email to the address you give us, and an internal notification to our sales
          team.
        </p>
      </LegalSection>

      <LegalSection heading="How long we keep it">
        <p>
          We keep enquiries for as long as we need them to respond to you and to keep our business records. You can ask
          us to delete your details at any time.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>
          You can ask to see, correct or delete the information we hold about you. Use the{" "}
          <Link href="/contact" className="link-blue">
            contact page
          </Link>{" "}
          and mention the enquiry number you received when you submitted your request.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>We may update this policy. The date above shows when it last changed.</p>
      </LegalSection>
    </LegalPage>
  );
}
