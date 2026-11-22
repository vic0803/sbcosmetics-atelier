"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Instagram,
  Plus,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import {
  LineReveal,
  LUXURY_EASE,
  ParallaxMedia,
  Reveal,
} from "@/components/MotionPrimitives";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import { BUNDLES } from "@/data/bundles";
import { JOURNAL_ARTICLES } from "@/data/journal";
import { getProductById, PRODUCTS, type LocalizedText } from "@/data/products";
import { buildRitualRecommendation, type QuizGoal } from "@/data/quiz";
import { CLIENT_REVIEWS } from "@/data/reviews";
import { assetPath } from "@/lib/assets";
import { formatPrice } from "@/lib/format";

type ShowcaseTab = "hits" | "face" | "body-hair" | "sets";

interface ActiveAccordionItem {
  num: string;
  key: string;
  name: LocalizedText;
  role: LocalizedText;
  desc: LocalizedText;
  productIds: string[];
}

const INCI_ACCORDION: ActiveAccordionItem[] = [
  {
    num: "01",
    key: "hyaluronic",
    name: { uk: "Гіалуронова кислота", en: "Hyaluronic Acid" },
    role: { uk: "Глибоке зволоження", en: "Deep Hydration" },
    desc: {
      uk: "Біоферментована гіалуронова кислота притягує та утримує вологу всередині епідермісу, миттєво розгладжуючи лінії зневоднення без липкості.",
      en: "Bio-fermented hyaluronic acid binds water inside the epidermis, visibly plumping dehydration lines with zero sticky feel.",
    },
    productIds: ["serum-gel", "eye-cream"],
  },
  {
    num: "02",
    key: "aloe-co2",
    name: { uk: "CO₂-екстракт алое вера", en: "CO₂ Aloe Vera Extract" },
    role: { uk: "Чисте заспокоєння", en: "Pure Botanical Calm" },
    desc: {
      uk: "Надкритична екстракція без нагрівання зберігає 100% біоактивних полісахаридів, знімаючи почервоніння та сухість реактивної шкіри.",
      en: "Cold supercritical extraction preserves 100% of active polysaccharides to quiet redness and comfort reactive skin.",
    },
    productIds: ["serum-gel", "toner-aloe"],
  },
  {
    num: "03",
    key: "caffeine",
    name: { uk: "Кофеїн", en: "Botanical Caffeine" },
    role: { uk: "Дренаж і свіжий погляд", en: "Depuffing & Energy" },
    desc: {
      uk: "Активує ранкову мікроциркуляцію, помітно зменшує набряки під очима та прибирає сліди втоми вже за 10 хвилин.",
      en: "Stimulates morning microcirculation to visibly reduce under-eye puffiness and fatigue in 10 minutes.",
    },
    productIds: ["gel-mask", "eye-cream"],
  },
  {
    num: "04",
    key: "succinic",
    name: { uk: "Янтарна кислота 0,2%", en: "Succinic Acid 0.2%" },
    role: { uk: "Делікатне оновлення", en: "Gentle Daily Renewal" },
    desc: {
      uk: "М'яко вирівнює тон і текстуру пор без лущення, печіння чи фоточутливості — підходить навіть для щоденного догляду чутливої шкіри.",
      en: "Gently refines tone and pores without peeling or stinging—safe for everyday sensitive-skin glow.",
    },
    productIds: ["toner-aloe"],
  },
  {
    num: "05",
    key: "panthenol",
    name: { uk: "D-пантенол & Рослинні олії", en: "D-Panthenol & Plant Lipids" },
    role: { uk: "Захист бар'єру", en: "Lipid Barrier Seal" },
    desc: {
      uk: "Провітамін B5 у парі з холоднопресованими оліями мигдалю, виноградних кісточок та ши відновлюють ліпідний бар'єр від вітру й сухого повітря.",
      en: "Provitamin B5 paired with cold-pressed almond, grapeseed, and shea oils rebuild skin resilience against cold and dry air.",
    },
    productIds: ["day-cream", "body-cream"],
  },
];

const INLINE_QUIZ_GOALS: {
  goal: QuizGoal;
  title: LocalizedText;
  hint: LocalizedText;
  image: string;
}[] = [
  {
    goal: "hydration",
    title: { uk: "Зволоження і сяйво", en: "Hydration & Glow" },
    hint: { uk: "Стягнутість, тьмяність", en: "Tightness, dullness" },
    image: "/assets/products/serum-gel.jpg",
  },
  {
    goal: "eyes",
    title: { uk: "Свіжий погляд без набряків", en: "Rested Eyes & Depuff" },
    hint: { uk: "Ранкова втома під очима", en: "Morning eye fatigue" },
    image: "/assets/products/gel-mask.jpg",
  },
  {
    goal: "barrier",
    title: { uk: "Чутлива шкіра та бар'єр", en: "Sensitive & Barrier" },
    hint: { uk: "Почервоніння, сухість", en: "Redness, dryness" },
    image: "/assets/products/day-cream.jpg",
  },
  {
    goal: "clarity",
    title: { uk: "Чисті пори і баланс", en: "Clarity & Balance" },
    hint: { uk: "Блиск у Т-зоні, нерівний тон", en: "T-zone shine, uneven tone" },
    image: "/assets/products/toner-aloe.jpg",
  },
];

export function HomeClient() {
  const {
    lang,
    t,
    addProductToCart,
    addBundleToCart,
    addMultipleProductsToCart,
    openOverlay,
  } = useStore();

  // Act 2: Inline category showcase tab
  const [showcaseTab, setShowcaseTab] = useState<ShowcaseTab>("hits");
  // Act 4: Inline interactive quiz selection
  const [selectedGoal, setSelectedGoal] = useState<QuizGoal>("hydration");
  // Act 5: INCI accordion open key
  const [openActiveKey, setOpenActiveKey] = useState<string>("hyaluronic");
  // Act 6: Panoramic gift set selector
  const [selectedBundleIdx, setSelectedBundleIdx] = useState<number>(0);

  const showcaseProducts = (() => {
    if (showcaseTab === "face") {
      return PRODUCTS.filter((p) => p.category === "face").slice(0, 4);
    }
    if (showcaseTab === "body-hair") {
      return PRODUCTS.filter((p) => p.category === "body" || p.category === "hair").slice(0, 4);
    }
    return PRODUCTS.filter((p) => p.badge === "bestseller").slice(0, 4);
  })();

  const inlineProtocol = buildRitualRecommendation({
    skinType:
      selectedGoal === "barrier"
        ? "sensitive"
        : selectedGoal === "clarity"
          ? "oily"
          : "dry",
    goal: selectedGoal,
    intensity: "minimal",
    extra: "none",
  });

  const activeBundle = BUNDLES[selectedBundleIdx] ?? BUNDLES[0];

  const tabs: { key: ShowcaseTab; label: LocalizedText }[] = [
    { key: "hits", label: { uk: "Усі хіти", en: "Top Hits" } },
    { key: "face", label: { uk: "Обличчя", en: "Face" } },
    { key: "body-hair", label: { uk: "Тіло та волосся", en: "Body & Hair" } },
    { key: "sets", label: { uk: "Набори", en: "Sets" } },
  ];

  return (
    <div className="overflow-x-clip">
      {/* ==================== ACT 1: HERO — SCULPTURAL PORCELAIN PORTRAIT (SAFE FROM 360px TO 3440px) ==================== */}
      <section className="relative overflow-hidden bg-paper pt-[96px] lg:h-[min(100svh,900px)] lg:min-h-[660px] lg:pt-0">
        <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col lg:grid lg:grid-cols-12">
          {/* Mobile Clean Unobstructed Sculptural Portrait Top Frame */}
          <div className="relative h-[44svh] min-h-[290px] max-h-[420px] w-full shrink-0 overflow-hidden lg:hidden">
            <motion.img
              initial={{ scale: 1.04, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.85, ease: LUXURY_EASE }}
              src={assetPath("/assets/hero/hero-sculpture.jpg")}
              alt={
                lang === "uk"
                  ? "Порцелянова гладкість і сяйво шкіри Sophie Bilynska Cosmetics"
                  : "Porcelain smoothness and radiant skin with Sophie Bilynska Cosmetics"
              }
              className="absolute inset-0 h-full w-full object-cover object-[center_26%]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper to-transparent" />
          </div>

          {/* Copy Column: Aligned 1:1 with Header & Page Container on ALL Screen Widths */}
          <div className="relative z-10 flex flex-col justify-center px-5 pb-12 pt-3 text-ink sm:px-8 lg:col-span-6 lg:h-full lg:min-h-0 lg:px-10 lg:pb-10 lg:pt-[108px]">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: LUXURY_EASE }}
                className="eyebrow inline-flex items-center gap-2.5 text-accent"
              >
                <span className="h-[1.5px] w-7 bg-accent" />
                <span>
                  {lang === "uk"
                    ? "Сертифікована косметика технолога · Львів"
                    : "Certified Technologist Skincare · Lviv"}
                </span>
              </motion.p>

              <h1 className="mt-3.5 font-display text-[2.35rem] leading-[0.98] font-bold tracking-[-0.025em] uppercase sm:text-5xl lg:mt-4 lg:text-[3.75rem] xl:text-[4.65rem]">
                <LineReveal delay={0.08}>
                  {lang === "uk" ? "Шкіра, яку" : "Skin you want"}
                </LineReveal>
                <LineReveal delay={0.18} className="text-accent">
                  {lang === "uk" ? "хочеться торкатись." : "to touch."}
                </LineReveal>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28, ease: LUXURY_EASE }}
                className="mt-3.5 max-w-md text-sm leading-relaxed text-muted sm:text-base lg:mt-5 lg:text-lg"
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* Single Bold Primary CTA + Clean Editorial Text Link */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.36, ease: LUXURY_EASE }}
                className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-7 lg:mt-8"
              >
                <Link
                  href="/catalog"
                  className="btn-tactile inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-ink px-8 py-3.5 text-xs font-bold tracking-[0.18em] text-surface uppercase shadow-lg hover:bg-accent hover:text-ink"
                >
                  <span>{lang === "uk" ? "Обрати догляд" : "Explore Collection"}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </Link>

                <a
                  href="#ritual-finder"
                  className="group inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold tracking-[0.15em] text-ink uppercase transition-colors hover:text-accent sm:justify-start"
                >
                  <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                  <span className="border-b border-ink/30 pb-0.5 group-hover:border-accent">
                    {lang === "uk" ? "Пройти підбір за 30 с" : "30-Sec Ritual Finder"}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>

              {/* Single-line quiet proof facts */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.48 }}
                className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line-strong/60 pt-5 text-[11px] font-semibold tracking-[0.12em] text-muted uppercase lg:mt-8"
              >
                <span>100% {lang === "uk" ? "еко-активи" : "eco actives"}</span>
                <span className="text-accent">·</span>
                <span>{lang === "uk" ? "Малі партії" : "Small batches"}</span>
                <span className="text-accent">·</span>
                <span>16.5K @sb.cosm</span>
              </motion.div>
            </div>
          </div>

          {/* Desktop Right-Side Sculptural Portrait: absolute inset-0 so it NEVER inflates grid height! */}
          <div className="relative hidden lg:col-span-6 lg:block lg:h-full lg:min-h-0 lg:overflow-hidden">
            <motion.img
              initial={{ scale: 1.04, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.95, ease: LUXURY_EASE }}
              src={assetPath("/assets/hero/hero-sculpture.jpg")}
              alt={
                lang === "uk"
                  ? "Порцелянова гладкість і сяйво шкіри Sophie Bilynska Cosmetics"
                  : "Porcelain smoothness and radiant skin with Sophie Bilynska Cosmetics"
              }
              className="absolute inset-0 h-full w-full object-cover object-[center_24%] [mask-image:linear-gradient(90deg,transparent_0%,black_18%,black_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_18%,black_88%,transparent_100%)]"
            />
          </div>
        </div>
      </section>

      {/* ==================== ACT 2: BESTSELLERS + INLINE TABS + MOBILE SWIPE CAROUSEL ==================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow text-accent">{t("home.bestsellersEyebrow")}</p>
              <h2 className="mt-1.5 font-display text-3xl font-bold uppercase text-ink sm:text-5xl">
                {t("home.bestsellersTitle")}
              </h2>
            </div>

            {/* Inline Interactive Spring Tabs */}
            <div className="no-scrollbar flex max-w-full items-center gap-1.5 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const active = showcaseTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setShowcaseTab(tab.key)}
                    className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-[0.12em] uppercase transition-colors ${
                      active ? "text-surface" : "text-muted hover:text-ink"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="home-showcase-tab"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-ink"
                      />
                    )}
                    <span className="relative z-10">{tab.label[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {showcaseTab === "sets" ? (
            <motion.div
              key="sets"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: LUXURY_EASE }}
              className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:mt-10 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible"
            >
              {BUNDLES.map((bundle) => (
                <div
                  key={bundle.id}
                  className="flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-surface lg:w-auto lg:max-w-none"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={bundle.image}
                      alt={bundle.name[lang]}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-ink/90 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-accent uppercase">
                      {bundle.badge[lang]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-xl font-bold text-ink">
                      {bundle.name[lang]}
                    </h3>
                    <p className="mt-1 text-xs text-muted">{bundle.subtitle[lang]}</p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-ink">
                          {formatPrice(bundle.bundlePrice, lang)}
                        </span>
                        <span className="text-xs text-muted line-through">
                          {formatPrice(bundle.originalPrice, lang)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          addBundleToCart(bundle.id);
                          openOverlay("cart");
                        }}
                        className="btn-tactile rounded-full bg-ink px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-surface uppercase hover:bg-accent hover:text-ink"
                      >
                        + {t("common.quickAdd")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={showcaseTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: LUXURY_EASE }}
              className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:mt-10 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible"
            >
              {showcaseProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="w-[70vw] max-w-[285px] shrink-0 snap-start lg:w-auto lg:max-w-none"
                >
                  <ProductCard product={product} index={idx} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-end">
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-ink uppercase hover:text-accent"
          >
            <span>{t("home.viewAll")}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ==================== ACT 3: FLAGSHIP IN MOTION — ICE-BLOOM.MP4 VIDEO SPOTLIGHT (SMOKED CHARCOAL & VELVET ESPRESSO) ==================== */}
      <section className="relative overflow-hidden bg-ink py-16 text-pearl lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_30%,rgba(90,59,38,0.34),transparent_62%),radial-gradient(ellipse_at_22%_75%,rgba(185,154,99,0.12),transparent_55%)]"
        />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
          {/* Left: Tall Portrait Video with Subtle Parallax (clamped max width so it stays balanced on all monitors) */}
          <div className="mx-auto w-full max-w-[440px] lg:col-span-6 lg:max-w-[520px]">
            <ParallaxMedia className="aspect-[4/5] rounded-[28px] border border-accent/25 bg-obsidian-soft shadow-2xl">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={assetPath("/assets/hero/ice-bloom-poster.jpg")}
              >
                <source src={assetPath("/assets/hero/ice-bloom.mp4")} type="video/mp4" />
              </video>
            </ParallaxMedia>
          </div>

          {/* Right: Editorial Deep-Dive into #1 Bestseller Silk Touch Serum */}
          <Reveal className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow text-accent">
                {lang === "uk" ? "Флагман у русі · Хіт №1" : "Flagship in Motion · No. 1 Hit"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-pearl/15 bg-pearl/5 px-3 py-1 text-[11px] font-semibold text-pearl">
                <Star className="h-3 w-3 fill-accent text-accent" />
                4.95 · 131 {t("pdp.reviewsLabel")}
              </span>
            </div>

            <h2 className="mt-4 font-display text-3xl leading-[1.02] font-bold uppercase text-pearl sm:text-5xl">
              {lang === "uk"
                ? "Гель-сироватка «Дотик шовку»"
                : "Silk Touch Hydrating Gel Serum"}
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-pearl/72 sm:text-base">
              {lang === "uk"
                ? "Невагомий кришталевий гель, який вбирається за секунди, наповнює вологою без липкості й створює ідеальну шовкову основу під крем або макіяж."
                : "A crystal-clear weightless gel that absorbs in seconds, floods skin with moisture without stickiness, and forms a silky canvas under cream or makeup."}
            </p>

            {/* 3 Hero Actives */}
            <div className="mt-8 divide-y divide-pearl/12 border-y border-pearl/12">
              {(lang === "uk"
                ? [
                    {
                      n: "01",
                      title: "Гіалуронова кислота",
                      sub: "Утримує вологу в епідермісі та миттєво розгладжує мікрорельєф",
                    },
                    {
                      n: "02",
                      title: "CO₂-екстракт алое вера",
                      sub: "Заспокоює чутливу шкіру та знімає відчуття стягнутості",
                    },
                    {
                      n: "03",
                      title: "D-пантенол & Бетаїн",
                      sub: "Зміцнюють природний ліпідний бар'єр на весь день",
                    },
                  ]
                : [
                    {
                      n: "01",
                      title: "Hyaluronic Acid",
                      sub: "Locks hydration inside the epidermis and smooths fine lines",
                    },
                    {
                      n: "02",
                      title: "CO₂ Aloe Vera Extract",
                      sub: "Instantly calms reactive skin and eases dryness",
                    },
                    {
                      n: "03",
                      title: "D-Panthenol & Betaine",
                      sub: "Reinforce your daily moisture barrier without weight",
                    },
                  ]
              ).map((row) => (
                <div key={row.n} className="flex items-start gap-4 py-4">
                  <span className="mt-0.5 text-xs font-bold tracking-[0.16em] text-accent">
                    {row.n}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold text-pearl">
                      {row.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-pearl/65">
                      {row.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Instant Buy + Explore */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <button
                type="button"
                onClick={() => {
                  addProductToCart("serum-gel", 1, 0);
                  openOverlay("cart");
                }}
                className="btn-tactile inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-4 text-xs font-bold tracking-[0.16em] text-ink uppercase hover:bg-pearl"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>
                  {lang === "uk"
                    ? `Додати «Дотик шовку» · ${formatPrice(1200, lang)}`
                    : `Add Silk Touch · ${formatPrice(1200, lang)}`}
                </span>
              </button>

              <Link
                href="/product/serum-gel"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold tracking-[0.16em] text-pearl/80 uppercase hover:text-accent"
              >
                <span>{lang === "uk" ? "Детальніше про формулу" : "Explore formula"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== ACT 4: INLINE INTERACTIVE RITUAL FINDER (STEP 1 ON HOME!) ==================== */}
      <section
        id="ritual-finder"
        className="mx-auto max-w-[1440px] scroll-mt-28 px-4 py-16 sm:px-8 lg:px-12 lg:py-24"
      >
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow inline-flex items-center gap-2 text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t("home.quizEyebrow")}</span>
              </p>
              <h2 className="mt-1.5 font-display text-3xl font-bold uppercase text-ink sm:text-5xl">
                {lang === "uk"
                  ? "Яка ваша головна задача зараз?"
                  : "What is your main skin goal today?"}
              </h2>
            </div>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] text-muted uppercase hover:text-ink"
            >
              <span>
                {lang === "uk" ? "Повний 4-кроковий тест" : "Full 4-step consultation"}
              </span>
              <ArrowUpRight className="h-4 w-4 text-accent" />
            </Link>
          </div>
        </Reveal>

        {/* 2x2 Mobile / 4-Col Desktop Tactile Goal Tiles */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {INLINE_QUIZ_GOALS.map((item) => {
            const active = selectedGoal === item.goal;
            return (
              <button
                key={item.goal}
                type="button"
                onClick={() => setSelectedGoal(item.goal)}
                className={`btn-tactile group relative flex flex-col overflow-hidden rounded-2xl border p-3.5 text-left transition-all sm:p-4 ${
                  active
                    ? "border-ink bg-ink text-pearl shadow-lg"
                    : "border-line bg-surface text-ink hover:border-accent"
                }`}
              >
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl">
                  <img
                    src={assetPath(item.image)}
                    alt={item.title[lang]}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-display text-base leading-tight font-bold sm:text-lg">
                  {item.title[lang]}
                </p>
                <p
                  className={`mt-1 text-[11px] sm:text-xs ${
                    active ? "text-pearl/70" : "text-muted"
                  }`}
                >
                  {item.hint[lang]}
                </p>
                {active && (
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.14em] text-accent uppercase">
                    <Check className="h-3 w-3" />
                    {lang === "uk" ? "Обрано" : "Selected"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Live Matched Protocol Drawer Right Below */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGoal}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: LUXURY_EASE }}
            className="mt-6 rounded-[28px] border border-line bg-surface p-5 shadow-[0_8px_32px_rgba(23,26,28,0.04)] sm:p-8"
          >
            <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 lg:flex-row lg:items-center">
              <div>
                <p className="eyebrow text-accent">
                  {lang === "uk"
                    ? "Рекомендація технолога · −10% за промо SOPHIE10"
                    : "Technologist Match · −10% with SOPHIE10"}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                  {inlineProtocol.title[lang]}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-ink sm:text-3xl">
                    {formatPrice(inlineProtocol.bundlePrice, lang)}
                  </span>
                  <span className="text-sm text-muted line-through">
                    {formatPrice(inlineProtocol.totalPrice, lang)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addMultipleProductsToCart(
                      inlineProtocol.steps.map((s) => s.product.id),
                      lang === "uk"
                        ? "Ваш підібраний ритуал додано в кошик!"
                        : "Your matched ritual has been added to bag!"
                    );
                    openOverlay("cart");
                  }}
                  className="btn-tactile inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold tracking-[0.15em] text-surface uppercase hover:bg-accent hover:text-ink"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>
                    {lang === "uk" ? "Додати весь ритуал" : "Add Full Ritual"}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {inlineProtocol.steps.slice(0, 3).map((step, idx) => (
                <Link
                  key={step.product.id}
                  href={`/product/${step.product.id}`}
                  className="group flex items-center gap-3.5 rounded-2xl border border-line/80 bg-surface-soft p-3.5 transition-colors hover:border-accent"
                >
                  <img
                    src={step.product.image}
                    alt={step.product.name[lang]}
                    className="h-20 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold tracking-[0.14em] text-accent uppercase">
                      0{idx + 1} · {step.slot[lang]}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-bold text-ink group-hover:text-accent">
                      {step.product.line ? step.product.line[lang] : step.product.name[lang]}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted">
                      {step.reason[lang]}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ==================== ACT 5: ANATOMY OF FORMULAS — EDITORIAL INCI ACCORDION ==================== */}
      <section className="border-t border-line bg-surface py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] items-start gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-12">
          {/* Left: Macro Botanical Science Visual */}
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            <p className="eyebrow text-accent">{t("home.activesEyebrow")}</p>
            <h2 className="mt-1.5 font-display text-3xl leading-[1.04] font-bold uppercase text-ink sm:text-5xl">
              {lang === "uk" ? "Анатомія формул: прозорий INCI" : "Formula Anatomy: Honest INCI"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {lang === "uk"
                ? "Жодних порожніх обіцянок — лише робочі концентрації чистих активів, відібраних сертифікованим технологом."
                : "Zero filler claims—only effective concentrations of clean botanical actives chosen by a certified technologist."}
            </p>

            <div className="relative mt-6 overflow-hidden rounded-[26px] border border-line">
              <img
                src={assetPath("/assets/editorial/journal-actives.jpg")}
                alt="Botanical laboratory actives"
                className="aspect-[16/10] w-full object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-ink/88 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.14em] text-accent uppercase backdrop-blur-md">
                {lang === "uk" ? "Сертифікований технолог · Львів" : "Certified Technologist · Lviv"}
              </span>
            </div>
          </div>

          {/* Right: 5 Clean Hairline Accordion Rows with Product Pills */}
          <div className="divide-y divide-line border-y border-line lg:col-span-7">
            {INCI_ACCORDION.map((item) => {
              const isOpen = openActiveKey === item.key;
              const linked = item.productIds
                .map(getProductById)
                .filter((p): p is NonNullable<typeof p> => Boolean(p));

              return (
                <div key={item.key} className="py-1">
                  <button
                    type="button"
                    onClick={() => setOpenActiveKey(isOpen ? "" : item.key)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs font-bold tracking-[0.16em] text-accent">
                        {item.num}
                      </span>
                      <div>
                        <span className="font-display text-xl font-bold text-ink sm:text-2xl">
                          {item.name[lang]}
                        </span>
                        <span className="ml-3 hidden text-xs font-semibold tracking-[0.12em] text-muted uppercase sm:inline">
                          {item.role[lang]}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: LUXURY_EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pl-9 pr-2">
                          <p className="text-sm leading-relaxed text-ink-soft">
                            {item.desc[lang]}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {linked.map((p) => (
                              <div
                                key={p.id}
                                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-soft py-1.5 pl-3.5 pr-1.5"
                              >
                                <Link
                                  href={`/product/${p.id}`}
                                  className="text-xs font-bold text-ink hover:text-accent"
                                >
                                  {p.line ? p.line[lang] : p.name[lang]} ·{" "}
                                  {formatPrice(p.price, lang)}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => addProductToCart(p.id, 1, 0)}
                                  aria-label={t("common.addToCart")}
                                  className="btn-tactile flex h-7 w-7 items-center justify-center rounded-full bg-ink text-surface hover:bg-accent hover:text-ink"
                                >
                                  <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== ACT 6: PANORAMIC ATELIER GIFT SETS ==================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface shadow-sm">
            {/* Panoramic Campaign Image (safe min-height on 1024px+ so floating card never crowds top) */}
            <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-[21/9] lg:min-h-[480px] xl:min-h-[540px]">
              <img
                src={assetPath("/assets/editorial/campaign-giftset.jpg")}
                alt={activeBundle.name[lang]}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink/35 lg:via-transparent lg:to-transparent" />
            </div>

            {/* Architectural Floating Set Switcher Card (bottom-left on desktop, clean block below on mobile) */}
            <div className="p-5 sm:p-7 lg:absolute lg:bottom-7 lg:left-7 lg:w-[460px] lg:rounded-3xl lg:border lg:border-line/60 lg:bg-surface/95 lg:p-7 lg:shadow-2xl lg:backdrop-blur-md">
              <p className="eyebrow text-accent">{t("home.setsEyebrow")}</p>

              {/* 3 Set Switcher Pills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {BUNDLES.map((b, idx) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBundleIdx(idx)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors ${
                      selectedBundleIdx === idx
                        ? "bg-ink text-pearl"
                        : "bg-surface-soft text-muted hover:text-ink"
                    }`}
                  >
                    {idx === 0
                      ? lang === "uk"
                        ? "Набір №1 · Очі"
                        : "Set 1 · Eyes"
                      : idx === 1
                        ? lang === "uk"
                          ? "Тріо Бар'єр"
                          : "Barrier Trio"
                        : lang === "uk"
                          ? "SPA Тіло"
                          : "Body SPA"}
                  </button>
                ))}
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-ink">
                {activeBundle.name[lang]}
              </h3>
              <p className="mt-1 text-xs font-semibold text-accent">
                {activeBundle.subtitle[lang]}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {activeBundle.description[lang]}
              </p>

              <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-ink">
                    {formatPrice(activeBundle.bundlePrice, lang)}
                  </span>
                  <span className="text-xs text-muted line-through">
                    {formatPrice(activeBundle.originalPrice, lang)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addBundleToCart(activeBundle.id);
                    openOverlay("cart");
                  }}
                  className="btn-tactile inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-surface uppercase hover:bg-accent hover:text-ink"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>{t("common.addToCart")}</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ==================== ACT 7: LVIV ATELIER + REVIEWS + COMPACT JOURNAL ==================== */}
      <section className="border-t border-line bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] space-y-16 px-4 sm:px-8 lg:space-y-24 lg:px-12">
          {/* 7A: Behind the Laboratory */}
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
            <ParallaxMedia className="rounded-[26px] border border-line lg:col-span-6">
              <img
                src={assetPath("/assets/editorial/campaign-atelier.jpg")}
                alt="Sophie Bilynska Lviv botanical laboratory"
                className="aspect-[16/10] w-full object-cover"
              />
            </ParallaxMedia>

            <Reveal className="lg:col-span-6">
              <p className="eyebrow text-accent">
                {lang === "uk" ? "За лаштунками лабораторії · Львів" : "Behind the Lviv Lab"}
              </p>
              <blockquote className="mt-3 font-display text-2xl leading-[1.12] font-bold text-ink sm:text-4xl">
                {lang === "uk"
                  ? "«Справжній догляд не маскує шкіру — він повертає їй спокій, природний бар'єр і власне сяйво.»"
                  : "“True skincare never masks skin — it restores calm, strengthens the barrier, and reveals your own glow.”"}
              </blockquote>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {lang === "uk"
                  ? "Софія Білинська — сертифікований технолог. Кожну формулу ми створюємо й тестуємо вручну малими партіями зі 100% еко-складників."
                  : "Sophie Bilynska, certified cosmetic technologist. Every formula is compounded and checked by hand in small batches with 100% eco ingredients."}
              </p>
              <div className="mt-6">
                <Link
                  href="/atelier"
                  className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-ink uppercase hover:text-accent"
                >
                  <span className="border-b border-ink/30 pb-0.5 group-hover:border-accent">
                    {t("home.atelierCta")}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* 7B: Community Reviews Swipe Strip + Compact Journal Notes */}
          <div>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-accent">{t("home.reviewsEyebrow")}</p>
                <h2 className="mt-1 font-display text-3xl font-bold uppercase text-ink sm:text-4xl">
                  {t("home.reviewsTitle")}
                </h2>
              </div>
              <a
                href="https://www.instagram.com/sb.cosm/"
                target="_blank"
                rel="noreferrer"
                className="btn-tactile inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-surface"
              >
                <Instagram className="h-4 w-4 text-accent" />
                <span>@sb.cosm · 16.5K</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Horizontal Swipe on Mobile / 4-Col Desktop */}
            <div className="no-scrollbar -mx-4 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {CLIENT_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="flex w-[82vw] max-w-[320px] shrink-0 snap-start flex-col rounded-2xl border border-line bg-paper/55 p-5 lg:w-auto lg:max-w-none"
                >
                  <div className="flex items-center gap-0.5 text-accent">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    «{rev.text[lang]}»
                  </p>
                  <div className="mt-4 border-t border-line pt-3">
                    <div className="flex items-center justify-between text-xs font-bold text-ink">
                      <span>{rev.author[lang]}</span>
                      <span className="text-accent">{rev.city[lang]}</span>
                    </div>
                    <Link
                      href={`/product/${rev.productId}`}
                      className="mt-1 block truncate text-[11px] font-semibold text-muted hover:text-accent"
                    >
                      {rev.productName[lang]} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Compact 3-Row Editorial Journal Strip */}
            <div className="mt-14 border-t border-line pt-10">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-accent">{t("home.journalEyebrow")}</p>
                <Link
                  href="/journal"
                  className="text-xs font-bold tracking-[0.14em] text-ink uppercase hover:text-accent"
                >
                  {t("home.journalAll")} →
                </Link>
              </div>
              <div className="mt-4 divide-y divide-line">
                {JOURNAL_ARTICLES.slice(0, 3).map((article) => (
                  <Link
                    key={article.slug}
                    href={`/journal/${article.slug}`}
                    className="group flex flex-col justify-between gap-2 py-4 transition-colors sm:flex-row sm:items-center sm:gap-6"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="shrink-0 text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
                        {article.category[lang]}
                      </span>
                      <span className="font-display text-lg font-bold text-ink group-hover:text-accent sm:text-xl">
                        {article.title[lang]}
                      </span>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-muted">
                      <span>{article.readTime[lang]}</span>
                      <ArrowUpRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ACT 8A: PRE-FOOTER CONCIERGE CTA ==================== */}
      <section className="border-t border-line bg-[#fbf1e2] py-14 lg:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-4 sm:px-8 lg:flex-row lg:items-center lg:px-12">
          <div>
            <p className="eyebrow text-accent">
              {lang === "uk" ? "Персональна консультація" : "Personal Concierge"}
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold uppercase text-ink sm:text-4xl">
              {lang === "uk"
                ? "Сумніваєтесь у виборі? Підберемо догляд разом."
                : "Unsure what to pick? Let's build your ritual together."}
            </h2>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href="https://t.me/+380631790642"
              target="_blank"
              rel="noreferrer"
              className="btn-tactile inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold tracking-[0.15em] text-surface uppercase hover:bg-accent hover:text-ink"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{lang === "uk" ? "Написати в Telegram" : "Message on Telegram"}</span>
            </a>
            <Link
              href="/quiz"
              className="btn-tactile inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-ink px-6 py-3 text-xs font-bold tracking-[0.15em] text-ink uppercase hover:bg-ink hover:text-surface"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>{lang === "uk" ? "Пройти підбір за 30 с" : "30-Sec Ritual Finder"}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
