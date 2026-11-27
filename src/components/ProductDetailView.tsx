import Image from "next/image";
import { getIndustries } from "@/lib/data";
import { isWooConfigured } from "@/lib/woocommerce";
import { SpecTable } from "@/components/SpecTable";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { PageHero } from "@/components/PageHero";
import { t } from "@/lib/locale";
import type { LeadType, Product } from "@/lib/types";

interface ProductDetailViewProps {
  product: Product;
  related: Product[];
  leadType?: LeadType;
  rootHref: string;
  rootLabel: string;
  group?: { href: string; label: string };
}

export function ProductDetailView({ product, related, rootHref, rootLabel, group }: ProductDetailViewProps) {
  const industries = getIndustries();
  const industryNames = product.industries
    .map((industrySlug) => industries.find((i) => i.slug === industrySlug)?.name)
    .filter((n): n is string => !!n);

  const crumbs = [
    { label: rootLabel, href: rootHref },
    ...(group ? [{ label: group.label, href: group.href }] : []),
    { label: product.name },
  ];

  return (
    <>
      <PageHero
        eyebrow={product.part_number ? `${t.products.codeLabel} ${product.part_number}` : rootLabel}
        title={product.name}
        crumbs={crumbs}
      />

      <div className="container-tp section-y">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 mb-16 items-start">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-tp-blue-light shadow-lg ring-1 ring-black/5">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority />
          </div>

          <div>
            {!isWooConfigured() && <span className="badge-sample mb-3">{t.productDetail.sampleNotice}</span>}
            {product.brand && (
              <p className="text-xs font-bold text-tp-blue uppercase tracking-[0.14em]">{product.brand}</p>
            )}
            <p className="text-lg text-[var(--tp-neutral-700)] mt-3 leading-relaxed">{product.description}</p>

            <div className="card p-5 mt-7">
              <ProductActions product={product} />
            </div>

            {industryNames.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {industryNames.map((name) => (
                  <span
                    key={name}
                    className="text-xs font-medium bg-[var(--tp-neutral-100)] text-tp-navy rounded-full px-3 py-1"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {((product.features && product.features.length > 0) ||
          (product.applications && product.applications.length > 0)) && (
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            {product.features && product.features.length > 0 && (
              <div className="card p-7">
                <h2 className="text-lg font-extrabold text-tp-navy mb-4">{t.productDetail.features}</h2>
                <ul className="space-y-2.5 list-disc ps-5 text-[var(--tp-neutral-700)]">
                  {product.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.applications && product.applications.length > 0 && (
              <div className="card p-7">
                <h2 className="text-lg font-extrabold text-tp-navy mb-4">{t.productDetail.applications}</h2>
                <ul className="space-y-2.5 list-disc ps-5 text-[var(--tp-neutral-700)]">
                  {product.applications.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {product.specifications.length > 0 && (
          <div className="mb-14">
            <h2 className="section-title mb-5">{t.productDetail.specifications}</h2>
            <SpecTable specs={product.specifications} />
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-6">{t.productDetail.relatedHeading}</h2>
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
