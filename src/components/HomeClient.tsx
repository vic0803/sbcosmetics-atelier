"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  Instagram,
  Leaf,
  Package,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ActivesExplorer } from "@/components/ActivesExplorer";
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
import { getBestsellers } from "@/data/products";
import { CLIENT_REVIEWS } from "@/data/reviews";
import { assetPath } from "@/lib/assets";
import { formatPrice } from "@/lib/format";

const BESTSELLERS = getBestsellers(4);

export function HomeClient() {
  const { lang, t, addBundleToCart, openOverlay } = useStore();

  const trustItems = [
    t("hero.trust1"),
    t("hero.trust2"),
    t("hero.trust3"),
    t("hero.trust4"),
    "INCI Transparent",
    "@sb.cosm · 16.5K",
  ];

  return (
    <div className="overflow-x-clip">
      {/* ==================== 1. HERO: MOBILE FULL-BLEED VIDEO / DESKTOP AIRY CREAM SPLIT ==================== */}
      <section className="relative min-h-[100svh] overflow-hidden bg-paper lg:grid lg:h-[100svh] lg:min-h-[680px] lg:max-h-[960px] lg:grid-cols-12">
        {/* Background Video on Mobile (100svh full-bleed) -> Right Full-Height Column on Desktop */}
        <div className="absolute inset-0 z-0 lg:relative lg:order-2 lg:col-span-6 lg:h-full">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={assetPath("/assets/hero/ice-bloom-poster.jpg")}
          >
            <source src={assetPath("/assets/hero/ice-bloom.mp4")} type="video/mp4" />
          </video>

          {/* Mobile legibility gradient scrim (bottom + subtle top) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/35 lg:hidden" />

          {/* Desktop subtle left blend seam into warm cream #efe9df */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-paper to-transparent lg:block" />

          {/* Desktop Floating Featured Product Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: LUXURY_EASE }}
            className="absolute inset-x-8 bottom-8 hidden lg:block"
          >
            <Link
              href="/product/serum-gel"
              className="btn-tactile group flex items-center justify-between gap-4 rounded-2xl border border-surface/30 bg-ink/75 px-5 py-4 text-surface shadow-2xl backdrop-blur-xl hover:border-accent"
            >
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
                  {lang === "uk" ? "У кадрі · Бестселер" : "Featured · Bestseller"}
                </p>
                <p className="mt-0.5 text-lg font-bold tracking-tight text-surface">
                  {lang === "uk"
                    ? "Гель-сироватка «Дотик шовку»"
                    : "Silk Touch Gel Serum"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-surface">
                  {formatPrice(1200, lang)}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-ink transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Copy Column: Bottom overlay on Mobile / Airy Left Editorial Column on Desktop */}
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-24 pt-24 text-surface sm:px-8 lg:order-1 lg:col-span-6 lg:min-h-0 lg:justify-center lg:px-12 lg:pb-12 lg:pt-24 lg:text-ink xl:px-16">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: LUXURY_EASE }}
              className="eyebrow inline-flex items-center gap-2.5 text-accent lg:text-accent-deep"
            >
              <span className="h-[2px] w-7 bg-accent" />
              <span>{t("hero.eyebrow")}</span>
            </motion.p>

            <h1 className="mt-4 font-display text-[2.65rem] leading-[0.98] font-bold tracking-[-0.025em] uppercase sm:text-6xl lg:text-[4.1rem] xl:text-[4.8rem]">
              <LineReveal delay={0.08}>{t("hero.titleLine1")}</LineReveal>
              <LineReveal
                delay={0.18}
                className="text-accent lg:text-accent-deep"
              >
                {t("hero.titleLine2")}
              </LineReveal>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28, ease: LUXURY_EASE }}
              className="mt-4 max-w-md text-sm leading-relaxed text-surface/85 sm:text-base lg:mt-6 lg:max-w-lg lg:text-lg lg:text-muted"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Punchy High-Contrast CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.36, ease: LUXURY_EASE }}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-9"
            >
              <Link
                href="/catalog"
                className="btn-tactile inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-xs font-bold tracking-[0.16em] text-ink uppercase shadow-lg hover:bg-ink hover:text-surface lg:bg-ink lg:text-surface lg:hover:bg-accent lg:hover:text-ink"
              >
                <span>{t("hero.ctaPrimary")}</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </Link>

              <Link
                href="/quiz"
                className="btn-tactile inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-surface/35 bg-ink/40 px-6 py-3.5 text-xs font-bold tracking-[0.14em] text-surface uppercase backdrop-blur-md hover:border-accent hover:text-accent lg:border-ink/25 lg:bg-surface/80 lg:text-ink lg:hover:border-accent-deep lg:hover:text-accent-deep"
              >
                <Sparkles className="h-4 w-4 text-accent lg:text-accent-deep" strokeWidth={2} />
                <span>{t("hero.ctaSecondary")}</span>
              </Link>
            </motion.div>

            {/* Desktop Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-10 hidden grid-cols-3 gap-4 border-t border-line-strong/80 pt-6 lg:grid"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                <Award className="h-4 w-4 shrink-0 text-accent-deep" strokeWidth={1.8} />
                <span>{t("hero.trust1")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                <Leaf className="h-4 w-4 shrink-0 text-accent-deep" strokeWidth={1.8} />
                <span>{t("hero.trust2")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                <Package className="h-4 w-4 shrink-0 text-accent-deep" strokeWidth={1.8} />
                <span>{t("hero.trust3")}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 2. CRISP MARQUEE TICKER ==================== */}
      <div className="overflow-hidden border-y border-line bg-ink py-3.5 text-surface">
        <div className="animate-marquee flex items-center gap-10">
          {[...trustItems, ...trustItems, ...trustItems].map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center gap-10 whitespace-nowrap text-[11px] font-semibold tracking-[0.2em] uppercase"
            >
              <span>{item}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
          ))}
        </div>
      </div>

      {/* ==================== 3. BESTSELLERS (2-COL MOBILE / 4-COL DESKTOP) ==================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-accent-deep">{t("home.bestsellersEyebrow")}</p>
              <h2 className="mt-1.5 font-display text-3xl font-bold uppercase text-ink sm:text-5xl">
                {t("home.bestsellersTitle")}
              </h2>
            </div>
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-ink uppercase hover:text-accent-deep"
            >
              <span>{t("home.viewAll")}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-x-3.5 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:mt-10 lg:grid-cols-4">
          {BESTSELLERS.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>

      {/* ==================== 4. INTERACTIVE SKIN QUIZ BANNER ==================== */}
      <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <Reveal>
          <div className="grid overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_8px_36px_rgba(23,26,28,0.05)] lg:grid-cols-12">
            <ParallaxMedia className="aspect-[4/3] lg:col-span-5 lg:aspect-auto">
              <img
                src={assetPath("/assets/editorial/campaign-ritual.jpg")}
                alt="Botanical skincare ritual"
                className="h-full w-full object-cover"
              />
            </ParallaxMedia>

            <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-14">
              <p className="eyebrow inline-flex items-center gap-2 text-accent-deep">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span>{t("home.quizEyebrow")}</span>
              </p>
              <h2 className="mt-2.5 font-display text-2xl leading-[1.06] font-bold uppercase text-ink sm:text-4xl lg:text-[2.75rem]">
                {t("home.quizTitle")}
              </h2>
              <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                {t("home.quizDesc")}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {(lang === "uk"
                  ? ["Суха шкіра", "Комбінована", "Чутлива", "Набряки під очима", "Бар'єр"]
                  : ["Dry Skin", "Combination", "Sensitive", "Eye Puffiness", "Barrier"]
                ).map((tag) => (
                  <Link
                    key={tag}
                    href="/quiz"
                    className="rounded-full border border-line bg-accent-soft/70 px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-accent-deep hover:bg-accent hover:text-ink"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <div className="mt-7">
                <Link
                  href="/quiz"
                  className="btn-tactile inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-ink px-8 py-3.5 text-xs font-bold tracking-[0.16em] text-surface uppercase hover:bg-accent hover:text-ink sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span>{t("home.quizCta")}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ==================== 5. ACTIVES LIBRARY EXPLORER ==================== */}
      <section className="border-t border-line bg-paper py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <ActivesExplorer />
        </div>
      </section>

      {/* ==================== 6. CURATED GIFT SETS (HIGH-CONTRAST INK + GLACIAL BLUE) ==================== */}
      <section className="bg-ink py-16 text-surface lg:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow text-accent">{t("home.setsEyebrow")}</p>
                <h2 className="mt-1.5 font-display text-3xl font-bold uppercase text-surface sm:text-5xl">
                  {t("home.setsTitle")}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-surface/70">
                  {t("home.setsSub")}
                </p>
              </div>
              <Link
                href="/catalog?category=sets"
                className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-accent uppercase hover:text-surface"
              >
                <span>{t("common.sets")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-9 grid gap-5 lg:grid-cols-12">
            {/* Hero Gift Set */}
            <Reveal className="lg:col-span-7">
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-surface/12 bg-obsidian-soft">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={BUNDLES[0].image}
                    alt={BUNDLES[0].name[lang]}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-accent px-3.5 py-1.5 text-[10px] font-bold tracking-[0.14em] text-ink uppercase">
                    {BUNDLES[0].badge[lang]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="font-display text-2xl font-bold text-surface sm:text-3xl">
                    {BUNDLES[0].name[lang]}
                  </h3>
                  <p className="mt-1 text-xs font-semibold tracking-wide text-accent">
                    {BUNDLES[0].subtitle[lang]}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-surface/72">
                    {BUNDLES[0].description[lang]}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-display text-3xl font-bold text-surface">
                        {formatPrice(BUNDLES[0].bundlePrice, lang)}
                      </span>
                      <span className="text-sm text-surface/45 line-through">
                        {formatPrice(BUNDLES[0].originalPrice, lang)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addBundleToCart(BUNDLES[0].id);
                        openOverlay("cart");
                      }}
                      className="btn-tactile inline-flex min-h-[48px] items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-bold tracking-[0.16em] text-ink uppercase hover:bg-surface"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>{t("common.addToCart")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 2 Secondary Gift Sets */}
            <div className="flex flex-col gap-5 lg:col-span-5">
              {BUNDLES.slice(1).map((bundle, idx) => (
                <Reveal key={bundle.id} delay={0.08 * (idx + 1)} className="flex-1">
                  <div className="flex h-full flex-col justify-between rounded-3xl border border-surface/12 bg-obsidian-soft p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
                    <img
                      src={bundle.image}
                      alt={bundle.name[lang]}
                      className="h-44 w-full rounded-2xl object-cover sm:h-36 sm:w-32 sm:shrink-0"
                    />
                    <div className="mt-4 flex flex-1 flex-col sm:mt-0">
                      <span className="text-[10px] font-bold tracking-[0.14em] text-accent uppercase">
                        {bundle.badge[lang]}
                      </span>
                      <h3 className="mt-1 font-display text-xl leading-snug font-bold text-surface">
                        {bundle.name[lang]}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-surface/65">
                        {bundle.subtitle[lang]}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-surface">
                            {formatPrice(bundle.bundlePrice, lang)}
                          </span>
                          <span className="text-xs text-surface/45 line-through">
                            {formatPrice(bundle.originalPrice, lang)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => addBundleToCart(bundle.id)}
                          className="btn-tactile rounded-full border border-accent px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-accent uppercase hover:bg-accent hover:text-ink"
                        >
                          + {t("common.quickAdd")}
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. ATELIER STORY ==================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
          <ParallaxMedia className="rounded-[26px] border border-line lg:col-span-6">
            <img
              src={assetPath("/assets/editorial/campaign-atelier.jpg")}
              alt="Sophie Bilynska Lviv botanical laboratory"
              className="aspect-[16/10] w-full object-cover lg:aspect-[5/4]"
            />
          </ParallaxMedia>

          <Reveal className="lg:col-span-6">
            <p className="eyebrow text-accent-deep">{t("home.atelierEyebrow")}</p>
            <h2 className="mt-2 font-display text-3xl leading-[1.05] font-bold uppercase text-ink sm:text-5xl">
              {t("home.atelierTitle")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              {t("home.atelierBody")}
            </p>

            <div className="mt-7 grid grid-cols-3 gap-4 border-y border-line-strong py-5">
              <div>
                <p className="font-display text-2xl font-bold text-ink sm:text-4xl">
                  {t("home.atelierStat1Value")}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted">
                  {t("home.atelierStat1Label")}
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-accent-deep sm:text-4xl">
                  {t("home.atelierStat2Value")}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted">
                  {t("home.atelierStat2Label")}
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-ink sm:text-4xl">
                  {t("home.atelierStat3Value")}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted">
                  {t("home.atelierStat3Label")}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <Link
                href="/atelier"
                className="btn-tactile inline-flex min-h-[50px] items-center gap-2.5 rounded-full border-2 border-ink px-7 py-3 text-xs font-bold tracking-[0.15em] text-ink uppercase hover:bg-ink hover:text-surface"
              >
                <span>{t("home.atelierCta")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== 8. JOURNAL PREVIEW ==================== */}
      <section className="border-t border-line bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-accent-deep">{t("home.journalEyebrow")}</p>
                <h2 className="mt-1.5 font-display text-3xl font-bold uppercase text-ink sm:text-5xl">
                  {t("home.journalTitle")}
                </h2>
              </div>
              <Link
                href="/journal"
                className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-ink uppercase hover:text-accent-deep"
              >
                <span>{t("home.journalAll")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {JOURNAL_ARTICLES.slice(0, 3).map((article, idx) => (
              <Reveal key={article.slug} delay={idx * 0.08}>
                <Link
                  href={`/journal/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper/65 transition-all hover:border-accent hover:shadow-lg"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={article.cover}
                      alt={article.title[lang]}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.12em] text-accent-deep uppercase">
                      <span>{article.category[lang]}</span>
                      <span className="text-muted">{article.readTime[lang]}</span>
                    </div>
                    <h3 className="mt-2 font-display text-xl leading-snug font-bold text-ink group-hover:text-accent-deep">
                      {article.title[lang]}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                      {article.excerpt[lang]}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold tracking-[0.14em] text-ink uppercase">
                      <span>{t("common.readMore")}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-accent-deep" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 9. CLIENT REVIEWS & @SB.COSM ==================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-accent-deep">{t("home.reviewsEyebrow")}</p>
              <h2 className="mt-1.5 font-display text-3xl font-bold uppercase text-ink sm:text-5xl">
                {t("home.reviewsTitle")}
              </h2>
            </div>
            <a
              href="https://www.instagram.com/sb.cosm/"
              target="_blank"
              rel="noreferrer"
              className="btn-tactile inline-flex items-center gap-2 rounded-full border border-ink bg-surface px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-ink uppercase hover:bg-ink hover:text-surface"
            >
              <Instagram className="h-4 w-4 text-accent-deep" />
              <span>@sb.cosm</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CLIENT_REVIEWS.map((rev, idx) => (
            <Reveal key={rev.id} delay={idx * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <div className="flex items-center gap-0.5 text-accent-deep">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-3.5 flex-1 text-sm leading-relaxed text-ink-soft">
                  «{rev.text[lang]}»
                </p>
                <div className="mt-4 border-t border-line pt-3.5">
                  <div className="flex items-center justify-between text-xs font-bold text-ink">
                    <span>{rev.author[lang]}</span>
                    <span className="inline-flex items-center gap-1 text-accent-deep">
                      <Check className="h-3 w-3" />
                      {rev.city[lang]}
                    </span>
                  </div>
                  <Link
                    href={`/product/${rev.productId}`}
                    className="mt-1 block truncate text-[11px] font-semibold text-muted hover:text-accent-deep"
                  >
                    {rev.productName[lang]} →
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
