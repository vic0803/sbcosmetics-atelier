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
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MobileCircularCarousel } from "@/components/MobileCircularCarousel";
import {
  LineReveal,
  LUXURY_EASE,
  ParallaxMedia,
  Reveal,
} from "@/components/MotionPrimitives";
import { ProductCard } from "@/components/ProductCard";
import { SilkVeilHero } from "@/components/SilkVeilHero";
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

  // Act 1: Hero ref for scroll-driven silk organza sweep
  const heroSectionRef = useRef<HTMLElement | null>(null);

  // Act 1: Sticky hero exit choreography (0 = hero fully visible, 1 = next section covers it)
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroExit = useMotionValue(0);
  const syncHeroExit = (y: number) => {
    const vh = window.innerHeight || 1;
    heroExit.set(Math.min(1, Math.max(0, y / vh)));
  };
  useMotionValueEvent(scrollY, "change", syncHeroExit);
  useEffect(() => {
    const onResize = () => syncHeroExit(window.scrollY);
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Uniform upward lift from scroll 0; fade/blur starts only when next section covers 1/3 screen (heroExit >= 0.33)
  const heroTextY = useTransform(heroExit, [0, 0.70], [0, -96]);
  const heroTextBlur = useTransform(heroExit, [0.46, 0.70], [0, 14]);
  const heroTextFilter = useMotionTemplate`blur(${heroTextBlur}px)`;
  const heroTextOpacity = useTransform(heroExit, [0.46, 0.70], [1, 0]);

  // Buttons lift together with text from scroll 0, begin fading/blurring strictly at 1/3 screen cover (0.33)
  const heroCtaY = useTransform(heroExit, [0, 0.60], [0, -84]);
  const heroCtaBlur = useTransform(heroExit, [0.33, 0.52], [0, 14]);
  const heroCtaFilter = useMotionTemplate`blur(${heroCtaBlur}px)`;
  const heroCtaOpacity = useTransform(heroExit, [0.33, 0.52], [1, 0]);

  const heroLinkY = useTransform(heroExit, [0, 0.60], [0, -84]);
  const heroLinkBlur = useTransform(heroExit, [0.34, 0.53], [0, 14]);
  const heroLinkFilter = useMotionTemplate`blur(${heroLinkBlur}px)`;
  const heroLinkOpacity = useTransform(heroExit, [0.34, 0.53], [1, 0]);

  const heroProofOpacity = useTransform(heroExit, [0.15, 0.32], [1, 0]);
  const heroProofY = useTransform(heroExit, [0, 0.33], [0, -30]);
  const heroVeilOpacity = useTransform(heroExit, [0.30, 1], [0, 0.22]);

  const heroTextStyle = prefersReducedMotion
    ? undefined
    : { filter: heroTextFilter, opacity: heroTextOpacity, y: heroTextY };
  const heroCtaStyle = prefersReducedMotion
    ? undefined
    : { filter: heroCtaFilter, opacity: heroCtaOpacity, y: heroCtaY };
  const heroLinkStyle = prefersReducedMotion
    ? undefined
    : { filter: heroLinkFilter, opacity: heroLinkOpacity, y: heroLinkY };
  const heroProofStyle = prefersReducedMotion
    ? undefined
    : { opacity: heroProofOpacity, y: heroProofY };
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
      {/* ==================== ACT 1: HERO — STICKY 100SVH FULL-BLEED EDITORIAL PORTRAIT (next sections slide over it) ==================== */}
      <section
        ref={heroSectionRef}
        data-header-theme="hero"
        className="sticky top-[min(0px,calc(100svh-680px))] z-0 h-[100svh] min-h-[680px] overflow-hidden bg-paper"
      >
        {/* Mobile Full-Height Sculptural Portrait: flush inset-0 so top edge never detaches or exposes a gap on scroll */}
        <div className="pointer-events-auto absolute inset-0 overflow-hidden lg:hidden">
          <SilkVeilHero
            src={assetPath("/assets/hero/hero-sculpture.jpg")}
            alt={
              lang === "uk"
                ? "Порцелянова гладкість і сяйво шкіри Sophie Bilynska Cosmetics"
                : "Porcelain smoothness and radiant skin with Sophie Bilynska Cosmetics"
            }
            scrollTargetRef={heroSectionRef}
            objectPosition={[0.22, 0.42]}
            className="h-full w-full"
            imgClassName="object-cover object-[22%_42%]"
          />
        </div>

        {/* Desktop Full-Bleed 16:9 Mineral-Plaster Portrait Canvas: flush inset-0 (zero top gap on overscroll/return to top) */}
        <div className="pointer-events-auto absolute inset-0 hidden overflow-hidden lg:block">
          <SilkVeilHero
            src={assetPath("/assets/hero/hero-sculpture-wide.jpg")}
            alt={
              lang === "uk"
                ? "Порцелянова гладкість і сяйво шкіри Sophie Bilynska Cosmetics"
                : "Porcelain smoothness and radiant skin with Sophie Bilynska Cosmetics"
            }
            scrollTargetRef={heroSectionRef}
            objectPosition={[1, 0.5]}
            shimmerMinX={0.44}
            className="h-full w-full"
            imgClassName="object-cover object-right"
          />
        </div>

        {/* Soft ink veil deepens the portrait as the next section slides over the sticky hero */}
        <motion.div
          aria-hidden="true"
          style={prefersReducedMotion ? { opacity: 0 } : { opacity: heroVeilOpacity }}
          className="pointer-events-none absolute inset-0 z-[5] bg-ink"
        />

        <div className="pointer-events-none relative z-10 flex h-full w-full flex-col lg:grid lg:grid-cols-12">
          {/* Copy Column: Mobile = centered eyebrow + left-edge title + centered CTAs; Desktop = flush-aligned to the "S" of SOPHIE BILYNSKA (lg: 32+32+10=74px, xl: 40+32+10=82px) */}
          <div className="pointer-events-auto relative z-10 flex h-full min-h-0 flex-col justify-between px-5 pb-[86px] pt-[100px] text-ink sm:px-8 lg:col-span-6 lg:items-start lg:pb-6 lg:pl-[74px] lg:pr-4 lg:pt-[112px] xl:pl-[82px] 2xl:pb-10 2xl:pt-[136px]">
            {/* Mobile-only top masthead eyebrow centered cleanly beneath the header */}
            <motion.div style={heroTextStyle} className="flex justify-center lg:hidden">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: LUXURY_EASE }}
                className="eyebrow inline-flex items-center justify-center gap-2 text-center text-[10px] text-ink/80"
              >
                <span className="h-[1.5px] w-5 bg-accent" />
                <span>
                  {lang === "uk"
                    ? "Еко-косметика ручної роботи · Львів"
                    : "Handmade Eco Cosmetics · Lviv"}
                </span>
              </motion.p>
            </motion.div>

            <div className="w-full max-w-[640px] lg:flex lg:h-full lg:flex-col lg:justify-between">
              {/* Top Editorial Group: Desktop Eyebrow + Monumental Stacked Headline + Desktop Subtitle */}
              <div>
                {/* Text group blurs, lifts and dissolves as the next section rises over the hero */}
                <motion.div style={heroTextStyle} className="will-change-[filter,opacity,transform]">
                {/* Desktop eyebrow (aligned above headline with signature gold rule) */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: LUXURY_EASE }}
                  className="eyebrow hidden items-center gap-2.5 text-ink/75 lg:inline-flex"
                >
                  <span className="h-[1.5px] w-7 bg-accent" />
                  <span>
                    {lang === "uk"
                      ? "Еко-косметика ручної роботи · Львів"
                      : "Handmade Eco Cosmetics · Lviv"}
                  </span>
                </motion.p>

                {/* Editorial Vertical Stacked Headline (One Unified Size Scale across UA & EN: 2.55rem Mobile, clamp(3.4rem,min(6.8vw,9.4svh),9rem) Desktop) */}
                <h1
                  className={`font-display text-[2.55rem] leading-[1.06] font-bold uppercase lg:mt-4 lg:text-[clamp(3.4rem,min(6.8vw,9.4svh),9rem)] lg:leading-[0.96] ${
                    lang === "uk" ? "tracking-[-0.005em]" : "tracking-[-0.015em]"
                  }`}
                >
                  {lang === "uk" ? (
                    <>
                      <LineReveal delay={0.06} className="text-ink">
                        Ніжність
                      </LineReveal>
                      <LineReveal delay={0.11} className="text-ink">
                        природи
                      </LineReveal>
                      <LineReveal delay={0.16} className="text-ink">
                        у
                      </LineReveal>
                      <LineReveal
                        delay={0.21}
                        className="text-outline-ink mt-[0.06em] px-[2px] -mx-[2px] py-[0.02em] tracking-[0.045em]"
                      >
                        кожному
                      </LineReveal>
                      <LineReveal
                        delay={0.26}
                        className="text-outline-ink mt-[0.06em] px-[2px] -mx-[2px] py-[0.02em] tracking-[0.045em]"
                      >
                        дотику
                      </LineReveal>
                    </>
                  ) : (
                    <>
                      <LineReveal delay={0.06} className="text-ink">
                        Nature
                      </LineReveal>
                      <LineReveal delay={0.11} className="text-ink">
                        in
                      </LineReveal>
                      <LineReveal delay={0.16} className="text-ink">
                        every
                      </LineReveal>
                      <LineReveal
                        delay={0.21}
                        className="text-outline-ink mt-[0.06em] px-[2px] -mx-[2px] py-[0.02em] tracking-[0.03em]"
                      >
                        gentle
                      </LineReveal>
                      <LineReveal
                        delay={0.26}
                        className="text-outline-ink mt-[0.06em] px-[2px] -mx-[2px] py-[0.02em] tracking-[0.03em]"
                      >
                        touch
                      </LineReveal>
                    </>
                  )}
                </h1>

                {/* Subtitle shown on desktop: 24–27px, 450px measure, 2x vertical breathing room (40px top, 56px bottom to CTAs) */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.28, ease: LUXURY_EASE }}
                  className="mt-5 hidden max-w-[450px] text-[24px] leading-[1.35] text-ink-soft lg:mt-[min(40px,4svh)] lg:block xl:text-[27px]"
                >
                  {t("hero.subtitle")}
                </motion.p>
                </motion.div>

                {/* Primary CTA + Ritual Link: 56px below subtitle on tall desktops (compresses on short laptop screens), +30% larger desktop button type (16px / 15.5px) & +10% larger mobile type (13.2px) */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.36, ease: LUXURY_EASE }}
                  className="mt-6 flex flex-col items-center gap-3.5 lg:mt-[min(56px,5.2svh)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8"
                >
                  {/* Primary CTA lifts upward and blurs on scroll */}
                  <motion.div style={heroCtaStyle} className="flex w-full justify-center will-change-[filter,opacity,transform] lg:w-auto">
                  <Link
                    href="/catalog"
                    className="btn-tactile inline-flex min-h-[54px] w-full max-w-[300px] shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-ink px-7 py-3.5 text-[13.2px] font-bold tracking-[0.16em] text-surface uppercase shadow-lg hover:bg-accent hover:text-ink lg:min-h-[62px] lg:w-auto lg:max-w-none lg:px-8 lg:py-4 lg:text-[16px] xl:px-10"
                  >
                    <span>{lang === "uk" ? "Обрати догляд" : "Explore Collection"}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" strokeWidth={2.2} />
                  </Link>
                  </motion.div>

                  {/* Secondary ritual link lifts upward and blurs */}
                  <motion.div style={heroLinkStyle} className="flex justify-center will-change-[filter,opacity,transform]">
                  <a
                    href="#ritual-finder"
                    className="group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap py-1 text-[13.2px] font-bold tracking-[0.14em] text-ink uppercase transition-colors hover:text-accent lg:py-2 lg:text-[15.5px]"
                  >
                    <Sparkles className="h-4 w-4 text-accent lg:h-[18px] lg:w-[18px]" strokeWidth={2} />
                    <span className="border-b border-ink/40 pb-0.5 group-hover:border-accent">
                      {lang === "uk" ? "Пройти підбір за 30 с" : "30-Sec Ritual Finder"}
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:h-[18px] lg:w-[18px]" />
                  </a>
                  </motion.div>
                </motion.div>
              </div>

              {/* Hairline divider + Single-line quiet proof facts anchored flush to the Hero floor */}
              <motion.div style={heroProofStyle} className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.48 }}
                className="mt-3 hidden flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line-strong/60 pt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-soft/75 uppercase lg:flex 2xl:mt-6 2xl:pt-5"
              >
                <span>100% {lang === "uk" ? "еко-активи" : "eco actives"}</span>
                <span className="text-accent">·</span>
                <span>{lang === "uk" ? "Малі партії" : "Small batches"}</span>
                <span className="text-accent">·</span>
                <span>16.5K @sb.cosm</span>
              </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything after the hero rides on an opaque layer that slides up over the sticky hero */}
      <div className="relative z-10 bg-[#f4efe8] shadow-[0_-28px_60px_-12px_rgba(14,22,30,0.22)]">
      {/* ==================== ACT 2: BESTSELLERS — DEEP SLATE NAVY GALLERY ==================== */}
      <section
        data-header-theme="navy"
        className="relative overflow-hidden border-t border-accent/20 bg-ink pt-14 pb-12 text-pearl lg:pt-20 lg:pb-14"
      >
        <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-end lg:gap-5">
              <div>
                <p className="eyebrow text-accent">{t("home.bestsellersEyebrow")}</p>
                <h2 className="mt-1 font-display text-2xl font-bold uppercase text-pearl sm:text-4xl lg:mt-1.5 lg:text-5xl">
                  {t("home.bestsellersTitle")}
                </h2>
              </div>

              {/* Inline Interactive Spring Tabs (compact on mobile so all 4 tabs stay crisp without right-edge clipping) */}
              <div className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto pb-1 sm:gap-1.5">
                {tabs.map((tab) => {
                  const active = showcaseTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setShowcaseTab(tab.key)}
                      className={`relative shrink-0 rounded-full px-2.5 py-1.5 text-[10px] font-bold tracking-[0.08em] uppercase transition-colors sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.12em] ${
                        active ? "text-ink" : "text-pearl/60 hover:text-pearl"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="home-showcase-tab"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                          className="absolute inset-0 rounded-full bg-pearl"
                        />
                      )}
                      <span className="relative z-10">{tab.label[lang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <AnimatePresence mode="wait" initial={false}>
            {showcaseTab === "sets" ? (
              <motion.div
                key="sets"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Mobile: Centered single-card infinite circular carousel */}
                <MobileCircularCarousel
                  key={`mobile-sets-${lang}`}
                  items={BUNDLES}
                  getKey={(b) => b.id}
                  prevLabel={lang === "uk" ? "Попередній набір" : "Previous set"}
                  nextLabel={lang === "uk" ? "Наступний набір" : "Next set"}
                  renderItem={(bundle) => (
                    <div className="flex flex-col overflow-hidden rounded-2xl border border-pearl/12 bg-espresso">
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
                        <h3 className="font-display text-xl font-bold text-pearl">
                          {bundle.name[lang]}
                        </h3>
                        <p className="mt-1 text-xs text-pearl/65">{bundle.subtitle[lang]}</p>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-pearl">
                              {formatPrice(bundle.bundlePrice, lang)}
                            </span>
                            <span className="text-xs text-pearl/45 line-through">
                              {formatPrice(bundle.originalPrice, lang)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              addBundleToCart(bundle.id);
                              openOverlay("cart");
                            }}
                            className="btn-tactile rounded-full bg-accent px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-ink uppercase hover:bg-pearl"
                          >
                            + {t("common.quickAdd")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                />

                {/* Desktop: 3-column grid */}
                <div className="mt-10 hidden lg:grid lg:grid-cols-3 lg:gap-6">
                  {BUNDLES.map((bundle) => (
                    <div
                      key={bundle.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-pearl/12 bg-espresso"
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
                        <h3 className="font-display text-xl font-bold text-pearl">
                          {bundle.name[lang]}
                        </h3>
                        <p className="mt-1 text-xs text-pearl/65">{bundle.subtitle[lang]}</p>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-pearl">
                              {formatPrice(bundle.bundlePrice, lang)}
                            </span>
                            <span className="text-xs text-pearl/45 line-through">
                              {formatPrice(bundle.originalPrice, lang)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              addBundleToCart(bundle.id);
                              openOverlay("cart");
                            }}
                            className="btn-tactile rounded-full bg-accent px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-ink uppercase hover:bg-pearl"
                          >
                            + {t("common.quickAdd")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={showcaseTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Mobile: Centered single-card infinite circular carousel */}
                <MobileCircularCarousel
                  key={`mobile-${showcaseTab}`}
                  items={showcaseProducts}
                  getKey={(p) => p.id}
                  prevLabel={lang === "uk" ? "Попередній засіб" : "Previous formula"}
                  nextLabel={lang === "uk" ? "Наступний засіб" : "Next formula"}
                  renderItem={(product, idx) => (
                    <ProductCard product={product} variant="dark" index={idx} />
                  )}
                />

                {/* Desktop: 4-column studio gallery grid */}
                <div className="mt-10 hidden lg:grid lg:grid-cols-4 lg:gap-6">
                  {showcaseProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} variant="dark" index={idx} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex justify-center lg:justify-end">
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-pearl/85 uppercase hover:text-accent"
            >
              <span>{t("home.viewAll")}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== ACT 3: FLAGSHIP IN MOTION — ICE-BLOOM.MP4 VIDEO SPOTLIGHT ==================== */}
      <section
        data-header-theme="paper"
        className="relative overflow-hidden border-t border-line bg-[#f4efe8] pt-14 pb-16 lg:pt-20 lg:pb-24"
      >
        <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-8 px-4 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
          {/* Left: Portrait Video Canvas */}
          <div className="mx-auto w-full max-w-[440px] lg:col-span-6 lg:max-w-[520px]">
            <ParallaxMedia className="aspect-[4/5] w-full rounded-[24px] border border-line bg-surface shadow-[0_8px_32px_rgba(23,26,28,0.06)] lg:rounded-[28px]">
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
            <div className="flex flex-wrap items-center gap-2.5 lg:gap-3">
              <span className="eyebrow text-accent">
                {lang === "uk" ? "Флагман у русі · Хіт №1" : "Flagship in Motion · No. 1 Hit"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface/60 px-2.5 py-0.5 text-[10px] font-semibold text-ink lg:px-3 lg:py-1 lg:text-[11px]">
                <Star className="h-3 w-3 fill-accent text-accent" />
                4.95 · 131 {t("pdp.reviewsLabel")}
              </span>
            </div>

            <h2 className="mt-3 font-display text-3xl leading-[1.02] font-bold uppercase text-ink sm:text-4xl lg:mt-4 lg:text-5xl">
              {lang === "uk"
                ? "Гель-сироватка «Дотик шовку»"
                : "Silk Touch Hydrating Gel Serum"}
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted lg:text-base">
              {lang === "uk"
                ? "Невагомий кришталевий гель, який вбирається за секунди, наповнює вологою без липкості й створює ідеальну шовкову основу під крем або макіяж."
                : "A crystal-clear weightless gel that absorbs in seconds, floods skin with moisture without stickiness, and forms a silky canvas under cream or makeup."}
            </p>

            {/* 3 Hero Actives */}
            <div className="mt-6 divide-y divide-line border-y border-line lg:mt-8">
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
                <div key={row.n} className="flex items-start gap-3 py-2 lg:gap-4 lg:py-4">
                  <span className="mt-0.5 text-[11px] font-bold tracking-[0.16em] text-accent lg:text-xs">
                    {row.n}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink lg:text-lg">
                      {row.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted lg:text-xs lg:leading-relaxed">
                      {row.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Instant Buy + Explore */}
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-6 lg:mt-8">
              <button
                type="button"
                onClick={() => {
                  addProductToCart("serum-gel", 1, 0);
                  openOverlay("cart");
                }}
                className="btn-tactile inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-3 text-xs font-bold tracking-[0.16em] text-surface uppercase hover:bg-accent hover:text-ink lg:min-h-[54px] lg:px-7 lg:py-4"
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
                className="inline-flex items-center justify-center gap-1.5 py-1 text-xs font-bold tracking-[0.16em] text-ink/75 uppercase hover:text-accent"
              >
                <span>{lang === "uk" ? "Детальніше про формулу" : "Explore formula"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== ACT 4: INLINE INTERACTIVE RITUAL FINDER ==================== */}
      <section
        id="ritual-finder"
        data-header-theme="paper"
        className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8 lg:px-12 lg:py-24"
      >
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-2.5 lg:flex-row lg:items-end lg:gap-4">
            <div>
              <p className="eyebrow inline-flex items-center gap-2 text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t("home.quizEyebrow")}</span>
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold uppercase text-ink sm:text-4xl lg:mt-1.5 lg:text-5xl">
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
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-8 lg:grid-cols-4">
          {INLINE_QUIZ_GOALS.map((item) => {
            const active = selectedGoal === item.goal;
            return (
              <button
                key={item.goal}
                type="button"
                onClick={() => setSelectedGoal(item.goal)}
                className={`btn-tactile group relative flex flex-col overflow-hidden rounded-2xl border p-3 text-left sm:p-4 ${
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
                <p className="mt-2.5 font-display text-sm leading-tight font-bold sm:text-base lg:mt-3 lg:text-lg">
                  {item.title[lang]}
                </p>
                <p
                  className={`mt-1 text-[11px] leading-snug sm:text-xs ${
                    active ? "text-pearl/70" : "text-muted"
                  }`}
                >
                  {item.hint[lang]}
                </p>
                {active && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.14em] text-accent uppercase lg:mt-2.5">
                    <Check className="h-3 w-3" />
                    {lang === "uk" ? "Обрано" : "Selected"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Matched 3-Step Protocol */}
        <div id="ritual-result" className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedGoal}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: LUXURY_EASE }}
              className="rounded-[24px] border border-line bg-surface p-5 shadow-[0_8px_32px_rgba(23,26,28,0.04)] sm:p-6 lg:rounded-[28px] lg:p-8"
            >
              <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 lg:flex-row lg:items-center lg:gap-4 lg:pb-5">
                <div>
                  <p className="eyebrow text-[10px] text-accent lg:text-[0.72rem]">
                    {lang === "uk"
                      ? "Рекомендація технолога · −10% SOPHIE10"
                      : "Technologist Match · −10% SOPHIE10"}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl lg:text-3xl">
                    {inlineProtocol.title[lang]}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end lg:gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-xl font-bold text-ink sm:text-2xl lg:text-3xl">
                      {formatPrice(inlineProtocol.bundlePrice, lang)}
                    </span>
                    <span className="text-xs text-muted line-through lg:text-sm">
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
                    className="btn-tactile inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-surface uppercase hover:bg-accent hover:text-ink lg:min-h-[48px] lg:px-6 lg:py-3 lg:text-xs"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    <span>
                      {lang === "uk" ? "Додати весь ритуал" : "Add Full Ritual"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-3.5 grid gap-2.5 md:grid-cols-3 lg:mt-5 lg:gap-4">
                {inlineProtocol.steps.slice(0, 3).map((step, idx) => (
                  <Link
                    key={step.product.id}
                    href={`/product/${step.product.id}`}
                    className="group flex items-center gap-3 rounded-2xl border border-line/80 bg-surface-soft p-2.5 transition-colors hover:border-accent lg:gap-3.5 lg:p-3.5"
                  >
                    <img
                      src={step.product.image}
                      alt={step.product.name[lang]}
                      className="h-16 w-14 shrink-0 rounded-xl object-cover lg:h-20 lg:w-16"
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
        </div>
      </section>

      {/* ==================== ACT 5: ANATOMY OF FORMULAS — EDITORIAL INCI ACCORDION ==================== */}
      <section
        data-header-theme="surface"
        className="border-t border-line bg-surface py-14 lg:py-24"
      >
        <div className="mx-auto grid w-full max-w-[1440px] items-start gap-8 px-4 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-12">
          {/* Left: Macro Botanical Science Visual */}
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            <p className="eyebrow text-accent">{t("home.activesEyebrow")}</p>
            <h2 className="mt-1.5 font-display text-3xl leading-[1.04] font-bold uppercase text-ink sm:text-4xl lg:text-5xl">
              {lang === "uk" ? "Анатомія формул: прозорий INCI" : "Formula Anatomy: Honest INCI"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {lang === "uk"
                ? "Жодних порожніх обіцянок — лише робочі концентрації чистих активів, відібраних сертифікованим технологом."
                : "Zero filler claims—only effective concentrations of clean botanical actives chosen by a certified technologist."}
            </p>

            <div className="relative mt-5 overflow-hidden rounded-[22px] border border-line lg:mt-6 lg:rounded-[26px]">
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
                <div key={item.key} className="py-0.5 lg:py-1">
                  <button
                    type="button"
                    onClick={() => setOpenActiveKey(isOpen ? "" : item.key)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-3 text-left lg:py-5"
                  >
                    <div className="flex items-baseline gap-3 lg:gap-4">
                      <span className="text-[11px] font-bold tracking-[0.16em] text-accent lg:text-xs">
                        {item.num}
                      </span>
                      <div>
                        <span className="font-display text-base font-bold text-ink sm:text-xl lg:text-2xl">
                          {item.name[lang]}
                        </span>
                        <span className="ml-3 hidden text-xs font-semibold tracking-[0.12em] text-muted uppercase sm:inline">
                          {item.role[lang]}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 lg:h-5 lg:w-5 ${
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
                        <div className="pb-3.5 pl-7 pr-2 lg:pb-6 lg:pl-9">
                          <p className="text-xs leading-relaxed text-ink-soft lg:text-sm">
                            {item.desc[lang]}
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-2 lg:mt-4">
                            {linked.map((p) => (
                              <div
                                key={p.id}
                                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-soft py-1 pl-3 pr-1 lg:py-1.5 lg:pl-3.5 lg:pr-1.5"
                              >
                                <Link
                                  href={`/product/${p.id}`}
                                  className="text-[11px] font-bold text-ink hover:text-accent lg:text-xs"
                                >
                                  {p.line ? p.line[lang] : p.name[lang]} ·{" "}
                                  {formatPrice(p.price, lang)}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => addProductToCart(p.id, 1, 0)}
                                  aria-label={t("common.addToCart")}
                                  className="btn-tactile flex h-6 w-6 items-center justify-center rounded-full bg-ink text-surface hover:bg-accent hover:text-ink lg:h-7 lg:w-7"
                                >
                                  <Plus className="h-3 w-3 lg:h-3.5 lg:w-3.5" strokeWidth={2.2} />
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
      <section
        data-header-theme="paper"
        className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8 lg:px-12 lg:py-24"
      >
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] border border-line bg-surface shadow-sm lg:rounded-[28px]">
            {/* Panoramic Campaign Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-[21/9] lg:min-h-[480px] xl:min-h-[540px]">
              <img
                src={assetPath("/assets/editorial/campaign-giftset.jpg")}
                alt={activeBundle.name[lang]}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Architectural Floating Set Switcher Card (bottom-left on desktop, compact block below on mobile) */}
            <div className="p-4 sm:p-6 lg:absolute lg:bottom-7 lg:left-7 lg:w-[460px] lg:rounded-3xl lg:border lg:border-line/60 lg:bg-surface/95 lg:p-7 lg:shadow-2xl lg:backdrop-blur-md">
              <p className="eyebrow text-accent">{t("home.setsEyebrow")}</p>

              {/* 3 Set Switcher Pills */}
              <div className="mt-2.5 flex flex-wrap gap-1.5 lg:mt-3">
                {BUNDLES.map((b, idx) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBundleIdx(idx)}
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors lg:text-[11px] ${
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

              <h3 className="mt-3 font-display text-xl font-bold text-ink lg:mt-4 lg:text-2xl">
                {activeBundle.name[lang]}
              </h3>
              <p className="mt-1 text-xs font-semibold text-accent">
                {activeBundle.subtitle[lang]}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted lg:mt-2">
                {activeBundle.description[lang]}
              </p>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-3.5 lg:mt-5 lg:pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-xl font-bold text-ink lg:text-2xl">
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
      <section
        data-header-theme="surface"
        className="border-t border-line bg-surface py-14 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px] space-y-16 px-4 sm:px-8 lg:space-y-24 lg:px-12">
          {/* 7A: Behind the Laboratory */}
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
            <ParallaxMedia className="rounded-[22px] border border-line lg:col-span-6 lg:rounded-[26px]">
              <img
                src={assetPath("/assets/editorial/campaign-atelier.jpg")}
                alt="Sophie Bilynska Lviv botanical laboratory"
                className="aspect-[16/9] w-full object-cover lg:aspect-[16/10]"
              />
            </ParallaxMedia>

            <Reveal className="lg:col-span-6">
              <p className="eyebrow text-accent">
                {lang === "uk" ? "За лаштунками лабораторії · Львів" : "Behind the Lviv Lab"}
              </p>
              <blockquote className="mt-2 font-display text-xl leading-[1.14] font-bold text-ink sm:text-3xl lg:mt-3 lg:text-4xl">
                {lang === "uk"
                  ? "«Справжній догляд не маскує шкіру — він повертає їй спокій, природний бар'єр і власне сяйво.»"
                  : "“True skincare never masks skin — it restores calm, strengthens the barrier, and reveals your own glow.”"}
              </blockquote>
              <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm lg:mt-4">
                {lang === "uk"
                  ? "Софія Білинська — сертифікований технолог. Кожну формулу ми створюємо й тестуємо вручну малими партіями зі 100% еко-складників."
                  : "Sophie Bilynska, certified cosmetic technologist. Every formula is compounded and checked by hand in small batches with 100% eco ingredients."}
              </p>
              <div className="mt-4 lg:mt-6">
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

          {/* 7B: Community Reviews Circular Carousel + 7C Compact Journal Notes */}
          <div>
            <div>
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end lg:gap-4">
                <div>
                  <p className="eyebrow text-accent">{t("home.reviewsEyebrow")}</p>
                  <h2 className="mt-1 font-display text-2xl font-bold uppercase text-ink sm:text-4xl">
                    {t("home.reviewsTitle")}
                  </h2>
                </div>
                <a
                  href="https://www.instagram.com/sb.cosm/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-tactile inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-surface lg:px-5 lg:py-2.5"
                >
                  <Instagram className="h-4 w-4 text-accent" />
                  <span>@sb.cosm · 16.5K</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Mobile: Centered single-card infinite circular review carousel with hairline chevrons & progress bar */}
              <MobileCircularCarousel
                items={CLIENT_REVIEWS}
                getKey={(rev) => rev.id}
                prevLabel={lang === "uk" ? "Попередній відгук" : "Previous review"}
                nextLabel={lang === "uk" ? "Наступний відгук" : "Next review"}
                theme="light"
                arrowTopClass="top-1/2"
                renderItem={(rev) => (
                  <div className="flex min-h-[220px] flex-col rounded-2xl border border-line bg-paper/55 p-5">
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
                )}
              />

              {/* Desktop: 4-Col Grid */}
              <div className="mt-7 hidden gap-4 lg:grid lg:grid-cols-4">
                {CLIENT_REVIEWS.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex flex-col rounded-2xl border border-line bg-paper/55 p-5"
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
            </div>

            {/* 7C: Compact 3-Row Editorial Journal Strip */}
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
                    className="group flex flex-col justify-between gap-1.5 py-4 transition-colors sm:flex-row sm:items-center sm:gap-6"
                  >
                    <div className="flex items-baseline gap-3 lg:gap-4">
                      <span className="shrink-0 text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
                        {article.category[lang]}
                      </span>
                      <span className="font-display text-base font-bold text-ink group-hover:text-accent sm:text-xl">
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
      <section
        data-header-theme="surface"
        className="border-t border-line bg-surface py-14 lg:py-20"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-4 sm:px-8 lg:flex-row lg:items-center lg:px-12">
          <div>
            <p className="eyebrow text-accent">
              {lang === "uk" ? "Персональна консультація" : "Personal Concierge"}
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold uppercase text-ink sm:text-4xl">
              {lang === "uk"
                ? "Сумніваєтесь у виборі? Підберемо догляд разом"
                : "Unsure what to pick? Let's build your ritual together"}
            </h2>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href="https://t.me/+380631790642"
              target="_blank"
              rel="noreferrer"
              className="btn-tactile inline-flex min-h-[50px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ink px-6 py-3 text-xs font-bold tracking-[0.15em] text-surface uppercase hover:bg-accent hover:text-ink"
            >
              <Send className="h-3.5 w-3.5 shrink-0" />
              <span>{lang === "uk" ? "Написати в Telegram" : "Message on Telegram"}</span>
            </a>
            <Link
              href="/quiz"
              className="btn-tactile inline-flex min-h-[50px] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-ink px-6 py-3 text-xs font-bold tracking-[0.15em] text-ink uppercase hover:bg-ink hover:text-surface"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span>{lang === "uk" ? "Пройти підбір за 30 с" : "30-Sec Ritual Finder"}</span>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
