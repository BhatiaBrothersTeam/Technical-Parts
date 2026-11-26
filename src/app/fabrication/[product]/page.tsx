import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByBrand, CJ_BRAND } from "@/lib/data";
import { isCjProduct } from "@/lib/product-links";
import { ProductDetailView } from "@/components/ProductDetailView";

interface PageProps {
  params: Promise<{ product: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product: slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !isCjProduct(product)) return {};
  return {
    title: `${product.name} | C&J Fabrication`,
    description: product.description || `${product.name}. Send your requirement to technicalparts.com.`,
  };
}

export default async function CjProductPage({ params }: PageProps) {
  const { product: slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !isCjProduct(product)) notFound();

  const related = (await getProductsByBrand(CJ_BRAND))
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailView
      product={product}
      related={related}
      leadType="cj_enquiry"
      rootHref="/fabrication"
      rootLabel="C&J Fabrication"
    />
  );
}
