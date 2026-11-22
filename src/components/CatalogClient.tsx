"use client";

import { ShoppingBag, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import { BUNDLES } from "@/data/bundles";
import { getCategoryLabel, PRODUCTS, type Category } from "@/data/products";
import { formatPrice } from "@/lib/format";

type FilterKind = "all" | Category | "sets";
type SortKind = "popular" | "price-asc" | "price-desc";

export function CatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, t, addBundleToCart, openOverlay } = useStore();

  const initialCat = (searchParams.get("category") ?? "all") as FilterKind;
  const activeFilter: FilterKind = ["all", "face", "body", "hair", "sets"].includes(
    initialCat
  )
    ? initialCat
    : "all";

  const [sort, setSort] = useState<SortKind>("popular");

  const setFilter = (next: FilterKind) => {
    const url = next === "all" ? "/catalog" : `/catalog?category=${next}`;
    router.replace(url, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    if (activeFilter === "sets") return [];
    const base =
      activeFilter === "all"
        ? [...PRODUCTS]
        : PRODUCTS.filter((p) => p.category === activeFilter);
    if (sort === "price-asc") return base.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return base.sort((a, b) => b.price - a.price);
    return base.sort((a, b) => b.reviews - a.reviews);
  }, [activeFilter, sort]);

  const filters: { key: FilterKind; label: string; count: number }[] = [
    { key: "all", label: t("common.all"), count: PRODUCTS.length },
    {
      key: "face",
      label: getCategoryLabel("face", lang),
      count: PRODUCTS.filter((p) => p.category === "face").length,
    },
    {
      key: "body",
      label: getCategoryLabel("body", lang),
      count: PRODUCTS.filter((p) => p.category === "body").length,
    },
    {
      key: "hair",
      label: getCategoryLabel("hair", lang),
      count: PRODUCTS.filter((p) => p.category === "hair").length,
    },
    { key: "sets", label: t("common.sets"), count: BUNDLES.length },
  ];

  return (
    <div className="pt-28 pb-24 lg:pt-36">
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 border-b border-line pb-8 lg:flex-row lg:items-end lg:pb-10">
          <div>
            <p className="eyebrow text-accent">{t("catalog.eyebrow")}</p>
            <h1 className="mt-1.5 font-display text-4xl font-bold uppercase text-ink sm:text-6xl">
              {t("catalog.title")}
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {t("catalog.subtitle")}
            </p>
          </div>

          <Link
            href="/quiz"
            className="btn-tactile inline-flex min-h-[46px] items-center gap-2 self-start rounded-full border border-accent/40 bg-accent-soft px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-accent"
          >
            <Sparkles className="h-4 w-4 text-accent" strokeWidth={2} />
            <span>{t("hero.ctaSecondary")}</span>
          </Link>
        </div>

        {/* Spring Sliding Filter Chips + Sort */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center lg:mt-8">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = f.key === activeFilter;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`relative inline-flex min-h-[42px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-[0.12em] uppercase transition-colors sm:px-5 ${
                    active
                      ? "border-ink text-surface"
                      : "border-line-strong bg-surface text-ink hover:border-accent"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="catalog-filter-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-ink"
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                  <span
                    className={`relative z-10 text-[10px] ${
                      active ? "text-accent" : "text-muted"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeFilter !== "sets" && (
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted" />
              <label htmlFor="catalog-sort" className="sr-only">
                Sort
              </label>
              <select
                id="catalog-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKind)}
                className="min-h-[42px] rounded-full border border-line-strong bg-surface px-4 py-2 text-xs font-semibold tracking-wide text-ink"
              >
                <option value="popular">{t("catalog.sortPopular")}</option>
                <option value="price-asc">{t("catalog.sortPriceAsc")}</option>
                <option value="price-desc">{t("catalog.sortPriceDesc")}</option>
              </select>
            </div>
          )}
        </div>

        {/* Grid: Bundles or 2-Col Mobile / 4-Col Desktop Products */}
        {activeFilter === "sets" ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {BUNDLES.map((bundle) => (
              <article
                key={bundle.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={bundle.image}
                    alt={bundle.name[lang]}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-accent px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-ink uppercase">
                    {bundle.badge[lang]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-2xl font-bold text-ink">
                    {bundle.name[lang]}
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-accent">
                    {bundle.subtitle[lang]}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {bundle.description[lang]}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-bold text-ink">
                        {formatPrice(bundle.bundlePrice, lang)}
                      </span>
                      <span className="text-xs text-muted line-through">
                        {formatPrice(bundle.originalPrice, lang)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addBundleToCart(bundle.id);
                        openOverlay("cart");
                      }}
                      className="btn-tactile inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-surface uppercase hover:bg-accent hover:text-ink"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>{t("common.addToCart")}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-line bg-surface p-12 text-center">
            <p className="font-display text-2xl font-bold text-ink">
              {t("catalog.empty")}
            </p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="btn-tactile mt-5 rounded-full bg-ink px-6 py-3 text-xs font-bold tracking-[0.16em] text-surface uppercase"
            >
              {t("catalog.reset")}
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-3.5 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
