"use client";

import { Heart, Plus } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getStepLabel, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { LUXURY_EASE } from "./MotionPrimitives";

interface ProductCardProps {
  product: Product;
  variant?: "light" | "dark";
  index?: number;
}

export function ProductCard({
  product,
  variant = "light",
  index = 0,
}: ProductCardProps) {
  const { lang, t, addProductToCart, toggleWishlist, isWishlisted } = useStore();
  const liked = isWishlisted(product.id);
  const dark = variant === "dark";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.06, ease: LUXURY_EASE }}
      className="group flex h-full flex-col"
    >
      {/* Crisp 3:4 Studio Frame */}
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl border transition-all duration-300 ${
          dark
            ? "border-surface/10 bg-obsidian-soft"
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
            className={`btn-tactile pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-colors sm:h-10 sm:w-10 ${
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
          <span className="truncate text-accent-deep">
            {getStepLabel(product.ritualStep, lang)}
          </span>
          <span className="shrink-0 text-muted">
            {product.variants[0]?.label[lang]}
          </span>
        </div>

        <Link
          href={`/product/${product.id}`}
          className={`mt-1 text-base leading-snug font-bold tracking-[-0.01em] transition-colors sm:text-lg ${
            dark
              ? "text-surface hover:text-accent"
              : "text-ink hover:text-accent-deep"
          }`}
        >
          {product.line ? product.line[lang] : product.name[lang]}
        </Link>

        <p
          className={`mt-1 line-clamp-2 text-xs leading-relaxed ${
            dark ? "text-surface/65" : "text-muted"
          }`}
        >
          {product.shortTagline[lang]}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2.5 sm:pt-3.5">
          <span
            className={`text-sm font-bold tracking-wide sm:text-base ${
              dark ? "text-surface" : "text-ink"
            }`}
          >
            {formatPrice(product.price, lang)}
          </span>
          <span className="hidden text-[11px] font-semibold text-accent-deep opacity-0 transition-opacity group-hover:opacity-100 lg:inline">
            {t("common.details")} →
          </span>
        </div>
      </div>
    </motion.article>
  );
}
