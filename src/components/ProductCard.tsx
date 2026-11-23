"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { t } from "@/lib/locale";
import { useRfq } from "@/lib/rfq-context";
import { useToast } from "@/lib/toast-context";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addLine } = useRfq();
  const { showToast } = useToast();
  const router = useRouter();
  const href = `/epc/${product.category}/${product.slug}`;

  function handleAddToRfq() {
    addLine({
      product: product.name,
      brand: product.brand,
      part_number: product.part_number,
      quantity: 1,
    });
    showToast(`${product.name} added to My RFQ`);
  }

  function handleRequestPrice() {
    addLine({
      product: product.name,
      brand: product.brand,
      part_number: product.part_number,
      quantity: 1,
    });
    router.push("/my-rfq");
  }

  return (
    <div className="card overflow-hidden flex flex-col group">
      <Link href={href} className="block relative aspect-[4/3] bg-tp-blue-light">
        <Image
          src={product.images[0]}
          alt={`${product.brand} ${product.name}`}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs font-semibold text-tp-blue uppercase tracking-wide">{product.brand}</p>
        )}
        <Link href={href} className="font-semibold text-tp-navy leading-snug mt-0.5 hover:text-tp-blue">
          {product.name}
        </Link>
        {product.part_number && (
          <p className="text-xs text-[var(--tp-neutral-600)] mt-1">{t.products.codeLabel}: {product.part_number}</p>
        )}
        {product.description && (
          <p className="text-xs text-[var(--tp-neutral-600)] mt-1 line-clamp-3">{product.description}</p>
        )}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <button type="button" onClick={handleRequestPrice} className="btn btn-primary btn-sm w-full">
            {t.products.requestPrice}
          </button>
          <button type="button" onClick={handleAddToRfq} className="btn btn-outline-navy btn-sm w-full">
            {t.products.addToRfq}
          </button>
        </div>
      </div>
    </div>
  );
}
