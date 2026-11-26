import Link from "next/link";
import { t } from "@/lib/locale";
import { IconLinkedin, IconYoutube, IconWhatsapp, IconGlobe } from "@/components/icons";

const social = [
  { href: "https://www.linkedin.com", label: "LinkedIn", Icon: IconLinkedin },
  { href: "https://www.youtube.com", label: "YouTube", Icon: IconYoutube },
  { href: "https://wa.me/97141234567", label: "WhatsApp", Icon: IconWhatsapp },
];

export function Footer() {
  return (
    <footer>
      {/* Call to action band */}
      <section className="bg-gradient-to-r from-tp-blue to-tp-navy text-white">
        <div className="container-tp py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Have a project in mind?</h2>
            <p className="text-white/80 mt-1">Send your drawings or requirement and our team will review it.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/rfq" className="btn btn-accent">
              {t.header.sendRfq} <span aria-hidden>&rarr;</span>
            </Link>
            <Link href="/contact" className="btn btn-outline">
              {t.header.contactUs}
            </Link>
          </div>
        </div>
      </section>

      <div className="relative bg-tp-navy-dark text-white/75 text-sm overflow-hidden">
        <IconGlobe className="hidden md:block absolute -bottom-16 -end-16 h-72 w-72 text-white/[0.04]" />

        <div className="container-tp relative py-14 grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
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
            <p className="text-white/70 max-w-sm mb-5">{t.about.intro}</p>
            <div className="flex items-center gap-3">
              {social.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-tp-accent hover:text-tp-navy-dark transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{t.footer.quickLinks}</h3>
            <ul className="space-y-2.5">
              <li><Link href="/fabrication" className="hover:text-white">{t.header.nav.fabrication}</Link></li>
              <li><Link href="/epc" className="hover:text-white">{t.header.nav.packages}</Link></li>
              <li><Link href="/projects" className="hover:text-white">{t.header.nav.projects}</Link></li>
              <li><Link href="/industries" className="hover:text-white">{t.header.nav.industries}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{t.footer.resources}</h3>
            <ul className="space-y-2.5">
              <li><Link href="/rfq" className="hover:text-white">Upload RFQ</Link></li>
              <li><Link href="/my-rfq" className="hover:text-white">My RFQ</Link></li>
              <li><Link href="/about" className="hover:text-white">{t.header.nav.about}</Link></li>
              <li><Link href="/contact" className="hover:text-white">{t.header.nav.contact}</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{t.footer.contact}</h3>
            <address className="not-italic space-y-2 text-white/70">
              <p>{t.brand.group}</p>
              <p>Dubai, United Arab Emirates</p>
              <p>P.O. Box 12345 <span className="badge-sample align-middle ms-1">{t.common.sample}</span></p>
              <p>+971 4 123 4567 <span className="badge-sample align-middle ms-1">{t.common.sample}</span></p>
              <p>info@technicalparts.com <span className="badge-sample align-middle ms-1">{t.common.sample}</span></p>
            </address>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="container-tp py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
            <p>&copy; {new Date().getFullYear()} technicalparts.com. {t.footer.rights}</p>
            <div className="flex gap-5">
              <span>{t.footer.privacy}</span>
              <span>{t.footer.terms}</span>
              <span>{t.header.langEn} | {t.header.langAr}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
