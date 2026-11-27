"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { t } from "@/lib/locale";
import { useRfq } from "@/lib/rfq-context";
import { IconBox } from "@/components/icons";

const navItems = [
  { href: "/", label: t.header.nav.home },
  { href: "/cj-packages", label: t.header.nav.fabrication },
  { href: "/epc", label: t.header.nav.packages },
  { href: "/industries", label: t.header.nav.industries },
  { href: "/about", label: t.header.nav.about },
  { href: "/contact", label: t.header.nav.contact },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useRfq();
  const pathname = usePathname() ?? "/";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[var(--tp-neutral-200)] shadow-sm">
      <div className="container-tp flex items-center gap-4 h-16 md:h-[4.5rem]">
        <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setMenuOpen(false)}>
          <span
            aria-hidden
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-tp-blue to-tp-navy text-white flex items-center justify-center font-extrabold text-sm shadow-md"
          >
            tp
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg md:text-xl font-extrabold text-tp-navy tracking-tight font-[family-name:var(--font-heading)]">
              technicalparts<span className="text-tp-blue">.com</span>
            </span>
            <span className="hidden xl:block text-[0.62rem] uppercase tracking-[0.14em] text-[var(--tp-neutral-600)] mt-1">
              {t.brand.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ms-auto text-sm" aria-label="Main">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-2.5 xl:px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? "text-tp-blue bg-tp-blue-light"
                    : "text-[var(--tp-neutral-700)] hover:text-tp-blue hover:bg-[var(--tp-neutral-50)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 ms-auto lg:ms-2">
          <Link
            href="/my-rfq"
            className="relative flex items-center gap-2 text-tp-navy font-semibold text-sm hover:text-tp-blue"
            aria-label={`${t.header.myRfq} (${count})`}
          >
            <IconBox className="h-6 w-6" />
            <span className="hidden xl:inline">{t.header.myRfq}</span>
            {count > 0 && (
              <span className="absolute -top-2 -end-2.5 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-tp-accent text-tp-navy-dark text-xs font-bold">
                {count}
              </span>
            )}
          </Link>

          <Link href="/rfq" className="btn btn-primary btn-sm hidden sm:inline-flex">
            {t.header.sendRfq}
          </Link>

          <button
            type="button"
            className="lg:hidden p-2 -me-2"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="block w-6 h-0.5 bg-tp-navy mb-1.5" />
            <span className="block w-6 h-0.5 bg-tp-navy mb-1.5" />
            <span className="block w-6 h-0.5 bg-tp-navy" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-[var(--tp-neutral-200)] bg-white">
          <div className="container-tp py-3 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-3 font-semibold border-b border-[var(--tp-neutral-100)] ${
                  isActive(pathname, item.href) ? "text-tp-blue" : "text-tp-navy"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/rfq" className="btn btn-primary mt-4 mb-1 justify-center" onClick={() => setMenuOpen(false)}>
              {t.header.sendRfq}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
