import packagesData from "./packages.json";
import categoriesData from "./categories.json";
import industriesData from "./industries.json";
import doorsData from "./doors.json";
import { fetchWooCatalogue, isWooConfigured, normalizeSlug } from "@/lib/woocommerce";
import type { Product, Category, Industry, Door } from "@/lib/types";

/**
 * Single read boundary for all package/content data (spec: "All product/content
 * reads go through /lib/data only. No API calls inside pages."). A "product"
 * here is an EPC package.
 *
 * With WOOCOMMERCE_STORE_URL set, packages and their groups (categories) come
 * from WooCommerce (cached, server-side only). Without it, the bundled sample
 * packages are used so the site still runs offline. Industries and division
 * copy are site content and always come from the local JSON files.
 */

import { CJ_BRAND, isCjProduct } from "@/lib/product-links";

export { CJ_BRAND };

interface Catalogue {
  products: Product[];
  categories: Category[];
}

async function loadCatalogue(): Promise<Catalogue> {
  if (isWooConfigured()) return fetchWooCatalogue();
  return {
    products: packagesData as Product[],
    categories: categoriesData as Category[],
  };
}

export async function getProducts(): Promise<Product[]> {
  return (await loadCatalogue()).products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const wanted = normalizeSlug(slug);
  return (await getProducts()).find((p) => normalizeSlug(p.slug) === wanted);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const wanted = normalizeSlug(categorySlug);
  return (await getProducts()).filter((p) => normalizeSlug(p.category) === wanted);
}

/**
 * Curated picks by slug. When none of the slugs exist in the live catalogue,
 * falls back to the first `fallbackLimit` packages so sections never render
 * empty.
 */
export async function getProductsBySlugs(slugs: string[], fallbackLimit: number): Promise<Product[]> {
  const all = await getProducts();
  const picked = slugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
  return picked.length > 0 ? picked : all.slice(0, fallbackLimit);
}

/**
 * All packages from a given brand/manufacturer (case-insensitive substring
 * match, e.g. "C&J" matches "C&J Gulf Equipment Manufacturing L.L.C.").
 */
export async function getProductsByBrand(brand: string): Promise<Product[]> {
  const wanted = brand.trim().toLowerCase();
  if (!wanted) return [];
  return (await getProducts()).filter((p) => p.brand.toLowerCase().includes(wanted));
}

/**
 * All packages EXCEPT those from a given brand. Used to keep the general EPC
 * catalogue free of packages that belong to a brand's own dedicated page
 * (e.g. C&J Gulf's packages live on /fabrication, not /epc).
 */
export async function getProductsExcludingBrand(brand: string): Promise<Product[]> {
  const unwanted = brand.trim().toLowerCase();
  if (!unwanted) return getProducts();
  return (await getProducts()).filter((p) => !p.brand.toLowerCase().includes(unwanted));
}

/** Only the categories that still have at least one package in `products`. */
export async function getCategoriesFor(products: Product[]): Promise<Category[]> {
  const liveSlugs = new Set(products.map((p) => p.category));
  return (await getCategories()).filter((c) => liveSlugs.has(c.slug));
}

export async function getCategories(): Promise<Category[]> {
  return (await loadCatalogue()).categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const wanted = normalizeSlug(slug);
  return (await getCategories()).find((c) => normalizeSlug(c.slug) === wanted);
}

/** EPC catalogue: everything that is not a C&J product. */
export async function getEpcProducts(): Promise<Product[]> {
  return (await getProducts()).filter((x) => !isCjProduct(x));
}

/** Groups (categories) that contain at least one C&J product. */
export async function getCjCategories(): Promise<Category[]> {
  return getCategoriesFor(await getProductsByBrand(CJ_BRAND));
}

/** Groups (categories) that contain at least one EPC package. */
export async function getEpcCategories(): Promise<Category[]> {
  return getCategoriesFor(await getEpcProducts());
}

export function getIndustries(): Industry[] {
  return industriesData as Industry[];
}

export function getDoors(): Door[] {
  return doorsData as Door[];
}
