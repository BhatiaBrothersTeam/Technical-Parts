import Link from "next/link";

/** Consent line shown under every form that collects personal details. */
export function PrivacyNote() {
  return (
    <p className="text-xs text-[var(--tp-neutral-600)]">
      By submitting, you agree that we may contact you about this enquiry. See our{" "}
      <Link href="/privacy" className="link-blue">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
