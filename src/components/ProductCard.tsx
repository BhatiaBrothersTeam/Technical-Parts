"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { t } from "@/lib/locale";
import { useRfq } from "@/lib/rfq-context";
import { useToast } from "@/lib/toast-context";
import { productHref } from "@/lib/product-links";
import type { Product } from "@/lib/types";

export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  const { addLine } = useRfq();
  const { showToast } = useToast();
  const router = useRouter();
  const href = productHref(product);

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
    <div className="card card-hover overflow-hidden flex flex-col group">
      <Link href={href} className="block relative aspect-[4/3] bg-tp-blue-light overflow-hidden">
        <Image
          src={product.images[0]}
          alt={`${product.brand} ${product.name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {categoryName && (
          <span className="absolute top-3 start-3 text-[11px] font-semibold text-tp-navy bg-white/95 rounded-full px-2.5 py-1 shadow-sm">
            {categoryName}
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        {product.part_number && (
          <p className="text-[11px] font-bold text-tp-blue tracking-wider">{product.part_number}</p>
        )}
        <Link href={href} className="font-bold text-tp-navy leading-snug mt-1 hover:text-tp-blue text-[0.95rem]">
          {product.name}
        </Link>
        {product.description && (
          <p className="text-xs text-[var(--tp-neutral-600)] mt-2 line-clamp-3">{product.description}</p>
        )}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <button type="button" onClick={handleRequestPrice} className="btn btn-primary btn-sm w-full whitespace-normal">
            {t.products.requestPrice}
          </button>
          <button type="button" onClick={handleAddToRfq} className="btn btn-outline-navy btn-sm w-full whitespace-normal">
            {t.products.addToRfq}
          </button>
        </div>
      </div>
    </div>
  );
}
