/**
 * Public contact details. Set CONTACT_ADDRESS, CONTACT_PHONE, CONTACT_EMAIL and
 * (optionally) WHATSAPP_NUMBER in the hosting environment and redeploy; the
 * "sample contact details" notices disappear as soon as a real phone and email
 * are set. Until then the placeholders below are shown and labelled as samples.
 */
const SAMPLE = {
  address: "BB Group, Dubai, United Arab Emirates, P.O. Box 12345",
  phone: "+971 4 123 4567",
  email: "info@technicalparts.com",
};

export function getContact() {
  const address = process.env.CONTACT_ADDRESS?.trim();
  const phone = process.env.CONTACT_PHONE?.trim();
  const email = process.env.CONTACT_EMAIL?.trim();
  const whatsapp = (process.env.WHATSAPP_NUMBER ?? "").replace(/[^\d]/g, "");

  return {
    address: address || SAMPLE.address,
    phone: phone || SAMPLE.phone,
    email: email || SAMPLE.email,
    /** Digits only, international format without "+", e.g. 971501234567. */
    whatsapp: whatsapp.length >= 8 ? whatsapp : "",
    isSample: !phone || !email,
  };
}

export function siteUrl(): string {
  const raw = process.env.SITE_URL?.trim() || process.env.URL?.trim() || "https://technicalparts.com";
  return raw.replace(/\/+$/, "");
}
