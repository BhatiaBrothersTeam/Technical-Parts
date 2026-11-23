import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { t } from "@/lib/locale";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ProductCard } from "@/components/ProductCard";
import type { LeadType, Product } from "@/lib/types";

interface DoorPageHeroProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  intro: string;
  points: string[];
  leadType: LeadType;
  ctaLabel: string;
  showProjectFields?: boolean;
  showTechnicalFields?: boolean;
  products?: Product[];
  productsHeading?: string;
}

export function DoorPageHero({
  icon: Icon,
  title,
  intro,
  points,
  leadType,
  ctaLabel,
  showProjectFields,
  showTechnicalFields,
  products,
  productsHeading,
}: DoorPageHeroProps) {
  return (
    <div className="container-tp section-y">
      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <div className="h-12 w-12 rounded-lg bg-tp-blue-light text-tp-blue flex items-center justify-center mb-4">
            <Icon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-tp-navy mb-1">{title}</h1>
          <span className="badge-sample mb-4 inline-flex">{t.doors.sampleNotice}</span>
          <p className="text-[var(--tp-neutral-600)] max-w-xl mb-6">{intro}</p>
          <ul className="space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-tp-navy">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-tp-blue shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {products && products.length > 0 && (
            <div className="mt-8">
              <p className="form-label">{productsHeading ?? "Related products"}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {products.slice(0, 2).map((product) => (
                  <Link
                    key={product.id}
                    href={`/epc/${product.category}/${product.slug}`}
                    className="card flex items-center gap-3 p-3 hover:border-tp-blue/40 hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden bg-tp-blue-light">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      {product.part_number && (
                        <p className="text-xs font-semibold text-tp-blue uppercase tracking-wide truncate">
                          {product.part_number}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-tp-navy truncate">{product.name}</p>
                      <span className="link-blue text-xs">{t.products.requestPrice} &rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
              <a href="#related-products" className="link-blue text-sm mt-3 inline-block">
                See all {products.length} &rarr;
              </a>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <EnquiryForm
            leadType={leadType}
            heading={t.doors.formHeading}
            showProjectFields={showProjectFields}
            showTechnicalFields={showTechnicalFields}
            submitLabel={ctaLabel}
          />
        </div>
      </div>

      {products && products.length > 0 && (
        <div id="related-products" className="mt-16 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-tp-navy">{productsHeading ?? "Related Products"}</h2>
            <Link href="/epc" className="link-blue text-sm">
              {t.home.viewAllPackages}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
