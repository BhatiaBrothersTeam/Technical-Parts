"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { t } from "@/lib/locale";
import { useRfq } from "@/lib/rfq-context";
import { IconSearch, IconBox } from "@/components/icons";

const navItems = [
  { href: "/", label: t.header.nav.home },
  { href: "/fabrication", label: t.header.nav.fabrication },
  { href: "/epc", label: t.header.nav.packages },
  { href: "/projects", label: t.header.nav.projects },
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm">
      <div className="border-b border-[var(--tp-neutral-200)]">
        <div className="container-tp flex items-center gap-5 py-3.5">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span
              aria-hidden
              className="h-10 w-10 rounded-xl bg-gradient-to-br from-tp-blue to-tp-navy text-white flex items-center justify-center font-extrabold text-sm shadow-md"
            >
              tp
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-xl md:text-2xl font-extrabold text-tp-navy tracking-tight font-[family-name:var(--font-heading)]">
                technicalparts<span className="text-tp-blue">.com</span>
              </span>
              <span className="hidden md:block text-[0.68rem] uppercase tracking-[0.14em] text-[var(--tp-neutral-600)] mt-1">
                {t.brand.tagline}
              </span>
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl relative ms-4">
            <IconSearch className="absolute top-1/2 -translate-y-1/2 start-4 h-5 w-5 text-[var(--tp-neutral-600)]" />
            <input
              type="search"
              placeholder={t.header.searchPlaceholder}
              className="ps-12 py-2.5 text-base rounded-full bg-[var(--tp-neutral-50)]"
              aria-label={t.header.searchPlaceholder}
            />
          </div>

          <div className="hidden lg:flex items-center gap-5 text-sm shrink-0 ms-auto">
            <button
              type="button"
              title={t.header.langArComingSoon}
              className="font-semibold text-[var(--tp-neutral-700)]"
            >
              {t.header.langEn} <span className="text-[var(--tp-neutral-200)]">|</span>{" "}
              <span className="opacity-60">{t.header.langAr}</span>
            </button>
            <Link href="/contact" className="font-semibold text-[var(--tp-neutral-700)] hover:text-tp-blue">
              {t.header.contactUs}
            </Link>
          </div>

          <Link
            href="/my-rfq"
            className="relative flex items-center gap-2 text-tp-navy font-semibold text-sm shrink-0 ms-auto lg:ms-0 hover:text-tp-blue"
            aria-label={`${t.header.myRfq} (${count})`}
          >
            <IconBox className="h-6 w-6" />
            <span className="hidden sm:inline">{t.header.myRfq}</span>
            {count > 0 && (
              <span className="absolute -top-2 -start-3 sm:start-4 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-tp-accent text-tp-navy-dark text-xs font-bold">
                {count}
              </span>
            )}
          </Link>

          <Link href="/rfq" className="btn btn-primary hidden sm:inline-flex shrink-0">
            {t.header.sendRfq}
          </Link>

          <button
            type="button"
            className="lg:hidden shrink-0 p-2 -me-2"
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

      <nav className="hidden lg:block bg-tp-navy" aria-label="Main">
        <div className="container-tp flex items-center gap-1 text-sm">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-4 py-3 font-medium transition-colors ${
                  active ? "text-white" : "text-white/75 hover:text-white"
                } after:absolute after:inset-x-4 after:bottom-0 after:h-[3px] after:rounded-t after:transition-colors ${
                  active ? "after:bg-tp-accent" : "after:bg-transparent hover:after:bg-white/30"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden border-t border-[var(--tp-neutral-200)] bg-white">
          <div className="container-tp py-3 flex flex-col gap-1">
            <div className="relative mb-2">
              <IconSearch className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-[var(--tp-neutral-600)]" />
              <input
                type="search"
                placeholder={t.header.searchPlaceholder}
                className="ps-9"
                aria-label={t.header.searchPlaceholder}
              />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-2.5 font-medium border-b border-[var(--tp-neutral-100)] ${
                  isActive(pathname, item.href) ? "text-tp-blue" : "text-tp-navy"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-3">
              <Link href="/contact" className="font-semibold text-sm text-tp-navy" onClick={() => setMenuOpen(false)}>
                {t.header.contactUs}
              </Link>
              <button type="button" className="font-semibold text-sm text-[var(--tp-neutral-700)]" title={t.header.langArComingSoon}>
                {t.header.langEn} | {t.header.langAr}
              </button>
            </div>
            <Link href="/rfq" className="btn btn-primary mt-3 justify-center" onClick={() => setMenuOpen(false)}>
              {t.header.sendRfq}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
