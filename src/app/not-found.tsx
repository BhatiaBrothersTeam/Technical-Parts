import Link from "next/link";
import { t } from "@/lib/locale";

export default function NotFound() {
  return (
    <div className="container-tp section-y text-center py-24">
      <p className="text-tp-blue font-bold text-sm mb-2">404</p>
      <h1 className="text-3xl font-bold text-tp-navy mb-3">{t.notFound.title}</h1>
      <p className="text-[var(--tp-neutral-600)] mb-8">{t.notFound.copy}</p>
      <Link href="/" className="btn btn-primary">
        {t.notFound.cta}
      </Link>
    </div>
  );
}
