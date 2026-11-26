import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { t } from "@/lib/locale";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { IconShieldCheck } from "@/components/icons";
import type { Category, LeadType, Product } from "@/lib/types";

interface DoorPageHeroProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  intro: string;
  points: string[];
  leadType: LeadType;
  ctaLabel: string;
  showProjectFields?: boolean;
  showTechnicalFields?: boolean;
  products?: Product[];
  productsHeading?: string;
  categories?: Category[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function DoorPageHero({
  title,
  intro,
  points,
  leadType,
  ctaLabel,
  showProjectFields,
  showTechnicalFields,
  products,
  productsHeading,
  categories,
  viewAllHref,
  viewAllLabel,
}: DoorPageHeroProps) {
  const hasProducts = !!products && products.length > 0;

  return (
    <>
      <PageHero eyebrow="Division" title={title} subtitle={intro} crumbs={[{ label: title }]}>
        <a href="#enquiry" className="btn btn-accent">
          {ctaLabel} <span aria-hidden>&darr;</span>
        </a>
        {hasProducts && (
          <a href="#related-products" className="btn btn-outline">
            Browse {products.length} packages
          </a>
        )}
      </PageHero>

      <div className="container-tp section-y">
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-3">
            <h2 className="section-title mb-6">What you get</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {points.map((point) => (
                <li key={point} className="card card-hover p-5 flex items-start gap-3">
                  <span className="h-9 w-9 shrink-0 rounded-lg bg-tp-blue-light text-tp-blue flex items-center justify-center">
                    <IconShieldCheck className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium text-tp-navy">{point}</span>
                </li>
              ))}
            </ul>

            {categories && categories.length > 0 && (
              <div className="mt-10">
                <p className="eyebrow mb-4">Browse by category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <a
                      key={c.slug}
                      href={`#${c.slug}`}
                      className="text-sm font-semibold text-tp-navy bg-white border border-[var(--tp-neutral-200)] hover:border-tp-blue hover:text-tp-blue shadow-sm transition-colors rounded-full px-4 py-2"
                    >
                      {c.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div id="enquiry" className="lg:col-span-2 scroll-mt-40">
            <EnquiryForm
              leadType={leadType}
              heading={t.doors.formHeading}
              showProjectFields={showProjectFields}
              showTechnicalFields={showTechnicalFields}
              submitLabel={ctaLabel}
            />
          </div>
        </div>
      </div>

      {hasProducts && (
        <section id="related-products" className="bg-[var(--tp-neutral-50)] section-y scroll-mt-24">
          <div className="container-tp">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <p className="eyebrow mb-3">Catalogue</p>
                <h2 className="section-title">{productsHeading ?? "Related Products"}</h2>
              </div>
              {viewAllHref && (
                <Link href={viewAllHref} className="link-blue text-sm">
                  {viewAllLabel ?? t.home.viewAllPackages}
                </Link>
              )}
            </div>
            {(() => {
              const order = new Map((categories ?? []).map((c, i) => [c.slug, i]));
              const names = new Map((categories ?? []).map((c) => [c.slug, c.name]));
              const sorted = [...products].sort(
                (x, y) => (order.get(x.category) ?? 999) - (order.get(y.category) ?? 999)
              );
              const seen = new Set<string>();
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {sorted.map((product) => {
                    const first = !seen.has(product.category);
                    seen.add(product.category);
                    return (
                      <div
                        key={product.id}
                        id={first ? product.category : undefined}
                        className="scroll-mt-40 [&>div]:h-full"
                      >
                        <ProductCard product={product} categoryName={names.get(product.category)} />
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </section>
      )}
    </>
  );
}
