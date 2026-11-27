"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { t } from "@/lib/locale";
import { ProductCard } from "@/components/ProductCard";
import { IconSearch } from "@/components/icons";
import type { Category, Industry, Product } from "@/lib/types";

interface ProductsBrowserProps {
  products: Product[];
  categories: Category[];
  industries?: Industry[];
  lockedCategory?: string;
}

export function ProductsBrowser({ products, categories, industries = [], lockedCategory }: ProductsBrowserProps) {
  const params = useSearchParams();
  const initialIndustry = params?.get("industry") ?? "";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(lockedCategory ?? "");
  const [industry, setIndustry] = useState(industries.some((i) => i.slug === initialIndustry) ? initialIndustry : "");

  const names = useMemo(() => new Map(categories.map((c) => [c.slug, c.name])), [categories]);
  const industryName = industries.find((i) => i.slug === industry)?.name;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || [p.name, p.part_number, p.description].join(" ").toLowerCase().includes(q);
      const matchesCategory = !category || p.category === category;
      const matchesIndustry = !industry || p.industries.includes(industry);
      return matchesQuery && matchesCategory && matchesIndustry;
    });
  }, [products, query, category, industry]);

  const filtering = query.trim() !== "" || (category !== "" && !lockedCategory) || industry !== "";

  return (
    <div>
      <div className="card p-3 sm:p-4 mb-6 grid gap-3 sm:grid-cols-[1fr_16rem] items-center">
        <div className="relative">
          <IconSearch className="absolute top-1/2 -translate-y-1/2 start-3.5 h-5 w-5 text-[var(--tp-neutral-600)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.products.searchPlaceholder}
            aria-label={t.products.searchPlaceholder}
            className="ps-11"
          />
        </div>
        {!lockedCategory && categories.length > 1 && (
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

      <div className="flex flex-wrap items-center justify-between gap-2 mb-5 text-sm text-[var(--tp-neutral-600)]">
        <p className="flex flex-wrap items-center gap-2">
          <span>
            <strong className="text-tp-navy">{filtered.length}</strong> {t.products.resultsCount}
          </span>
          {industryName && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-tp-blue-light text-tp-blue font-semibold px-3 py-1">
              {industryName}
              <button
                type="button"
                onClick={() => setIndustry("")}
                aria-label={`Remove ${industryName} filter`}
                className="text-base leading-none hover:text-tp-navy"
              >
                &times;
              </button>
            </span>
          )}
        </p>
        {filtering && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIndustry("");
              if (!lockedCategory) setCategory("");
            }}
            className="link-blue"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--tp-neutral-600)] py-16 text-center">{t.products.noResults}</p>
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={lockedCategory ? undefined : names.get(product.category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
