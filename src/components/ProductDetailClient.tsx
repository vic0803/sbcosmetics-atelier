"use client";

import {
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import {
  getCategoryLabel,
  getRitualPairings,
  getStepLabel,
  type Product,
} from "@/data/products";
import { formatPrice } from "@/lib/format";

export function ProductDetailClient({ product }: { product: Product }) {
  const {
    lang,
    t,
    addProductToCart,
    toggleWishlist,
    isWishlisted,
    openOverlay,
  } = useStore();

  const [activeImage, setActiveImage] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string>("benefits");

  const variant = product.variants[variantIndex] ?? product.variants[0];
  const unitPrice = variant ? variant.price : product.price;
  const liked = isWishlisted(product.id);
  const pairings = getRitualPairings(product);

  const handleAdd = () => {
    addProductToCart(product.id, qty, variantIndex);
    openOverlay("cart");
  };

  return (
    <div
      data-header-theme="paper"
      className="bg-paper pt-28 pb-28 lg:pt-36 lg:pb-24"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 border-b border-line pb-4 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase"
        >
          <Link href="/" className="transition-colors hover:text-ink">
            Sophie Bilynska
          </Link>
          <span className="text-line-strong">/</span>
          <Link href="/catalog" className="transition-colors hover:text-ink">
            {t("nav.catalog")}
          </Link>
          <span className="text-line-strong">/</span>
          <Link
            href={`/catalog?category=${product.category}`}
            className="transition-colors hover:text-ink"
          >
            {getCategoryLabel(product.category, lang)}
          </Link>
          <span className="text-line-strong">/</span>
          <span className="text-ink">
            {product.line ? product.line[lang] : product.name[lang]}
          </span>
        </nav>

        {/* Main 2-Column PDP */}
        <div className="mt-7 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Sharp 90° Full-Bleed Editorial Gallery */}
          <div className="lg:col-span-6">
            <div className="sticky top-28 space-y-3">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-none border-0 bg-espresso sm:aspect-[3/4]">
                <img
                  src={product.gallery[activeImage] ?? product.image}
                  alt={product.name[lang]}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover:scale-[1.03]"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 border-l-2 border-accent bg-ink/95 px-3.5 py-1.5 text-[11px] leading-none font-bold tracking-[0.16em] text-accent uppercase sm:top-5 sm:left-5 sm:text-[12px]">
                    {product.badge === "bestseller"
                      ? lang === "uk"
                        ? "Хіт"
                        : "Hit"
                      : "New"}
                  </span>
                )}
              </div>

              {product.gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:flex">
                  {product.gallery.map((src, idx) => (
                    <button
                      key={`${src}-${idx}`}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      aria-label={`${product.name[lang]} — ${idx + 1}`}
                      className={`relative aspect-[3/4] overflow-hidden rounded-none border-2 bg-espresso transition-all sm:h-24 sm:w-[72px] sm:aspect-auto ${
                        activeImage === idx
                          ? "border-accent opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Editorial Info, Buy Box, Key Actives & Accordions */}
          <div className="lg:col-span-6">
            <p className="eyebrow inline-flex items-center gap-2.5 text-ink/75">
              <span className="h-[1.5px] w-7 bg-accent" />
              <span>{getStepLabel(product.ritualStep, lang)}</span>
            </p>

            <h1 className="mt-3 font-display text-3xl leading-[1.02] font-bold tracking-[-0.015em] text-ink uppercase sm:text-4xl lg:text-5xl">
              {product.name[lang]}
            </h1>

            {/* Rating + Texture */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-muted">
              <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                {product.rating.toFixed(2)}
                <span className="font-normal text-muted">
                  ({product.reviews} {t("pdp.reviewsLabel")})
                </span>
              </span>
              <span className="text-accent">·</span>
              <span>{product.texture[lang]}</span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3 border-y border-line py-5">
              <span className="font-display text-3xl leading-none font-bold tracking-[-0.01em] text-ink sm:text-4xl">
                {formatPrice(unitPrice, lang)}
              </span>
              <span className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                {variant?.label[lang]}
              </span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-ink-soft/85 sm:text-base">
              {product.shortTagline[lang]}
            </p>

            {/* Variant Picker (90° Architectural Tiles) */}
            <div className="mt-7">
              <p className="eyebrow text-muted">{t("pdp.volume")}</p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {product.variants.map((v, idx) => {
                  const selected = idx === variantIndex;
                  return (
                    <button
                      key={v.label.uk}
                      type="button"
                      onClick={() => setVariantIndex(idx)}
                      className={`btn-tactile min-h-[44px] rounded-none border px-5 py-2.5 text-xs font-bold tracking-[0.1em] uppercase ${
                        selected
                          ? "border-ink bg-ink text-pearl"
                          : "border-line-strong bg-surface text-ink hover:border-ink"
                      }`}
                    >
                      <span>{v.label[lang]}</span>
                      <span
                        className={`mx-2 ${
                          selected ? "text-accent" : "text-line-strong"
                        }`}
                      >
                        ·
                      </span>
                      <span>{formatPrice(v.price, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Primary CTA + Square Wishlist (strict 90°) */}
            <div className="mt-7 flex flex-wrap items-stretch gap-3">
              <div className="flex h-[54px] items-center rounded-none border border-line-strong bg-surface">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-full w-12 items-center justify-center text-ink transition-colors hover:text-accent"
                >
                  <Minus className="h-4 w-4" strokeWidth={1.9} />
                </button>
                <span className="min-w-8 text-center text-sm font-bold text-ink">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex h-full w-12 items-center justify-center text-ink transition-colors hover:text-accent"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.9} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="btn-tactile flex min-h-[54px] flex-1 items-center justify-center gap-2.5 rounded-none bg-ink px-6 py-3.5 text-xs font-bold tracking-[0.16em] text-pearl uppercase hover:bg-accent hover:text-ink"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={1.9} />
                <span className="truncate">
                  {t("common.addToCart")} — {formatPrice(unitPrice * qty, lang)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={t("common.savedToWishlist")}
                className={`btn-tactile flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-none border ${
                  liked
                    ? "border-ink bg-ink text-accent"
                    : "border-line-strong bg-surface text-ink hover:border-ink"
                }`}
              >
                <Heart
                  className="h-5 w-5"
                  strokeWidth={1.75}
                  fill={liked ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Trust Micro-bar (Sharp 90° Architectural Split) */}
            <div className="mt-6 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
              <div className="flex items-center gap-3 bg-surface px-4 py-3.5 text-xs font-medium text-ink-soft">
                <Truck className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.8} />
                <span>
                  {lang === "uk" ? "Нова Пошта · 1–2 дні" : "Nova Poshta · 1–2 days"}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-surface px-4 py-3.5 text-xs font-medium text-ink-soft">
                <ShieldCheck
                  className="h-4 w-4 shrink-0 text-accent"
                  strokeWidth={1.8}
                />
                <span>
                  {lang === "uk" ? "Свіжа мала партія · Львів" : "Fresh small batch · Lviv"}
                </span>
              </div>
            </div>

            {/* KEY ACTIVES: Architectural Numbered Cards */}
            <div className="mt-10">
              <p className="eyebrow inline-flex items-center gap-2 text-ink/75">
                <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                <span>{t("pdp.keyActives")}</span>
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.actives.map((act, idx) => (
                  <div
                    key={act.id}
                    className="rounded-none border border-line border-l-2 border-l-accent bg-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
                        {act.role[lang]}
                      </p>
                      <span className="text-[10px] font-bold tracking-[0.14em] text-muted/60">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-lg leading-snug font-bold text-ink">
                      {act.name[lang]}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                      {act.note[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accordions: Benefits / Usage / INCI / Delivery */}
            <div className="mt-10 divide-y divide-line border-y border-line">
              {(
                [
                  {
                    key: "benefits",
                    title: t("pdp.benefits"),
                    content: (
                      <ul className="space-y-2.5 text-sm text-ink-soft">
                        {product.benefits[lang].map((b) => (
                          <li key={b} className="flex items-start gap-2.5">
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                              strokeWidth={2.2}
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    key: "usage",
                    title: t("pdp.usage"),
                    content: (
                      <p className="text-sm leading-relaxed text-ink-soft">
                        {product.usage[lang]}
                      </p>
                    ),
                  },
                  {
                    key: "inci",
                    title: t("pdp.inci"),
                    content: (
                      <p className="font-mono text-xs leading-relaxed text-muted">
                        {product.inci}
                      </p>
                    ),
                  },
                  {
                    key: "delivery",
                    title: t("pdp.delivery"),
                    content: (
                      <p className="text-sm leading-relaxed text-ink-soft">
                        {t("pdp.deliveryText")}
                      </p>
                    ),
                  },
                ] as const
              ).map((sec) => {
                const isOpen = openAccordion === sec.key;
                return (
                  <div key={sec.key}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordion(isOpen ? "" : sec.key)
                      }
                      aria-expanded={isOpen}
                      className="flex min-h-[56px] w-full items-center justify-between py-4 text-left text-xs font-bold tracking-[0.16em] text-ink uppercase transition-colors hover:text-accent"
                    >
                      <span>{sec.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-accent" : "text-muted"
                        }`}
                        strokeWidth={2}
                      />
                    </button>
                    {isOpen && <div className="pb-5">{sec.content}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Complete the Ritual (Editorial Cards Matching Catalog & Home) */}
        {pairings.length > 0 && (
          <section className="mt-20 border-t border-line pt-14 lg:mt-24 lg:pt-16">
            <p className="eyebrow inline-flex items-center gap-2.5 text-ink/75">
              <span className="h-[1.5px] w-7 bg-accent" />
              <span>{t("pdp.pairSub")}</span>
            </p>
            <h2 className="mt-2.5 font-display text-3xl leading-[1.02] font-bold tracking-[-0.015em] text-ink uppercase sm:text-4xl">
              {t("pdp.pairTitle")}
            </h2>
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-9 lg:grid-cols-3 lg:gap-6">
              {pairings.map((item, idx) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  layout="editorial"
                  density="compact"
                  showTypeAtRest
                  heightClassName="aspect-[4/5] sm:aspect-[3/4]"
                  index={idx}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* MOBILE STICKY BUY BAR (Sharp 90°) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold tracking-[-0.01em] text-ink">
              {product.line ? product.line[lang] : product.name[lang]}
            </p>
            <p className="text-xs text-muted">
              {variant?.label[lang]} ·{" "}
              <strong className="font-bold text-ink">
                {formatPrice(unitPrice * qty, lang)}
              </strong>
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn-tactile inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-none bg-ink px-6 py-3 text-xs font-bold tracking-[0.15em] text-pearl uppercase hover:bg-accent hover:text-ink"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.9} />
            <span>{t("common.addToCart")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
