import Link from "next/link";
import { t } from "@/lib/locale";
import { IconLinkedin, IconYoutube, IconWhatsapp, IconGlobe } from "@/components/icons";

export function Footer() {
  return (
    <footer className="relative bg-tp-navy-dark text-white/80 text-sm overflow-hidden">
      <IconGlobe className="hidden md:block absolute -bottom-16 -end-16 h-72 w-72 text-white/[0.04]" />

      <div className="container-tp relative py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="text-lg font-extrabold text-white mb-1">
            technicalparts<span className="text-tp-blue">.com</span>
          </div>
          <p className="text-xs text-white/60 mb-3">{t.brand.group}</p>
          <p className="text-white/70 mb-4">{t.about.intro}</p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-tp-blue transition-colors"
            >
              <IconLinkedin className="h-4 w-4" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-tp-blue transition-colors"
            >
              <IconYoutube className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/97141234567"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-tp-blue transition-colors"
            >
              <IconWhatsapp className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">{t.footer.quickLinks}</h3>
          <ul className="space-y-2">
            <li><Link href="/epc" className="hover:text-white">{t.header.nav.packages}</Link></li>
            <li><Link href="/fabrication" className="hover:text-white">{t.header.nav.fabrication}</Link></li>
            <li><Link href="/projects" className="hover:text-white">{t.header.nav.projects}</Link></li>
            <li><Link href="/industries" className="hover:text-white">{t.header.nav.industries}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">{t.footer.resources}</h3>
          <ul className="space-y-2">
            <li><Link href="/rfq" className="hover:text-white">Upload RFQ</Link></li>
            <li><Link href="/my-rfq" className="hover:text-white">My RFQ</Link></li>
            <li><Link href="/about" className="hover:text-white">{t.header.nav.about}</Link></li>
            <li><Link href="/contact" className="hover:text-white">{t.header.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">{t.footer.contact}</h3>
          <address className="not-italic space-y-1 text-white/70">
            <p>{t.brand.group}</p>
            <p>Dubai, United Arab Emirates</p>
            <p>P.O. Box 12345 <span className="badge-sample align-middle ms-1">{t.common.sample}</span></p>
            <p>+971 4 123 4567 <span className="badge-sample align-middle ms-1">{t.common.sample}</span></p>
            <p>info@technicalparts.com <span className="badge-sample align-middle ms-1">{t.common.sample}</span></p>
          </address>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-tp py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} technicalparts.com. {t.footer.rights}</p>
          <div className="flex gap-4">
            <span>{t.footer.privacy}</span>
            <span>{t.footer.terms}</span>
            <span>{t.header.langEn} | {t.header.langAr}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
