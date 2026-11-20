"use client";

import {
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  Truck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useStore, type OrderRecord } from "@/context/StoreContext";
import { BUNDLES } from "@/data/bundles";
import { getProductById } from "@/data/products";
import { formatPrice } from "@/lib/format";

const POPULAR_CITIES = ["Львів", "Київ", "Одеса", "Дніпро", "Харків", "Івано-Франківськ"];

const NP_BRANCHES_BY_CITY: Record<string, string[]> = {
  Львів: [
    "Відділення №12 (вул. Сахарова, 42)",
    "Відділення №1 (вул. Городоцька, 359)",
    "Поштомат №24081 (пр. Свободи, 27)",
  ],
  Київ: [
    "Відділення №5 (вул. Федорова, 32)",
    "Відділення №42 (вул. Велика Васильківська, 72)",
    "Поштомат №31104 (вул. Антоновича, 176)",
  ],
  Одеса: [
    "Відділення №14 (вул. Пушкінська, 34)",
    "Поштомат №19044 (вул. Дерибасівська, 12)",
  ],
};

export function CheckoutClient() {
  const {
    lang,
    t,
    user,
    openOverlay,
    cartItems,
    cartSubtotal,
    discountAmount,
    cartTotal,
    freeShippingThreshold,
    recordOrder,
    clearCart,
  } = useStore();

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [deliveryType, setDeliveryType] = useState<"branch" | "locker" | "courier">("branch");
  const [city, setCity] = useState(user?.city ?? "Львів");
  const [branch, setBranch] = useState(
    user?.npBranch ?? "Відділення №12 (вул. Сахарова, 42)"
  );
  const [paymentMethod, setPaymentMethod] = useState<"apple-monobank" | "card" | "cod">(
    "apple-monobank"
  );
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);

  const freeShipping = cartTotal >= freeShippingThreshold;
  const branchOptions = NP_BRANCHES_BY_CITY[city] ?? [
    `${lang === "uk" ? "Відділення №1" : "Branch #1"} (${city})`,
    `${lang === "uk" ? "Поштомат №1042" : "Locker #1042"} (${city})`,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const summary = cartItems
      .map((item) => {
        if (item.kind === "bundle") {
          const b = BUNDLES.find((x) => x.id === item.id);
          return b ? `${b.name[lang]} × ${item.qty}` : "";
        }
        const p = getProductById(item.id);
        return p ? `${p.line ? p.line[lang] : p.name[lang]} × ${item.qty}` : "";
      })
      .filter(Boolean)
      .join(", ");

    const created = recordOrder({
      city,
      branch,
      total: cartTotal,
      itemsSummary: summary,
    });
    clearCart();
    setPlacedOrder(created);
  };

  if (placedOrder) {
    return (
      <div className="pt-28 pb-24 lg:pt-36">
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-obsidian text-bronze-light">
            <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <p className="eyebrow mt-6 text-bronze-dark">{placedOrder.id}</p>
          <h1 className="mt-2 font-editorial text-4xl font-medium text-obsidian sm:text-5xl">
            {t("checkout.successTitle")}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-umber sm:text-base">
            {t("checkout.successDesc")}
          </p>

          <div className="mt-8 rounded-3xl border border-sand bg-alabaster p-6 text-left text-sm">
            <div className="flex justify-between py-2">
              <span className="text-umber">
                {lang === "uk" ? "Орієнтовна ТТН НП" : "Preview NP Waybill"}
              </span>
              <span className="font-mono font-medium text-obsidian">
                {placedOrder.trackingNumber}
              </span>
            </div>
            <div className="flex justify-between border-t border-sand py-2">
              <span className="text-umber">{lang === "uk" ? "Доставка" : "Delivery"}</span>
              <span className="text-right text-obsidian">
                {placedOrder.city}, {placedOrder.branch}
              </span>
            </div>
            <div className="flex justify-between border-t border-sand py-2 font-medium">
              <span className="text-umber">{t("cart.total")}</span>
              <span className="text-obsidian">
                {formatPrice(placedOrder.total, lang)}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openOverlay("account")}
              className="btn-tactile rounded-full bg-obsidian px-7 py-4 text-xs font-medium tracking-[0.16em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
            >
              {lang === "uk" ? "Відкрити в кабінеті" : "View in Account"}
            </button>
            <Link
              href="/catalog"
              className="btn-tactile rounded-full border border-sand-dark px-7 py-4 text-xs font-medium tracking-[0.16em] text-obsidian uppercase hover:border-obsidian"
            >
              {t("checkout.backCatalog")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 lg:pt-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <p className="eyebrow text-bronze-dark">{t("checkout.eyebrow")}</p>
        <h1 className="mt-2 font-editorial text-4xl font-medium text-obsidian sm:text-5xl">
          {t("checkout.title")}
        </h1>

        {cartItems.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-sand bg-alabaster p-12 text-center">
            <Package className="mx-auto h-8 w-8 text-umber" strokeWidth={1.4} />
            <p className="mt-4 font-editorial text-2xl text-obsidian">
              {t("cart.emptyTitle")}
            </p>
            <Link
              href="/catalog"
              className="btn-tactile mt-6 inline-flex rounded-full bg-obsidian px-7 py-3.5 text-xs font-medium tracking-[0.16em] text-pearl uppercase"
            >
              {t("hero.ctaPrimary")}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start"
          >
            {/* Left: 3 Checkout Steps */}
            <div className="space-y-6 lg:col-span-7">
              {/* Quick Apple/Google prompt if not logged in */}
              {!user && (
                <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-bronze/40 bg-alabaster p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-bronze-dark" />
                    <p className="text-sm text-espresso">
                      {lang === "uk"
                        ? "Увійдіть через Apple або Google, щоб зберегти ТТН і чек у кабінеті."
                        : "Sign in with Apple or Google to save tracking and receipts in your Account."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openOverlay("account")}
                    className="btn-tactile shrink-0 rounded-full bg-obsidian px-5 py-2.5 text-xs font-medium tracking-[0.14em] text-pearl uppercase"
                  >
                    {lang === "uk" ? "Увійти" : "Sign In"}
                  </button>
                </div>
              )}

              {/* Step 1: Recipient */}
              <div className="rounded-3xl border border-sand bg-alabaster p-6 sm:p-8">
                <h2 className="font-editorial text-2xl font-medium text-obsidian">
                  {t("checkout.step1")}
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="chk-name"
                      className="mb-1.5 block text-xs font-medium text-espresso"
                    >
                      {t("auth.nameLabel")} *
                    </label>
                    <input
                      id="chk-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={lang === "uk" ? "Олена Коваленко" : "Olena Kovalenko"}
                      className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="chk-email"
                      className="mb-1.5 block text-xs font-medium text-espresso"
                    >
                      Email *
                    </label>
                    <input
                      id="chk-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="chk-phone"
                      className="mb-1.5 block text-xs font-medium text-espresso"
                    >
                      {lang === "uk" ? "Телефон *" : "Phone *"}
                    </label>
                    <input
                      id="chk-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+380 (63) 000-00-00"
                      className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Nova Poshta */}
              <div className="rounded-3xl border border-sand bg-alabaster p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-editorial text-2xl font-medium text-obsidian">
                    {t("checkout.step2")}
                  </h2>
                  <Truck className="h-5 w-5 text-bronze-dark" />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "branch", uk: "Відділення", en: "Branch" },
                      { id: "locker", uk: "Поштомат", en: "Locker" },
                      { id: "courier", uk: "Кур'єр", en: "Courier" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDeliveryType(opt.id)}
                      className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-medium tracking-wide transition-colors ${
                        deliveryType === opt.id
                          ? "border-obsidian bg-obsidian text-pearl"
                          : "border-sand bg-travertine/60 text-espresso hover:border-bronze"
                      }`}
                    >
                      {opt[lang]}
                    </button>
                  ))}
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="chk-city"
                      className="mb-1.5 block text-xs font-medium text-espresso"
                    >
                      <MapPin className="mr-1 inline h-3.5 w-3.5 text-bronze-dark" />
                      {lang === "uk" ? "Місто" : "City"} *
                    </label>
                    <input
                      id="chk-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {POPULAR_CITIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCity(c);
                            setBranch(
                              NP_BRANCHES_BY_CITY[c]?.[0] ?? `Відділення №1 (${c})`
                            );
                          }}
                          className="rounded-full border border-sand bg-travertine px-3 py-1 text-[11px] text-umber hover:border-bronze hover:text-obsidian"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="chk-branch"
                      className="mb-1.5 block text-xs font-medium text-espresso"
                    >
                      {deliveryType === "courier"
                        ? lang === "uk"
                          ? "Адреса доставки"
                          : "Street Address"
                        : lang === "uk"
                          ? "Відділення або поштомат Нової Пошти"
                          : "Nova Poshta Branch or Locker"}
                    </label>
                    {deliveryType === "courier" ? (
                      <input
                        id="chk-branch"
                        type="text"
                        required
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder={lang === "uk" ? "вул. ..." : "Street, apt..."}
                        className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian"
                      />
                    ) : (
                      <select
                        id="chk-branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian"
                      >
                        {branchOptions.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Payment */}
              <div className="rounded-3xl border border-sand bg-alabaster p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-editorial text-2xl font-medium text-obsidian">
                    {t("checkout.step3")}
                  </h2>
                  <CreditCard className="h-5 w-5 text-bronze-dark" />
                </div>

                <div className="mt-5 space-y-2.5">
                  {(
                    [
                      {
                        id: "apple-monobank",
                        title: "Apple Pay / Google Pay / Monobank",
                        sub:
                          lang === "uk"
                            ? "Миттєва онлайн-оплата без комісії"
                            : "Instant zero-fee online checkout",
                      },
                      {
                        id: "card",
                        title: lang === "uk" ? "Банківська картка Visa / Mastercard" : "Visa / Mastercard",
                        sub: "LiqPay / WayForPay",
                      },
                      {
                        id: "cod",
                        title: lang === "uk" ? "Оплата при отриманні (Нова Пошта)" : "Pay on Pickup (Nova Poshta)",
                        sub:
                          lang === "uk"
                            ? "Комісія перевізника 20 ₴ + 2%"
                            : "Carrier fee applies",
                      },
                    ] as const
                  ).map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors ${
                        paymentMethod === pm.id
                          ? "border-obsidian bg-obsidian text-pearl"
                          : "border-sand bg-travertine/55 text-obsidian hover:border-bronze"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">{pm.title}</p>
                        <p
                          className={`mt-0.5 text-xs ${
                            paymentMethod === pm.id ? "text-pearl/70" : "text-umber"
                          }`}
                        >
                          {pm.sub}
                        </p>
                      </div>
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          paymentMethod === pm.id
                            ? "border-bronze bg-bronze"
                            : "border-sand-dark"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sticky Summary */}
            <div className="lg:sticky lg:top-24 lg:col-span-5">
              <div className="rounded-3xl border border-sand bg-alabaster p-6 sm:p-8">
                <h2 className="font-editorial text-2xl font-medium text-obsidian">
                  {lang === "uk" ? "Ваше замовлення" : "Order Summary"}
                </h2>

                <ul className="mt-5 divide-y divide-sand">
                  {cartItems.map((item) => {
                    if (item.kind === "bundle") {
                      const b = BUNDLES.find((x) => x.id === item.id);
                      if (!b) return null;
                      return (
                        <li
                          key={`sum-b-${b.id}`}
                          className="flex items-center justify-between gap-3 py-3 text-sm"
                        >
                          <span className="text-espresso">
                            {b.name[lang]} × {item.qty}
                          </span>
                          <span className="font-medium text-obsidian">
                            {formatPrice(b.bundlePrice * item.qty, lang)}
                          </span>
                        </li>
                      );
                    }
                    const p = getProductById(item.id);
                    if (!p) return null;
                    const v = p.variants[item.variantIndex] ?? p.variants[0];
                    const price = (v ? v.price : p.price) * item.qty;
                    return (
                      <li
                        key={`sum-p-${p.id}-${item.variantIndex}`}
                        className="flex items-center justify-between gap-3 py-3 text-sm"
                      >
                        <span className="text-espresso">
                          {p.line ? p.line[lang] : p.name[lang]} ({v?.label[lang]}) ×{" "}
                          {item.qty}
                        </span>
                        <span className="font-medium text-obsidian">
                          {formatPrice(price, lang)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-5 space-y-2 border-t border-sand pt-4 text-sm">
                  <div className="flex justify-between text-umber">
                    <span>{t("cart.subtotal")}</span>
                    <span>{formatPrice(cartSubtotal, lang)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sage">
                      <span>{t("cart.discount")}</span>
                      <span>−{formatPrice(discountAmount, lang)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-umber">
                    <span>{t("cart.shipping")}</span>
                    <span className={freeShipping ? "font-medium text-sage" : ""}>
                      {freeShipping ? t("cart.shippingFree") : t("cart.shippingCalc")}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-sand pt-3 text-lg font-medium text-obsidian">
                    <span>{t("cart.total")}</span>
                    <span>{formatPrice(cartTotal, lang)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-tactile mt-6 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-obsidian px-6 py-4 text-xs font-medium tracking-[0.18em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{t("checkout.placeOrder")}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
