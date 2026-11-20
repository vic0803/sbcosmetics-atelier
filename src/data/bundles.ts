import { assetPath } from "@/lib/assets";
import type { LocalizedText } from "./products";

export interface RitualBundle {
  id: string;
  badge: LocalizedText;
  name: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  image: string;
  productIds: string[];
  originalPrice: number;
  bundlePrice: number;
}

const RAW_BUNDLES: RitualBundle[] = [
  {
    id: "bundle-eye-awakening",
    badge: { uk: "Хіт Instagram · Набір №1", en: "Instagram Hit · Set No. 1" },
    name: {
      uk: "Ритуал «Свіжий погляд» 2в1",
      en: "Awakened Eyes Ritual Duo",
    },
    subtitle: {
      uk: "Крем 2в1 для очей і обличчя + Гель-маска «Рідкі патчі»",
      en: "2-in-1 Eye & Face Cream + Liquid Patches Gel Mask",
    },
    description: {
      uk: "Ідеальний дует на кофеїні та гіалуроновій кислоті проти ранкових набряків, слідів втоми й сухості. У подарунковому пакуванні Atelier.",
      en: "Our signature caffeine & hyaluronic duo targeting morning puffiness, fatigue, and dehydration. Arrives in Atelier gift packaging.",
    },
    image: "/assets/editorial/campaign-giftset.jpg",
    productIds: ["eye-cream", "gel-mask"],
    originalPrice: 1700,
    bundlePrice: 1490,
  },
  {
    id: "bundle-silk-hydration",
    badge: { uk: "Повний бар'єр · −12%", en: "Complete Barrier · −12%" },
    name: {
      uk: "Тріо «Дотик шовку & Базовий догляд»",
      en: "Silk Hydration Barrier Trio",
    },
    subtitle: {
      uk: "Тонік «Фреш Алое» + Сироватка «Дотик шовку» + Щоденний крем",
      en: "Fresh Aloe Toner + Silk Touch Serum + Essential Daily Cream",
    },
    description: {
      uk: "Три узгоджені кроки технолога: відновлення pH, багаторівневе зволоження CO₂-алое та закріплення бар'єру холодними рослинними оліями.",
      en: "Three technologist-calibrated steps: pH prep, multi-level CO₂ aloe hydration, and cold-pressed botanical lipid sealing.",
    },
    image: "/assets/products/serum-gel.jpg",
    productIds: ["toner-aloe", "serum-gel", "day-cream"],
    originalPrice: 2750,
    bundlePrice: 2420,
  },
  {
    id: "bundle-home-spa",
    badge: { uk: "Подарунок · Тіло", en: "Gift Ready · Body" },
    name: {
      uk: "Домашнє SPA «Теплий вечір»",
      en: "Warm Evening Home SPA Duo",
    },
    subtitle: {
      uk: "Мило-скраб з гвоздикою + Універсальний крем для тіла",
      en: "Spiced Clove Scrub Soap + Universal Body Repair Cream",
    },
    description: {
      uk: "Делікатне оновлення шкіри крафтовим милом-скрабом та глибоке заспокоєння олією ши і D-пантенолом.",
      en: "Natural small-batch exfoliation paired with deep shea butter & D-panthenol recovery.",
    },
    image: "/assets/products/body-cream.jpg",
    productIds: ["scrub-soap", "body-cream"],
    originalPrice: 670,
    bundlePrice: 590,
  },
];

export const BUNDLES: RitualBundle[] = RAW_BUNDLES.map((b) => ({
  ...b,
  image: assetPath(b.image),
}));
