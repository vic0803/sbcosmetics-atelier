"use client";

import {
  ArrowUpRight,
  ChevronDown,
  Plus,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import { BUNDLES } from "@/data/bundles";
import { getCategoryLabel, PRODUCTS, type Category } from "@/data/products";
import { assetPath } from "@/lib/assets";
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

  const activeCount =
    activeFilter === "sets" ? BUNDLES.length : filteredProducts.length;

  return (
    <div data-header-theme="paper" className="bg-paper pt-28 pb-24 lg:pt-36">
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Editorial Header */}
        <div className="flex flex-col justify-between gap-5 border-b border-line pb-7 lg:flex-row lg:items-end lg:pb-9">
          <div>
            <p className="eyebrow inline-flex items-center gap-2.5 text-ink/75">
              <span className="h-[1.5px] w-7 bg-accent" />
              <span>{t("catalog.eyebrow")}</span>
            </p>
            <h1 className="mt-2.5 font-display text-4xl leading-[0.98] font-bold tracking-[-0.015em] text-ink uppercase sm:text-5xl lg:text-6xl">
              {t("catalog.title")}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft/80 sm:text-base">
              {t("catalog.subtitle")}
            </p>
          </div>

          <Link
            href="/quiz"
            className="group inline-flex shrink-0 items-center gap-2 self-start whitespace-nowrap py-1 text-xs font-bold tracking-[0.14em] text-ink uppercase transition-colors hover:text-accent lg:self-end lg:text-[13.5px]"
          >
            <Sparkles className="h-4 w-4 text-accent" strokeWidth={2} />
            <span className="border-b border-ink/40 pb-0.5 transition-colors group-hover:border-accent">
              {t("hero.ctaSecondary")}
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Architectural Underline Filter Tabs + Sharp 90° Sort Bar */}
        <div className="mt-6 flex flex-col gap-4 border-b border-line md:flex-row md:items-end md:justify-between lg:mt-8">
          <div
            role="tablist"
            aria-label={t("catalog.title")}
            className="no-scrollbar -mx-4 flex items-center gap-6 overflow-x-auto px-4 sm:-mx-8 sm:px-8 md:mx-0 md:gap-8 md:overflow-visible md:px-0"
          >
            {filters.map((f) => {
              const active = f.key === activeFilter;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.key)}
                  className={`relative inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap pb-3.5 text-xs font-bold tracking-[0.14em] uppercase transition-colors md:text-[13px] xl:text-sm ${
                    active ? "text-ink" : "text-ink-soft/55 hover:text-ink"
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`text-[10px] font-semibold transition-colors ${
                      active ? "text-accent" : "text-muted/70"
                    }`}
                  >
                    {f.count}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="catalog-filter-underline"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-x-0 bottom-0 h-[2px] rounded-none bg-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {activeFilter !== "sets" && (
            <div className="flex items-center justify-between gap-4 pb-3 md:justify-end md:pb-2.5">
              <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase md:hidden">
                {activeCount}{" "}
                {lang === "uk" ? "позицій" : activeCount === 1 ? "item" : "items"}
              </span>

              <div className="relative flex items-center gap-2">
                <SlidersHorizontal
                  className="pointer-events-none h-3.5 w-3.5 shrink-0 text-accent"
                  strokeWidth={2}
                />
                <label htmlFor="catalog-sort" className="sr-only">
                  Sort
                </label>
                <div className="relative">
                  <select
                    id="catalog-sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKind)}
                    className="h-9 appearance-none rounded-none border border-line-strong bg-surface pr-8 pl-3 text-xs font-semibold tracking-[0.06em] text-ink transition-colors hover:border-ink focus:border-accent focus:outline-none"
                  >
                    <option value="popular">{t("catalog.sortPopular")}</option>
                    <option value="price-asc">{t("catalog.sortPriceAsc")}</option>
                    <option value="price-desc">{t("catalog.sortPriceDesc")}</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-ink/70"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid: Editorial Bundles or Editorial Products (1-Col Mobile / 2-Col Tablet / 3–4-Col Desktop) */}
        {activeFilter === "sets" ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-9 lg:grid-cols-3 lg:gap-6">
            {BUNDLES.map((bundle) => (
              <article
                key={bundle.id}
                className="group relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-none border-0 bg-espresso sm:aspect-[3/4]"
              >
                <img
                  src={bundle.image}
                  alt={bundle.name[lang]}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover:scale-[1.04]"
                />

                {/* Top subtle vignette */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/45 via-ink/15 to-transparent transition-opacity duration-400 lg:opacity-0 lg:group-hover:opacity-100" />

                {/* Resting short bottom scrim */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-ink/90 via-ink/45 to-transparent" />

                {/* Expanded hover bottom scrim */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-ink/96 via-ink/74 to-transparent transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:opacity-0 lg:group-hover:opacity-100" />

                {/* Top zone: High-contrast Dark Navy Editorial Badge */}
                <div className="relative z-10 flex items-center justify-between p-4 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-5 lg:-translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                  <span className="border-l-2 border-accent bg-ink/95 px-3 py-1.5 text-[11px] leading-none font-bold tracking-[0.16em] text-accent uppercase sm:text-[12px]">
                    {bundle.badge[lang]}
                  </span>
                </div>

                {/* Bottom zone: White Name + Aqua Price (turns white on hover) + Hover Description & 40x40 Add Button */}
                <div className="relative z-10 mt-auto p-4 sm:p-5">
                  <h2 className="line-clamp-2 font-display text-2xl leading-[1.08] font-semibold text-pearl lg:text-[26px]">
                    {bundle.name[lang]}
                  </h2>

                  <div className="grid grid-rows-[1fr] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[0fr] lg:opacity-0 lg:delay-75 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100">
                    <div className="overflow-hidden">
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed font-medium text-accent/95 lg:text-[13px]">
                        {bundle.subtitle[lang]}
                      </p>
                      <p className="mt-1 mb-2 line-clamp-2 text-xs leading-relaxed text-pearl/78 lg:mb-6 lg:text-[13px]">
                        {bundle.description[lang]}
                      </p>
                    </div>
                  </div>

                  <div className="mt-1.5 flex items-end justify-between gap-3">
                    <div className="flex items-baseline gap-2 leading-none">
                      <span className="text-lg leading-none font-semibold tracking-wide text-accent transition-colors duration-300 lg:text-[19px] lg:group-hover:text-pearl">
                        {formatPrice(bundle.bundlePrice, lang)}
                      </span>
                      <span className="text-xs leading-none text-pearl/50 line-through">
                        {formatPrice(bundle.originalPrice, lang)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addBundleToCart(bundle.id);
                        openOverlay("cart");
                      }}
                      aria-label={t("common.addToCart")}
                      className="btn-tactile flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-surface text-ink transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-accent lg:absolute lg:right-5 lg:bottom-5 lg:translate-y-3 lg:opacity-0 lg:delay-75 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                    >
                      <Plus className="h-[18px] w-[18px]" strokeWidth={1.9} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-12 rounded-none border border-line bg-surface p-10 text-center sm:p-14">
            <p className="font-display text-2xl font-bold text-ink">
              {t("catalog.empty")}
            </p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="btn-tactile mt-5 inline-flex min-h-[46px] items-center justify-center rounded-none bg-ink px-7 py-3 text-xs font-bold tracking-[0.16em] text-surface uppercase hover:bg-accent hover:text-ink"
            >
              {t("catalog.reset")}
            </button>
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-9 lg:grid-cols-4 lg:gap-5 xl:gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                layout="editorial"
                density="compact"
                heightClassName="aspect-[4/5] sm:aspect-[3/4]"
                index={idx}
              />
            ))}

            {/* 12th Editorial Slot: Coming Soon tile completing the 4×3 grid */}
            <article className="group relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-none border-0 bg-espresso sm:aspect-[3/4]">
              <img
                src={assetPath("/assets/editorial/campaign-atelier.jpg")}
                alt={
                  lang === "uk"
                    ? "Нова формула в розробці у лабораторії Sophie Bilynska"
                    : "New formula in development at Sophie Bilynska lab"
                }
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso via-ink/75 to-ink/55" />

              {/* Top Editorial Tag */}
              <div className="relative z-10 flex items-center justify-between p-4 sm:p-5">
                <span className="border-l-2 border-accent bg-ink/95 px-3 py-1.5 text-[11px] leading-none font-bold tracking-[0.16em] text-accent uppercase sm:text-[12px]">
                  {lang === "uk" ? "Coming Soon" : "Coming Soon"}
                </span>
                <Sparkles
                  className="h-4 w-4 text-accent/80"
                  strokeWidth={1.75}
                />
              </div>

              {/* Bottom Editorial Content */}
              <div className="relative z-10 mt-auto p-4 sm:p-5">
                <p className="mb-1.5 text-[10px] font-semibold tracking-[0.16em] text-accent uppercase lg:text-[11px]">
                  {lang === "uk"
                    ? "Лабораторія · Львів"
                    : "Lviv Lab · Small Batch"}
                </p>

                <h2 className="font-display text-2xl leading-[1.08] font-semibold text-pearl sm:text-[22px] lg:text-[24px] xl:text-[26px]">
                  {lang === "uk"
                    ? "Скоро нова формула"
                    : "New Formula Arriving"}
                </h2>

                <p className="mt-2 mb-5 text-xs leading-relaxed text-pearl/78 lg:text-[13px]">
                  {lang === "uk"
                    ? "Тестуємо наступний ботанічний засіб у малих партіях. Анонс релізу — першим в @sb.cosm."
                    : "Testing our next small-batch botanical formula. First launch reveal on @sb.cosm."}
                </p>

                <div className="flex items-center justify-between gap-3 border-t border-pearl/12 pt-3.5">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase transition-colors group-hover:text-pearl">
                    {lang === "uk" ? "Дізнатися першою" : "Follow Release"}
                  </span>

                  <Link
                    href="/atelier"
                    aria-label={
                      lang === "uk"
                        ? "Перейти до ательє Sophie Bilynska"
                        : "Explore Sophie Bilynska Atelier"
                    }
                    className="btn-tactile flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-pearl/35 bg-transparent text-pearl hover:border-accent hover:bg-accent hover:text-ink"
                  >
                    <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={1.9} />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}
      </section>
    </div>
  );
}
