import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getEpcProducts, getProductBySlug } from "@/lib/data";
import { isCjProduct } from "@/lib/product-links";
import { normalizeSlug } from "@/lib/woocommerce";
import { ProductDetailView } from "@/components/ProductDetailView";
import { t } from "@/lib/locale";

interface PageProps {
  params: Promise<{ category: string; product: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product: slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || isCjProduct(product)) return {};
  return {
    title: [product.brand, product.name].filter(Boolean).join(" "),
    description: product.description || `${product.name}. Submit your project requirement to technicalparts.com.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { category: categorySlug, product: slug } = await params;
  const [product, category] = await Promise.all([getProductBySlug(slug), getCategoryBySlug(categorySlug)]);
  // C&J products are never served under /epc.
  if (!product || !category || isCjProduct(product) || normalizeSlug(product.category) !== normalizeSlug(categorySlug)) {
    notFound();
  }

  const related = (await getEpcProducts())
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailView
      product={product}
      related={related}
      leadType="epc_enquiry"
      rootHref="/epc"
      rootLabel={t.products.breadcrumbRoot}
      group={{ href: `/epc/${category.slug}`, label: category.name }}
    />
  );
}
