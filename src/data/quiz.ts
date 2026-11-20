import { getProductById, type LocalizedText, type Product } from "./products";

export type QuizSkinType = "dry" | "combo" | "oily" | "sensitive";
export type QuizGoal = "hydration" | "eyes" | "barrier" | "clarity";
export type QuizIntensity = "minimal" | "complete";
export type QuizExtra = "none" | "body" | "hair";

export interface QuizAnswers {
  skinType: QuizSkinType;
  goal: QuizGoal;
  intensity: QuizIntensity;
  extra: QuizExtra;
}

export interface QuizOption<T extends string> {
  value: T;
  label: LocalizedText;
  hint: LocalizedText;
}

export const QUIZ_STEPS = {
  skinType: {
    eyebrow: { uk: "Крок 01 з 04", en: "Step 01 of 04" },
    question: {
      uk: "Як почувається ваша шкіра протягом дня?",
      en: "How does your skin feel through the day?",
    },
    options: [
      {
        value: "dry",
        label: { uk: "Суха та зневоднена", en: "Dry & Dehydrated" },
        hint: {
          uk: "Відчуття стягнутості після вмивання, хочеться живлення",
          en: "Feels tight after cleansing, craves lasting nourishment",
        },
      },
      {
        value: "combo",
        label: { uk: "Комбінована", en: "Combination" },
        hint: {
          uk: "Легкий блиск у Т-зоні, комфортні або сухі щоки",
          en: "Subtle shine in the T-zone, balanced or dry cheeks",
        },
      },
      {
        value: "oily",
        label: { uk: "Схильна до жирності", en: "Oily & Blemish-Prone" },
        hint: {
          uk: "Помітний блиск, розширені пори, потрібні легкі текстури",
          en: "Visible shine, congested pores, prefers weightless gels",
        },
      },
      {
        value: "sensitive",
        label: { uk: "Чутлива та реактивна", en: "Sensitive & Reactive" },
        hint: {
          uk: "Швидко червоніє на вітер, холод або нові засоби",
          en: "Flushes easily from weather, stress, or harsh formulas",
        },
      },
    ] as QuizOption<QuizSkinType>[],
  },
  goal: {
    eyebrow: { uk: "Крок 02 з 04", en: "Step 02 of 04" },
    question: {
      uk: "Який результат зараз у пріоритеті?",
      en: "What is your main skincare priority right now?",
    },
    options: [
      {
        value: "hydration",
        label: { uk: "Глибоке зволоження і сяйво", en: "Deep Hydration & Glow" },
        hint: {
          uk: "Наповнити вологою, прибрати тьмяність та сухі лінії",
          en: "Plump with moisture and restore luminous radiance",
        },
      },
      {
        value: "eyes",
        label: { uk: "Свіжий погляд без набряків", en: "Rested Eyes & Depuffing" },
        hint: {
          uk: "Прибрати ранкову втому та підтягнути зону під очима",
          en: "Target morning puffiness and delicate under-eye fatigue",
        },
      },
      {
        value: "barrier",
        label: { uk: "Відновлення бар'єру", en: "Barrier Repair & Calm" },
        hint: {
          uk: "Заспокоїти, зняти почервоніння та захистити шкіру",
          en: "Rebuild lipid protection and soothe discomfort",
        },
      },
      {
        value: "clarity",
        label: { uk: "М'яке очищення і рівний тон", en: "Gentle Clarity & Even Tone" },
        hint: {
          uk: "Чисті пори без пересушування та делікатне оновлення",
          en: "Clear pores without stripping plus subtle acid renewal",
        },
      },
    ] as QuizOption<QuizGoal>[],
  },
  intensity: {
    eyebrow: { uk: "Крок 03 з 04", en: "Step 03 of 04" },
    question: {
      uk: "Який ритм догляду вам комфортний?",
      en: "Which daily ritual pace feels effortless for you?",
    },
    options: [
      {
        value: "minimal",
        label: { uk: "Лаконічний · 3 кроки", en: "Essential · 3 Steps" },
        hint: {
          uk: "Очищення + головний актив + крем. 2 хвилини зранку і ввечері.",
          en: "Cleanse + hero active + seal. Two effortless minutes AM & PM.",
        },
      },
      {
        value: "complete",
        label: { uk: "Повний ритуал · 4–5 кроків", en: "Complete Atelier · 4–5 Steps" },
        hint: {
          uk: "З тонізацією та експрес-маскою для максимального ефекту.",
          en: "Adds botanical toning and express cooling mask for peak results.",
        },
      },
    ] as QuizOption<QuizIntensity>[],
  },
  extra: {
    eyebrow: { uk: "Крок 04 з 04", en: "Step 04 of 04" },
    question: {
      uk: "Додати до ритуалу догляд за тілом чи волоссям?",
      en: "Would you like to include body or hair care?",
    },
    options: [
      {
        value: "none",
        label: { uk: "Тільки догляд за обличчям", en: "Face Ritual Only" },
        hint: {
          uk: "Фокус на шкірі обличчя, очей, шиї та декольте",
          en: "Focused purely on face, eyes, neck and décolleté",
        },
      },
      {
        value: "body",
        label: { uk: "Додати відновлення тіла", en: "Add Body Recovery" },
        hint: {
          uk: "Універсальний крем для тіла після душу",
          en: "Universal Botanical Body Cream for post-shower hydration",
        },
      },
      {
        value: "hair",
        label: { uk: "Додати зміцнення волосся", en: "Add Hair Vitality" },
        hint: {
          uk: "Безсульфатний шампунь з біотином та розмарином",
          en: "Sulfate-free biotin & rosemary volume shampoo",
        },
      },
    ] as QuizOption<QuizExtra>[],
  },
};

export interface RitualRecommendationStep {
  slot: LocalizedText;
  product: Product;
  reason: LocalizedText;
}

export interface RitualRecommendation {
  title: LocalizedText;
  summary: LocalizedText;
  steps: RitualRecommendationStep[];
  totalPrice: number;
  bundlePrice: number;
}

export function buildRitualRecommendation(
  answers: QuizAnswers
): RitualRecommendation {
  const steps: RitualRecommendationStep[] = [];

  // Step 1: Cleanser
  const cleanserId =
    answers.skinType === "oily" || answers.goal === "clarity"
      ? "wash-gel"
      : "face-foam";
  const cleanser = getProductById(cleanserId);
  if (cleanser) {
    steps.push({
      slot: { uk: "Крок 01 · Ранок і вечір", en: "Step 01 · AM & PM" },
      product: cleanser,
      reason:
        cleanserId === "wash-gel"
          ? {
              uk: "М'яко прибирає надлишок себуму без сульфатів, не провокуючи зневоднення.",
              en: "Lifts excess sebum without sulfates or rebound tightness.",
            }
          : {
              uk: "Делікатна пінка з ромашкою та D-пантенолом дбайливо зберігає ліпідний бар'єр.",
              en: "Chamomile & D-panthenol micro-foam cleanses while safeguarding your barrier.",
            },
    });
  }

  // Step 2: Toner (included in complete or clarity)
  if (answers.intensity === "complete" || answers.goal === "clarity") {
    const toner = getProductById("toner-aloe");
    if (toner) {
      steps.push({
        slot: { uk: "Крок 02 · Тонізація", en: "Step 02 · Tone" },
        product: toner,
        reason: {
          uk: "Гідролат алое та 0,2% янтарної кислоти вирівнюють pH і підсилюють дію сироватки.",
          en: "Aloe hydrosol and 0.2% succinic acid rebalance pH and amplify serum absorption.",
        },
      });
    }
  }

  // Step 3: Hero Active
  const heroId = answers.goal === "eyes" ? "eye-cream" : "serum-gel";
  const hero = getProductById(heroId);
  if (hero) {
    steps.push({
      slot: { uk: "Крок 03 · Головний актив", en: "Step 03 · Hero Active" },
      product: hero,
      reason:
        heroId === "eye-cream"
          ? {
              uk: "Кофеїн і гіалуронова кислота прибирають ранкову набряклість і освіжають погляд 2в1.",
              en: "Caffeine and hyaluronic acid visibly depuff and revitalize tired eyes.",
            }
          : {
              uk: "Гіалуронова кислота й CO₂-екстракт алое глибоко зволожують без липкої плівки.",
              en: "Hyaluronic acid and CO₂ aloe deeply hydrate with a weightless silk finish.",
            },
    });
  }

  // Optional Eye Mask for complete or eyes goal
  if (answers.goal === "eyes" || answers.intensity === "complete") {
    const mask = getProductById("gel-mask");
    if (mask) {
      steps.push({
        slot: { uk: "Експрес-ритуал · 10 хв", en: "Express Ritual · 10 min" },
        product: mask,
        reason: {
          uk: "Охолоджуючі «Рідкі патчі» з кофеїном дають миттєвий ліфтинг-ефект перед виходом.",
          en: "Cooling caffeine Liquid Patches deliver an instant refreshed glow before makeup.",
        },
      });
    }
  }

  // Step 4: Seal cream (if hero wasn't eye-cream for minimal oily, add day-cream for barrier/dry/combo/complete)
  if (
    answers.goal === "barrier" ||
    answers.skinType === "dry" ||
    answers.skinType === "sensitive" ||
    answers.intensity === "complete" ||
    steps.length < 3
  ) {
    const cream = getProductById("day-cream");
    if (cream) {
      steps.push({
        slot: { uk: "Крок 04 · Захист бар'єру", en: "Step 04 · Barrier Seal" },
        product: cream,
        reason: {
          uk: "Холоднопресовані олії мигдалю та протеїни пшениці закріплюють вологу на весь день.",
          en: "Cold-pressed almond oil and wheat proteins lock in hydration all day.",
        },
      });
    }
  }

  // Extra
  if (answers.extra === "body") {
    const body = getProductById("body-cream");
    if (body) {
      steps.push({
        slot: { uk: "Доповнення · Тіло", en: "Ritual Addition · Body" },
        product: body,
        reason: {
          uk: "Відновлює м'якість і комфорт шкіри тіла після душу без липкості.",
          en: "Restores velvety body hydration after showering with zero stickiness.",
        },
      });
    }
  } else if (answers.extra === "hair") {
    const hair = getProductById("shampoo");
    if (hair) {
      steps.push({
        slot: { uk: "Доповнення · Волосся", en: "Ritual Addition · Hair" },
        product: hair,
        reason: {
          uk: "Біотин і розмарин зміцнюють корені та дарують природний об'єм без сульфатів.",
          en: "Biotin and rosemary strengthen roots and boost natural sulfate-free volume.",
        },
      });
    }
  }

  const totalPrice = steps.reduce((sum, s) => sum + s.product.price, 0);
  const bundlePrice = Math.round((totalPrice * 0.9) / 10) * 10;

  const titleMap: Record<QuizGoal, LocalizedText> = {
    hydration: {
      uk: "Ваш ритуал «Шовкове зволоження»",
      en: "Your Silk Hydration Protocol",
    },
    eyes: {
      uk: "Ваш ритуал «Пробуджений погляд»",
      en: "Your Awakened Eyes Protocol",
    },
    barrier: {
      uk: "Ваш ритуал «Відновлення бар'єру»",
      en: "Your Barrier Recovery Protocol",
    },
    clarity: {
      uk: "Ваш ритуал «Чистий баланс»",
      en: "Your Pure Balance Protocol",
    },
  };

  const summaryMap: Record<QuizSkinType, LocalizedText> = {
    dry: {
      uk: "Формули підібрані для усунення стягнутості та багаторівневого утримання вологи без важких силіконів.",
      en: "Formulas calibrated to relieve tightness and lock in multi-level hydration without heavy silicones.",
    },
    combo: {
      uk: "Невагомі гелеві й емульсійні текстури зволожують сухі ділянки та зберігають свіжість Т-зони.",
      en: "Breathable gel and satin emulsions hydrate dry zones while keeping the T-zone refined.",
    },
    oily: {
      uk: "Безсульфатне очищення, янтарна кислота 0,2% і легкий гель-сироватка працюють без забивання пор.",
      en: "Sulfate-free cleansing, 0.2% succinic acid, and weightless gel hydration keep pores clear.",
    },
    sensitive: {
      uk: "Заспокійливий CO₂-екстракт алое, ромашка та D-пантенол делікатно знімають реактивність.",
      en: "Calming CO₂ aloe, chamomile, and D-panthenol gently quiet reactivity and rebuild resilience.",
    },
  };

  return {
    title: titleMap[answers.goal],
    summary: summaryMap[answers.skinType],
    steps,
    totalPrice,
    bundlePrice,
  };
}
