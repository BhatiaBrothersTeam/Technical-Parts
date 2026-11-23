import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { ProductsBrowser } from "@/components/ProductsBrowser";
import { t } from "@/lib/locale";

export const metadata: Metadata = {
  title: "EPC Packages",
  description: t.products.metaDescription,
};

export default async function PackagesPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="container-tp section-y">
      <h1 className="text-3xl font-bold mb-2">{t.products.title}</h1>
      <p className="text-[var(--tp-neutral-600)] mb-8 max-w-2xl">{t.products.intro}</p>
      <ProductsBrowser products={products} categories={categories} />
    </div>
  );
}
