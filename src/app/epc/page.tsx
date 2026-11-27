import type { Metadata } from "next";
import { getDoors, getEpcCategories, getEpcProducts } from "@/lib/data";
import { DoorPageHero } from "@/components/DoorPageHero";
import { t } from "@/lib/locale";

export const metadata: Metadata = {
  title: "EPC Packages",
  description: t.products.metaDescription,
};

export default async function PackagesPage() {
  const door = getDoors().find((d) => d.id === "epc")!;
  // C&J products belong to /cj-packages and never appear in the EPC catalogue.
  const [products, categories] = await Promise.all([getEpcProducts(), getEpcCategories()]);

  return (
    <DoorPageHero
      title={door.title}
      intro={door.intro}
      leadType={door.leadType}
      ctaLabel={door.ctaLabel}
      products={products}
      categories={categories}
      emptyHeading={t.products.emptyHeading}
      emptyCopy={t.products.emptyCopy}
    />
  );
}
