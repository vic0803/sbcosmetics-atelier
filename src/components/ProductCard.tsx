"use client";

import { ArrowUpRight, Heart, Plus } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getStepLabel, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  variant?: "light" | "dark";
  layout?: "classic" | "editorial";
  density?: "default" | "compact";
  fillHeight?: boolean;
  heightClassName?: string;
  index?: number;
}

export function ProductCard({
  product,
  variant = "light",
  layout = "classic",
  density = "default",
  fillHeight = false,
  heightClassName,
}: ProductCardProps) {
  const { lang, t, addProductToCart, toggleWishlist, isWishlisted } = useStore();
  const liked = isWishlisted(product.id);
  const dark = variant === "dark";

  if (layout === "editorial") {
    const compact = density === "compact";
    const resolvedHeightClass =
      heightClassName ??
      (fillHeight ? "h-[58svh] min-h-[480px] max-h-[600px]" : "aspect-[3/4]");

    return (
      <article
        className={`group relative flex w-full flex-col justify-between overflow-hidden rounded-none border-0 bg-espresso ${resolvedHeightClass}`}
      >
        {/* Full-bleed clickable photo backdrop: always crisp (zero blur), subtle editorial zoom on hover */}
        <Link
          href={`/product/${product.id}`}
          aria-label={product.name[lang]}
          draggable={false}
          className="absolute inset-0 z-0 block overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name[lang]}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover:scale-[1.04]"
          />

          {/* Top subtle vignette (always on mobile; fades in on desktop hover for badge/heart legibility) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/45 via-ink/15 to-transparent transition-opacity duration-400 lg:opacity-0 lg:group-hover:opacity-100" />

          {/* Resting short bottom scrim (keeps Name + Price crisp while leaving upper ~70% of photo bright) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-ink/90 via-ink/45 to-transparent" />

          {/* Expanded hover bottom scrim (always on mobile; smoothly deepens on desktop hover for tagline & buttons) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink/96 via-ink/72 to-transparent transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:opacity-0 lg:group-hover:opacity-100" />
        </Link>

        {/* TOP ZONE: High-contrast Dark Navy Editorial Badge + Bare Heart */}
        <div
          className={`pointer-events-none relative z-10 flex items-center justify-between gap-2 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] lg:-translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${
            compact ? "p-4 sm:p-5" : "p-4 sm:p-5 lg:p-6"
          }`}
        >
          {product.badge ? (
            <span
              className={`border-l-2 border-accent bg-ink/95 leading-none font-bold text-accent uppercase ${
                compact
                  ? "px-3 py-1.5 text-[11px] tracking-[0.16em] sm:text-[12px]"
                  : "px-3.5 py-1.5 text-[13px] tracking-[0.18em]"
              }`}
            >
              {product.badge === "bestseller"
                ? lang === "uk"
                  ? "Хіт"
                  : "Hit"
                : "New"}
            </span>
          ) : (
            <span
              className={`bg-ink/85 leading-none font-semibold text-pearl/90 uppercase ${
                compact
                  ? "px-3 py-1.5 text-[11px] tracking-[0.14em]"
                  : "px-3.5 py-1.5 text-[12px] tracking-[0.14em]"
              }`}
            >
              {product.variants[0]?.label[lang]}
            </span>
          )}

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={liked ? t("common.removedFromWishlist") : t("common.savedToWishlist")}
            className={`btn-tactile pointer-events-auto flex h-9 w-9 items-center justify-center drop-shadow-[0_1px_4px_rgba(14,22,30,0.5)] transition-colors ${
              liked ? "text-accent" : "text-pearl hover:text-accent"
            }`}
          >
            <Heart
              className="h-5 w-5"
              strokeWidth={1.75}
              fill={liked ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* BOTTOM ZONE: White Name + Aqua Price (turns white on desktop hover); Step & Tagline lift cleanly higher on hover */}
        <div
          className={`pointer-events-none relative z-10 mt-auto ${
            compact ? "p-4 sm:p-5" : "p-4 sm:p-5 lg:p-6"
          }`}
        >
          {/* Step & Volume (expands smoothly above title on desktop hover) */}
          <div className="grid grid-rows-[1fr] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100">
            <div className="overflow-hidden">
              <p className="mb-1.5 truncate text-[10px] font-semibold tracking-[0.16em] text-accent uppercase lg:text-[11px]">
                {getStepLabel(product.ritualStep, lang)}
                {product.variants[0] ? ` · ${product.variants[0].label[lang]}` : ""}
              </p>
            </div>
          </div>

          {/* Product Name (always crisp white, semibold) */}
          <Link
            href={`/product/${product.id}`}
            className={`pointer-events-auto block line-clamp-2 font-display leading-[1.08] font-semibold text-pearl transition-colors ${
              compact
                ? "text-2xl sm:text-[22px] lg:text-[24px] xl:text-[26px]"
                : fillHeight
                  ? "text-2xl sm:text-2xl lg:text-[32px]"
                  : "text-xl sm:text-2xl lg:text-[32px]"
            }`}
          >
            {product.line ? product.line[lang] : product.name[lang]}
          </Link>

          {/* Short Tagline (expands smoothly below title and lifts text block generously above price on desktop hover) */}
          <div className="grid grid-rows-[1fr] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[0fr] lg:opacity-0 lg:delay-75 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100">
            <div className="overflow-hidden">
              <p
                className={`mt-1.5 mb-2 line-clamp-2 text-xs leading-relaxed text-pearl/82 lg:text-[13px] ${
                  compact ? "lg:mb-6" : "lg:mb-7"
                }`}
              >
                {product.shortTagline[lang]}
              </p>
            </div>
          </div>

          {/* Price (aqua at rest, transitions to white on desktop hover) + Two Equal 40x40 Square Buttons */}
          <div className="mt-1.5 flex items-end justify-between gap-3">
            <span
              className={`leading-none font-semibold tracking-wide text-accent transition-colors duration-300 lg:group-hover:text-pearl ${
                compact ? "text-lg lg:text-[19px]" : "text-lg lg:text-xl"
              }`}
            >
              {formatPrice(product.price, lang)}
            </span>

            <div
              className={`pointer-events-auto flex items-center gap-2 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] lg:absolute lg:translate-y-3 lg:opacity-0 lg:delay-75 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${
                compact ? "lg:right-5 lg:bottom-5" : "lg:right-6 lg:bottom-6"
              }`}
            >
              <button
                type="button"
                onClick={() => addProductToCart(product.id, 1, 0)}
                aria-label={t("common.addToCart")}
                className="btn-tactile flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-pearl/35 bg-transparent text-pearl hover:border-accent hover:bg-accent hover:text-ink"
              >
                <Plus className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </button>

              <Link
                href={`/product/${product.id}`}
                aria-label={t("common.details")}
                className="btn-tactile flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-surface text-ink transition-colors hover:bg-accent"
              >
                <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col">
      {/* Crisp 3:4 Studio Frame */}
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl border transition-all duration-300 ${
          dark
            ? "border-pearl/12 bg-espresso shadow-[0_8px_28px_rgba(0,0,0,0.28)] group-hover:border-accent/55"
            : "border-line bg-surface shadow-[0_2px_12px_rgba(23,26,28,0.03)] group-hover:border-accent/60 group-hover:shadow-[0_14px_34px_rgba(23,26,28,0.08)]"
        }`}
      >
        <Link
          href={`/product/${product.id}`}
          className="block h-full w-full overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name[lang]}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        </Link>

        {/* Top Badges & Wishlist */}
        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-1.5 sm:inset-x-3 sm:top-3">
          {product.badge ? (
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] uppercase backdrop-blur-md sm:px-3 sm:text-[10px] ${
                product.badge === "bestseller"
                  ? "bg-ink/90 text-accent"
                  : "bg-accent text-ink"
              }`}
            >
              {product.badge === "bestseller"
                ? lang === "uk"
                  ? "Хіт"
                  : "Hit"
                : lang === "uk"
                  ? "New"
                  : "New"}
            </span>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={liked ? t("common.removedFromWishlist") : t("common.savedToWishlist")}
            className={`btn-tactile pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md sm:h-10 sm:w-10 ${
              liked
                ? "border-accent bg-ink text-accent"
                : "border-ink/10 bg-surface/85 text-ink hover:bg-ink hover:text-surface"
            }`}
          >
            <Heart
              className="h-4 w-4"
              strokeWidth={1.8}
              fill={liked ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Mobile Floating + Quick-Add Circle (compact, 2-col friendly!) */}
        <button
          type="button"
          onClick={() => addProductToCart(product.id, 1, 0)}
          aria-label={t("common.addToCart")}
          className="btn-tactile absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-surface shadow-lg hover:bg-accent hover:text-ink lg:hidden"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
        </button>

        {/* Desktop Floating Quick-Add Bar on Hover */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          <button
            type="button"
            onClick={() => addProductToCart(product.id, 1, 0)}
            className="btn-tactile pointer-events-auto flex w-full items-center justify-center gap-2 rounded-full bg-ink/95 px-4 py-3 text-[11px] font-bold tracking-[0.16em] text-surface uppercase shadow-xl backdrop-blur-md hover:bg-accent hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
            <span>{t("common.addToCart")}</span>
          </button>
        </div>
      </div>

      {/* Product Typography (100% Crisp Futura PT) */}
      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        <div className="flex items-center justify-between gap-2 text-[10px] font-semibold tracking-[0.12em] uppercase sm:text-[11px]">
          <span className={`truncate ${dark ? "text-accent" : "text-accent"}`}>
            {getStepLabel(product.ritualStep, lang)}
          </span>
          <span className={`shrink-0 ${dark ? "text-pearl/55" : "text-muted"}`}>
            {product.variants[0]?.label[lang]}
          </span>
        </div>

        <Link
          href={`/product/${product.id}`}
          className={`mt-1 text-base leading-snug font-bold tracking-[-0.01em] transition-colors sm:text-lg ${
            dark
              ? "text-pearl hover:text-accent"
              : "text-ink hover:text-accent"
          }`}
        >
          {product.line ? product.line[lang] : product.name[lang]}
        </Link>

        <p
          className={`mt-1 line-clamp-2 text-xs leading-relaxed ${
            dark ? "text-pearl/65" : "text-muted"
          }`}
        >
          {product.shortTagline[lang]}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2.5 sm:pt-3.5">
          <span
            className={`text-sm font-bold tracking-wide sm:text-base ${
              dark ? "text-pearl" : "text-ink"
            }`}
          >
            {formatPrice(product.price, lang)}
          </span>
          <span
            className={`hidden text-[11px] font-semibold opacity-0 transition-opacity group-hover:opacity-100 lg:inline ${
              dark ? "text-accent" : "text-accent"
            }`}
          >
            {t("common.details")} →
          </span>
        </div>
      </div>
    </article>
  );
}
