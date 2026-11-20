"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { PRODUCTS, type LocalizedText } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { LUXURY_EASE } from "./MotionPrimitives";

interface ActiveStory {
  key: string;
  label: LocalizedText;
  origin: LocalizedText;
  summary: LocalizedText;
  productIds: string[];
}

const ACTIVES_LIBRARY: ActiveStory[] = [
  {
    key: "hyaluronic",
    label: { uk: "Гіалуронова кислота", en: "Hyaluronic Acid" },
    origin: { uk: "Біоферментація · глибоке зволоження", en: "Bio-fermented · Deep Moisture" },
    summary: {
      uk: "Притягує та утримує вологу всередині епідермісу, миттєво розгладжуючи мікрорельєф і лінії зневоднення без липкої плівки.",
      en: "Draws and holds water inside the epidermis, visibly plumping dehydration lines with zero sticky residue.",
    },
    productIds: ["serum-gel", "eye-cream", "gel-mask"],
  },
  {
    key: "aloe",
    label: { uk: "Алое вера (CO₂)", en: "Aloe Vera (CO₂)" },
    origin: { uk: "Надкритична екстракція без нагріву", en: "Cold Supercritical Extraction" },
    summary: {
      uk: "Зберігає максимум біоактивних полісахаридів, знімає почервоніння та повертає комфорт навіть реактивній шкірі.",
      en: "Preserves peak bioactive polysaccharides to quiet redness and restore calm to reactive skin.",
    },
    productIds: ["toner-aloe", "serum-gel", "day-cream", "body-cream"],
  },
  {
    key: "caffeine",
    label: { uk: "Кофеїн", en: "Botanical Caffeine" },
    origin: { uk: "Мікроциркуляція · дренаж", en: "Microcirculation · Depuffing" },
    summary: {
      uk: "Активує ранковий лімфодренаж, зменшує набряки під очима та повертає погляду свіжість за 10 хвилин.",
      en: "Energizes morning microcirculation to ease under-eye puffiness and restore a rested look in 10 minutes.",
    },
    productIds: ["eye-cream", "gel-mask"],
  },
  {
    key: "succinic",
    label: { uk: "Янтарна кислота 0,2%", en: "Succinic Acid 0.2%" },
    origin: { uk: "Делікатне оновлення pH", en: "Gentle Daily Renewal" },
    summary: {
      uk: "Освіжає тон, м'яко працює з порами та підтримує клітинне дихання без лущення й подразнень.",
      en: "Refines pores and brightens uneven tone calmly every day without peeling or redness.",
    },
    productIds: ["toner-aloe"],
  },
  {
    key: "panthenol",
    label: { uk: "D-пантенол & Олії", en: "D-Panthenol & Oils" },
    origin: { uk: "Відновлення ліпідного бар'єру", en: "Lipid Barrier Architecture" },
    summary: {
      uk: "Провітамін B5 разом із холоднопресованими оліями мигдалю, винограду та ши загоюють та захищають шкіру від холоду й сухого повітря.",
      en: "Provitamin B5 paired with cold-pressed almond, grapeseed, and shea oils rebuild and cushion dry skin.",
    },
    productIds: ["day-cream", "face-foam", "body-cream"],
  },
  {
    key: "biotin",
    label: { uk: "Біотин & Розмарин", en: "Biotin & Rosemary" },
    origin: { uk: "Сила коренів і природний об'єм", en: "Root Vitality & Lift" },
    summary: {
      uk: "Тонізують шкіру голови, зміцнюють волосяні фолікули та дарують чистий об'єм без сульфатів і силіконів.",
      en: "Invigorate the scalp, fortify hair follicles, and lift natural volume free from harsh sulfates.",
    },
    productIds: ["shampoo"],
  },
];

export function ActivesExplorer() {
  const { lang, t, addProductToCart } = useStore();
  const [selectedKey, setSelectedKey] = useState(ACTIVES_LIBRARY[0].key);

  const active =
    ACTIVES_LIBRARY.find((a) => a.key === selectedKey) ?? ACTIVES_LIBRARY[0];
  const matchedProducts = PRODUCTS.filter((p) =>
    active.productIds.includes(p.id)
  );

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
      {/* Left: Spring Sliding Active Pills + Explanation */}
      <div className="lg:col-span-5">
        <p className="eyebrow text-accent-deep">{t("home.activesEyebrow")}</p>
        <h2 className="mt-1.5 font-display text-3xl leading-[1.05] font-bold uppercase text-ink sm:text-5xl">
          {t("home.activesTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {t("home.activesSub")}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {ACTIVES_LIBRARY.map((item) => {
            const isSelected = item.key === active.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedKey(item.key)}
                className={`relative min-h-[42px] rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-colors ${
                  isSelected
                    ? "border-ink text-surface"
                    : "border-line-strong bg-surface text-ink hover:border-accent-deep"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="active-ingredient-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-ink"
                  />
                )}
                <span className="relative z-10">{item.label[lang]}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: LUXURY_EASE }}
            className="mt-6 rounded-2xl border border-line bg-surface p-6 shadow-sm"
          >
            <p className="eyebrow text-accent-deep">{active.origin[lang]}</p>
            <h3 className="mt-1.5 font-display text-2xl font-bold text-ink">
              {active.label[lang]}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
              {active.summary[lang]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right: Matching Formulas (Animated swap) */}
      <div className="lg:col-span-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: LUXURY_EASE }}
            className="grid grid-cols-2 gap-3.5 sm:gap-5"
          >
            {matchedProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:border-accent hover:shadow-lg"
              >
                <Link
                  href={`/product/${product.id}`}
                  className="relative aspect-[4/3] overflow-hidden bg-surface-soft"
                >
                  <img
                    src={product.image}
                    alt={product.name[lang]}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-sm font-bold text-ink hover:text-accent-deep sm:text-base"
                    >
                      {product.line ? product.line[lang] : product.name[lang]}
                    </Link>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted sm:text-xs">
                    {product.shortTagline[lang]}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-sm font-bold text-ink">
                      {formatPrice(product.price, lang)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addProductToCart(product.id, 1, 0)}
                      className="btn-tactile inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-surface hover:bg-accent hover:text-ink sm:h-auto sm:w-auto sm:gap-1 sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:font-bold sm:tracking-[0.12em] sm:uppercase"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
                      <span className="hidden sm:inline">{t("common.quickAdd")}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
