"use client";

import { ArrowRight, Check, Minus, Plus, Truck, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { BUNDLES } from "@/data/bundles";
import {
  getProductById,
  getRitualPairings,
  PRODUCTS,
  type Product,
} from "@/data/products";
import { formatPrice, type Lang } from "@/lib/format";
import { SlideSheet } from "./SlideSheet";

function formatItemCount(count: number, lang: Lang): string {
  if (lang === "en") {
    return `${count} ${count === 1 ? "item" : "items"}`;
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} засіб`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} засоби`;
  }
  return `${count} засобів`;
}

export function CartDrawer() {
  const {
    activeOverlay,
    closeOverlay,
    lang,
    t,
    cartItems,
    cartCount,
    cartSubtotal,
    promoCode,
    discountAmount,
    cartTotal,
    freeShippingThreshold,
    updateCartQty,
    removeCartItem,
    addProductToCart,
    applyPromo,
    clearPromo,
  } = useStore();

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(false);

  const remaining = Math.max(0, freeShippingThreshold - cartTotal);
  const progress = Math.min(
    100,
    Math.round((cartTotal / freeShippingThreshold) * 100)
  );

  // Collect all product IDs already present in cart (direct or inside bundles)
  const inCartProductIds = useMemo(() => {
    const ids = new Set<string>();
    for (const item of cartItems) {
      if (item.kind === "product") {
        ids.add(item.id);
      } else {
        const bundle = BUNDLES.find((b) => b.id === item.id);
        bundle?.productIds.forEach((pid) => ids.add(pid));
      }
    }
    return ids;
  }, [cartItems]);

  // Smart editorial pairing for non-empty cart
  const upsellProduct: Product | undefined = useMemo(() => {
    for (const item of cartItems) {
      if (item.kind === "product") {
        const prod = getProductById(item.id);
        if (prod) {
          const match = getRitualPairings(prod).find(
            (p) => !inCartProductIds.has(p.id)
          );
          if (match) return match;
        }
      }
    }
    return (
      PRODUCTS.find(
        (p) => p.badge === "bestseller" && !inCartProductIds.has(p.id)
      ) ?? PRODUCTS.find((p) => !inCartProductIds.has(p.id))
    );
  }, [cartItems, inCartProductIds]);

  // 2 signature bestsellers for empty bag quick-add
  const emptyBestsellers = useMemo(
    () => PRODUCTS.filter((p) => p.badge === "bestseller").slice(0, 2),
    []
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    if (applyPromo(promoInput)) {
      setPromoInput("");
      setPromoError(false);
      setPromoOpen(false);
    } else {
      setPromoError(true);
    }
  };

  return (
    <SlideSheet
      open={activeOverlay === "cart"}
      onClose={closeOverlay}
      title={t("cart.title")}
      subtitle={cartCount > 0 ? formatItemCount(cartCount, lang) : undefined}
      surface="parchment"
      footer={
        cartItems.length > 0 ? (
          <div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted">
                <span>{t("cart.subtotal")}</span>
                <span className="tabular-nums">
                  {formatPrice(cartSubtotal, lang)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between font-medium text-sage">
                  <span className="inline-flex items-center gap-1.5">
                    <span>
                      {t("cart.discount")} ({promoCode})
                    </span>
                    <button
                      type="button"
                      onClick={clearPromo}
                      aria-label={t("cart.promoRemove")}
                      className="text-muted transition-colors hover:text-ink"
                    >
                      <X className="h-3 w-3" strokeWidth={1.8} />
                    </button>
                  </span>
                  <span className="tabular-nums">
                    −{formatPrice(discountAmount, lang)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-muted">
                <span>{t("cart.shipping")}</span>
                <span
                  className={
                    remaining === 0
                      ? "font-medium text-sage"
                      : "tabular-nums"
                  }
                >
                  {remaining === 0
                    ? t("cart.shippingFree")
                    : t("cart.shippingCalc")}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-parchment-line pt-3">
                <span className="text-xs font-semibold tracking-[0.14em] text-ink uppercase">
                  {t("cart.total")}
                </span>
                <span className="font-display text-2xl leading-none font-bold tracking-[-0.015em] text-ink tabular-nums">
                  {formatPrice(cartTotal, lang)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeOverlay}
              className="btn-tactile mt-4 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-none bg-[#7CCBE0] px-6 py-4 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-pearl"
            >
              <span>{t("cart.checkout")}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        ) : undefined
      }
    >
      {/* Empty State */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col py-4">
          <div className="py-4">
            <h3 className="font-display text-2xl leading-tight font-bold tracking-[-0.015em] text-ink">
              {t("cart.emptyTitle")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t("cart.emptySub")}
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/catalog"
                onClick={closeOverlay}
                className="btn-tactile flex min-h-[50px] w-full items-center justify-center gap-2 rounded-none bg-[#7CCBE0] px-5 py-3.5 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-pearl"
              >
                <span>{t("hero.ctaPrimary")}</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
              <Link
                href="/quiz"
                onClick={closeOverlay}
                className="btn-tactile flex min-h-[46px] w-full items-center justify-center rounded-none border border-parchment-line px-5 py-3 text-xs font-semibold tracking-[0.14em] text-ink uppercase hover:border-ink"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>

          {/* 2 Signature Bestsellers for quick-add */}
          {emptyBestsellers.length > 0 && (
            <div className="mt-8 border-t border-parchment-line pt-6">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">
                {t("cart.emptyBestsellers")}
              </p>
              <ul className="mt-4 divide-y divide-parchment-line">
                {emptyBestsellers.map((prod) => {
                  const vol = prod.variants[0]?.label[lang];
                  return (
                    <li
                      key={prod.id}
                      className="flex items-center gap-3.5 py-4 first:pt-0 last:pb-0"
                    >
                      <Link
                        href={`/product/${prod.id}`}
                        onClick={closeOverlay}
                        className="h-[72px] w-[58px] shrink-0 overflow-hidden rounded-none bg-surface-soft"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name[lang]}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${prod.id}`}
                          onClick={closeOverlay}
                          className="block truncate font-display text-sm font-bold text-ink transition-colors hover:text-accent"
                        >
                          {prod.line ? prod.line[lang] : prod.name[lang]}
                        </Link>
                        <p className="mt-0.5 truncate text-xs text-muted">
                          {prod.productType[lang]}
                          {vol ? ` · ${vol}` : ""}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-ink tabular-nums">
                          {formatPrice(prod.price, lang)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addProductToCart(prod.id, 1, 0)}
                        className="btn-tactile shrink-0 rounded-none border border-parchment-line px-3.5 py-2 text-[11px] font-semibold tracking-[0.14em] text-ink uppercase hover:border-ink hover:bg-ink hover:text-pearl"
                      >
                        + {t("common.quickAdd")}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Free Shipping Progress — Hairline editorial bar, no box */}
          <div className="mb-6 border-b border-parchment-line pb-4">
            <div className="flex items-center gap-2 text-xs">
              {remaining === 0 ? (
                <>
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-sage"
                    strokeWidth={2}
                  />
                  <span className="font-medium text-sage">
                    {t("common.freeShippingUnlocked")}
                  </span>
                </>
              ) : (
                <>
                  <Truck
                    className="h-3.5 w-3.5 shrink-0 text-accent"
                    strokeWidth={1.6}
                  />
                  <span className="text-ink-soft">
                    {lang === "uk" ? "До безкоштовної доставки ще " : "Add "}
                    <strong className="font-semibold text-ink tabular-nums">
                      {formatPrice(remaining, lang)}
                    </strong>
                    {lang === "uk"
                      ? ` · НП від ${formatPrice(freeShippingThreshold, lang)}`
                      : ` for free shipping (${formatPrice(freeShippingThreshold, lang)})`}
                  </span>
                </>
              )}
            </div>
            <div className="mt-2.5 h-[2px] w-full overflow-hidden rounded-none bg-parchment-line">
              <div
                className={`h-full rounded-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  remaining === 0 ? "bg-sage" : "bg-[#2B849E]"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Cart Items */}
          <ul className="divide-y divide-parchment-line">
            {cartItems.map((item) => {
              if (item.kind === "bundle") {
                const bundle = BUNDLES.find((b) => b.id === item.id);
                if (!bundle) return null;
                return (
                  <li
                    key={`bundle-${bundle.id}`}
                    className="flex gap-4 py-5 first:pt-0"
                  >
                    <div className="h-[104px] w-[84px] shrink-0 overflow-hidden rounded-none bg-surface-soft">
                      <img
                        src={bundle.image}
                        alt={bundle.name[lang]}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold tracking-[0.16em] text-accent uppercase">
                            {bundle.badge[lang]}
                          </span>
                          <p className="mt-0.5 font-display text-base leading-snug font-bold tracking-[-0.01em] text-ink">
                            {bundle.name[lang]}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                            {bundle.subtitle[lang]}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCartItem("bundle", bundle.id, 0)}
                          aria-label={t("cart.removeItem")}
                          className="-mr-1.5 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-none text-muted/70 transition-colors hover:text-ink"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={1.7} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                        <div className="-ml-2 inline-flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQty("bundle", bundle.id, 0, -1)
                            }
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center rounded-none text-ink/70 transition-colors hover:text-ink"
                          >
                            <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </button>
                          <span className="min-w-6 text-center text-sm font-medium text-ink tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQty("bundle", bundle.id, 0, 1)
                            }
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center rounded-none text-ink/70 transition-colors hover:text-ink"
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.qty > 1 && (
                            <p className="text-[11px] text-muted tabular-nums">
                              {formatPrice(bundle.bundlePrice, lang)} /{" "}
                              {t("cart.perUnit")}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-ink tabular-nums">
                            {formatPrice(bundle.bundlePrice * item.qty, lang)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }

              const product = getProductById(item.id);
              if (!product) return null;
              const variant =
                product.variants[item.variantIndex] ?? product.variants[0];
              const unitPrice = variant ? variant.price : product.price;

              return (
                <li
                  key={`prod-${product.id}-${item.variantIndex}`}
                  className="flex gap-4 py-5 first:pt-0"
                >
                  <Link
                    href={`/product/${product.id}`}
                    onClick={closeOverlay}
                    className="h-[104px] w-[84px] shrink-0 overflow-hidden rounded-none bg-surface-soft"
                  >
                    <img
                      src={product.image}
                      alt={product.name[lang]}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${product.id}`}
                          onClick={closeOverlay}
                          className="block font-display text-base leading-snug font-bold tracking-[-0.01em] text-ink transition-colors hover:text-accent"
                        >
                          {product.line
                            ? product.line[lang]
                            : product.name[lang]}
                        </Link>
                        <p className="mt-0.5 truncate text-xs text-muted">
                          {product.productType[lang]}
                          {variant ? ` · ${variant.label[lang]}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeCartItem(
                            "product",
                            product.id,
                            item.variantIndex
                          )
                        }
                        aria-label={t("cart.removeItem")}
                        className="-mr-1.5 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-none text-muted/70 transition-colors hover:text-ink"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={1.7} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                      <div className="-ml-2 inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(
                              "product",
                              product.id,
                              item.variantIndex,
                              -1
                            )
                          }
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-none text-ink/70 transition-colors hover:text-ink"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                        <span className="min-w-6 text-center text-sm font-medium text-ink tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(
                              "product",
                              product.id,
                              item.variantIndex,
                              1
                            )
                          }
                          aria-label="Increase quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-none text-ink/70 transition-colors hover:text-ink"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>

                      <div className="text-right">
                        {item.qty > 1 && (
                          <p className="text-[11px] text-muted tabular-nums">
                            {formatPrice(unitPrice, lang)} / {t("cart.perUnit")}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-ink tabular-nums">
                          {formatPrice(unitPrice * item.qty, lang)}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Collapsible Promo Code */}
          <div className="border-t border-parchment-line py-4">
            {promoCode ? (
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold tracking-[0.1em] text-sage uppercase">
                  {promoCode} · −10%
                </span>
                <button
                  type="button"
                  onClick={clearPromo}
                  className="text-muted underline underline-offset-4 transition-colors hover:text-ink"
                >
                  {t("cart.promoRemove")}
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setPromoOpen((prev) => !prev);
                    setPromoError(false);
                  }}
                  aria-expanded={promoOpen}
                  className="flex w-full items-center justify-between py-0.5 text-left text-xs font-medium tracking-[0.12em] text-ink-soft uppercase transition-colors hover:text-ink"
                >
                  <span>{t("cart.promoToggle")}</span>
                  {promoOpen ? (
                    <Minus className="h-3.5 w-3.5 text-muted" strokeWidth={1.7} />
                  ) : (
                    <Plus className="h-3.5 w-3.5 text-muted" strokeWidth={1.7} />
                  )}
                </button>

                {promoOpen && (
                  <div className="mt-3">
                    <form
                      onSubmit={handleApplyPromo}
                      className="flex items-stretch gap-2"
                    >
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          if (promoError) setPromoError(false);
                        }}
                        aria-label={t("cart.promoPlaceholder")}
                        placeholder={t("cart.promoPlaceholder")}
                        className="min-w-0 flex-1 rounded-none border border-parchment-line bg-transparent px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-ink"
                      />
                      <button
                        type="submit"
                        className="btn-tactile shrink-0 rounded-none border border-ink px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-pearl"
                      >
                        {t("cart.promoApply")}
                      </button>
                    </form>
                    {promoError && (
                      <p className="mt-2 text-xs text-muted">
                        {t("cart.promoInvalid")}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Editorial Ritual Upsell — No Box */}
          {upsellProduct && (
            <div className="border-t border-parchment-line pt-5">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">
                {t("cart.upsellTitle")}
              </p>
              <div className="mt-3.5 flex items-center gap-3.5">
                <Link
                  href={`/product/${upsellProduct.id}`}
                  onClick={closeOverlay}
                  className="h-[72px] w-[58px] shrink-0 overflow-hidden rounded-none bg-surface-soft"
                >
                  <img
                    src={upsellProduct.image}
                    alt={upsellProduct.name[lang]}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${upsellProduct.id}`}
                    onClick={closeOverlay}
                    className="block truncate font-display text-sm font-bold text-ink transition-colors hover:text-accent"
                  >
                    {upsellProduct.line
                      ? upsellProduct.line[lang]
                      : upsellProduct.name[lang]}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-muted tabular-nums">
                    {upsellProduct.variants[0]?.label[lang]
                      ? `${upsellProduct.variants[0].label[lang]} · `
                      : ""}
                    {formatPrice(upsellProduct.price, lang)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addProductToCart(upsellProduct.id, 1, 0)}
                  className="btn-tactile shrink-0 rounded-none border border-parchment-line px-3.5 py-2 text-[11px] font-semibold tracking-[0.14em] text-ink uppercase hover:border-ink hover:bg-ink hover:text-pearl"
                >
                  + {t("common.quickAdd")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </SlideSheet>
  );
}
