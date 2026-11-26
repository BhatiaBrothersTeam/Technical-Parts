import { unstable_cache } from "next/cache";
import localCategories from "@/lib/data/categories.json";
import type { Category, Product } from "@/lib/types";

export const CATALOGUE_TAG = "catalogue";

const PAGE_SIZE = 100;
const MAX_PAGES = 20;
const REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 15000;

const CATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  "piping-plant-works": "/images/photos/capability.jpg",
  "process-vessels-exchangers": "/images/photos/industry-petrochemical.jpg",
  "skids-manifolds": "/images/photos/door-equipment.jpg",
  "safety-marine-utilities": "/images/photos/industry-oilgas.jpg",
};
const DEFAULT_FALLBACK_IMAGE = "/images/photos/capability.jpg";

const SPEC_EXCLUDED = new Set(["brand", "manufacturer", "model", "part number", "part_number"]);

interface RawProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  categories: Array<{ name: string; slug: string }>;
  tags: Array<{ slug: string }>;
  brands: Array<{ name: string }>;
  images: Array<{ src: string }>;
  attributes: Array<{ name: string; options: string[] }>;
}

export function isWooConfigured(): boolean {
  return Boolean(process.env.WOOCOMMERCE_STORE_URL);
}

function baseUrl(): string {
  return (process.env.WOOCOMMERCE_STORE_URL ?? "").replace(/\/+$/, "");
}

/**
 * Hosts next/image may load product photos from: the store itself plus any
 * extra hosts in WOOCOMMERCE_IMAGE_HOSTS (comma separated, for example a CDN).
 * Must stay in sync with images.remotePatterns in next.config.ts.
 */
function allowedImageHosts(): Set<string> {
  const hosts = new Set<string>();
  try {
    hosts.add(new URL(baseUrl()).host);
  } catch {
    // an invalid store URL is reported by the fetch itself
  }
  for (const h of (process.env.WOOCOMMERCE_IMAGE_HOSTS ?? "").split(",")) {
    if (h.trim()) hosts.add(h.trim());
  }
  return hosts;
}

const warnedImageHosts = new Set<string>();

function usableImage(src: string): boolean {
  try {
    const { host } = new URL(src);
    if (allowedImageHosts().has(host)) return true;
    if (!warnedImageHosts.has(host)) {
      warnedImageHosts.add(host);
      console.warn(
        `Product images on "${host}" are not allowed, so a category photo is used instead. ` +
          `Add the host to WOOCOMMERCE_IMAGE_HOSTS to show them.`
      );
    }
  } catch {
    // relative or malformed URL: not usable with next/image
  }
  return false;
}

function authHeader(): string | null {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (!key || !secret) return null;
  return `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`;
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&nbsp;": " ",
  "&quot;": '"',
  "&#039;": "'",
  "&#8217;": "’",
  "&#8211;": "–",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

function plainText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:amp|nbsp|quot|#039|#8217|#8211|apos|lt|gt);/g, (e) => ENTITIES[e] ?? e)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * WordPress stores slugs for names with special characters percent-encoded
 * (for example "revol-%c2%b7-ep2"), while the browser and Next.js hand us the
 * decoded form. Compare everything in one decoded, lower-case form.
 */
export function normalizeSlug(value: string): string {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // malformed escape sequence: keep the value as it is
  }
  return decoded.toLowerCase();
}

async function wooFetch(path: string, authed: boolean): Promise<Response> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (authed) {
    const auth = authHeader();
    if (!auth) throw new Error("WooCommerce API keys are not configured");
    headers.Authorization = auth;
  }
  return fetch(`${baseUrl()}${path}`, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

function fromRest(p: Record<string, unknown>): RawProduct {
  const list = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  return {
    id: Number(p.id),
    name: String(p.name ?? ""),
    slug: String(p.slug ?? ""),
    sku: String(p.sku ?? ""),
    description: String(p.description ?? ""),
    short_description: String(p.short_description ?? ""),
    categories: list<{ name: string; slug: string }>(p.categories),
    tags: list<{ slug: string }>(p.tags),
    brands: list<{ name: string }>(p.brands),
    images: list<{ src: string }>(p.images),
    attributes: list<{ name: string; options?: string[] }>(p.attributes).map((a) => ({
      name: a.name,
      options: a.options ?? [],
    })),
  };
}

function fromStoreApi(p: Record<string, unknown>): RawProduct {
  const raw = fromRest(p);
  const attrs = Array.isArray(p.attributes)
    ? (p.attributes as Array<{ name: string; terms?: Array<{ name: string }> }>)
    : [];
  raw.attributes = attrs.map((a) => ({ name: a.name, options: (a.terms ?? []).map((t) => t.name) }));
  return raw;
}

async function fetchAllPages(
  pathFor: (page: number) => string,
  authed: boolean,
  map: (p: Record<string, unknown>) => RawProduct
): Promise<RawProduct[]> {
  const all: RawProduct[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await wooFetch(pathFor(page), authed);
    if (!res.ok) throw new Error(`WooCommerce responded ${res.status} for page ${page}`);
    const batch = (await res.json()) as Array<Record<string, unknown>>;
    all.push(...batch.map(map));
    if (batch.length < PAGE_SIZE) break;
  }
  return all;
}

async function loadRawProducts(): Promise<RawProduct[]> {
  if (authHeader()) {
    try {
      return await fetchAllPages(
        (page) => `/wp-json/wc/v3/products?status=publish&per_page=${PAGE_SIZE}&page=${page}`,
        true,
        fromRest
      );
    } catch (err) {
      console.error("WooCommerce REST API failed, falling back to the public Store API", err);
    }
  }
  return fetchAllPages(
    (page) => `/wp-json/wc/store/v1/products?per_page=${PAGE_SIZE}&page=${page}`,
    false,
    fromStoreApi
  );
}

function attributeValue(raw: RawProduct, ...names: string[]): string {
  const wanted = names.map((n) => n.toLowerCase());
  const hit = raw.attributes.find((a) => wanted.includes(a.name.toLowerCase()));
  return hit?.options[0]?.trim() ?? "";
}

function primaryCategory(raw: RawProduct): { name: string; slug: string } {
  const found =
    raw.categories.find((c) => c.slug !== "uncategorized") ??
    raw.categories[0] ?? { name: "Other", slug: "uncategorized" };
  return { name: found.name, slug: normalizeSlug(found.slug) };
}

function toProduct(raw: RawProduct): Product {
  const categorySlug = primaryCategory(raw).slug;
  const brand = plainText(raw.brands[0]?.name || attributeValue(raw, "Brand", "Manufacturer"));
  const description = plainText(raw.short_description) || plainText(raw.description);
  const images = raw.images.map((i) => i.src).filter((src) => src && usableImage(src));

  return {
    id: String(raw.id),
    name: plainText(raw.name),
    slug: normalizeSlug(raw.slug),
    brand,
    part_number: raw.sku || attributeValue(raw, "Part Number", "Part_Number"),
    model: attributeValue(raw, "Model"),
    category: categorySlug,
    description,
    specifications: raw.attributes
      .filter((a) => !SPEC_EXCLUDED.has(a.name.toLowerCase()) && a.options.length > 0)
      .map((a) => ({ label: plainText(a.name), value: a.options.map(plainText).join(", ") })),
    industries: raw.tags.map((t) => t.slug),
    images: images.length > 0 ? images : [CATEGORY_FALLBACK_IMAGE[categorySlug] ?? DEFAULT_FALLBACK_IMAGE],
  };
}

export interface WooCatalogue {
  products: Product[];
  categories: Category[];
}

const knownGroups = localCategories as Category[];

function buildCatalogue(raw: RawProduct[]): WooCatalogue {
  const products = raw.map(toProduct).filter((p) => p.slug && p.name);
  const live = new Set(products.map((p) => p.slug));

  const categories = new Map<string, Category>();
  for (const r of raw) {
    if (!live.has(normalizeSlug(r.slug))) continue;
    const primary = primaryCategory(r);
    if (categories.has(primary.slug)) continue;
    const known = knownGroups.find((g) => g.slug === primary.slug);
    categories.set(primary.slug, {
      id: primary.slug,
      slug: primary.slug,
      name: plainText(primary.name),
      description: known?.description ?? "",
    });
  }

  // Our own package groups keep their usual order; any other category follows alphabetically.
  const order = (slug: string) => {
    const i = knownGroups.findIndex((g) => g.slug === slug);
    return i === -1 ? knownGroups.length : i;
  };
  return {
    products,
    categories: [...categories.values()].sort(
      (a, b) => order(a.slug) - order(b.slug) || a.name.localeCompare(b.name)
    ),
  };
}

const cachedCatalogue = unstable_cache(
  async () => buildCatalogue(await loadRawProducts()),
  ["woocommerce-catalogue", baseUrl()],
  { revalidate: REVALIDATE_SECONDS, tags: [CATALOGUE_TAG] }
);

export async function fetchWooCatalogue(): Promise<WooCatalogue> {
  try {
    return await cachedCatalogue();
  } catch (err) {
    console.error("Could not load the WooCommerce catalogue", err);
    return { products: [], categories: [] };
  }
}
