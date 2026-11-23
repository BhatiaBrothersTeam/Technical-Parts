"use client";

import Link from "next/link";
import { useState } from "react";
import { t } from "@/lib/locale";
import { useRfq } from "@/lib/rfq-context";
import type { Category } from "@/lib/types";
import { IconSearch, IconBox, IconChevronDown } from "@/components/icons";

const navItems = [
  { href: "/", label: t.header.nav.home },
  { href: "/epc", label: t.header.nav.packages },
  { href: "/fabrication", label: t.header.nav.fabrication },
  { href: "/projects", label: t.header.nav.projects },
  { href: "/industries", label: t.header.nav.industries },
  { href: "/about", label: t.header.nav.about },
  { href: "/contact", label: t.header.nav.contact },
];

export function Header({ categories: productCategories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { count } = useRfq();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-[var(--tp-neutral-200)]">
        <div className="container-tp flex items-center gap-5 py-4">
          <Link href="/" className="flex flex-col leading-none shrink-0">
            <span className="text-xl md:text-2xl font-extrabold text-tp-navy tracking-tight">
              technicalparts<span className="text-tp-blue">.com</span>
            </span>
            <span className="hidden md:block text-xs uppercase tracking-wide text-[var(--tp-neutral-600)] mt-1">
              {t.brand.tagline}
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl relative">
            <IconSearch className="absolute top-1/2 -translate-y-1/2 start-4 h-5 w-5 text-[var(--tp-neutral-600)]" />
            <input
              type="search"
              placeholder={t.header.searchPlaceholder}
              className="ps-12 py-3 text-base"
              aria-label={t.header.searchPlaceholder}
            />
          </div>

          <div className="hidden lg:flex items-center gap-5 text-base shrink-0">
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
            className="relative flex items-center gap-2 text-tp-navy font-semibold text-base shrink-0"
            aria-label={`${t.header.myRfq} (${count})`}
          >
            <IconBox className="h-7 w-7" />
            <span className="hidden sm:inline">{t.header.myRfq}</span>
            {count > 0 && (
              <span className="absolute -top-2 -end-2 flex h-5 w-5 items-center justify-center rounded-full bg-tp-blue text-white text-xs font-bold">
                {count}
              </span>
            )}
          </Link>

          <Link href="/rfq" className="btn btn-primary hidden sm:inline-flex shrink-0 text-base">
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

      <nav className="hidden lg:block bg-tp-navy">
        <div className="container-tp flex items-center gap-6 text-sm text-white/90">
          {navItems.map((item) =>
            item.href === "/epc" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="py-2.5 hover:text-white font-medium inline-flex items-center gap-1"
                >
                  {item.label}
                  <IconChevronDown className="h-3.5 w-3.5" />
                </Link>
                <div className="absolute top-full start-0 z-50 hidden min-w-[200px] rounded-b-lg border border-t-0 border-[var(--tp-neutral-200)] bg-white py-2 text-tp-navy shadow-lg group-hover:block">
                  <Link href="/epc" className="block px-4 py-2 text-sm font-semibold hover:bg-tp-blue-light">
                    All Packages
                  </Link>
                  {productCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/epc/${category.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-tp-blue-light"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="py-2.5 hover:text-white font-medium">
                {item.label}
              </Link>
            )
          )}
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
            {navItems.map((item) =>
              item.href === "/epc" ? (
                <div key={item.href} className="border-b border-[var(--tp-neutral-100)]">
                  <div className="flex items-center justify-between py-2">
                    <Link
                      href={item.href}
                      className="font-medium text-tp-navy"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-label="Toggle package groups"
                      aria-expanded={productsOpen}
                      onClick={() => setProductsOpen((v) => !v)}
                      className="p-1"
                    >
                      <IconChevronDown
                        className={`h-4 w-4 text-[var(--tp-neutral-600)] transition-transform ${productsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                  {productsOpen && (
                    <div className="ps-4 pb-2 flex flex-col gap-1">
                      {productCategories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/epc/${category.slug}`}
                          className="py-1.5 text-sm text-[var(--tp-neutral-600)]"
                          onClick={() => setMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 font-medium text-tp-navy border-b border-[var(--tp-neutral-100)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
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
