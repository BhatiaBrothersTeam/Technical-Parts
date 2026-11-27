import type { Metadata } from "next";
import { CJ_BRAND, getCjCategories, getDoors, getIndustries, getProductsByBrand } from "@/lib/data";
import { DoorPageHero } from "@/components/DoorPageHero";

export const metadata: Metadata = {
  title: "C&J Packages",
  description:
    "C&J packages for oil and gas and industrial projects. Browse the packages, then send your RFQ or drawing for review.",
};

export default async function CjPackagesPage() {
  const door = getDoors().find((d) => d.id === "cj")!;
  // Only C&J products (brand match) are listed here; EPC packages stay on /epc.
  const [products, categories] = await Promise.all([getProductsByBrand(CJ_BRAND), getCjCategories()]);

  return (
    <DoorPageHero
      title={door.title}
      intro={door.intro}
      leadType={door.leadType}
      ctaLabel={door.ctaLabel}
      products={products}
      categories={categories}
      industries={getIndustries()}
    />
  );
}
