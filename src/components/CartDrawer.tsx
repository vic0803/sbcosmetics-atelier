"use client";

import { ArrowRight, Minus, Plus, Sparkles, Tag, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { BUNDLES } from "@/data/bundles";
import { getProductById, PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { SlideSheet } from "./SlideSheet";

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

  const [promoInput, setPromoInput] = useState("");

  const remaining = Math.max(0, freeShippingThreshold - cartTotal);
  const progress = Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));

  // Suggest 1 complementary product not currently in cart
  const upsellProduct = PRODUCTS.find(
    (p) =>
      (p.id === "gel-mask" || p.id === "toner-aloe" || p.id === "scrub-soap") &&
      !cartItems.some((c) => c.kind === "product" && c.id === p.id)
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    if (applyPromo(promoInput)) {
      setPromoInput("");
    }
  };

  return (
    <SlideSheet
      open={activeOverlay === "cart"}
      onClose={closeOverlay}
      title={t("cart.title")}
      subtitle={
        cartCount > 0
          ? `${cartCount} ${lang === "uk" ? "позиц." : "items"} · ${formatPrice(cartTotal, lang)}`
          : undefined
      }
      footer={
        cartItems.length > 0 ? (
          <div className="space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-umber">
                <span>{t("cart.subtotal")}</span>
                <span>{formatPrice(cartSubtotal, lang)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sage font-medium">
                  <span className="flex items-center gap-1.5">
                    {t("cart.discount")} ({promoCode})
                    <button
                      type="button"
                      onClick={clearPromo}
                      className="text-xs underline opacity-75 hover:opacity-100"
                    >
                      ×
                    </button>
                  </span>
                  <span>−{formatPrice(discountAmount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-umber">
                <span>{t("cart.shipping")}</span>
                <span className={remaining === 0 ? "font-medium text-sage" : ""}>
                  {remaining === 0 ? t("cart.shippingFree") : t("cart.shippingCalc")}
                </span>
              </div>
              <div className="flex justify-between border-t border-sand pt-2.5 text-base font-medium text-obsidian">
                <span>{t("cart.total")}</span>
                <span>{formatPrice(cartTotal, lang)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeOverlay}
              className="btn-tactile flex w-full items-center justify-center gap-2 rounded-full bg-obsidian px-6 py-4 text-xs font-medium tracking-[0.18em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
            >
              <span>{t("cart.checkout")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : undefined
      }
    >
      {/* Free Shipping Bar */}
      <div className="mb-5 rounded-2xl border border-sand bg-travertine/75 p-4">
        <div className="flex items-center gap-2 text-xs text-espresso">
          <Truck className="h-4 w-4 shrink-0 text-bronze-dark" strokeWidth={1.6} />
          {remaining === 0 ? (
            <span className="font-medium text-sage">
              {t("common.freeShippingUnlocked")}
            </span>
          ) : (
            <span>
              {t("common.freeShippingAt")}{" "}
              <strong className="font-semibold text-obsidian">
                {formatPrice(freeShippingThreshold, lang)}
              </strong>{" "}
              ({lang === "uk" ? "ще" : "add"} {formatPrice(remaining, lang)})
            </span>
          )}
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-sand">
          <div
            className="h-full rounded-full bg-bronze transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Empty State */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-sand bg-travertine text-bronze-dark">
            <Sparkles className="h-6 w-6" strokeWidth={1.4} />
          </div>
          <h3 className="mt-5 font-editorial text-2xl font-medium text-obsidian">
            {t("cart.emptyTitle")}
          </h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-umber">
            {t("cart.emptySub")}
          </p>
          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Link
              href="/quiz"
              onClick={closeOverlay}
              className="btn-tactile flex w-full items-center justify-center gap-2 rounded-full bg-obsidian px-5 py-3.5 text-xs font-medium tracking-[0.16em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("hero.ctaSecondary")}</span>
            </Link>
            <Link
              href="/catalog"
              onClick={closeOverlay}
              className="btn-tactile flex w-full items-center justify-center rounded-full border border-sand-dark px-5 py-3.5 text-xs font-medium tracking-[0.16em] text-obsidian uppercase hover:border-obsidian"
            >
              {t("hero.ctaPrimary")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Items */}
          <ul className="divide-y divide-sand">
            {cartItems.map((item) => {
              if (item.kind === "bundle") {
                const bundle = BUNDLES.find((b) => b.id === item.id);
                if (!bundle) return null;
                return (
                  <li
                    key={`bundle-${bundle.id}`}
                    className="flex gap-4 py-4 first:pt-0"
                  >
                    <img
                      src={bundle.image}
                      alt={bundle.name[lang]}
                      className="h-24 w-20 shrink-0 rounded-xl border border-sand object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="text-[10px] font-medium tracking-[0.16em] text-bronze-dark uppercase">
                        {bundle.badge[lang]}
                      </span>
                      <p className="mt-0.5 font-editorial text-lg leading-tight font-medium text-obsidian">
                        {bundle.name[lang]}
                      </p>
                      <p className="mt-1 text-sm font-medium text-obsidian">
                        {formatPrice(bundle.bundlePrice * item.qty, lang)}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-sand bg-travertine">
                          <button
                            type="button"
                            onClick={() => updateCartQty("bundle", bundle.id, 0, -1)}
                            aria-label="Decrease quantity"
                            className="flex h-9 w-9 items-center justify-center text-obsidian hover:text-bronze-dark"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-xs font-medium">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty("bundle", bundle.id, 0, 1)}
                            aria-label="Increase quantity"
                            className="flex h-9 w-9 items-center justify-center text-obsidian hover:text-bronze-dark"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCartItem("bundle", bundle.id, 0)}
                          aria-label="Remove item"
                          className="flex h-9 w-9 items-center justify-center rounded-full text-umber hover:bg-sand/60 hover:text-obsidian"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              }

              const product = getProductById(item.id);
              if (!product) return null;
              const variant = product.variants[item.variantIndex] ?? product.variants[0];
              const unitPrice = variant ? variant.price : product.price;

              return (
                <li
                  key={`prod-${product.id}-${item.variantIndex}`}
                  className="flex gap-4 py-4 first:pt-0"
                >
                  <Link
                    href={`/product/${product.id}`}
                    onClick={closeOverlay}
                    className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-sand"
                  >
                    <img
                      src={product.image}
                      alt={product.name[lang]}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/product/${product.id}`}
                      onClick={closeOverlay}
                      className="font-editorial text-lg leading-tight font-medium text-obsidian hover:text-bronze-dark"
                    >
                      {product.line ? product.line[lang] : product.name[lang]}
                    </Link>
                    <p className="mt-0.5 text-xs text-umber">
                      {variant?.label[lang]}
                    </p>
                    <p className="mt-1 text-sm font-medium text-obsidian">
                      {formatPrice(unitPrice * item.qty, lang)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-sand bg-travertine">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty("product", product.id, item.variantIndex, -1)
                          }
                          aria-label="Decrease quantity"
                          className="flex h-9 w-9 items-center justify-center text-obsidian hover:text-bronze-dark"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-xs font-medium">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty("product", product.id, item.variantIndex, 1)
                          }
                          aria-label="Increase quantity"
                          className="flex h-9 w-9 items-center justify-center text-obsidian hover:text-bronze-dark"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeCartItem("product", product.id, item.variantIndex)
                        }
                        aria-label="Remove item"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-umber hover:bg-sand/60 hover:text-obsidian"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Promo Code */}
          <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-umber" />
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                aria-label={t("cart.promoPlaceholder")}
                placeholder={t("cart.promoPlaceholder")}
                className="w-full rounded-full border border-sand bg-travertine/70 py-2.5 pl-9 pr-4 text-sm text-obsidian placeholder:text-umber/75 focus:border-bronze"
              />
            </div>
            <button
              type="submit"
              className="btn-tactile rounded-full border border-obsidian px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-obsidian uppercase hover:bg-obsidian hover:text-pearl"
            >
              {t("cart.promoApply")}
            </button>
          </form>

          {/* Upsell */}
          {upsellProduct && (
            <div className="rounded-2xl border border-sand bg-travertine/55 p-4">
              <p className="eyebrow text-bronze-dark">
                {lang === "uk" ? "Доповнити ритуал" : "Complete the Ritual"}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={upsellProduct.image}
                  alt={upsellProduct.name[lang]}
                  className="h-14 w-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-editorial text-base font-medium text-obsidian">
                    {upsellProduct.line ? upsellProduct.line[lang] : upsellProduct.name[lang]}
                  </p>
                  <p className="text-xs text-umber">
                    {formatPrice(upsellProduct.price, lang)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addProductToCart(upsellProduct.id, 1, 0)}
                  className="btn-tactile rounded-full bg-obsidian px-3.5 py-2 text-[11px] font-medium tracking-[0.12em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
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
