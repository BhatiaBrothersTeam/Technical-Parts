import type { MetadataRoute } from "next";
import { CJ_BRAND, getProductsByBrand } from "@/lib/data";
import { siteUrl } from "@/lib/contact";

export const revalidate = 3600;

const PAGES: Array<{ path: string; priority: number }> = [
  { path: "", priority: 1 },
  { path: "/cj-packages", priority: 0.9 },
  { path: "/epc", priority: 0.7 },
  { path: "/industries", priority: 0.6 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/rfq", priority: 0.5 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  // If WooCommerce is unreachable at build time the static pages still go out.
  const products = await getProductsByBrand(CJ_BRAND).catch(() => []);

  return [
    ...PAGES.map((p) => ({ url: `${base}${p.path}`, lastModified: now, priority: p.priority })),
    ...products.map((p) => ({
      url: `${base}/cj-packages/${p.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
