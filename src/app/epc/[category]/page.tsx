import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getEpcProducts } from "@/lib/data";
import { normalizeSlug } from "@/lib/woocommerce";
import { t } from "@/lib/locale";
import { PageHero } from "@/components/PageHero";
import { ProductsBrowser } from "@/components/ProductsBrowser";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description || `${category.name}: fabricated EPC packages from technicalparts.com. Submit your project requirement or RFQ.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  // C&J products live on /fabrication, not in the EPC catalogue.
  const wanted = normalizeSlug(slug);
  const products = (await getEpcProducts()).filter((p) => normalizeSlug(p.category) === wanted);
  if (products.length === 0) notFound();

  return (
    <>
      <PageHero
        eyebrow={t.products.breadcrumbRoot}
        title={category.name}
        subtitle={category.description || undefined}
        crumbs={[{ label: t.products.breadcrumbRoot, href: "/epc" }, { label: category.name }]}
      />
      <div className="container-tp section-y">
        <ProductsBrowser products={products} categories={[category]} lockedCategory={slug} />
      </div>
    </>
  );
}
