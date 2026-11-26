import Link from "next/link";
import { t } from "@/lib/locale";

export default function NotFound() {
  return (
    <section className="page-banner">
      <div className="container-tp relative z-10 py-24 md:py-32 text-center">
        <p className="text-7xl md:text-8xl font-extrabold text-tp-accent mb-4">404</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">{t.notFound.title}</h1>
        <p className="text-white/75 mb-8 max-w-md mx-auto">{t.notFound.copy}</p>
        <Link href="/" className="btn btn-accent">
          {t.notFound.cta}
        </Link>
      </div>
    </section>
  );
}
