"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/locale";
import { useRfq } from "@/lib/rfq-context";
import { useToast } from "@/lib/toast-context";
import type { Product } from "@/lib/types";

export function ProductActions({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addLine } = useRfq();
  const { showToast } = useToast();
  const router = useRouter();

  function line() {
    return {
      product: product.name,
      brand: product.brand,
      part_number: product.part_number,
      quantity: qty,
    };
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="form-label mb-0">
          {t.form.quantity}
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="w-20"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => {
            addLine(line());
            router.push("/my-rfq");
          }}
          className="btn btn-primary flex-1"
        >
          {t.productDetail.requestPrice}
        </button>
        <button
          type="button"
          onClick={() => {
            addLine(line());
            showToast(`${product.name} added to My RFQ`);
          }}
          className="btn btn-outline-navy flex-1"
        >
          {t.productDetail.addToRfq}
        </button>
      </div>
    </div>
  );
}
