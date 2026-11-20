"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import type { JournalArticle } from "@/data/journal";
import { getProductById } from "@/data/products";
import { formatPrice } from "@/lib/format";

export function JournalArticleClient({ article }: { article: JournalArticle }) {
  const { lang, t, addProductToCart } = useStore();
  const featuredProducts = article.featuredProductIds
    .map(getProductById)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <article className="pt-24 pb-24 lg:pt-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-umber uppercase hover:text-obsidian"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t("home.journalAll")}</span>
        </Link>

        <div className="mt-6 flex items-center gap-3 text-xs font-medium tracking-[0.16em] text-bronze-dark uppercase">
          <span>{article.category[lang]}</span>
          <span>·</span>
          <span className="text-umber">{article.date[lang]}</span>
          <span>·</span>
          <span className="text-umber">{article.readTime[lang]}</span>
        </div>

        <h1 className="mt-3 font-editorial text-4xl leading-[1.08] font-medium text-obsidian sm:text-5xl lg:text-6xl">
          {article.title[lang]}
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-umber">
          {article.excerpt[lang]}
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-sand">
          <img
            src={article.cover}
            alt={article.title[lang]}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        <div className="mt-10 space-y-8">
          {article.sections.map((sec) => (
            <section key={sec.heading.uk}>
              <h2 className="font-editorial text-3xl font-medium text-obsidian">
                {sec.heading[lang]}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-espresso/90">
                {sec.body[lang]}
              </p>
            </section>
          ))}
        </div>

        {/* Inline Shoppable Products Mentioned in Article */}
        {featuredProducts.length > 0 && (
          <div className="mt-14 rounded-3xl border border-sand bg-alabaster p-6 sm:p-8">
            <p className="eyebrow text-bronze-dark">
              {lang === "uk" ? "Формули зі статті" : "Formulas Mentioned"}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {featuredProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 rounded-2xl border border-sand bg-travertine/55 p-3.5"
                >
                  <Link
                    href={`/product/${p.id}`}
                    className="h-24 w-20 shrink-0 overflow-hidden rounded-xl"
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
                      className="block font-editorial text-xl leading-tight font-medium text-obsidian hover:text-bronze-dark"
                    >
                      {p.line ? p.line[lang] : p.name[lang]}
                    </Link>
                    <p className="mt-1 text-sm font-medium text-obsidian">
                      {formatPrice(p.price, lang)}
                    </p>
                    <button
                      type="button"
                      onClick={() => addProductToCart(p.id, 1, 0)}
                      className="btn-tactile mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-obsidian px-4 py-1.5 text-[11px] font-medium tracking-[0.12em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      <span>{t("common.addToCart")}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
