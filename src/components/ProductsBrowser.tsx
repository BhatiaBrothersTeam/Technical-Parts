"use client";

import { useMemo, useState } from "react";
import { t } from "@/lib/locale";
import { ProductCard } from "@/components/ProductCard";
import type { Category, Product } from "@/lib/types";

interface ProductsBrowserProps {
  products: Product[];
  categories: Category[];
  lockedCategory?: string;
}

export function ProductsBrowser({ products, categories, lockedCategory }: ProductsBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(lockedCategory ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || [p.name, p.part_number, p.description].join(" ").toLowerCase().includes(q);
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.products.searchPlaceholder}
          aria-label={t.products.searchPlaceholder}
        />
        {!lockedCategory && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label={t.products.filterCategory}
          >
            <option value="">{t.products.allCategories}</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <p className="text-sm text-[var(--tp-neutral-600)] mb-4">
        {filtered.length} {t.products.resultsCount}
      </p>

      {filtered.length === 0 ? (
        <p className="text-[var(--tp-neutral-600)] py-16 text-center">{t.products.noResults}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
