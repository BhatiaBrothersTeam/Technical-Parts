import Link from "next/link";
import { t } from "@/lib/locale";
import { getContact } from "@/lib/contact";

export function Footer() {
  const contact = getContact();
  return (
    <footer className="bg-tp-navy-dark text-white/75 text-sm">
      <div className="container-tp py-10 grid gap-8 md:grid-cols-2 md:items-start">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span
              aria-hidden
              className="h-10 w-10 rounded-xl bg-gradient-to-br from-tp-blue to-tp-navy-light text-white flex items-center justify-center font-extrabold text-sm ring-1 ring-white/15"
            >
              tp
            </span>
            <div>
              <div className="text-lg font-extrabold text-white leading-none font-[family-name:var(--font-heading)]">
                technicalparts<span className="text-tp-sky">.com</span>
              </div>
              <p className="text-xs text-white/55 mt-1">{t.brand.group}</p>
            </div>
          </div>
          <p className="text-white/70 max-w-sm">{t.about.intro}</p>
        </div>

        <div className="md:justify-self-end md:text-end">
          <address className="not-italic space-y-1.5 text-white/70">
            <p>{contact.address}</p>
            <p>
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                {contact.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </p>
          </address>
          {contact.isSample && (
            <p className="mt-2">
              <span className="badge-sample">Sample contact details</span>
            </p>
          )}
          <Link href="/contact" className="inline-block mt-3 font-semibold text-white hover:text-tp-accent">
            {t.header.contactUs} &rarr;
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className={`container-tp py-4 text-xs text-white/50 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 ${contact.whatsapp ? "pe-20" : ""}`}>
          <p>&copy; {new Date().getFullYear()} technicalparts.com. {t.footer.rights}</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Use
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
