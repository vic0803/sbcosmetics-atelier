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
    <div className="pt-28 pb-28 lg:pt-32 lg:pb-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 py-4 text-xs tracking-[0.12em] text-muted uppercase"
        >
          <Link href="/" className="hover:text-ink">
            Sophie Bilynska
          </Link>
          <span>/</span>
          <Link
            href={`/catalog?category=${product.category}`}
            className="hover:text-ink"
          >
            {getCategoryLabel(product.category, lang)}
          </Link>
          <span>/</span>
          <span className="text-ink">
            {product.line ? product.line[lang] : product.name[lang]}
          </span>
        </nav>

        {/* Main 2-Column PDP */}
        <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Clean Editorial Gallery */}
          <div className="lg:col-span-6">
            <div className="sticky top-24 space-y-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-line bg-surface">
                <img
                  src={product.gallery[activeImage] ?? product.image}
                  alt={product.name[lang]}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />
                {product.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3.5 py-1.5 text-[10px] font-medium tracking-[0.16em] text-accent uppercase">
                    {product.badge === "bestseller"
                      ? lang === "uk"
                        ? "Бестселер"
                        : "Bestseller"
                      : lang === "uk"
                        ? "Новинка"
                        : "New"}
                  </span>
                )}
              </div>

              {product.gallery.length > 1 && (
                <div className="flex gap-3">
                  {product.gallery.map((src, idx) => (
                    <button
                      key={`${src}-${idx}`}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`h-20 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                        activeImage === idx
                          ? "border-accent opacity-100"
                          : "border-line opacity-65 hover:opacity-100"
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

          {/* Right: Info, Actives, Buy Box & Accordions */}
          <div className="lg:col-span-6">
            <p className="eyebrow text-accent">
              {getStepLabel(product.ritualStep, lang)}
            </p>

            <h1 className="mt-2 font-display font-bold tracking-[-0.02em] text-4xl leading-[1.08] text-ink sm:text-5xl">
              {product.name[lang]}
            </h1>

            {/* Rating + Texture */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                {product.rating.toFixed(2)} ({product.reviews} {t("pdp.reviewsLabel")})
              </span>
              <span>·</span>
              <span>{product.texture[lang]}</span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display font-bold tracking-[-0.02em] text-4xl text-ink">
                {formatPrice(unitPrice, lang)}
              </span>
              <span className="text-xs tracking-[0.14em] text-muted uppercase">
                {variant?.label[lang]}
              </span>
            </div>

            <p className="mt-4 text-base leading-relaxed text-ink-soft/85">
              {product.shortTagline[lang]}
            </p>

            {/* Variant Picker */}
            <div className="mt-7">
              <p className="eyebrow text-muted">{t("pdp.volume")}</p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.label.uk}
                    type="button"
                    onClick={() => setVariantIndex(idx)}
                    className={`btn-tactile min-h-[44px] rounded-full border px-5 py-2 text-xs font-medium tracking-wide ${
                      idx === variantIndex
                        ? "border-ink bg-ink text-pearl"
                        : "border-line-strong bg-surface text-ink hover:border-accent"
                    }`}
                  >
                    {v.label[lang]} · {formatPrice(v.price, lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Primary CTA + Wishlist */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-line-strong bg-surface">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-12 w-12 items-center justify-center text-ink hover:text-accent"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-sm font-medium">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex h-12 w-12 items-center justify-center text-ink hover:text-accent"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="btn-tactile flex min-h-[52px] flex-1 items-center justify-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-xs font-medium tracking-[0.18em] text-pearl uppercase hover:bg-accent hover:text-ink"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>
                  {t("common.addToCart")} — {formatPrice(unitPrice * qty, lang)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={t("common.savedToWishlist")}
                className={`btn-tactile flex h-[52px] w-[52px] items-center justify-center rounded-full border ${
                  liked
                    ? "border-accent bg-ink text-accent"
                    : "border-line-strong bg-surface text-ink hover:border-ink"
                }`}
              >
                <Heart
                  className="h-5 w-5"
                  strokeWidth={1.6}
                  fill={liked ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Trust Micro-bar */}
            <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-surface p-4 text-xs text-ink-soft">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-accent" />
                <span>
                  {lang === "uk" ? "Нова Пошта · 1–2 дні" : "Nova Poshta · 1–2 days"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
                <span>
                  {lang === "uk" ? "Свіжа мала партія" : "Fresh small batch"}
                </span>
              </div>
            </div>

            {/* INTERACTIVE NATIVE INGREDIENT CARDS (Replaces cluttered Prom text posters!) */}
            <div className="mt-10">
              <p className="eyebrow flex items-center gap-2 text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t("pdp.keyActives")}</span>
              </p>
              <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                {product.actives.map((act) => (
                  <div
                    key={act.id}
                    className="rounded-2xl border border-line bg-surface p-4"
                  >
                    <p className="text-[10px] font-medium tracking-[0.16em] text-accent uppercase">
                      {act.role[lang]}
                    </p>
                    <h3 className="mt-1 font-display font-bold tracking-[-0.02em] text-xl text-ink">
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
            <div className="mt-9 divide-y divide-line border-y border-line">
              {(
                [
                  {
                    key: "benefits",
                    title: t("pdp.benefits"),
                    content: (
                      <ul className="space-y-2 text-sm text-ink-soft">
                        {product.benefits[lang].map((b) => (
                          <li key={b} className="flex items-start gap-2.5">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
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
                      className="flex min-h-[54px] w-full items-center justify-between py-4 text-left text-xs font-medium tracking-[0.16em] text-ink uppercase"
                    >
                      <span>{sec.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && <div className="pb-5">{sec.content}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Complete the Ritual (Complementary Steps) */}
        {pairings.length > 0 && (
          <section className="mt-24 border-t border-line pt-16">
            <p className="eyebrow text-accent">{t("pdp.pairSub")}</p>
            <h2 className="mt-2 font-display font-bold tracking-[-0.02em] text-3xl text-ink sm:text-4xl">
              {t("pdp.pairTitle")}
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-3">
              {pairings.map((item, idx) => (
                <ProductCard key={item.id} product={item} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* MOBILE STICKY BUY BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display font-bold tracking-[-0.02em] text-lg text-ink">
              {product.line ? product.line[lang] : product.name[lang]}
            </p>
            <p className="text-xs text-muted">
              {variant?.label[lang]} ·{" "}
              <strong className="font-semibold text-ink">
                {formatPrice(unitPrice * qty, lang)}
              </strong>
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn-tactile inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-medium tracking-[0.15em] text-pearl uppercase"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{t("common.addToCart")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
