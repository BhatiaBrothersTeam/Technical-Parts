import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { t } from "@/lib/locale";
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

  const products = await getProductsByCategory(slug);

  return (
    <div className="container-tp section-y">
      <nav className="text-sm text-[var(--tp-neutral-600)] mb-3" aria-label="Breadcrumb">
        <Link href="/epc" className="link-blue">
          {t.products.breadcrumbRoot}
        </Link>{" "}
        / {category.name}
      </nav>
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-[var(--tp-neutral-600)] mb-8 max-w-2xl">{category.description}</p>
      )}
      <ProductsBrowser products={products} categories={[category]} lockedCategory={slug} />
    </div>
  );
}
