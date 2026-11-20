"use client";

import { ArrowRight, Award, FlaskConical, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { assetPath } from "@/lib/assets";

export function AtelierClient() {
  const { lang, t } = useStore();

  const pillars = [
    {
      icon: FlaskConical,
      num: "01",
      title: { uk: "Авторські формули технолога", en: "Technologist-Authored Formulas" },
      desc: {
        uk: "Кожен крем, сироватка й тонік розроблені сертифікованим технологом Софією Білинською — без контрактних шаблонів і компромісів у концентраціях активів.",
        en: "Every cream, serum, and toner is formulated in-house by certified technologist Sophie Bilynska—zero white-label bases or diluted actives.",
      },
    },
    {
      icon: Leaf,
      num: "02",
      title: { uk: "100% еко-складники & CO₂-екстракти", en: "100% Eco & CO₂ Extracts" },
      desc: {
        uk: "Використовуємо надкритичні CO₂-екстракти, біоферментовану гіалуронову кислоту, холоднопресовані рослинні олії та делікатні рослинні ПАР.",
        en: "Supercritical CO₂ botanical extracts, bio-fermented hyaluronic acid, cold-pressed plant oils, and mild plant-derived cleansers.",
      },
    },
    {
      icon: Award,
      num: "03",
      title: { uk: "Офіційна сертифікація", en: "Certified Quality Standards" },
      desc: {
        uk: "Косметика проходить лабораторні перевірки безпеки й стабільності. Повний прозорий склад INCI вказаний на кожному флаконі та на сайті.",
        en: "Every product is certified and stability-tested with complete, transparent INCI labeling both on the vessel and online.",
      },
    },
    {
      icon: ShieldCheck,
      num: "04",
      title: { uk: "Свіжість малих партій", en: "Small-Batch Freshness" },
      desc: {
        uk: "Виготовляємо невеликими партіями у Львові, щоб ви отримували живі, максимально ефективні формули, а не товар після річного зберігання.",
        en: "Compounded in small Lviv batches so every bottle arrives fresh and potent rather than sitting in a warehouse.",
      },
    },
  ];

  return (
    <div className="pt-24 pb-24 lg:pt-32">
      {/* Intro Hero */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="eyebrow text-bronze-dark">{t("home.atelierEyebrow")}</p>
          <h1 className="mt-3 font-editorial text-5xl leading-[1.05] font-medium text-obsidian sm:text-6xl lg:text-7xl">
            {lang === "uk"
              ? "Ательє чесної ботанічної космецевтики у Львові"
              : "An Atelier of Honest Botanical Skincare in Lviv"}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-umber sm:text-lg">
            {t("home.atelierBody")}
          </p>
        </div>

        {/* Wide Lab Image */}
        <div className="mt-12 overflow-hidden rounded-[32px] border border-sand">
          <img
            src={assetPath("/assets/editorial/campaign-atelier.jpg")}
            alt="Sophie Bilynska Lviv atelier"
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        {/* 4 Pillars */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {pillars.map((p) => (
            <div
              key={p.num}
              className="rounded-3xl border border-sand bg-alabaster p-7 sm:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="eyebrow text-bronze-dark">{p.num}</span>
                <p.icon className="h-5 w-5 text-bronze-dark" strokeWidth={1.5} />
              </div>
              <h2 className="mt-4 font-editorial text-3xl font-medium text-obsidian">
                {p.title[lang]}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-umber">
                {p.desc[lang]}
              </p>
            </div>
          ))}
        </div>

        {/* Editorial Quote + CTA Band */}
        <div className="mt-16 grid items-center gap-8 rounded-[32px] bg-obsidian p-8 text-pearl sm:p-12 lg:grid-cols-12 lg:p-16">
          <div className="lg:col-span-8">
            <p className="eyebrow text-bronze-light">
              {lang === "uk" ? "Слово засновниці" : "Founder's Note"}
            </p>
            <blockquote className="mt-4 font-editorial text-3xl leading-snug italic text-pearl sm:text-4xl">
              {lang === "uk"
                ? "«Справжній догляд не маскує шкіру — він повертає їй спокій, природний бар'єр і власне сяйво.»"
                : "“True skincare never masks the skin — it restores calm, strengthens the barrier, and reveals your natural radiance.”"}
            </blockquote>
            <p className="mt-4 text-xs font-medium tracking-[0.18em] text-bronze-light uppercase">
              — Sophie Bilynska · {lang === "uk" ? "Сертифікований технолог" : "Certified Technologist"}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
            <Link
              href="/quiz"
              className="btn-tactile inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-bronze px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-obsidian uppercase hover:bg-bronze-light lg:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t("home.quizCta")}</span>
            </Link>
            <Link
              href="/catalog"
              className="btn-tactile inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-pearl/25 px-6 py-3.5 text-xs font-medium tracking-[0.16em] text-pearl uppercase hover:border-pearl lg:w-auto"
            >
              <span>{t("hero.ctaPrimary")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
