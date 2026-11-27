import type { Product } from "@/lib/types";

/**
 * Brand marker for C&J Packages products. Safe to import from client
 * components (no server-only code here).
 */
export const CJ_BRAND = "C&J";

export function isCjProduct(product: Pick<Product, "brand">): boolean {
  return product.brand.toLowerCase().includes(CJ_BRAND.toLowerCase());
}

/** C&J products live under /cj-packages, EPC packages under /epc. */
export function productHref(product: Pick<Product, "brand" | "category" | "slug">): string {
  return isCjProduct(product)
    ? `/cj-packages/${product.slug}`
    : `/epc/${product.category}/${product.slug}`;
}
