"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import type { TranslationKey } from "@/data/i18n";
import {
  getCategoryLabel,
  getRitualPairings,
  getStepLabel,
  type Product,
  type SkinType,
} from "@/data/products";
import { formatPrice } from "@/lib/format";

const SKIN_TYPE_KEYS: Record<SkinType, TranslationKey> = {
  dry: "pdp.skin.dry",
  combo: "pdp.skin.combo",
  oily: "pdp.skin.oily",
  sensitive: "pdp.skin.sensitive",
  all: "pdp.skin.all",
};

const AM_PM_KEYS: Record<Product["amPm"], TranslationKey> = {
  "am-pm": "pdp.amPm.am-pm",
  am: "pdp.amPm.am",
  pm: "pdp.amPm.pm",
};

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
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string>("benefits");
  const [footerVisible, setFooterVisible] = useState(false);

  const mobileTrackRef = useRef<HTMLDivElement>(null);

  const galleryCount = product.gallery.length;
  const variant = product.variants[0];
  const unitPrice = variant ? variant.price : product.price;
  const lineTotal = unitPrice * qty;
  const liked = isWishlisted(product.id);
  const pairings = getRitualPairings(product);
  const showStickyBar = !footerVisible;

  const specificSkinTypes = product.skinTypes.filter((s) => s !== "all");
  const skinTypeSummary =
    specificSkinTypes.length > 0
      ? specificSkinTypes.map((s) => t(SKIN_TYPE_KEYS[s])).join(", ")
      : t("pdp.skin.all");

  // Keep mobile sticky buy bar visible across PDP and hide smoothly when footer enters viewport
  useEffect(() => {
    const footerEl = document.querySelector("footer");
    if (!footerEl) return;

    const footerObs = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    footerObs.observe(footerEl);

    return () => {
      footerObs.disconnect();
    };
  }, []);

  const selectImage = useCallback(
    (idx: number) => {
      const clamped = (idx + galleryCount) % galleryCount;
      setActiveImage(clamped);
      const track = mobileTrackRef.current;
      if (track) {
        track.scrollTo({
          left: clamped * track.clientWidth,
          behavior: "smooth",
        });
      }
    },
    [galleryCount]
  );

  const handleMobileGalleryScroll = () => {
    const track = mobileTrackRef.current;
    if (!track || track.clientWidth === 0) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    if (idx !== activeImage && idx >= 0 && idx < galleryCount) {
      setActiveImage(idx);
    }
  };

  const handleAdd = () => {
    addProductToCart(product.id, qty, 0);
    openOverlay("cart");
  };

  const badgeLabel =
    product.badge === "bestseller"
      ? lang === "uk"
        ? "Хіт"
        : "Hit"
      : "New";

  const activesGridClass =
    product.actives.length === 2
      ? "sm:grid-cols-2"
      : product.actives.length === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div
      data-header-theme="parchment"
      className="bg-parchment pt-24 pb-36 sm:pt-28 lg:pt-32 lg:pb-24"
    >
      <div className="mx-auto max-w-[1560px] px-4 sm:px-8 lg:px-12">
        {/* Quiet Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 pb-5 text-[11px] font-medium tracking-[0.14em] text-muted uppercase"
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

        {/* Main Editorial Split (2-col on lg, 3-col with dedicated sticky Buy column on xl+) */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12 xl:gap-14">
          {/* Left: Dominant Full-Bleed Editorial Gallery */}
          <div className="lg:col-span-7 xl:col-span-5">
            <div className="lg:sticky lg:top-28">
              {/* Mobile Swipeable Gallery (< lg) */}
              <div className="relative lg:hidden">
                <div
                  ref={mobileTrackRef}
                  onScroll={handleMobileGalleryScroll}
                  className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto bg-surface-soft"
                >
                  {product.gallery.map((src, idx) => (
                    <div
                      key={`${src}-${idx}`}
                      className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden bg-surface-soft sm:aspect-[3/4]"
                    >
                      <img
                        src={src}
                        alt={
                          idx === 0
                            ? product.name[lang]
                            : `${product.name[lang]} — ${idx + 1}`
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {product.badge && (
                  <span className="pointer-events-none absolute top-4 left-4 border-l-2 border-accent bg-ink/90 px-3 py-1.5 text-[11px] leading-none font-bold tracking-[0.16em] text-accent uppercase">
                    {badgeLabel}
                  </span>
                )}

                {galleryCount > 1 && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    {product.gallery.map((src, idx) => (
                      <button
                        key={`${src}-bar-${idx}`}
                        type="button"
                        onClick={() => selectImage(idx)}
                        aria-label={`${product.name[lang]} — ${idx + 1}`}
                        className="group flex flex-1 max-w-14 items-center py-2"
                      >
                        <span
                          className={`block h-[2px] w-full transition-colors duration-300 ${
                            activeImage === idx
                              ? "bg-ink"
                              : "bg-line-strong group-hover:bg-ink/50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Gallery (lg+) */}
              <div className="hidden space-y-3 lg:block">
                <div className="group relative aspect-[4/5] max-h-[78svh] w-full overflow-hidden rounded-none bg-surface-soft">
                  <img
                    key={product.gallery[activeImage] ?? product.image}
                    src={product.gallery[activeImage] ?? product.image}
                    alt={product.name[lang]}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
                  />

                  {product.badge && (
                    <span className="absolute top-5 left-5 border-l-2 border-accent bg-ink/90 px-3.5 py-1.5 text-[11px] leading-none font-bold tracking-[0.16em] text-accent uppercase">
                      {badgeLabel}
                    </span>
                  )}

                  {galleryCount > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => selectImage(activeImage - 1)}
                        aria-label="Previous image"
                        className="btn-tactile absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-none bg-parchment/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-ink hover:text-pearl"
                      >
                        <ChevronLeft className="h-5 w-5" strokeWidth={1.7} />
                      </button>
                      <button
                        type="button"
                        onClick={() => selectImage(activeImage + 1)}
                        aria-label="Next image"
                        className="btn-tactile absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-none bg-parchment/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-ink hover:text-pearl"
                      >
                        <ChevronRight className="h-5 w-5" strokeWidth={1.7} />
                      </button>
                    </>
                  )}
                </div>

                {galleryCount > 1 && (
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div className="flex gap-2.5">
                      {product.gallery.map((src, idx) => (
                        <button
                          key={`${src}-${idx}`}
                          type="button"
                          onClick={() => selectImage(idx)}
                          aria-label={`${product.name[lang]} — ${idx + 1}`}
                          className={`relative h-20 w-16 overflow-hidden rounded-none border-b-2 bg-surface-soft transition-opacity ${
                            activeImage === idx
                              ? "border-accent opacity-100"
                              : "border-transparent opacity-55 hover:opacity-100"
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
                    <span className="text-[11px] font-medium tracking-[0.18em] text-muted tabular-nums">
                      {String(activeImage + 1).padStart(2, "0")} /{" "}
                      {String(galleryCount).padStart(2, "0")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center: Seamless Editorial Info, Ledger & Accordions */}
          <div className="lg:col-span-5 lg:pt-2 xl:col-span-4">
            {/* Step Eyebrow */}
            <p className="eyebrow inline-flex items-center gap-2.5 text-ink/75">
              <span className="h-[1.5px] w-6 bg-accent" />
              <span>{getStepLabel(product.ritualStep, lang)}</span>
            </p>

            {/* Title + Bare Wishlist Heart */}
            <div className="mt-3 flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl leading-[1.02] font-bold tracking-[-0.015em] text-ink uppercase sm:text-4xl lg:text-[44px]">
                {product.line ? product.line[lang] : product.name[lang]}
              </h1>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={
                  liked
                    ? t("common.removedFromWishlist")
                    : t("common.savedToWishlist")
                }
                aria-pressed={liked}
                className={`btn-tactile -mr-1.5 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center transition-colors ${
                  liked ? "text-accent" : "text-ink/75 hover:text-accent"
                }`}
              >
                <Heart
                  className="h-6 w-6"
                  strokeWidth={1.6}
                  fill={liked ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Clean Subtitle (Product Type + Volume) */}
            <p className="mt-1.5 text-base font-medium text-ink-soft sm:text-lg">
              {product.productType[lang]}
              {variant ? (
                <span className="font-normal text-muted">
                  {" "}
                  · {variant.label[lang]}
                </span>
              ) : null}
            </p>

            {/* Rating + Texture */}
            <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted sm:text-[13px]">
              <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                {product.rating.toFixed(2)}
                <span className="font-normal text-muted">
                  ({product.reviews} {t("pdp.reviewsLabel")})
                </span>
              </span>
              <span className="text-line-strong">·</span>
              <span>{product.texture[lang]}</span>
            </div>

            {/* Short Sensory Tagline */}
            <p className="mt-4 text-sm leading-relaxed text-ink-soft/85 sm:text-[15px]">
              {product.shortTagline[lang]}
            </p>

            {/* Tablet/Laptop Buy Controls (lg only; mobile uses sticky bar, xl+ uses dedicated right column) */}
            <div className="mt-7 hidden border-t border-parchment-line pt-6 lg:block xl:hidden">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center text-ink/70 transition-colors hover:text-ink"
                  >
                    <Minus className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <span className="min-w-7 text-center text-lg font-medium text-ink tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center text-ink/70 transition-colors hover:text-ink"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>

                <span className="font-display text-[34px] leading-none font-bold tracking-[-0.015em] text-ink tabular-nums">
                  {formatPrice(lineTotal, lang)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="btn-tactile mt-5 flex min-h-[56px] w-full items-center justify-center gap-3 rounded-none bg-[#7CCBE0] px-7 py-4 text-sm font-bold tracking-[0.12em] text-ink uppercase hover:bg-ink hover:text-pearl"
              >
                <span>{t("common.addToCart")}</span>
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            </div>

            {/* Aesop-Style Borderless Ledger (Pure Hairlines on bg-paper) */}
            <dl className="mt-7 divide-y divide-parchment-line border-y border-parchment-line text-sm">
              <div className="grid grid-cols-12 items-baseline gap-3 py-3.5">
                <dt className="col-span-5 text-[11px] font-semibold tracking-[0.15em] text-muted uppercase">
                  {t("pdp.skinTypeLabel")}
                </dt>
                <dd className="col-span-7 text-ink">{skinTypeSummary}</dd>
              </div>
              <div className="grid grid-cols-12 items-baseline gap-3 py-3.5">
                <dt className="col-span-5 text-[11px] font-semibold tracking-[0.15em] text-muted uppercase">
                  {t("pdp.timeLabel")}
                </dt>
                <dd className="col-span-7 text-ink">
                  {t(AM_PM_KEYS[product.amPm])}
                </dd>
              </div>
              <div className="grid grid-cols-12 items-baseline gap-3 py-3.5">
                <dt className="col-span-5 text-[11px] font-semibold tracking-[0.15em] text-muted uppercase">
                  {lang === "uk" ? "Виробництво" : "Origin"}
                </dt>
                <dd className="col-span-7 text-ink">{t("pdp.trustBatch")}</dd>
              </div>
            </dl>

            {/* Minimalist Hairline Accordions (+ / −) */}
            <div className="mt-2 divide-y divide-parchment-line border-b border-parchment-line">
              {(
                [
                  {
                    key: "benefits",
                    title: t("pdp.benefits"),
                    content: (
                      <ul className="space-y-2.5 text-sm leading-relaxed text-ink-soft">
                        {product.benefits[lang].map((b) => (
                          <li key={b} className="flex items-start gap-2.5">
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                              strokeWidth={2}
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
                      onClick={() => setOpenAccordion(isOpen ? "" : sec.key)}
                      aria-expanded={isOpen}
                      className="flex min-h-[54px] w-full items-center justify-between py-4 text-left text-xs font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:text-accent"
                    >
                      <span>{sec.title}</span>
                      {isOpen ? (
                        <Minus
                          className="h-4 w-4 shrink-0 text-accent"
                          strokeWidth={1.75}
                        />
                      ) : (
                        <Plus
                          className="h-4 w-4 shrink-0 text-muted"
                          strokeWidth={1.75}
                        />
                      )}
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-5">{sec.content}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right (xl+): Dedicated Sticky Buy Column separated from editorial copy */}
          <aside className="hidden xl:col-span-3 xl:block">
            <div className="sticky top-28 border-l border-parchment-line pl-8">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                  {product.line ? product.line[lang] : product.name[lang]}
                </p>
                {variant && (
                  <span className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">
                    {variant.label[lang]}
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 border-t border-parchment-line pt-5">
                <div className="-ml-2 inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center text-ink/70 transition-colors hover:text-ink"
                  >
                    <Minus className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <span className="min-w-7 text-center text-lg font-medium text-ink tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center text-ink/70 transition-colors hover:text-ink"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>

                <span className="font-display text-3xl leading-none font-bold tracking-[-0.015em] text-ink tabular-nums">
                  {formatPrice(lineTotal, lang)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="btn-tactile mt-5 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-none bg-[#7CCBE0] px-6 py-4 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-pearl"
              >
                <span>{t("common.addToCart")}</span>
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={liked}
                className="mt-4 inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] text-muted transition-colors hover:text-ink"
              >
                <Heart
                  className={`h-4 w-4 ${liked ? "text-accent" : ""}`}
                  strokeWidth={1.7}
                  fill={liked ? "currentColor" : "none"}
                />
                <span>
                  {liked
                    ? t("common.savedToWishlist")
                    : t("common.save")}
                </span>
              </button>
            </div>
          </aside>
        </div>

        {/* Full-Width Open Editorial Band: Key Botanical Actives (Zero White Boxes) */}
        <section className="mt-20 border-t border-parchment-line pt-14 lg:mt-28 lg:pt-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow inline-flex items-center gap-2.5 text-ink/75">
                <span className="h-[1.5px] w-6 bg-accent" />
                <span>{t("pdp.keyActives")}</span>
              </p>
              <h2 className="mt-2.5 font-display text-2xl leading-[1.06] font-bold tracking-[-0.015em] text-ink uppercase sm:text-3xl lg:text-4xl">
                {product.name[lang]}
              </h2>
            </div>
          </div>

          <div
            className={`mt-10 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-parchment-line pt-8 ${activesGridClass}`}
          >
            {product.actives.map((act, idx) => (
              <div
                key={act.id}
                className="flex flex-col border-l border-parchment-line pl-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
                    {act.role[lang]}
                  </span>
                  <span className="text-[11px] font-medium tracking-[0.14em] text-muted/70 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl leading-snug font-bold text-ink">
                  {act.name[lang]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {act.note[lang]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Complete the Ritual: Mobile Swipe Carousel + Desktop 3-Col Grid */}
        {pairings.length > 0 && (
          <section className="mt-20 border-t border-parchment-line pt-14 lg:mt-28 lg:pt-20">
            <p className="eyebrow inline-flex items-center gap-2.5 text-ink/75">
              <span className="h-[1.5px] w-6 bg-accent" />
              <span>{t("pdp.pairSub")}</span>
            </p>
            <h2 className="mt-2.5 font-display text-2xl leading-[1.04] font-bold tracking-[-0.015em] text-ink uppercase sm:text-3xl lg:text-4xl">
              {t("pdp.pairTitle")}
            </h2>

            {/* Mobile horizontal swipe row (< sm) */}
            <div className="no-scrollbar -mx-4 mt-7 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 sm:hidden">
              {pairings.map((item, idx) => (
                <div
                  key={item.id}
                  className="w-[76vw] max-w-[300px] shrink-0 snap-start"
                >
                  <ProductCard
                    product={item}
                    layout="editorial"
                    density="compact"
                    showTypeAtRest
                    heightClassName="aspect-[4/5]"
                    index={idx}
                  />
                </div>
              ))}
            </div>

            {/* Tablet / Desktop Grid (sm+) */}
            <div className="mt-8 hidden gap-5 sm:grid sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
              {pairings.map((item, idx) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  layout="editorial"
                  density="compact"
                  showTypeAtRest
                  heightClassName="aspect-[3/4]"
                  index={idx}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* PERSISTENT MOBILE STICKY BUY BAR: Borderless Qty + Price above Full-Width CTA */}
      <div
        aria-hidden={!showStickyBar}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-parchment-line bg-parchment/96 px-4 pt-2.5 pb-[calc(0.85rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          showStickyBar
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto max-w-lg space-y-2.5">
          {/* Row 1: Borderless Quantity Stepper (Left) + Live Total Price (Right) */}
          <div className="flex items-center justify-between gap-4">
            <div className="-ml-2 inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                tabIndex={showStickyBar ? 0 : -1}
                aria-label="Decrease quantity"
                className="flex h-9 w-9 items-center justify-center text-ink/70 transition-colors hover:text-ink"
              >
                <Minus className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <span className="min-w-7 text-center text-lg font-medium text-ink tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                tabIndex={showStickyBar ? 0 : -1}
                aria-label="Increase quantity"
                className="flex h-9 w-9 items-center justify-center text-ink/70 transition-colors hover:text-ink"
              >
                <Plus className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <span className="font-display text-2xl leading-none font-bold tracking-[-0.015em] text-ink tabular-nums">
              {formatPrice(lineTotal, lang)}
            </span>
          </div>

          {/* Row 2: Full-Width Add to Bag CTA */}
          <button
            type="button"
            onClick={handleAdd}
            tabIndex={showStickyBar ? 0 : -1}
            className="btn-tactile flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-none bg-[#7CCBE0] px-6 py-3 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-pearl"
          >
            <span>{t("common.addToCart")}</span>
            <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
