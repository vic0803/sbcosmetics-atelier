"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { JOURNAL_ARTICLES } from "@/data/journal";

export function JournalListClient() {
  const { lang, t } = useStore();
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const categories = Array.from(
    new Set(JOURNAL_ARTICLES.map((a) => a.category[lang]))
  );

  const visible =
    selectedCat === "all"
      ? JOURNAL_ARTICLES
      : JOURNAL_ARTICLES.filter((a) => a.category[lang] === selectedCat);

  return (
    <div className="pt-24 pb-24 lg:pt-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="border-b border-sand pb-10">
          <p className="eyebrow text-bronze-dark">{t("home.journalEyebrow")}</p>
          <h1 className="mt-2 font-editorial text-5xl font-medium text-obsidian sm:text-6xl">
            {t("home.journalTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-umber sm:text-base">
            {lang === "uk"
              ? "Прості й доказові пояснення про активи, відновлення бар'єру та щоденні ритуали догляду від технолога бренду."
              : "Evidence-based notes on botanical actives, barrier repair, and mindful skincare rituals from our technologist."}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCat("all")}
              className={`min-h-[40px] rounded-full border px-4 py-1.5 text-xs font-medium tracking-[0.12em] uppercase ${
                selectedCat === "all"
                  ? "border-obsidian bg-obsidian text-pearl"
                  : "border-sand-dark bg-alabaster text-espresso"
              }`}
            >
              {t("common.all")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`min-h-[40px] rounded-full border px-4 py-1.5 text-xs font-medium tracking-[0.12em] uppercase ${
                  selectedCat === cat
                    ? "border-obsidian bg-obsidian text-pearl"
                    : "border-sand-dark bg-alabaster text-espresso"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {visible.map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-sand bg-alabaster transition-colors hover:border-bronze"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={article.cover}
                  alt={article.title[lang]}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-center justify-between text-[11px] font-medium tracking-[0.16em] text-bronze-dark uppercase">
                  <span>{article.category[lang]}</span>
                  <span className="text-umber">
                    {article.date[lang]} · {article.readTime[lang]}
                  </span>
                </div>
                <h2 className="mt-3 font-editorial text-3xl leading-snug font-medium text-obsidian group-hover:text-bronze-dark">
                  {article.title[lang]}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-umber">
                  {article.excerpt[lang]}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-xs font-medium tracking-[0.16em] text-obsidian uppercase">
                  <span>{t("common.readMore")}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
