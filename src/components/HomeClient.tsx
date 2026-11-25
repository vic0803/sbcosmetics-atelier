"use client";

import {
  ArrowLeft,
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
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
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

/** Native horizontal full-screen snap-scroll deck for mobile Act 2 (zero arrows, live progress pill/lines). */
function MobileSwipeDeck<T>({
  items,
  getKey,
  renderItem,
  resetKey,
}: {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, idx: number) => ReactNode;
  resetKey: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [resetKey]);

  const syncIndexFromScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    setActiveIdx((prev) => (prev === clamped ? prev : clamped));
  };

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const idxAttr = entry.target.getAttribute("data-slide-idx");
            if (idxAttr !== null) {
              const parsed = Number(idxAttr);
              if (!Number.isNaN(parsed)) {
                setActiveIdx((prev) => (prev === parsed ? prev : parsed));
              }
            }
          }
        }
      },
      { root, threshold: 0.55 }
    );

    slideRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [items.length, resetKey]);

  const scrollToSlide = (idx: number) => {
    setActiveIdx(idx);
    const target = slideRefs.current[idx];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      return;
    }
    const el = scrollerRef.current;
    if (el) {
      el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:hidden">
      {/* Full-bleed horizontal snap container */}
      <div
        ref={scrollerRef}
        onScroll={syncIndexFromScroll}
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {items.map((item, idx) => (
          <div
            key={getKey(item)}
            ref={(node) => {
              slideRefs.current[idx] = node;
            }}
            data-slide-idx={idx}
            className="h-full w-full shrink-0 snap-center px-4 sm:px-8"
          >
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {/* Minimalist swipe progress bar (expanding bronze line + subtle dots) */}
      {items.length > 1 && (
        <div
          className="mt-4 flex shrink-0 items-center justify-center gap-1 px-4"
          aria-label="Swipe progress"
        >
          {items.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={getKey(item)}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`Slide ${idx + 1} of ${items.length}`}
                aria-current={isActive ? "true" : undefined}
                className="flex h-6 min-w-[22px] items-center justify-center px-1"
              >
                <span
                  className={`block h-[3px] rounded-none transition-all duration-300 ${
                    isActive
                      ? "w-8 bg-accent"
                      : "w-2 bg-pearl/25 hover:bg-pearl/45"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Muted loop video: attaches source after hero entrance settles, then plays/pauses on scroll with zero React re-renders. */
function LazyLoopVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let visible = false;
    let loaded = false;

    const ensureSource = () => {
      if (loaded) return;
      loaded = true;
      video.src = src;
      video.load();
    };

    // Defer video network load until after the hero entrance animation finishes
    const idleTimer = window.setTimeout(ensureSource, 1200);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          ensureSource();
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "250px 0px" }
    );
    io.observe(video);

    return () => {
      window.clearTimeout(idleTimer);
      io.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
    />
  );
}

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
    // Once Act 2 completely covers the sticky Hero, hide the Hero from the compositor
    // so its WebGL/sticky layers can never bleed through or cause tile gaps below Act 2.
    if (heroSectionRef.current) {
      const shouldHide = y >= vh + 24;
      const nextVis = shouldHide ? "hidden" : "visible";
      if (heroSectionRef.current.style.visibility !== nextVis) {
        heroSectionRef.current.style.visibility = nextVis;
      }
    }
  };
  useMotionValueEvent(scrollY, "change", syncHeroExit);
  useEffect(() => {
    const onResize = () => syncHeroExit(window.scrollY);
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toBlurFilter = (v: number) => (v <= 0.15 ? "none" : `blur(${v.toFixed(1)}px)`);

  // --- DESKTOP ANIMATION: subtle float upward (-56px/-50px) with immediate fade/blur on scroll ---
  const desktopTextBlur = useTransform(heroExit, [0, 0.50], [0, 14]);
  const desktopTextFilter = useTransform(desktopTextBlur, toBlurFilter);
  const desktopTextOpacity = useTransform(heroExit, [0.05, 0.55], [1, 0]);
  const desktopTextY = useTransform(heroExit, [0, 0.60], [0, -56]);

  const desktopCtaBlur = useTransform(heroExit, [0, 0.38], [0, 14]);
  const desktopCtaFilter = useTransform(desktopCtaBlur, toBlurFilter);
  const desktopCtaOpacity = useTransform(heroExit, [0.02, 0.38], [1, 0]);
  const desktopCtaY = useTransform(heroExit, [0, 0.45], [0, -50]);

  // --- MOBILE ANIMATION: 1:1 synchronous upward scroll lift, fading strictly at 25% (buttons) and 38% (title) ---
  const mobileScrollLift = useTransform(scrollY, (s) => -s);

  const mobileEyebrowBlur = useTransform(heroExit, [0, 0.18], [0, 8]);
  const mobileEyebrowFilter = useTransform(mobileEyebrowBlur, toBlurFilter);
  const mobileEyebrowOpacity = useTransform(heroExit, [0, 0.18], [1, 0]);
  const mobileEyebrowY = useTransform(heroExit, [0, 0.20], [0, -20]);

  const mobileCtaBlur = useTransform(heroExit, [0.25, 0.42], [0, 14]);
  const mobileCtaFilter = useTransform(mobileCtaBlur, toBlurFilter);
  const mobileCtaOpacity = useTransform(heroExit, [0.25, 0.42], [1, 0]);

  const mobileTitleBlur = useTransform(heroExit, [0.38, 0.58], [0, 14]);
  const mobileTitleFilter = useTransform(mobileTitleBlur, toBlurFilter);
  const mobileTitleOpacity = useTransform(heroExit, [0.38, 0.58], [1, 0]);

  const heroProofOpacity = useTransform(heroExit, [0, 0.20], [1, 0]);
  const heroVeilOpacity = useTransform(heroExit, [0.25, 1], [0, 0.22]);

  // Combined styles conditionally bound to viewport mode
  const heroEyebrowStyle = prefersReducedMotion
    ? undefined
    : isDesktop
      ? { filter: desktopTextFilter, opacity: desktopTextOpacity, y: desktopTextY }
      : { filter: mobileEyebrowFilter, opacity: mobileEyebrowOpacity, y: mobileEyebrowY };

  const heroTitleStyle = prefersReducedMotion
    ? undefined
    : isDesktop
      ? { filter: desktopTextFilter, opacity: desktopTextOpacity, y: desktopTextY }
      : { filter: mobileTitleFilter, opacity: mobileTitleOpacity, y: mobileScrollLift };

  const heroCtaStyle = prefersReducedMotion
    ? undefined
    : isDesktop
      ? { filter: desktopCtaFilter, opacity: desktopCtaOpacity, y: desktopCtaY }
      : { filter: mobileCtaFilter, opacity: mobileCtaOpacity, y: mobileScrollLift };

  const heroProofStyle = prefersReducedMotion
    ? undefined
    : isDesktop
      ? { opacity: heroProofOpacity, y: desktopTextY }
      : { opacity: heroProofOpacity, y: mobileScrollLift };
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
      return PRODUCTS.filter((p) => p.category === "face").slice(0, 5);
    }
    if (showcaseTab === "body-hair") {
      return PRODUCTS.filter((p) => p.category === "body" || p.category === "hair").slice(0, 5);
    }
    return PRODUCTS.filter((p) => p.badge === "bestseller").slice(0, 5);
  })();

  // Desktop carousel scroll state for Act 2 (1 card = 100%, 2 cards = 2 equal, 3-5 cards = 2 visible + scroll)
  const desktopCarouselRef = useRef<HTMLDivElement | null>(null);
  const desktopDragRef = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const [isDesktopDragging, setIsDesktopDragging] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [desktopSlideIdx, setDesktopSlideIdx] = useState(0);

  const activeDesktopCount = showcaseTab === "sets" ? BUNDLES.length : showcaseProducts.length;
  const desktopStepsCount = Math.max(1, activeDesktopCount - 1);
  const showDesktopControls = activeDesktopCount > 2;

  const syncDesktopCarouselControls = () => {
    const el = desktopCarouselRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < maxScroll - 4);
    if (maxScroll > 0 && desktopStepsCount > 1) {
      const progress = el.scrollLeft / maxScroll;
      const idx = Math.round(progress * (desktopStepsCount - 1));
      const clamped = Math.max(0, Math.min(desktopStepsCount - 1, idx));
      setDesktopSlideIdx((prev) => (prev === clamped ? prev : clamped));
    } else {
      setDesktopSlideIdx(0);
    }
  };

  useEffect(() => {
    const el = desktopCarouselRef.current;
    setDesktopSlideIdx(0);
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
    const raf = window.requestAnimationFrame(syncDesktopCarouselControls);
    const onResize = () => syncDesktopCarouselControls();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showcaseTab, lang, activeDesktopCount]);

  const scrollDesktopByOneCard = (direction: -1 | 1) => {
    const el = desktopCarouselRef.current;
    if (!el) return;
    const firstSlide = el.firstElementChild as HTMLElement | null;
    const gapPx = 24; // gap-6
    const step = firstSlide ? firstSlide.offsetWidth + gapPx : (el.clientWidth + gapPx) / 2;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const scrollDesktopToStep = (stepIdx: number) => {
    const el = desktopCarouselRef.current;
    if (!el) return;
    const firstSlide = el.firstElementChild as HTMLElement | null;
    const gapPx = 24;
    const step = firstSlide ? firstSlide.offsetWidth + gapPx : (el.clientWidth + gapPx) / 2;
    el.scrollTo({ left: stepIdx * step, behavior: "smooth" });
  };

  const handleDesktopMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !showDesktopControls) return;
    const el = desktopCarouselRef.current;
    if (!el) return;
    desktopDragRef.current = {
      active: true,
      startX: e.pageX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
    setIsDesktopDragging(true);
  };

  const handleDesktopMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const drag = desktopDragRef.current;
    if (!drag.active) return;
    const el = desktopCarouselRef.current;
    if (!el) return;
    const dx = e.pageX - drag.startX;
    if (Math.abs(dx) > 6) {
      drag.moved = true;
    }
    if (drag.moved) {
      e.preventDefault();
      el.scrollLeft = drag.startScrollLeft - dx * 1.15;
    }
  };

  const endDesktopMouseDrag = () => {
    if (!desktopDragRef.current.active) return;
    desktopDragRef.current.active = false;
    setIsDesktopDragging(false);
    syncDesktopCarouselControls();
    window.setTimeout(() => {
      desktopDragRef.current.moved = false;
    }, 60);
  };

  const handleDesktopClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (desktopDragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

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

  const faceCount = PRODUCTS.filter((p) => p.category === "face").length;
  const bodyCount = PRODUCTS.filter((p) => p.category === "body").length;
  const hairCount = PRODUCTS.filter((p) => p.category === "hair").length;
  const setsCount = BUNDLES.length;

  const bentoCategories = [
    {
      key: "face",
      href: "/catalog?category=face",
      title: { uk: "Для обличчя", en: "Face Care" },
      subtitle: {
        uk: "Сироватки, тоніки та щоденне зволоження",
        en: "Serums, toners & daily hydration",
      },
      count: {
        uk: `${faceCount} формул`,
        en: `${faceCount} formulas`,
      },
      image: "/assets/editorial/campaign-ritual.jpg",
      imgPos: "object-[50%_22%]",
      spanClass: "col-span-2 aspect-[4/3] lg:col-span-6 lg:row-span-2 lg:aspect-auto",
      titleSize: "text-2xl sm:text-3xl lg:text-4xl",
    },
    {
      key: "sets",
      href: "/catalog?category=sets",
      title: { uk: "Набори", en: "Gift Sets" },
      subtitle: {
        uk: "Готові ритуали у фірмовому пакуванні −10%",
        en: "Curated rituals in signature box −10%",
      },
      count: {
        uk: `${setsCount} набори`,
        en: `${setsCount} sets`,
      },
      image: "/assets/editorial/campaign-giftset.jpg",
      imgPos: "object-center",
      spanClass: "col-span-2 aspect-[16/10] lg:col-span-6 lg:row-span-1 lg:aspect-auto",
      titleSize: "text-xl sm:text-2xl lg:text-3xl",
    },
    {
      key: "body",
      href: "/catalog?category=body",
      title: { uk: "Для тіла", en: "Body Care" },
      subtitle: {
        uk: "Оксамитові креми та делікатне очищення",
        en: "Velvet creams & gentle cleansing",
      },
      count: {
        uk: `${bodyCount} засоби`,
        en: `${bodyCount} items`,
      },
      image: "/assets/products/body-cream.jpg",
      imgPos: "object-center",
      spanClass: "col-span-1 aspect-[4/5] lg:col-span-3 lg:row-span-1 lg:aspect-auto",
      titleSize: "text-lg sm:text-xl lg:text-2xl",
    },
    {
      key: "hair",
      href: "/catalog?category=hair",
      title: { uk: "Для волосся", en: "Hair Care" },
      subtitle: {
        uk: "Твердий шампунь та ботанічний блиск",
        en: "Solid shampoo & botanical shine",
      },
      count: {
        uk: `${hairCount} засіб`,
        en: `${hairCount} item`,
      },
      image: "/assets/products/shampoo.jpg",
      imgPos: "object-center",
      spanClass: "col-span-1 aspect-[4/5] lg:col-span-3 lg:row-span-1 lg:aspect-auto",
      titleSize: "text-lg sm:text-xl lg:text-2xl",
    },
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
            scrollProgress={heroExit}
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
            scrollProgress={heroExit}
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
            <motion.div style={heroEyebrowStyle} className="flex justify-center lg:hidden">
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
                {/* Desktop eyebrow (dissolves softly at start of scroll) */}
                <motion.div style={heroEyebrowStyle} className="hidden lg:block">
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
                </motion.div>

                {/* Main Headline & Subtitle lift 1:1 with lower section, dissolving past 25% */}
                <motion.div style={heroTitleStyle}>
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

                  {/* Subtitle shown on desktop: 24–27px */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.28, ease: LUXURY_EASE }}
                    className="mt-5 hidden max-w-[450px] text-[24px] leading-[1.35] text-ink-soft lg:mt-[min(40px,4svh)] lg:block xl:text-[27px]"
                  >
                    {t("hero.subtitle")}
                  </motion.p>
                </motion.div>

                {/* Primary CTA + Ritual Link: lift synchronously with bottom section, begin fading at 25% */}
                <motion.div
                  style={heroCtaStyle}
                  className="mt-6 flex flex-col items-center gap-3.5 lg:mt-[min(56px,5.2svh)] lg:flex-row lg:items-center lg:gap-6 xl:gap-8"
                >
                  <div className="flex w-full justify-center lg:w-auto">
                    <Link
                      href="/catalog"
                      className="btn-tactile inline-flex min-h-[54px] w-full max-w-[300px] shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-none bg-ink px-7 py-3.5 text-[13.2px] font-bold tracking-[0.16em] text-surface uppercase shadow-lg hover:bg-accent hover:text-ink lg:min-h-[62px] lg:w-auto lg:max-w-none lg:px-8 lg:py-4 lg:text-[16px] xl:px-10"
                    >
                      <span>{lang === "uk" ? "Обрати догляд" : "Explore Collection"}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" strokeWidth={2.2} />
                    </Link>
                  </div>

                  <div className="flex justify-center">
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
                  </div>
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

      {/* Everything after the hero rides on an isolated opaque GPU layer that slides up over the sticky hero */}
      <div className="relative z-10 isolate bg-[#f4efe8] [transform:translate3d(0,0,0)]">
      {/* ==================== ACT 2: BESTSELLERS — DEEP SLATE NAVY GALLERY ==================== */}
      <section
        id="signature-formulas"
        data-header-theme="navy"
        className="relative flex h-[100svh] min-h-[680px] flex-col overflow-hidden border-t border-accent/20 bg-ink pt-[26px] pb-[76px] text-pearl shadow-[0_-24px_48px_-12px_rgba(14,22,30,0.22)] lg:block lg:h-auto lg:min-h-0 lg:py-20"
      >
        <div className="relative mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col lg:block lg:px-12">
          {/* DESKTOP TOP BAR: "ОБРАНО ВАМИ" (2x larger, left 1/3) aligned with Underline Filter Tabs (right 2/3) */}
          <div className="hidden lg:mb-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-12">
            <div className="lg:col-span-4">
              <p className="text-xl font-bold tracking-[0.14em] text-accent uppercase xl:text-2xl">
                {lang === "uk" ? "Обрано вами" : "Chosen by You"}
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="flex items-center gap-8">
                {tabs.map((tab) => {
                  const active = showcaseTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setShowcaseTab(tab.key)}
                      className={`relative pb-2 text-sm font-bold tracking-[0.15em] uppercase transition-colors xl:text-[15px] ${
                        active ? "text-pearl" : "text-pearl/55 hover:text-pearl"
                      }`}
                    >
                      <span>{tab.label[lang]}</span>
                      {active && (
                        <motion.span
                          layoutId="home-showcase-tab-desktop"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                          className="absolute inset-x-0 bottom-0 h-[2px] rounded-none bg-accent"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MOBILE HEADER: 2-line justified slogan tucked into the top scroll-in zone + "ОБРАНО ВАМИ" flush over "КУЛЬТОВІ" + Edge-to-Edge Title */}
          <div className="shrink-0 px-4 sm:px-8 lg:hidden">
            <p className="w-full text-[clamp(0.95rem,4.13vw,2.04rem)] leading-[1.3] font-normal tracking-[-0.015em] text-pearl/80">
              {lang === "uk" ? (
                <>
                  <span className="block w-full text-justify [text-align-last:justify]">
                    Формули, до яких повертаються з першого дотику. Чисті
                  </span>
                  <span className="block w-full text-justify [text-align-last:justify]">
                    ботанічні активи для природного сяйва шкіри щодня.
                  </span>
                </>
              ) : (
                <>
                  <span className="block w-full text-justify [text-align-last:justify]">
                    Formulas you return to from the very first touch. Pure
                  </span>
                  <span className="block w-full text-justify [text-align-last:justify]">
                    botanical actives for natural skin radiance every day.
                  </span>
                </>
              )}
            </p>

            <p className="mt-[30px] w-fit whitespace-nowrap text-[clamp(1.05rem,4.7vw,1.45rem)] leading-none font-bold tracking-[0.12em] text-accent uppercase">
              {lang === "uk" ? "Обрано вами" : "Chosen by You"}
            </p>
            <h2 className="mt-1 w-full whitespace-nowrap font-display text-[clamp(2.05rem,9.3vw,3.15rem)] leading-[0.96] font-bold tracking-[-0.02em] uppercase text-pearl">
              {t("home.bestsellersTitle")}
            </h2>

            <div className="mt-3 flex w-full items-center justify-between gap-0.5 rounded-none border border-pearl/12 bg-espresso/90 p-1">
              {tabs.map((tab) => {
                const active = showcaseTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setShowcaseTab(tab.key)}
                    className={`relative flex flex-auto items-center justify-center whitespace-nowrap rounded-none px-2 py-2 text-center text-[10px] leading-none font-bold tracking-[0.04em] uppercase transition-colors sm:px-4 sm:text-xs ${
                      active ? "text-ink" : "text-pearl/65 hover:text-pearl"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="home-showcase-tab-mobile"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-none bg-pearl"
                      />
                    )}
                    <span className="relative z-10">{tab.label[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN 2-COLUMN BODY (Desktop: Left 1/3 flush-top with Right 2/3 cards | Mobile: Full-height swipe card) */}
          <div className="mt-4 flex min-h-0 flex-1 flex-col lg:mt-0 lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
            {/* DESKTOP LEFT COLUMN (1/3): Monumental Title (+10%), 2x Larger Slogan, Bottom "Увесь каталог" (2x) + Side Nav Arrows & Progress */}
            <div className="hidden lg:col-span-4 lg:flex lg:h-[520px] lg:flex-col lg:justify-between xl:h-[560px]">
              <div>
                <h2 className="-mt-[0.08em] font-display text-[3.85rem] leading-[0.92] font-bold tracking-[-0.015em] uppercase text-pearl xl:text-[4.65rem]">
                  {t("home.bestsellersTitle")}
                </h2>
                <p className="mt-5 max-w-[380px] text-[22px] leading-[1.35] font-normal text-pearl/78 xl:mt-6 xl:text-[25px]">
                  {lang === "uk"
                    ? "Формули, до яких повертаються з першого дотику. Чисті активи для природного сяйва щодня."
                    : "Formulas you return to from the very first touch. Pure actives for natural radiance every day."}
                </p>
              </div>

              {/* Bottom of Left Column: "Увесь каталог" (2x larger) + Carousel Arrows & Progress right underneath */}
              <div className="pt-4">
                <Link
                  href="/catalog"
                  className="group inline-flex items-center gap-3 text-xl font-bold tracking-[0.1em] text-pearl uppercase transition-colors hover:text-accent xl:text-2xl"
                >
                  <span>{lang === "uk" ? "Увесь каталог" : "Full Catalog"}</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5 xl:h-6 xl:w-6" />
                </Link>

                {showDesktopControls && (
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => scrollDesktopByOneCard(-1)}
                      disabled={!canScrollPrev}
                      aria-label={lang === "uk" ? "Попередня картка" : "Previous card"}
                      className="flex h-8 w-8 items-center justify-center text-pearl/75 transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:text-pearl/75"
                    >
                      <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
                    </button>

                    <div
                      className="flex items-center gap-2"
                      aria-label="Carousel progress"
                    >
                      {Array.from({ length: desktopStepsCount }).map((_, idx) => {
                        const isActive = idx === desktopSlideIdx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => scrollDesktopToStep(idx)}
                            aria-label={`Position ${idx + 1} of ${desktopStepsCount}`}
                            aria-current={isActive ? "true" : undefined}
                            className="flex h-6 items-center justify-center px-0.5"
                          >
                            <span
                              className={`block h-[2.5px] rounded-none transition-all duration-300 ${
                                isActive
                                  ? "w-10 bg-accent"
                                  : "w-5 bg-pearl/25 hover:bg-pearl/50"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollDesktopByOneCard(1)}
                      disabled={!canScrollNext}
                      aria-label={lang === "uk" ? "Наступна картка" : "Next card"}
                      className="flex h-8 w-8 items-center justify-center text-pearl/75 transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:text-pearl/75"
                    >
                      <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN (2/3 on desktop, swipe deck on mobile): Constant-height single-row carousel with mouse drag + trackpad scroll */}
            <div className="flex min-h-0 flex-1 flex-col lg:col-span-8 lg:block">
              <AnimatePresence mode="wait" initial={false}>
                {showcaseTab === "sets" ? (
                  <motion.div
                    key="sets"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onAnimationComplete={syncDesktopCarouselControls}
                    className="flex min-h-0 flex-1 flex-col lg:block"
                  >
                    {/* Mobile: Full-screen single-card horizontal swipe deck */}
                    <MobileSwipeDeck
                      items={BUNDLES}
                      getKey={(b) => b.id}
                      resetKey={`sets-${lang}`}
                      renderItem={(bundle) => (
                        <article className="group relative flex h-full min-h-[340px] w-full flex-col justify-between overflow-hidden rounded-none border-0 bg-espresso">
                          <img
                            loading="lazy"
                            decoding="async"
                            src={bundle.image}
                            alt={bundle.name[lang]}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/50 via-ink/18 to-transparent" />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[66%] bg-gradient-to-t from-ink/96 via-ink/68 to-transparent" />

                          <div className="relative z-10 flex items-start justify-between p-4">
                            <span className="rounded-none border border-pearl/15 bg-ink/75 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-accent uppercase backdrop-blur-md">
                              {bundle.badge[lang]}
                            </span>
                          </div>

                          <div className="relative z-10 mt-auto p-5">
                            <h3 className="font-display text-2xl leading-tight font-bold text-pearl">
                              {bundle.name[lang]}
                            </h3>
                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-pearl/80">
                              {bundle.subtitle[lang]}
                            </p>

                            <div className="mt-4 flex items-center justify-between gap-3">
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-pearl">
                                  {formatPrice(bundle.bundlePrice, lang)}
                                </span>
                                <span className="text-xs text-pearl/50 line-through">
                                  {formatPrice(bundle.originalPrice, lang)}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  addBundleToCart(bundle.id);
                                  openOverlay("cart");
                                }}
                                className="btn-tactile inline-flex items-center gap-1.5 rounded-none bg-surface px-4 py-2.5 text-[11px] font-bold tracking-[0.12em] text-ink uppercase shadow-md hover:bg-accent"
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
                                <span>{t("common.quickAdd")}</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      )}
                    />

                    {/* Desktop: Fixed-height single-row horizontal carousel with mouse drag + trackpad */}
                    <div
                      ref={desktopCarouselRef}
                      onScroll={syncDesktopCarouselControls}
                      onMouseDown={handleDesktopMouseDown}
                      onMouseMove={handleDesktopMouseMove}
                      onMouseUp={endDesktopMouseDrag}
                      onMouseLeave={endDesktopMouseDrag}
                      onClickCapture={handleDesktopClickCapture}
                      className={`no-scrollbar hidden select-none lg:flex lg:h-[520px] lg:flex-nowrap lg:gap-6 lg:overflow-x-auto xl:h-[560px] ${
                        showDesktopControls
                          ? isDesktopDragging
                            ? "cursor-grabbing"
                            : "cursor-grab lg:scroll-smooth lg:snap-x lg:snap-mandatory"
                          : ""
                      }`}
                    >
                      {BUNDLES.map((bundle) => (
                        <div
                          key={bundle.id}
                          className={`h-full shrink-0 snap-start ${
                            BUNDLES.length === 1 ? "w-full" : "w-[calc((100%-1.5rem)/2)]"
                          }`}
                        >
                          <article className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-none border-0 bg-espresso">
                            <img
                              loading="lazy"
                              decoding="async"
                              draggable={false}
                              src={bundle.image}
                              alt={bundle.name[lang]}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                            />
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/45 via-ink/15 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-ink/90 via-ink/45 to-transparent" />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink/96 via-ink/72 to-transparent opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100" />

                            {/* Top badge glides down on hover (dark navy high-contrast tag) */}
                            <div className="relative z-10 flex -translate-y-3 items-center justify-between p-6 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                              <span className="border-l-2 border-accent bg-ink/95 px-3.5 py-1.5 text-[13px] leading-none font-bold tracking-[0.18em] text-accent uppercase">
                                {bundle.badge[lang]}
                              </span>
                            </div>

                            {/* Bottom zone: White Name + Aqua Price (turns white on hover); Description lifts generously on hover */}
                            <div className="relative z-10 mt-auto p-6">
                              <h3 className="line-clamp-2 font-display text-[32px] leading-[1.08] font-semibold text-pearl">
                                {bundle.name[lang]}
                              </h3>

                              <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-400 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100">
                                <div className="overflow-hidden">
                                  <p className="mt-1.5 mb-7 line-clamp-2 text-[13px] leading-relaxed text-pearl/82">
                                    {bundle.subtitle[lang]}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-1.5 flex items-end justify-between gap-3">
                                <div className="flex items-baseline gap-2 leading-none">
                                  <span className="text-xl leading-none font-semibold text-accent transition-colors duration-300 group-hover:text-pearl">
                                    {formatPrice(bundle.bundlePrice, lang)}
                                  </span>
                                  <span className="text-xs leading-none text-pearl/50 line-through">
                                    {formatPrice(bundle.originalPrice, lang)}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    addBundleToCart(bundle.id);
                                    openOverlay("cart");
                                  }}
                                  aria-label={t("common.quickAdd")}
                                  className="btn-tactile absolute right-6 bottom-6 flex h-10 w-10 shrink-0 translate-y-3 items-center justify-center rounded-none bg-surface text-ink opacity-0 transition-all duration-400 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-accent group-hover:translate-y-0 group-hover:opacity-100"
                                >
                                  <Plus className="h-[18px] w-[18px]" strokeWidth={1.9} />
                                </button>
                              </div>
                            </div>
                          </article>
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
                    onAnimationComplete={syncDesktopCarouselControls}
                    className="flex min-h-0 flex-1 flex-col lg:block"
                  >
                    {/* Mobile: Full-screen single-card horizontal swipe deck */}
                    <MobileSwipeDeck
                      items={showcaseProducts}
                      getKey={(p) => p.id}
                      resetKey={`${showcaseTab}-${lang}`}
                      renderItem={(product, idx) => (
                        <ProductCard
                          product={product}
                          variant="dark"
                          layout="editorial"
                          heightClassName="h-full min-h-[340px]"
                          fillHeight
                          index={idx}
                        />
                      )}
                    />

                    {/* Desktop: Fixed-height single-row horizontal carousel with mouse drag + trackpad */}
                    <div
                      ref={desktopCarouselRef}
                      onScroll={syncDesktopCarouselControls}
                      onMouseDown={handleDesktopMouseDown}
                      onMouseMove={handleDesktopMouseMove}
                      onMouseUp={endDesktopMouseDrag}
                      onMouseLeave={endDesktopMouseDrag}
                      onClickCapture={handleDesktopClickCapture}
                      className={`no-scrollbar hidden select-none lg:flex lg:h-[520px] lg:flex-nowrap lg:gap-6 lg:overflow-x-auto xl:h-[560px] ${
                        showDesktopControls
                          ? isDesktopDragging
                            ? "cursor-grabbing"
                            : "cursor-grab lg:scroll-smooth lg:snap-x lg:snap-mandatory"
                          : ""
                      }`}
                    >
                      {showcaseProducts.map((product, idx) => (
                        <div
                          key={product.id}
                          className={`h-full shrink-0 snap-start ${
                            showcaseProducts.length === 1
                              ? "w-full"
                              : "w-[calc((100%-1.5rem)/2)]"
                          }`}
                        >
                          <ProductCard
                            product={product}
                            variant="dark"
                            layout="editorial"
                            heightClassName="h-full"
                            index={idx}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile-only bottom link */}
          <div className="mt-3 flex shrink-0 justify-center px-4 sm:px-8 lg:hidden">
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-2 text-sm font-bold tracking-[0.14em] text-pearl/90 uppercase hover:text-accent"
            >
              <span>{lang === "uk" ? "Увесь каталог" : "Full Catalog"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== ACT 2.5: EDITORIAL BENTO — SHOP BY CATEGORY ==================== */}
      <section
        data-header-theme="paper"
        className="relative overflow-hidden bg-[#f4efe8] pt-14 pb-12 lg:pt-20 lg:pb-16"
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-accent">
                  {lang === "uk" ? "Напрямки догляду" : "Shop by Category"}
                </p>
                <h2 className="mt-1 font-display text-3xl leading-[1.02] font-bold uppercase text-ink sm:text-4xl lg:mt-1.5 lg:text-5xl">
                  {lang === "uk" ? "Обрати догляд" : "Choose Your Ritual"}
                </h2>
              </div>

              <Link
                href="/catalog"
                className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-[11px] font-bold tracking-[0.14em] text-ink uppercase transition-colors hover:text-accent sm:text-xs"
              >
                <span>{lang === "uk" ? "Увесь каталог" : "Full Catalog"}</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2.2}
                />
              </Link>
            </div>
          </Reveal>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-8 lg:h-[600px] lg:grid-cols-12 lg:grid-rows-2 lg:gap-4 xl:h-[660px]">
            {bentoCategories.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-none bg-espresso shadow-[0_6px_26px_rgba(18,16,14,0.08)] transition-shadow duration-500 hover:shadow-[0_18px_44px_rgba(18,16,14,0.16)] ${cat.spanClass}`}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={assetPath(cat.image)}
                  alt={cat.title[lang]}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] ${cat.imgPos}`}
                />
                {/* Soft top & bottom editorial scrims for guaranteed contrast on every crop */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink/35 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink/85 via-ink/35 to-transparent transition-opacity duration-500 group-hover:from-ink/90" />

                {/* Top pill count */}
                <div className="relative z-10 flex items-center justify-between p-3.5 sm:p-4 lg:p-5">
                  <span className="rounded-none border border-pearl/20 bg-ink/45 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-pearl/90 uppercase backdrop-blur-md sm:px-3 sm:text-[10px]">
                    {cat.count[lang]}
                  </span>
                </div>

                {/* Bottom title + floating arrow pill */}
                <div className="relative z-10 mt-auto flex items-end justify-between gap-3 p-3.5 sm:p-5 lg:p-6">
                  <div className="min-w-0">
                    <h3
                      className={`font-display leading-[1.04] font-bold text-pearl transition-colors group-hover:text-accent ${cat.titleSize}`}
                    >
                      {cat.title[lang]}
                    </h3>
                    <p className="mt-1 hidden line-clamp-1 text-xs text-pearl/75 sm:block">
                      {cat.subtitle[lang]}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-surface text-ink shadow-md transition-all duration-300 group-hover:scale-105 group-hover:bg-accent sm:h-10 sm:w-11 lg:h-11 lg:w-12"
                  >
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-[18px] sm:w-[18px]"
                      strokeWidth={2.2}
                    />
                  </span>
                </div>
              </Link>
            ))}
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
            <ParallaxMedia className="aspect-[4/5] w-full rounded-none border border-line bg-surface shadow-[0_8px_32px_rgba(23,26,28,0.06)] ">
              <LazyLoopVideo
                className="h-full w-full object-cover"
                poster={assetPath("/assets/hero/ice-bloom-poster.jpg")}
                src={assetPath("/assets/hero/ice-bloom.mp4")}
              />
            </ParallaxMedia>
          </div>

          {/* Right: Editorial Deep-Dive into #1 Bestseller Silk Touch Serum */}
          <Reveal className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2.5 lg:gap-3">
              <span className="eyebrow text-accent">
                {lang === "uk" ? "Флагман у русі · Хіт №1" : "Flagship in Motion · No. 1 Hit"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-none border border-line bg-surface/60 px-2.5 py-0.5 text-[10px] font-semibold text-ink lg:px-3 lg:py-1 lg:text-[11px]">
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
                className="btn-tactile inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-none bg-ink px-6 py-3 text-xs font-bold tracking-[0.16em] text-surface uppercase hover:bg-accent hover:text-ink lg:min-h-[54px] lg:px-7 lg:py-4"
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

        {/* 2x2 Mobile / 4-Col Desktop Full-Bleed Editorial Goal Tiles */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-8 lg:grid-cols-4">
          {INLINE_QUIZ_GOALS.map((item) => {
            const active = selectedGoal === item.goal;
            return (
              <button
                key={item.goal}
                type="button"
                onClick={() => setSelectedGoal(item.goal)}
                className={`btn-tactile group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-none text-left transition-all duration-300 sm:aspect-[4/4] ${
                  active
                    ? "ring-2 ring-accent ring-offset-2 ring-offset-[#f4efe8] shadow-[0_14px_34px_rgba(18,16,14,0.2)]"
                    : "border border-line/70 shadow-[0_4px_16px_rgba(18,16,14,0.06)] hover:shadow-[0_12px_28px_rgba(18,16,14,0.14)]"
                }`}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={assetPath(item.image)}
                  alt={item.title[lang]}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active ? "scale-[1.04]" : "group-hover:scale-[1.06]"
                  }`}
                />
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                    active
                      ? "bg-gradient-to-t from-ink/92 via-ink/45 to-ink/15"
                      : "bg-gradient-to-t from-ink/88 via-ink/38 to-transparent group-hover:from-ink/92"
                  }`}
                />

                {/* Top active indicator */}
                <div className="relative z-10 flex justify-end p-2.5 sm:p-3.5">
                  {active ? (
                    <span className="inline-flex items-center gap-1 rounded-none bg-accent px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-ink uppercase shadow-md sm:text-[10px]">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                      <span>{lang === "uk" ? "Обрано" : "Selected"}</span>
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-none border border-pearl/25 bg-ink/35 text-pearl/80 backdrop-blur-md transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-ink sm:h-8 sm:w-8">
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </span>
                  )}
                </div>

                {/* Bottom copy inside photo */}
                <div className="relative z-10 mt-auto p-3 sm:p-4 lg:p-5">
                  <p className="font-display text-sm leading-tight font-bold text-pearl sm:text-base lg:text-lg">
                    {item.title[lang]}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-pearl/75 sm:text-xs">
                    {item.hint[lang]}
                  </p>
                </div>
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
              className="rounded-none border border-line bg-surface p-5 shadow-[0_8px_32px_rgba(23,26,28,0.04)] sm:p-6 lg:p-8"
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
                    className="btn-tactile inline-flex min-h-[44px] items-center gap-2 rounded-none bg-ink px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-surface uppercase hover:bg-accent hover:text-ink lg:min-h-[48px] lg:px-6 lg:py-3 lg:text-xs"
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
                    className="group flex items-center gap-3 rounded-none border border-line/80 bg-surface-soft p-2.5 transition-colors hover:border-accent lg:gap-3.5 lg:p-3.5"
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={step.product.image}
                      alt={step.product.name[lang]}
                      className="h-16 w-14 shrink-0 rounded-none object-cover lg:h-20 lg:w-16"
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

            <div className="relative mt-5 overflow-hidden rounded-none border border-line lg:mt-6 ">
              <img
                loading="lazy"
                decoding="async"
                src={assetPath("/assets/editorial/journal-actives.jpg")}
                alt="Botanical laboratory actives"
                className="aspect-[16/10] w-full object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-none bg-ink/88 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.14em] text-accent uppercase backdrop-blur-md">
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
                                className="inline-flex items-center gap-2 rounded-none border border-line bg-surface-soft py-1 pl-3 pr-1 lg:py-1.5 lg:pl-3.5 lg:pr-1.5"
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
                                  className="btn-tactile flex h-6 w-6 items-center justify-center rounded-none bg-ink text-surface hover:bg-accent hover:text-ink lg:h-7 lg:w-7"
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
          <div className="relative overflow-hidden rounded-none border border-line bg-surface shadow-sm ">
            {/* Panoramic Campaign Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-[21/9] lg:min-h-[480px] xl:min-h-[540px]">
              <img
                loading="lazy"
                decoding="async"
                src={assetPath("/assets/editorial/campaign-giftset.jpg")}
                alt={activeBundle.name[lang]}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Architectural Floating Set Switcher Card (bottom-left on desktop, compact block below on mobile) */}
            <div className="p-4 sm:p-6 lg:absolute lg:bottom-7 lg:left-7 lg:w-[460px] lg:border lg:border-line/60 lg:bg-surface/95 lg:p-7 lg:shadow-2xl lg:backdrop-blur-md">
              <p className="eyebrow text-accent">{t("home.setsEyebrow")}</p>

              {/* 3 Set Switcher Pills */}
              <div className="mt-2.5 flex flex-wrap gap-1.5 lg:mt-3">
                {BUNDLES.map((b, idx) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBundleIdx(idx)}
                    className={`rounded-none px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors lg:text-[11px] ${
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
                  className="btn-tactile inline-flex min-h-[44px] items-center gap-2 rounded-none bg-ink px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-surface uppercase hover:bg-accent hover:text-ink"
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
            <ParallaxMedia className="rounded-none border border-line lg:col-span-6 ">
              <img
                loading="lazy"
                decoding="async"
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
                  className="btn-tactile inline-flex items-center gap-2 rounded-none border border-ink px-4 py-2 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-surface lg:px-5 lg:py-2.5"
                >
                  <Instagram className="h-4 w-4 text-accent" />
                  <span>@sb.cosm · 16.5K</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Mobile: native snap-scroll peeking rail | Desktop: 4-Col Grid */}
              <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-7 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
                {CLIENT_REVIEWS.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex w-[82vw] max-w-[320px] shrink-0 snap-start flex-col rounded-none border border-line bg-paper/55 p-5 lg:w-auto lg:max-w-none"
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
              className="btn-tactile inline-flex min-h-[50px] items-center justify-center gap-2 whitespace-nowrap rounded-none bg-ink px-6 py-3 text-xs font-bold tracking-[0.15em] text-surface uppercase hover:bg-accent hover:text-ink"
            >
              <Send className="h-3.5 w-3.5 shrink-0" />
              <span>{lang === "uk" ? "Написати в Telegram" : "Message on Telegram"}</span>
            </a>
            <Link
              href="/quiz"
              className="btn-tactile inline-flex min-h-[50px] items-center justify-center gap-2 whitespace-nowrap rounded-none border border-ink px-6 py-3 text-xs font-bold tracking-[0.15em] text-ink uppercase hover:bg-ink hover:text-surface"
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
