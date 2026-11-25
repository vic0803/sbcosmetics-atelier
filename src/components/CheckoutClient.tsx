"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Minus,
  Plus,
  Truck,
  UserCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore, type OrderRecord } from "@/context/StoreContext";
import { BUNDLES } from "@/data/bundles";
import { getProductById } from "@/data/products";
import { formatPrice } from "@/lib/format";

const POPULAR_CITIES = [
  "Львів",
  "Київ",
  "Одеса",
  "Дніпро",
  "Харків",
  "Івано-Франківськ",
];

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
    promoCode,
    discountAmount,
    cartTotal,
    freeShippingThreshold,
    applyPromo,
    clearPromo,
    recordOrder,
    clearCart,
  } = useStore();

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [deliveryType, setDeliveryType] = useState<
    "branch" | "locker" | "courier"
  >("branch");
  const [city, setCity] = useState(user?.city ?? "Львів");
  const [branch, setBranch] = useState(
    user?.npBranch ?? "Відділення №12 (вул. Сахарова, 42)"
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "apple-monobank" | "card" | "cod"
  >("apple-monobank");
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);

  // Prefill recipient fields once user hydrates from localStorage
  useEffect(() => {
    if (!user) return;
    setFullName((prev) => prev || user.name);
    setEmail((prev) => prev || user.email);
    setPhone((prev) => prev || user.phone);
    setCity((prev) => prev || user.city);
    setBranch((prev) => prev || user.npBranch);
  }, [user]);

  const freeShipping = cartTotal >= freeShippingThreshold;
  const remaining = Math.max(0, freeShippingThreshold - cartTotal);
  const branchOptions = NP_BRANCHES_BY_CITY[city] ?? [
    `${lang === "uk" ? "Відділення №1" : "Branch #1"} (${city})`,
    `${lang === "uk" ? "Поштомат №1042" : "Locker #1042"} (${city})`,
  ];

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

  const inputClass =
    "w-full rounded-none border border-parchment-line bg-transparent px-4 py-3 text-sm text-ink placeholder:text-muted/65 transition-colors focus:border-ink";
  const labelClass =
    "mb-2 block text-[11px] font-semibold tracking-[0.12em] text-muted uppercase";

  if (placedOrder) {
    return (
      <div
        data-header-theme="parchment"
        className="min-h-[80vh] bg-parchment pt-28 pb-24 lg:pt-36"
      >
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-sage uppercase">
            <Check className="h-4 w-4" strokeWidth={2} />
            <span className="tabular-nums">{placedOrder.id}</span>
          </div>

          <h1 className="mt-4 font-display text-3xl leading-[1.08] font-bold tracking-[-0.015em] text-ink sm:text-5xl">
            {t("checkout.successTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {t("checkout.successDesc")}
          </p>

          <dl className="mt-10 divide-y divide-parchment-line border-y border-parchment-line text-sm">
            <div className="flex items-baseline justify-between gap-4 py-3.5">
              <dt className="text-xs font-medium tracking-[0.1em] text-muted uppercase">
                {lang === "uk" ? "Орієнтовна ТТН НП" : "Preview NP Waybill"}
              </dt>
              <dd className="font-mono font-medium text-ink tabular-nums">
                {placedOrder.trackingNumber}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3.5">
              <dt className="text-xs font-medium tracking-[0.1em] text-muted uppercase">
                {lang === "uk" ? "Доставка" : "Delivery"}
              </dt>
              <dd className="text-right text-ink">
                {placedOrder.city}, {placedOrder.branch}
              </dd>
            </div>
            {placedOrder.itemsSummary && (
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-xs font-medium tracking-[0.1em] text-muted uppercase">
                  {lang === "uk" ? "Склад" : "Items"}
                </dt>
                <dd className="max-w-sm text-right text-ink-soft">
                  {placedOrder.itemsSummary}
                </dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-xs font-semibold tracking-[0.14em] text-ink uppercase">
                {t("cart.total")}
              </dt>
              <dd className="font-display text-2xl font-bold text-ink tabular-nums">
                {formatPrice(placedOrder.total, lang)}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openOverlay("account")}
              className="btn-tactile flex min-h-[52px] items-center justify-center gap-2 rounded-none bg-[#7CCBE0] px-7 py-4 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-pearl"
            >
              <span>
                {lang === "uk" ? "Відкрити в кабінеті" : "View in Account"}
              </span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <Link
              href="/catalog"
              className="btn-tactile flex min-h-[52px] items-center justify-center rounded-none border border-parchment-line px-7 py-4 text-xs font-semibold tracking-[0.14em] text-ink uppercase hover:border-ink"
            >
              {t("checkout.backCatalog")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-header-theme="parchment"
      className="min-h-[85vh] bg-parchment pt-24 pb-28 sm:pt-28 lg:pt-32 lg:pb-24"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Quiet Breadcrumb / Back link */}
        <div className="pb-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.7} />
            <span>{t("checkout.backCatalog")}</span>
          </Link>
        </div>

        {/* Editorial Title */}
        <div className="border-b border-parchment-line pb-8">
          <p className="eyebrow inline-flex items-center gap-2.5 text-ink/75">
            <span className="h-[1.5px] w-6 bg-accent" />
            <span>{t("checkout.eyebrow")}</span>
          </p>
          <h1 className="mt-2.5 font-display text-3xl leading-[1.06] font-bold tracking-[-0.015em] text-ink sm:text-4xl lg:text-5xl">
            {t("checkout.title")}
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="max-w-md py-16">
            <p className="font-display text-2xl font-bold tracking-[-0.015em] text-ink">
              {t("cart.emptyTitle")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t("cart.emptySub")}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalog"
                className="btn-tactile flex min-h-[50px] items-center justify-center gap-2 rounded-none bg-[#7CCBE0] px-7 py-3.5 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-pearl"
              >
                <span>{t("hero.ctaPrimary")}</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
              <Link
                href="/quiz"
                className="btn-tactile flex min-h-[50px] items-center justify-center rounded-none border border-parchment-line px-6 py-3.5 text-xs font-semibold tracking-[0.14em] text-ink uppercase hover:border-ink"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-14"
          >
            {/* Left: 3 Open Editorial Steps (Zero White Boxes) */}
            <div className="space-y-10 lg:col-span-7">
              {/* Quiet Auth Prompt if not signed in */}
              {!user && (
                <div className="flex flex-col items-start justify-between gap-4 border-b border-parchment-line pb-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <UserCheck
                      className="h-4 w-4 shrink-0 text-accent"
                      strokeWidth={1.7}
                    />
                    <p className="text-xs leading-relaxed text-ink-soft sm:text-sm">
                      {lang === "uk"
                        ? "Увійдіть через Apple або Google, щоб зберегти ТТН і чек у кабінеті."
                        : "Sign in with Apple or Google to save tracking and receipts in your Account."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openOverlay("account")}
                    className="btn-tactile shrink-0 rounded-none border border-parchment-line px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink uppercase hover:border-ink hover:bg-ink hover:text-pearl"
                  >
                    {lang === "uk" ? "Увійти" : "Sign In"}
                  </button>
                </div>
              )}

              {/* Step 01: Recipient */}
              <section>
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-semibold tracking-[0.16em] text-accent tabular-nums">
                    01
                  </span>
                  <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-ink sm:text-2xl">
                    {t("checkout.step1").replace(/^\d+\.\s*/, "")}
                  </h2>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="chk-name" className={labelClass}>
                      {t("auth.nameLabel")} *
                    </label>
                    <input
                      id="chk-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={
                        lang === "uk" ? "Олена Коваленко" : "Olena Kovalenko"
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="chk-email" className={labelClass}>
                      Email *
                    </label>
                    <input
                      id="chk-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="chk-phone" className={labelClass}>
                      {lang === "uk" ? "Телефон *" : "Phone *"}
                    </label>
                    <input
                      id="chk-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+380 (63) 000-00-00"
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              {/* Step 02: Nova Poshta */}
              <section className="border-t border-parchment-line pt-10">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-semibold tracking-[0.16em] text-accent tabular-nums">
                      02
                    </span>
                    <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-ink sm:text-2xl">
                      {t("checkout.step2").replace(/^\d+\.\s*/, "")}
                    </h2>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs ${
                      freeShipping ? "font-medium text-sage" : "text-muted"
                    }`}
                  >
                    <Truck className="h-3.5 w-3.5" strokeWidth={1.6} />
                    {freeShipping ? (
                      <span>{t("cart.shippingFree")}</span>
                    ) : (
                      <span className="tabular-nums">
                        {lang === "uk"
                          ? `Безкоштовно від ${formatPrice(freeShippingThreshold, lang)}`
                          : `Free from ${formatPrice(freeShippingThreshold, lang)}`}
                      </span>
                    )}
                  </span>
                </div>

                {/* Hairline Segmented Delivery Type Selector (No Black Blocks) */}
                <div className="mt-6 grid grid-cols-3 divide-x divide-parchment-line border border-parchment-line">
                  {(
                    [
                      { id: "branch", uk: "Відділення", en: "Branch" },
                      { id: "locker", uk: "Поштомат", en: "Locker" },
                      { id: "courier", uk: "Кур'єр", en: "Courier" },
                    ] as const
                  ).map((opt) => {
                    const active = deliveryType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setDeliveryType(opt.id);
                          if (opt.id === "courier") {
                            setBranch("");
                          } else {
                            setBranch(
                              NP_BRANCHES_BY_CITY[city]?.[0] ??
                                `${lang === "uk" ? "Відділення №1" : "Branch #1"} (${city})`
                            );
                          }
                        }}
                        className={`relative min-h-[46px] rounded-none px-3 py-2.5 text-xs tracking-[0.1em] uppercase transition-colors ${
                          active
                            ? "bg-accent-soft/65 font-semibold text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-accent"
                            : "bg-transparent font-medium text-muted hover:text-ink"
                        }`}
                      >
                        {opt[lang]}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="chk-city" className={labelClass}>
                      {lang === "uk" ? "Місто" : "City"} *
                    </label>
                    <input
                      id="chk-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={inputClass}
                    />
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {POPULAR_CITIES.map((c) => {
                        const isSelected = city === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setCity(c);
                              if (deliveryType !== "courier") {
                                setBranch(
                                  NP_BRANCHES_BY_CITY[c]?.[0] ??
                                    `${lang === "uk" ? "Відділення №1" : "Branch #1"} (${c})`
                                );
                              }
                            }}
                            className={`rounded-none border px-2.5 py-1 text-[11px] transition-colors ${
                              isSelected
                                ? "border-ink font-medium text-ink"
                                : "border-parchment-line text-muted hover:border-ink/50 hover:text-ink"
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="chk-branch" className={labelClass}>
                      {deliveryType === "courier"
                        ? lang === "uk"
                          ? "Адреса доставки *"
                          : "Street Address *"
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
                        placeholder={
                          lang === "uk"
                            ? "вул. Сахарова, 42, кв. 10"
                            : "42 Sakharova St, apt. 10"
                        }
                        className={inputClass}
                      />
                    ) : (
                      <select
                        id="chk-branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className={`${inputClass} bg-parchment`}
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
              </section>

              {/* Step 03: Payment */}
              <section className="border-t border-parchment-line pt-10">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-semibold tracking-[0.16em] text-accent tabular-nums">
                    03
                  </span>
                  <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-ink sm:text-2xl">
                    {t("checkout.step3").replace(/^\d+\.\s*/, "")}
                  </h2>
                </div>

                <div className="mt-6 divide-y divide-parchment-line border-y border-parchment-line">
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
                        title:
                          lang === "uk"
                            ? "Банківська картка Visa / Mastercard"
                            : "Visa / Mastercard",
                        sub: "LiqPay / WayForPay",
                      },
                      {
                        id: "cod",
                        title:
                          lang === "uk"
                            ? "Оплата при отриманні (Нова Пошта)"
                            : "Pay on Pickup (Nova Poshta)",
                        sub:
                          lang === "uk"
                            ? "Комісія перевізника 20 ₴ + 2%"
                            : "Carrier fee applies",
                      },
                    ] as const
                  ).map((pm) => {
                    const active = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`flex w-full items-center gap-4 px-4 py-4 text-left transition-colors ${
                          active
                            ? "border-l-2 border-accent bg-accent-soft/45 pl-[14px]"
                            : "hover:bg-surface-soft/35"
                        }`}
                      >
                        {/* Architectural 90-degree selector */}
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-none border ${
                            active ? "border-ink" : "border-line-strong"
                          }`}
                        >
                          {active && (
                            <span className="h-2 w-2 rounded-none bg-accent" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-ink">
                            {pm.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted">{pm.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Right: Dedicated Sticky Order Summary Column (mirrors PDP Buy Column) */}
            <aside className="border-t border-parchment-line pt-10 lg:sticky lg:top-28 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-sm font-bold tracking-[0.16em] text-ink uppercase">
                  {lang === "uk" ? "Ваше замовлення" : "Order Summary"}
                </h2>
                <button
                  type="button"
                  onClick={() => openOverlay("cart")}
                  className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-ink"
                >
                  {lang === "uk" ? "Редагувати" : "Edit bag"}
                </button>
              </div>

              {/* Items with sharp 90° thumbnails */}
              <ul className="mt-5 divide-y divide-parchment-line border-t border-parchment-line">
                {cartItems.map((item) => {
                  if (item.kind === "bundle") {
                    const b = BUNDLES.find((x) => x.id === item.id);
                    if (!b) return null;
                    return (
                      <li
                        key={`sum-b-${b.id}`}
                        className="flex items-center gap-3.5 py-4"
                      >
                        <div className="h-[64px] w-[52px] shrink-0 overflow-hidden rounded-none bg-surface-soft">
                          <img
                            src={b.image}
                            alt={b.name[lang]}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm font-bold text-ink">
                            {b.name[lang]}
                          </p>
                          <p className="mt-0.5 text-xs text-muted tabular-nums">
                            {b.badge[lang]} · × {item.qty}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-ink tabular-nums">
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
                      className="flex items-center gap-3.5 py-4"
                    >
                      <Link
                        href={`/product/${p.id}`}
                        className="h-[64px] w-[52px] shrink-0 overflow-hidden rounded-none bg-surface-soft"
                      >
                        <img
                          src={p.image}
                          alt={p.name[lang]}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${p.id}`}
                          className="block truncate font-display text-sm font-bold text-ink transition-colors hover:text-accent"
                        >
                          {p.line ? p.line[lang] : p.name[lang]}
                        </Link>
                        <p className="mt-0.5 truncate text-xs text-muted tabular-nums">
                          {v ? `${v.label[lang]} · ` : ""}× {item.qty}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-ink tabular-nums">
                        {formatPrice(price, lang)}
                      </span>
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
                        <Minus
                          className="h-3.5 w-3.5 text-muted"
                          strokeWidth={1.7}
                        />
                      ) : (
                        <Plus
                          className="h-3.5 w-3.5 text-muted"
                          strokeWidth={1.7}
                        />
                      )}
                    </button>

                    {promoOpen && (
                      <div className="mt-3">
                        <div className="flex items-stretch gap-2">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => {
                              setPromoInput(e.target.value);
                              if (promoError) setPromoError(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyPromo(e);
                              }
                            }}
                            aria-label={t("cart.promoPlaceholder")}
                            placeholder={t("cart.promoPlaceholder")}
                            className="min-w-0 flex-1 rounded-none border border-parchment-line bg-transparent px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-ink"
                          />
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            className="btn-tactile shrink-0 rounded-none border border-ink px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-pearl"
                          >
                            {t("cart.promoApply")}
                          </button>
                        </div>
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

              {/* Totals Breakdown */}
              <div className="space-y-2 border-t border-parchment-line pt-4 text-xs">
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
                      freeShipping ? "font-medium text-sage" : "tabular-nums"
                    }
                  >
                    {freeShipping
                      ? t("cart.shippingFree")
                      : t("cart.shippingCalc")}
                  </span>
                </div>

                {!freeShipping && (
                  <p className="pt-1 text-[11px] text-muted tabular-nums">
                    {lang === "uk"
                      ? `До безкоштовної доставки ще ${formatPrice(remaining, lang)}`
                      : `Add ${formatPrice(remaining, lang)} more for free shipping`}
                  </p>
                )}

                <div className="flex items-baseline justify-between border-t border-parchment-line pt-4">
                  <span className="text-xs font-semibold tracking-[0.14em] text-ink uppercase">
                    {t("cart.total")}
                  </span>
                  <span className="font-display text-2xl leading-none font-bold tracking-[-0.015em] text-ink tabular-nums">
                    {formatPrice(cartTotal, lang)}
                  </span>
                </div>
              </div>

              {/* Signature Primary CTA */}
              <button
                type="submit"
                className="btn-tactile mt-6 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-none bg-[#7CCBE0] px-6 py-4 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-pearl"
              >
                <Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>{t("checkout.placeOrder")}</span>
              </button>

              <p className="mt-3.5 text-center text-[11px] text-muted">
                {t("pdp.trustShipping")} · {t("pdp.trustBatch")}
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
