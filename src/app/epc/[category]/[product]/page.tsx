import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getIndustries, getProductBySlug, getProductsByCategory } from "@/lib/data";
import { isWooConfigured, normalizeSlug } from "@/lib/woocommerce";
import { SpecTable } from "@/components/SpecTable";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { t } from "@/lib/locale";

interface PageProps {
  params: Promise<{ category: string; product: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product: slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: [product.brand, product.name].filter(Boolean).join(" "),
    description: product.description || `${product.name}. Submit your project requirement to technicalparts.com.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { category: categorySlug, product: slug } = await params;
  const [product, category] = await Promise.all([getProductBySlug(slug), getCategoryBySlug(categorySlug)]);
  if (!product || !category || normalizeSlug(product.category) !== normalizeSlug(categorySlug)) notFound();

  const industries = getIndustries();
  const industryNames = product.industries
    .map((industrySlug) => industries.find((i) => i.slug === industrySlug)?.name)
    .filter((n): n is string => !!n);

  const related = (await getProductsByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-tp section-y">
      <nav className="text-sm text-[var(--tp-neutral-600)] mb-4" aria-label="Breadcrumb">
        <Link href="/epc" className="link-blue">
          {t.products.breadcrumbRoot}
        </Link>{" "}
        / <Link href={`/epc/${category.slug}`} className="link-blue">{category.name}</Link> / {product.name}
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-14">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-tp-blue-light">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority />
        </div>

        <div>
          {!isWooConfigured() && <span className="badge-sample mb-3">{t.productDetail.sampleNotice}</span>}
          {product.brand && (
            <p className="text-sm font-semibold text-tp-blue uppercase tracking-wide">{product.brand}</p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-tp-navy mt-1">{product.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--tp-neutral-600)] mt-3">
            {product.model && <span>Model: <strong className="text-tp-navy">{product.model}</strong></span>}
            {product.part_number && (
              <span>{t.products.codeLabel}: <strong className="text-tp-navy">{product.part_number}</strong></span>
            )}
          </div>
          <p className="text-[var(--tp-neutral-700)] mt-4">{product.description}</p>

          <div className="mt-6">
            <ProductActions product={product} />
          </div>

          {industryNames.length > 0 && (
            <div className="mt-6">
              <p className="form-label">{t.productDetail.industries}</p>
              <div className="flex flex-wrap gap-2">
                {industryNames.map((name) => (
                  <span key={name} className="text-xs font-medium bg-[var(--tp-neutral-100)] text-tp-navy rounded-full px-3 py-1">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-14">
        {product.features && product.features.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-tp-navy mb-3">{t.productDetail.features}</h2>
            <ul className="space-y-2 list-disc ps-5 text-[var(--tp-neutral-700)]">
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}
        {product.applications && product.applications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-tp-navy mb-3">{t.productDetail.applications}</h2>
            <ul className="space-y-2 list-disc ps-5 text-[var(--tp-neutral-700)]">
              {product.applications.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {product.specifications.length > 0 && (
        <div className="mb-14">
          <h2 className="text-lg font-bold text-tp-navy mb-3">{t.productDetail.specifications}</h2>
          <SpecTable specs={product.specifications} />
        </div>
      )}
      <div className="mb-14 max-w-3xl">
        <h2 className="text-lg font-bold text-tp-navy mb-3">{t.doors.formHeading}</h2>
        <EnquiryForm
          leadType="epc_enquiry"
          showProjectFields
          showTechnicalFields
          contextLabel={`Package: ${product.name}${product.part_number ? ` (${product.part_number})` : ""}`}
          submitLabel={t.productDetail.requestPrice}
        />
      </div>


      <div className="card p-6 bg-tp-blue-light mb-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-bold text-tp-navy">{t.productDetail.needHelp}</p>
          <p className="text-sm text-[var(--tp-neutral-600)]">{t.productDetail.needHelpCopy}</p>
        </div>
        <Link href="/contact" className="btn btn-primary shrink-0">
          {t.header.contactUs}
        </Link>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-tp-navy mb-4">{t.productDetail.relatedHeading}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
