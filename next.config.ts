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
};

export default nextConfig;
