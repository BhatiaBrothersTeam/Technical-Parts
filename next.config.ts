import type { NextConfig } from "next";

type Pattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const remotePatterns: Pattern[] = [];

function allow(urlLike: string) {
  try {
    const { protocol, hostname, port } = new URL(urlLike);
    remotePatterns.push({ protocol: protocol.replace(":", "") as "http" | "https", hostname, port });
  } catch {
    console.warn(`"${urlLike}" is not a valid URL; its images will not load.`);
  }
}

// Must stay in sync with allowedImageHosts() in src/lib/woocommerce.ts.
if (process.env.WOOCOMMERCE_STORE_URL) allow(process.env.WOOCOMMERCE_STORE_URL);
for (const host of (process.env.WOOCOMMERCE_IMAGE_HOSTS ?? "").split(",")) {
  if (host.trim()) allow(`https://${host.trim()}`);
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
  experimental: {
    // The production build cache stores the values of every env var the build
    // reads (including WooCommerce keys and the bb-leads secret) in
    // .next/cache. Hosts such as Netlify scan build files for secrets and fail
    // the deploy, so do not write it. Dev keeps its own cache.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
