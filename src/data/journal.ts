import { assetPath } from "@/lib/assets";
import type { LocalizedText } from "./products";

export interface JournalSection {
  heading: LocalizedText;
  body: LocalizedText;
}

export interface JournalArticle {
  slug: string;
  category: LocalizedText;
  readTime: LocalizedText;
  date: LocalizedText;
  title: LocalizedText;
  excerpt: LocalizedText;
  cover: string;
  featuredProductIds: string[];
  sections: JournalSection[];
}

const RAW_ARTICLES: JournalArticle[] = [
  {
    slug: "barrier-science-cold-season",
    category: { uk: "Наука шкіри", en: "Skin Science" },
    readTime: { uk: "4 хв читання", en: "4 min read" },
    date: { uk: "Листопад 2026", en: "November 2026" },
    title: {
      uk: "Чому шкіра втрачає вологу взимку — і як відновити бар'єр за 3 кроки",
      en: "Why Skin Loses Moisture in Cold Air — And How to Rebuild Your Barrier in 3 Steps",
    },
    excerpt: {
      uk: "Розбираємо механізм трансепідермальної втрати вологи, роль D-пантенолу та чому холоднопресовані олії працюють краще за важкі силікони.",
      en: "A technologist's guide to transepidermal water loss, D-panthenol, and why cold-pressed plant lipids outperform heavy occlusives.",
    },
    cover: "/assets/editorial/campaign-atelier.jpg",
    featuredProductIds: ["serum-gel", "day-cream"],
    sections: [
      {
        heading: {
          uk: "1. Очищення без «скрипу»",
          en: "1. Cleanse Without That Squeaky Feeling",
        },
        body: {
          uk: "Перша причина сухості — надто агресивні сульфатні гелі. Вони змивають захисну гідроліпідну мантію за 20 секунд, а на її відновлення шкірі потрібні години. Обирайте м'які рослинні ПАР на основі коко-глюкозиду з ромашкою.",
          en: "The number one driver of winter tightness is harsh sulfate cleansing. Stripping your hydrolipidic film takes 20 seconds, yet repairing it takes hours. Switch to gentle plant-derived coco-glucoside paired with soothing chamomile.",
        },
      },
      {
        heading: {
          uk: "2. Правило вологої шкіри для гіалуронової кислоти",
          en: "2. The Damp-Skin Rule for Hyaluronic Acid",
        },
        body: {
          uk: "Гіалуронова кислота працює як розумна губка: нанесіть гель-сироватку «Дотик шовку» на злегка вологе після тоніка обличчя, щоб зафіксувати воду у верхніх шарах епідермісу.",
          en: "Hyaluronic acid acts like an intelligent sponge: press Silk Touch Gel Serum onto freshly misted skin right after toning so it binds water right where your skin needs it.",
        },
      },
      {
        heading: {
          uk: "3. Закріпіть бар'єр рослинними ліпідами",
          en: "3. Seal With Breathable Plant Lipids",
        },
        body: {
          uk: "Олії мигдалю та виноградних кісточок у щоденному кремі «Базовий догляд» створюють дихаючий захист від холодного вітру й сухого повітря опалення.",
          en: "Cold-pressed almond and grapeseed oils in Essential Care Daily Cream form a breathable shield against biting wind and dry indoor heating.",
        },
      },
    ],
  },
  {
    slug: "co2-extracts-vs-synthetic",
    category: { uk: "Інгредієнти", en: "Ingredients" },
    readTime: { uk: "3 хв читання", en: "3 min read" },
    date: { uk: "Жовтень 2026", en: "October 2026" },
    title: {
      uk: "Що таке CO₂-екстракти та чому технолог обирає їх для малих партій",
      en: "What Are CO₂ Botanical Extracts — And Why Small-Batch Formulas Rely on Them",
    },
    excerpt: {
      uk: "Як надкритична екстракція зберігає 100% біоактивних молекул алое та зеленого чаю без нагрівання і розчинників.",
      en: "How supercritical extraction preserves 100% of active plant molecules from aloe and green tea without heat or chemical solvents.",
    },
    cover: "/assets/editorial/journal-actives.jpg",
    featuredProductIds: ["toner-aloe", "serum-gel"],
    sections: [
      {
        heading: {
          uk: "Чистота без високих температур",
          en: "Purity Without Thermal Degradation",
        },
        body: {
          uk: "Класичне виварювання руйнує вітаміни та антиоксиданти. Надкритичний CO₂ дозволяє отримати концентрат рослини при низькій температурі, а вуглекислий газ повністю випаровується після процесу — у формулі залишається лише чиста есенція.",
          en: "Traditional heat distillation degrades delicate vitamins and antioxidants. Supercritical CO₂ extracts the plant's active heart at gentle temperatures and evaporates completely, leaving nothing but pure botanical potency.",
        },
      },
      {
        heading: {
          uk: "Чому важливі малі партії",
          en: "Why Small Batches Matter",
        },
        body: {
          uk: "Натуральні активи найефективніші свіжими. У нашій лабораторії у Львові ми виготовляємо косметику невеликими партіями, щоб кожен флакон потрапляв до вас на піку активності формули.",
          en: "Natural actives perform best when fresh. At our Lviv atelier, every vessel is compounded in small batches so your formula reaches you at peak efficacy.",
        },
      },
    ],
  },
  {
    slug: "morning-depuffing-ritual",
    category: { uk: "Ритуали", en: "Rituals" },
    readTime: { uk: "3 хв читання", en: "3 min read" },
    date: { uk: "Вересень 2026", en: "September 2026" },
    title: {
      uk: "Ранкові 10 хвилин: як прибрати набряки під очима без одноразових патчів",
      en: "The 10-Minute Morning Ritual: Depuffing Eyes Without Single-Use Patches",
    },
    excerpt: {
      uk: "Поєднання охолодженої гель-маски «Рідкі патчі» з кофеїном та легкого лімфодренажу подушечками пальців.",
      en: "Pairing chilled caffeine Liquid Patches with featherlight lymphatic tapping for an instant wide-awake look.",
    },
    cover: "/assets/editorial/campaign-ritual.jpg",
    featuredProductIds: ["gel-mask", "eye-cream"],
    sections: [
      {
        heading: {
          uk: "Холод + кофеїн = миттєвий дренаж",
          en: "Chill + Caffeine = Immediate Drainage",
        },
        body: {
          uk: "Зберігайте баночку «Рідких патчів» на дверцятах холодильника. Прохолодний смарагдовий гель із кофеїном і зеленим чаєм звужує судини та за 10 хвилин повертає свіжість навіть після короткого сну.",
          en: "Keep your Liquid Patches jar chilled in the fridge door. Cool emerald gel infused with caffeine and green tea calms puffiness in 10 minutes—even after a short night.",
        },
      },
      {
        heading: {
          uk: "Закріплення кремом 2в1",
          en: "Locking In With 2-in-1 Eye Cream",
        },
        body: {
          uk: "Після маски нанесіть півкраплі крему для очей 2в1 легкими рухами від зовнішнього куточка до внутрішнього — шкіра стане гладенькою й готовою до консилера.",
          en: "Follow with a rice-grain drop of 2-in-1 Eye Cream tapped gently along the orbital bone—creating a smooth, hydrated canvas for concealer.",
        },
      },
    ],
  },
  {
    slug: "succinic-acid-gentle-glow",
    category: { uk: "Інгредієнти", en: "Ingredients" },
    readTime: { uk: "3 хв читання", en: "3 min read" },
    date: { uk: "Серпень 2026", en: "August 2026" },
    title: {
      uk: "Янтарна кислота 0,2%: делікатне оновлення навіть для чутливої шкіри",
      en: "0.2% Succinic Acid: Gentle Daily Renewal Even for Sensitive Skin",
    },
    excerpt: {
      uk: "Чому янтарна кислота в тоніку «Фреш Алое» дарує свіжий тон без лущення й підвищеної чутливості до сонця.",
      en: "Why low-dose succinic acid in Fresh Aloe Toner delivers clarity and radiance without peeling or redness.",
    },
    cover: "/assets/editorial/campaign-giftset.jpg",
    featuredProductIds: ["toner-aloe", "face-foam"],
    sections: [
      {
        heading: {
          uk: "Розумна альтернатива жорстким кислотам",
          en: "A Thoughtful Alternative to Harsh Acids",
        },
        body: {
          uk: "На відміну від високих концентрацій AHA, 0,2% янтарної кислоти у поєднанні з гідролатом алое вера працює м'яко: підтримує клітинне дихання, зменшує тьмяність та заспокоює схильну до почервонінь шкіру щодня.",
          en: "Unlike high-percentage AHA peels, 0.2% succinic acid suspended in aloe hydrosol works calmly every day—supporting cellular renewal, brightening dullness, and respecting sensitive skin.",
        },
      },
    ],
  },
];

export const JOURNAL_ARTICLES: JournalArticle[] = RAW_ARTICLES.map((a) => ({
  ...a,
  cover: assetPath(a.cover),
}));

export function getArticleBySlug(slug: string): JournalArticle | undefined {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug);
}
