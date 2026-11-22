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
          className="flex flex-wrap items-center gap-2 py-4 text-xs tracking-[0.12em] text-umber uppercase"
        >
          <Link href="/" className="hover:text-obsidian">
            Sophie Bilynska
          </Link>
          <span>/</span>
          <Link
            href={`/catalog?category=${product.category}`}
            className="hover:text-obsidian"
          >
            {getCategoryLabel(product.category, lang)}
          </Link>
          <span>/</span>
          <span className="text-obsidian">
            {product.line ? product.line[lang] : product.name[lang]}
          </span>
        </nav>

        {/* Main 2-Column PDP */}
        <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Clean Editorial Gallery */}
          <div className="lg:col-span-6">
            <div className="sticky top-24 space-y-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-sand bg-alabaster">
                <img
                  src={product.gallery[activeImage] ?? product.image}
                  alt={product.name[lang]}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />
                {product.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-obsidian/85 px-3.5 py-1.5 text-[10px] font-medium tracking-[0.16em] text-bronze-light uppercase">
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
                          ? "border-bronze opacity-100"
                          : "border-sand opacity-65 hover:opacity-100"
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
            <p className="eyebrow text-bronze-dark">
              {getStepLabel(product.ritualStep, lang)}
            </p>

            <h1 className="mt-2 font-editorial text-4xl leading-[1.08] font-medium text-obsidian sm:text-5xl">
              {product.name[lang]}
            </h1>

            {/* Rating + Texture */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-umber">
              <span className="inline-flex items-center gap-1.5 font-medium text-obsidian">
                <Star className="h-3.5 w-3.5 fill-bronze text-bronze" />
                {product.rating.toFixed(2)} ({product.reviews} {t("pdp.reviewsLabel")})
              </span>
              <span>·</span>
              <span>{product.texture[lang]}</span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-editorial text-4xl font-medium text-obsidian">
                {formatPrice(unitPrice, lang)}
              </span>
              <span className="text-xs tracking-[0.14em] text-umber uppercase">
                {variant?.label[lang]}
              </span>
            </div>

            <p className="mt-4 text-base leading-relaxed text-espresso/85">
              {product.shortTagline[lang]}
            </p>

            {/* Variant Picker */}
            <div className="mt-7">
              <p className="eyebrow text-umber">{t("pdp.volume")}</p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.label.uk}
                    type="button"
                    onClick={() => setVariantIndex(idx)}
                    className={`btn-tactile min-h-[44px] rounded-full border px-5 py-2 text-xs font-medium tracking-wide transition-colors ${
                      idx === variantIndex
                        ? "border-obsidian bg-obsidian text-pearl"
                        : "border-sand-dark bg-alabaster text-obsidian hover:border-bronze"
                    }`}
                  >
                    {v.label[lang]} · {formatPrice(v.price, lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Primary CTA + Wishlist */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-sand-dark bg-alabaster">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-12 w-12 items-center justify-center text-obsidian hover:text-bronze-dark"
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
                  className="flex h-12 w-12 items-center justify-center text-obsidian hover:text-bronze-dark"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="btn-tactile flex min-h-[52px] flex-1 items-center justify-center gap-2.5 rounded-full bg-obsidian px-7 py-3.5 text-xs font-medium tracking-[0.18em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
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
                className={`btn-tactile flex h-[52px] w-[52px] items-center justify-center rounded-full border transition-colors ${
                  liked
                    ? "border-bronze bg-obsidian text-bronze-light"
                    : "border-sand-dark bg-alabaster text-obsidian hover:border-obsidian"
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
            <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-sand bg-alabaster p-4 text-xs text-espresso">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-bronze-dark" />
                <span>
                  {lang === "uk" ? "Нова Пошта · 1–2 дні" : "Nova Poshta · 1–2 days"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-bronze-dark" />
                <span>
                  {lang === "uk" ? "Свіжа мала партія" : "Fresh small batch"}
                </span>
              </div>
            </div>

            {/* INTERACTIVE NATIVE INGREDIENT CARDS (Replaces cluttered Prom text posters!) */}
            <div className="mt-10">
              <p className="eyebrow flex items-center gap-2 text-bronze-dark">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t("pdp.keyActives")}</span>
              </p>
              <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                {product.actives.map((act) => (
                  <div
                    key={act.id}
                    className="rounded-2xl border border-sand bg-alabaster p-4"
                  >
                    <p className="text-[10px] font-medium tracking-[0.16em] text-bronze-dark uppercase">
                      {act.role[lang]}
                    </p>
                    <h3 className="mt-1 font-editorial text-xl font-medium text-obsidian">
                      {act.name[lang]}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-umber">
                      {act.note[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accordions: Benefits / Usage / INCI / Delivery */}
            <div className="mt-9 divide-y divide-sand border-y border-sand">
              {(
                [
                  {
                    key: "benefits",
                    title: t("pdp.benefits"),
                    content: (
                      <ul className="space-y-2 text-sm text-espresso">
                        {product.benefits[lang].map((b) => (
                          <li key={b} className="flex items-start gap-2.5">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" />
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
                      <p className="text-sm leading-relaxed text-espresso">
                        {product.usage[lang]}
                      </p>
                    ),
                  },
                  {
                    key: "inci",
                    title: t("pdp.inci"),
                    content: (
                      <p className="font-mono text-xs leading-relaxed text-umber">
                        {product.inci}
                      </p>
                    ),
                  },
                  {
                    key: "delivery",
                    title: t("pdp.delivery"),
                    content: (
                      <p className="text-sm leading-relaxed text-espresso">
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
                      className="flex min-h-[54px] w-full items-center justify-between py-4 text-left text-xs font-medium tracking-[0.16em] text-obsidian uppercase"
                    >
                      <span>{sec.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-umber transition-transform duration-300 ${
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
          <section className="mt-24 border-t border-sand pt-16">
            <p className="eyebrow text-bronze-dark">{t("pdp.pairSub")}</p>
            <h2 className="mt-2 font-editorial text-3xl font-medium text-obsidian sm:text-4xl">
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
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-alabaster/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-editorial text-lg font-medium text-obsidian">
              {product.line ? product.line[lang] : product.name[lang]}
            </p>
            <p className="text-xs text-umber">
              {variant?.label[lang]} ·{" "}
              <strong className="font-semibold text-obsidian">
                {formatPrice(unitPrice * qty, lang)}
              </strong>
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn-tactile inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-obsidian px-6 py-3 text-xs font-medium tracking-[0.15em] text-pearl uppercase"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{t("common.addToCart")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
