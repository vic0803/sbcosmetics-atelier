import { assetPath } from "@/lib/assets";
import type { Lang } from "@/lib/format";

export type Category = "face" | "body" | "hair";
export type RitualStep = "cleanse" | "tone" | "treat" | "seal" | "body" | "hair";
export type SkinType = "dry" | "combo" | "oily" | "sensitive" | "all";
export type SkinConcern =
  | "hydration"
  | "eyes"
  | "barrier"
  | "calming"
  | "cleansing"
  | "body"
  | "hair";

export interface LocalizedText {
  uk: string;
  en: string;
}

export interface LocalizedList {
  uk: string[];
  en: string[];
}

export interface ActiveDetail {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  note: LocalizedText;
}

export interface ProductVariant {
  label: LocalizedText;
  price: number;
}

export interface Product {
  id: string;
  category: Category;
  ritualStep: RitualStep;
  stepNumber: string;
  badge: "bestseller" | "new" | null;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  line?: LocalizedText;
  name: LocalizedText;
  shortTagline: LocalizedText;
  texture: LocalizedText;
  price: number;
  variants: ProductVariant[];
  skinTypes: SkinType[];
  concerns: SkinConcern[];
  actives: ActiveDetail[];
  inci: string;
  benefits: LocalizedList;
  usage: LocalizedText;
  amPm: "am-pm" | "am" | "pm";
}

const RAW_PRODUCTS: Product[] = [
  {
    id: "serum-gel",
    category: "face",
    ritualStep: "treat",
    stepNumber: "03",
    badge: "bestseller",
    rating: 4.95,
    reviews: 131,
    image: "/assets/products/serum-gel.jpg",
    gallery: [
      "/assets/products/serum-gel.jpg",
      "/assets/editorial/campaign-ritual.jpg",
      "/assets/editorial/journal-actives.jpg",
    ],
    line: { uk: "Дотик шовку", en: "Silk Touch" },
    name: {
      uk: "Гель-сироватка для обличчя, шиї та декольте «Дотик шовку»",
      en: "Silk Touch — Hydrating Gel Serum",
    },
    shortTagline: {
      uk: "Невагоме зволоження та шовковисте сяйво під макіяж",
      en: "Weightless deep hydration & luminous finish under makeup",
    },
    texture: {
      uk: "Прозорий невагомий гель · миттєве вбирання",
      en: "Crystal-clear weightless gel · instant absorption",
    },
    price: 1200,
    variants: [
      { label: { uk: "50 мл", en: "50 ml" }, price: 1200 },
      { label: { uk: "30 мл", en: "30 ml" }, price: 820 },
    ],
    skinTypes: ["dry", "combo", "sensitive", "all"],
    concerns: ["hydration", "barrier"],
    actives: [
      {
        id: "hyaluronic",
        name: { uk: "Гіалуронова кислота", en: "Hyaluronic Acid" },
        role: { uk: "Глибоке зволоження", en: "Deep Hydration" },
        note: {
          uk: "Утримує вологу в епідермісі та розгладжує мікрорельєф без липкості.",
          en: "Binds moisture in the epidermis and smooths texture without stickiness.",
        },
      },
      {
        id: "aloe-co2",
        name: { uk: "Алое вера (CO₂)", en: "Aloe Vera (CO₂)" },
        role: { uk: "Заспокоєння", en: "Calming" },
        note: {
          uk: "Чистий CO₂-екстракт миттєво знімає почервоніння та дискомфорт.",
          en: "Pure CO₂ extract rapidly calms redness and tightness.",
        },
      },
      {
        id: "panthenol",
        name: { uk: "D-пантенол & Бетаїн", en: "D-Panthenol & Betaine" },
        role: { uk: "Відновлення бар'єру", en: "Barrier Repair" },
        note: {
          uk: "Зміцнюють ліпідний бар'єр та підтримують водний баланс клітин.",
          en: "Reinforce the lipid barrier and maintain cellular hydration balance.",
        },
      },
      {
        id: "vitamin-e",
        name: { uk: "Вітамін E", en: "Vitamin E" },
        role: { uk: "Антиоксидант", en: "Antioxidant" },
        note: {
          uk: "Захищає шкіру від оксидативного стресу та передчасного старіння.",
          en: "Shields skin from oxidative stress and environmental fatigue.",
        },
      },
    ],
    inci: "Aqua, Sodium Hyaluronate, Aloe Barbadensis Leaf Extract, Glycerin, Betaine, Panthenol, Tocopherol (Vitamin E), Allantoin",
    benefits: {
      uk: [
        "Інтенсивне багаторівневе зволоження на весь день",
        "Ідеальна легка основа під крем та макіяж без скочування",
        "Підходить для обличчя, зони навколо очей, шиї та декольте",
      ],
      en: [
        "Intense multi-level hydration throughout the day",
        "Featherlight base under cream and makeup with zero pilling",
        "Safe for face, eye contour, neck and décolleté",
      ],
    },
    usage: {
      uk: "Нанесіть 2–3 краплі на злегка вологу шкіру після тоніка вранці та ввечері. Запечатайте кремом.",
      en: "Press 2–3 drops onto damp skin after toning, morning and evening. Follow with moisturizer.",
    },
    amPm: "am-pm",
  },
  {
    id: "eye-cream",
    category: "face",
    ritualStep: "treat",
    stepNumber: "03",
    badge: "bestseller",
    rating: 4.9,
    reviews: 118,
    image: "/assets/products/eye-cream.jpg",
    gallery: [
      "/assets/products/eye-cream.jpg",
      "/assets/editorial/campaign-giftset.jpg",
    ],
    line: { uk: "Делікатний 2в1", en: "2-in-1 Contour" },
    name: {
      uk: "Зволожувальний крем для шкіри навколо очей та обличчя 2в1",
      en: "Hydrating 2-in-1 Eye Contour & Face Cream",
    },
    shortTagline: {
      uk: "Кофеїн і гіалуронова кислота проти набряків і втоми",
      en: "Caffeine & hyaluronic acid for depuffing and rested radiance",
    },
    texture: {
      uk: "Шовковиста невагома емульсія · без ароматів",
      en: "Silky featherlight emulsion · gentle around eyes",
    },
    price: 1200,
    variants: [{ label: { uk: "30 мл", en: "30 ml" }, price: 1200 }],
    skinTypes: ["dry", "combo", "sensitive", "all"],
    concerns: ["eyes", "hydration"],
    actives: [
      {
        id: "caffeine",
        name: { uk: "Кофеїн", en: "Caffeine" },
        role: { uk: "Дренаж і тонус", en: "Depuffing & Tone" },
        note: {
          uk: "Активує мікроциркуляцію, зменшує ранкові набряки та темні кола.",
          en: "Boosts microcirculation to soften morning puffiness and fatigue.",
        },
      },
      {
        id: "hyaluronic",
        name: { uk: "Гіалуронова кислота", en: "Hyaluronic Acid" },
        role: { uk: "Пружність", en: "Plumping" },
        note: {
          uk: "Наповнює тонку шкіру навколо очей вологою та пом'якшує зморшки сухості.",
          en: "Replenishes delicate eye skin to soften dehydration fine lines.",
        },
      },
      {
        id: "shea",
        name: { uk: "Олія ши & Вітамін E", en: "Shea Butter & Vitamin E" },
        role: { uk: "Живлення", en: "Nourishment" },
        note: {
          uk: "Забезпечують м'якість і комфорт без відчуття тяжкості.",
          en: "Deliver lasting softness and comfort without heaviness.",
        },
      },
    ],
    inci: "Aqua, Caprylic/Capric Triglyceride, Glycerin, Butyrospermum Parkii Butter, Caffeine, Tocopherol",
    benefits: {
      uk: [
        "Помітно зменшує набряки та ознаки втоми зранку",
        "Універсальна делікатна формула 2в1 для повік і всього обличчя",
        "Гігієнічний вакуумний дозатор зберігає свіжість активів",
      ],
      en: [
        "Visibly reduces morning puffiness and signs of fatigue",
        "Gentle 2-in-1 formula calibrated for both eye contour and face",
        "Airless pump preserves potency and purity of every drop",
      ],
    },
    usage: {
      uk: "Вранці та ввечері наносьте легкими постукуваннями подушечок пальців по орбітальній кістці та обличчю.",
      en: "Morning and evening, tap lightly along the orbital bone and face with fingertips.",
    },
    amPm: "am-pm",
  },
  {
    id: "day-cream",
    category: "face",
    ritualStep: "seal",
    stepNumber: "04",
    badge: "bestseller",
    rating: 4.88,
    reviews: 89,
    image: "/assets/products/day-cream.jpg",
    gallery: [
      "/assets/products/day-cream.jpg",
      "/assets/editorial/campaign-atelier.jpg",
    ],
    line: { uk: "Базовий догляд", en: "Essential Care" },
    name: {
      uk: "Щоденний зволожувальний крем для обличчя, шиї та декольте",
      en: "Essential Care — Daily Hydrating Face & Neck Cream",
    },
    shortTagline: {
      uk: "Зміцнення шкірного бар'єру та оксамитовий комфорт",
      en: "Daily barrier nourishment with a velvety satin finish",
    },
    texture: {
      uk: "Збитий крем-флюїд · оксамитовий фініш без блиску",
      en: "Whipped satin cream · breathable matte-velvet finish",
    },
    price: 950,
    variants: [{ label: { uk: "50 мл", en: "50 ml" }, price: 950 }],
    skinTypes: ["dry", "combo", "sensitive", "all"],
    concerns: ["barrier", "hydration", "calming"],
    actives: [
      {
        id: "almond-grape",
        name: { uk: "Олії мигдалю та винограду", en: "Almond & Grapeseed Oils" },
        role: { uk: "Ліпідний баланс", en: "Lipid Balance" },
        note: {
          uk: "Холоднопресовані олії живлять і пом'якшують, не забиваючи пори.",
          en: "Cold-pressed botanical oils nourish deeply without clogging pores.",
        },
      },
      {
        id: "wheat-protein",
        name: { uk: "Протеїни пшениці", en: "Wheat Protein" },
        role: { uk: "Еластичність", en: "Elasticity" },
        note: {
          uk: "Підтримують природний бар'єр і надають шкірі пружності.",
          en: "Reinforce skin resilience and velvety smoothness.",
        },
      },
      {
        id: "green-tea",
        name: { uk: "Зелений чай & Лаванда", en: "Green Tea & Lavender" },
        role: { uk: "Антиоксиданти", en: "Antioxidant Shield" },
        note: {
          uk: "Заспокоюють чутливу шкіру та дарують природний тонкий аромат.",
          en: "Calm reactive skin with a subtle natural botanical aroma.",
        },
      },
    ],
    inci: "Aqua, Betaine, Aloe Barbadensis Leaf Extract, Prunus Amygdalus Dulcis Oil, Vitis Vinifera Seed Oil, Camellia Sinensis Leaf Extract, Hydrolyzed Wheat Protein, Panthenol, Lavandula Angustifolia Oil",
    benefits: {
      uk: [
        "Відновлює та захищає ліпідний бар'єр протягом дня",
        "Швидко вбирається без жирної плівки чи блиску",
        "Підходить для обличчя, шиї та ніжної зони декольте",
      ],
      en: [
        "Restores and protects the skin barrier all day",
        "Absorbs cleanly with zero greasy residue",
        "Designed for face, neck and delicate décolleté",
      ],
    },
    usage: {
      uk: "Нанесіть невелику кількість крему після сироватки вранці та ввечері легкими висхідними рухами.",
      en: "Smooth a pearl-sized amount over serum morning and evening using upward strokes.",
    },
    amPm: "am-pm",
  },
  {
    id: "toner-aloe",
    category: "face",
    ritualStep: "tone",
    stepNumber: "02",
    badge: "new",
    rating: 4.85,
    reviews: 27,
    image: "/assets/products/toner-aloe.jpg",
    gallery: [
      "/assets/products/toner-aloe.jpg",
      "/assets/editorial/journal-actives.jpg",
    ],
    line: { uk: "Фреш Алое", en: "Fresh Aloe" },
    name: {
      uk: "Тонік для обличчя «Фреш Алое» з янтарною кислотою",
      en: "Fresh Aloe — Botanical Facial Mist Toner",
    },
    shortTagline: {
      uk: "Делікатне оновлення pH та свіжість гідролату алое",
      en: "pH-restoring aloe hydrosol with 0.2% succinic acid glow",
    },
    texture: {
      uk: "Дрібнодисперсний освіжаючий міст · аромат вербени",
      en: "Ultra-fine botanical mist · crisp lemon verbena note",
    },
    price: 600,
    variants: [{ label: { uk: "200 мл", en: "200 ml" }, price: 600 }],
    skinTypes: ["combo", "oily", "sensitive", "all"],
    concerns: ["hydration", "calming", "cleansing"],
    actives: [
      {
        id: "aloe-hydrosol",
        name: { uk: "Гідролат алое вера", en: "Aloe Vera Hydrosol" },
        role: { uk: "Зволоження", en: "Soothing Hydration" },
        note: {
          uk: "Насичує вологою одразу після контакту з водою та знімає стягнутість.",
          en: "Replenishes moisture immediately after cleansing and eases tightness.",
        },
      },
      {
        id: "succinic",
        name: { uk: "Янтарна кислота 0,2%", en: "Succinic Acid 0.2%" },
        role: { uk: "Делікатне оновлення", en: "Gentle Renewal" },
        note: {
          uk: "М'яко вирівнює тон, освіжає пори та надає здорового сяйва без подразнень.",
          en: "Refines tone and pores softly without irritation or photosensitivity.",
        },
      },
      {
        id: "verbena",
        name: { uk: "Вербена лимонна", en: "Lemon Verbena" },
        role: { uk: "Тонізація", en: "Botanical Toning" },
        note: {
          uk: "Тонізує та освіжає шкіру, готуючи її до кращого проникнення сироватки.",
          en: "Revitalizes skin and preps it for optimal serum absorption.",
        },
      },
    ],
    inci: "Aqua (Aloe Barbadensis Hydrosol), Betaine, Succinic Acid, Vitis Vinifera Seed Oil, Hydrolyzed Wheat Protein, Lippia Citriodora Oil, Panthenol",
    benefits: {
      uk: [
        "Миттєво відновлює фізіологічний pH після вмивання",
        "Янтарна кислота 0,2% м'яко освітлює тон без агресії",
        "Підсилює дію наступної сироватки та крему",
      ],
      en: [
        "Restores balanced pH immediately after cleansing",
        "0.2% succinic acid brightens gently without stinging",
        "Boosts absorption of your serum and moisturizer",
      ],
    },
    usage: {
      uk: "Розпиліть безпосередньо на очищене обличчя або нанесіть долонями. Не змивайте.",
      en: "Mist directly over cleansed skin or press in with palms. Do not rinse.",
    },
    amPm: "am-pm",
  },
  {
    id: "gel-mask",
    category: "face",
    ritualStep: "treat",
    stepNumber: "03",
    badge: "bestseller",
    rating: 4.9,
    reviews: 36,
    image: "/assets/products/gel-mask.jpg",
    gallery: [
      "/assets/products/gel-mask.jpg",
      "/assets/editorial/campaign-giftset.jpg",
    ],
    line: { uk: "Рідкі патчі", en: "Liquid Patches" },
    name: {
      uk: "Гель-маска для обличчя та зони під очима «Рідкі патчі»",
      en: "Liquid Patches — Cooling Eye & Face Gel Mask",
    },
    shortTagline: {
      uk: "Експрес-ліфтинг і свіжість за 10 хвилин вранці",
      en: "10-minute botanical cooling wake-up for eyes & face",
    },
    texture: {
      uk: "Охолоджуючий смарагдовий гель · ефект патчів",
      en: "Cooling emerald botanical gel · instant patch effect",
    },
    price: 500,
    variants: [{ label: { uk: "100 мл", en: "100 ml" }, price: 500 }],
    skinTypes: ["dry", "combo", "oily", "sensitive", "all"],
    concerns: ["eyes", "hydration", "calming"],
    actives: [
      {
        id: "caffeine",
        name: { uk: "Кофеїн", en: "Caffeine" },
        role: { uk: "Проти набряків", en: "Anti-Puffiness" },
        note: {
          uk: "Швидко прибирає сліди недосипання та повертає погляду свіжість.",
          en: "Rapidly diminishes signs of late nights and revitalizes tired eyes.",
        },
      },
      {
        id: "hyaluronic",
        name: { uk: "Гіалуронова кислота", en: "Hyaluronic Acid" },
        role: { uk: "Експрес-зволоження", en: "Flash Hydration" },
        note: {
          uk: "Розгладжує шкіру за 10 хвилин перед важливою подією чи макіяжем.",
          en: "Plumps and smooths skin in 10 minutes before makeup or events.",
        },
      },
      {
        id: "green-tea",
        name: { uk: "Зелений чай & Алантоїн", en: "Green Tea & Allantoin" },
        role: { uk: "Охолодження", en: "Cooling Relief" },
        note: {
          uk: "Дарують приємну прохолоду, заспокоюють і підвищують пружність.",
          en: "Deliver gentle cooling comfort while calming and toning.",
        },
      },
    ],
    inci: "Aqua, Caffeine, Betaine, Sodium Hyaluronate, Allantoin, Panthenol, Aloe Barbadensis Leaf Extract, Camellia Sinensis Leaf Extract, Tocopherol",
    benefits: {
      uk: [
        "Замінює десятки одноразових патчів — вистачає на місяці",
        "Приємно охолоджує та знімає ранкові набряки за 10–15 хв",
        "Не потребує обов'язкового змивання — залишки ніжно вбиваються",
      ],
      en: [
        "Replaces dozens of single-use patches — lasts for months",
        "Cools and depuffs under-eyes in 10–15 minutes",
        "Leave-on friendly — gently tap any remaining veil into skin",
      ],
    },
    usage: {
      uk: "Нанесіть тонким шаром під очі або на все обличчя на 10–15 хвилин. Зберігайте у холодильнику для підсиленого ефекту.",
      en: "Apply a thin veil under eyes or across face for 10–15 minutes. Chill in the fridge for extra depuffing.",
    },
    amPm: "am",
  },
  {
    id: "face-foam",
    category: "face",
    ritualStep: "cleanse",
    stepNumber: "01",
    badge: null,
    rating: 4.82,
    reviews: 73,
    image: "/assets/products/face-foam.jpg",
    gallery: ["/assets/products/face-foam.jpg"],
    line: { uk: "М'яке очищення", en: "Cloud Cleanse" },
    name: {
      uk: "Делікатна пінка для щоденного очищення обличчя",
      en: "Gentle Daily Botanical Cleansing Foam",
    },
    shortTagline: {
      uk: "Хмаринка очищення з ромашкою без сухості та стягнутості",
      en: "Airy chamomile foam that cleanses without stripping",
    },
    texture: {
      uk: "Невагома вершкова мікропіна · pH-нейтральна",
      en: "Airy botanical micro-foam · pH-balanced",
    },
    price: 890,
    variants: [{ label: { uk: "150 мл", en: "150 ml" }, price: 890 }],
    skinTypes: ["dry", "sensitive", "combo", "all"],
    concerns: ["cleansing", "calming", "barrier"],
    actives: [
      {
        id: "chamomile",
        name: { uk: "Екстракт ромашки", en: "Chamomile Extract" },
        role: { uk: "Заспокоєння", en: "Soothing" },
        note: {
          uk: "Знімає реактивність і підтримує комфорт навіть дуже чутливої шкіри.",
          en: "Calms reactive skin and keeps cleansing completely comfortable.",
        },
      },
      {
        id: "coco-glucoside",
        name: { uk: "Рослинні ПАР (Coco-Glucoside)", en: "Plant-Derived Cleansers" },
        role: { uk: "М'яке очищення", en: "Gentle Cleanse" },
        note: {
          uk: "Видаляють забруднення та легкий макіяж, не руйнуючи ліпідний бар'єр.",
          en: "Lift impurities and daily buildup without disturbing natural lipids.",
        },
      },
      {
        id: "panthenol",
        name: { uk: "D-пантенол", en: "D-Panthenol" },
        role: { uk: "М'якість", en: "Conditioning" },
        note: {
          uk: "Залишає шкіру м'якою й зволоженою одразу після вмивання.",
          en: "Leaves skin supple and calm immediately after rinsing.",
        },
      },
    ],
    inci: "Aqua, Coco-Glucoside, Glycerin, Panthenol, Chamomilla Recutita Flower Extract",
    benefits: {
      uk: [
        "Очищує без відчуття скрипу, стягнутості та сухості",
        "Без сульфатів (SLS/SLES), спирту та різких ароматів",
        "Ідеальна для чутливої та зневодненої шкіри щодня",
      ],
      en: [
        "Cleanses thoroughly with zero tightness or dryness",
        "Free from harsh sulfates (SLS/SLES) and drying alcohols",
        "Ideal daily cleanser for sensitive and dehydrated skin",
      ],
    },
    usage: {
      uk: "Видавіть 1–2 натискання пінки на вологе обличчя, м'яко помасажуйте 30 секунд і змийте теплою водою.",
      en: "Massage 1–2 pumps onto damp skin for 30 seconds and rinse with lukewarm water.",
    },
    amPm: "am-pm",
  },
  {
    id: "wash-gel",
    category: "face",
    ritualStep: "cleanse",
    stepNumber: "01",
    badge: null,
    rating: 4.75,
    reviews: 51,
    image: "/assets/products/wash-gel.jpg",
    gallery: ["/assets/products/wash-gel.jpg"],
    line: { uk: "Баланс", en: "Daily Balance" },
    name: {
      uk: "Крем-гель для вмивання обличчя для підлітків та дорослих",
      en: "Cream-Gel Facial Wash for Teens & Adults",
    },
    shortTagline: {
      uk: "Кремова текстура для м'якого очищення комбінованої й проблемної шкіри",
      en: "Creamy sulfate-free wash for balanced, clear daily skin",
    },
    texture: {
      uk: "Ніжний зволожувальний крем-гель",
      en: "Cushioning hydrating cream-gel",
    },
    price: 500,
    variants: [{ label: { uk: "200 мл", en: "200 ml" }, price: 500 }],
    skinTypes: ["combo", "oily", "all"],
    concerns: ["cleansing", "calming"],
    actives: [
      {
        id: "aloe-juice",
        name: { uk: "Сік алое вера", en: "Aloe Vera Juice" },
        role: { uk: "Баланс", en: "Clarity & Calm" },
        note: {
          uk: "Заспокоює схильну до висипань шкіру та запобігає пересушуванню.",
          en: "Calms blemish-prone skin without triggering rebound oiliness.",
        },
      },
      {
        id: "panthenol",
        name: { uk: "D-пантенол & Гліцерин", en: "D-Panthenol & Glycerin" },
        role: { uk: "Комфорт", en: "Hydration" },
        note: {
          uk: "Пом'якшують шкіру та підтримують здоровий мікробіом.",
          en: "Keep skin soft and balanced through daily cleansing.",
        },
      },
    ],
    inci: "Aqua, Coco-Glucoside, Glycerin, Aloe Barbadensis Leaf Juice, Panthenol",
    benefits: {
      uk: [
        "Безпечна формула для підліткової та дорослої шкіри",
        "Дбайливо прибирає надлишок себуму без пересушування",
        "Економний об'єм 200 мл зі зручним дозатором",
      ],
      en: [
        "Thoughtful formula tailored for both teen and adult skin",
        "Removes excess sebum gently without stripping",
        "Generous 200 ml bottle with easy pump dispenser",
      ],
    },
    usage: {
      uk: "Нанесіть на вологу шкіру обличчя вранці та ввечері, ніжно помасажуйте і змийте водою.",
      en: "Massage onto damp face morning and evening, then rinse thoroughly.",
    },
    amPm: "am-pm",
  },
  {
    id: "body-cream",
    category: "body",
    ritualStep: "body",
    stepNumber: "05",
    badge: "new",
    rating: 4.92,
    reviews: 31,
    image: "/assets/products/body-cream.jpg",
    gallery: ["/assets/products/body-cream.jpg"],
    line: { uk: "Відновлення", en: "Body Repair" },
    name: {
      uk: "Універсальний крем для тіла: відновлення, заспокоєння та зволоження",
      en: "Universal Botanical Body Repair Cream",
    },
    shortTagline: {
      uk: "Сквалан, алое та олія ши для шовкової шкіри після душу",
      en: "Olive squalane, aloe & shea for deeply restored supple skin",
    },
    texture: {
      uk: "Насичений невагомий лосьйон · швидке вбирання",
      en: "Rich-yet-fluid lotion · zero sticky film",
    },
    price: 400,
    variants: [{ label: { uk: "200 мл", en: "200 ml" }, price: 400 }],
    skinTypes: ["dry", "sensitive", "all"],
    concerns: ["body", "barrier", "hydration"],
    actives: [
      {
        id: "shea-almond",
        name: { uk: "Олія ши та мигдалю", en: "Shea & Sweet Almond Oils" },
        role: { uk: "Живлення", en: "Deep Nourishment" },
        note: {
          uk: "Миттєво усувають лущення та сухість на ліктях, гомілках і руках.",
          en: "Instantly relieve dryness and rough patches across body and hands.",
        },
      },
      {
        id: "panthenol",
        name: { uk: "D-пантенол & Алое", en: "D-Panthenol & Aloe" },
        role: { uk: "Після процедур", en: "Post-Care Calm" },
        note: {
          uk: "Заспокоюють шкіру після засмаги, депіляції та жорсткої води.",
          en: "Calm skin after sun exposure, hair removal, or dry winter air.",
        },
      },
    ],
    inci: "Aqua, Butyrospermum Parkii Butter, Prunus Amygdalus Dulcis Oil, Glycerin, Panthenol, Aloe Barbadensis Leaf Extract, Tocopherol",
    benefits: {
      uk: [
        "Відновлює суху та чутливу шкіру тіла з першого нанесення",
        "Вбирається за хвилину — можна одразу одягатися",
        "Ніжна формула підходить для всієї родини",
      ],
      en: [
        "Restores dry, sensitive body skin from the very first application",
        "Absorbs cleanly in under a minute — dress right away",
        "Gentle botanical formula suited for the whole family",
      ],
    },
    usage: {
      uk: "Наносьте на чисту злегка вологу шкіру тіла після душу плавними масажними рухами.",
      en: "Massage smoothly onto clean, slightly damp skin after showering.",
    },
    amPm: "pm",
  },
  {
    id: "intimate-foam",
    category: "body",
    ritualStep: "body",
    stepNumber: "05",
    badge: null,
    rating: 4.85,
    reviews: 42,
    image: "/assets/products/intimate-foam.jpg",
    gallery: ["/assets/products/intimate-foam.jpg"],
    line: { uk: "Щоденна", en: "Pure Daily" },
    name: {
      uk: "Делікатна пінка для зовнішньої інтимної гігієни «Щоденна»",
      en: "Pure Daily — Gentle Intimate Hygiene Foam",
    },
    shortTagline: {
      uk: "Молочна кислота та сік алое для природного балансу pH",
      en: "Lactic acid & aloe juice respecting natural physiological pH",
    },
    texture: {
      uk: "Ультрам'яка невагома пінка без віддушок",
      en: "Ultra-soft fragrance-free botanical foam",
    },
    price: 600,
    variants: [{ label: { uk: "150 мл", en: "150 ml" }, price: 600 }],
    skinTypes: ["sensitive", "all"],
    concerns: ["body", "calming"],
    actives: [
      {
        id: "lactic",
        name: { uk: "Молочна кислота", en: "Lactic Acid" },
        role: { uk: "Природний pH", en: "Physiological pH" },
        note: {
          uk: "Підтримує здоровий кислотно-лужний баланс і комфорт щодня.",
          en: "Supports healthy natural pH and daily comfort.",
        },
      },
      {
        id: "aloe-panthenol",
        name: { uk: "Алое вера & D-пантенол", en: "Aloe Vera & D-Panthenol" },
        role: { uk: "Делікатність", en: "Soothing Care" },
        note: {
          uk: "Запобігають подразненню та сухості найделікатнішої шкіри.",
          en: "Prevent dryness and irritation on the most delicate skin.",
        },
      },
    ],
    inci: "Aqua, Coco-Glucoside, Lactic Acid, Glycerin, Aloe Barbadensis Leaf Juice, Panthenol",
    benefits: {
      uk: [
        "Фізіологічний pH із натуральною молочною кислотою",
        "Без мила, сульфатів та синтетичних ароматизаторів",
        "Рекомендована для щоденного делікатного догляду",
      ],
      en: [
        "Physiological pH balanced with natural lactic acid",
        "Zero soap, sulfates, or synthetic fragrances",
        "Crafted for gentle everyday comfort",
      ],
    },
    usage: {
      uk: "Нанесіть невелику кількість пінки, делікатно очистіть і змийте теплою водою.",
      en: "Apply a small pump, cleanse gently and rinse with lukewarm water.",
    },
    amPm: "am-pm",
  },
  {
    id: "shampoo",
    category: "hair",
    ritualStep: "hair",
    stepNumber: "06",
    badge: null,
    rating: 4.8,
    reviews: 58,
    image: "/assets/products/shampoo.jpg",
    gallery: ["/assets/products/shampoo.jpg"],
    line: { uk: "Ботанічне волосся", en: "Botanical Hair" },
    name: {
      uk: "Шампунь для об'єму, зміцнення та стимулювання росту волосся",
      en: "Botanical Volume & Growth Strengthening Shampoo",
    },
    shortTagline: {
      uk: "Біотин і розмарин для сили коренів та живого блиску",
      en: "Biotin & rosemary extract for resilient roots and natural volume",
    },
    texture: {
      uk: "Концентрована безсульфатна формула ручної роботи",
      en: "Concentrated sulfate-free artisanal formula",
    },
    price: 800,
    variants: [{ label: { uk: "250 мл", en: "250 ml" }, price: 800 }],
    skinTypes: ["all"],
    concerns: ["hair"],
    actives: [
      {
        id: "biotin",
        name: { uk: "Біотин (Вітамін B7)", en: "Biotin (Vitamin B7)" },
        role: { uk: "Зміцнення", en: "Root Strength" },
        note: {
          uk: "Зміцнює волосяний стрижень і допомагає зменшити ламкість.",
          en: "Fortifies hair strands and reduces breakage.",
        },
      },
      {
        id: "rosemary",
        name: { uk: "Екстракт розмарину", en: "Rosemary Extract" },
        role: { uk: "Стимуляція росту", en: "Scalp Vitality" },
        note: {
          uk: "Тонізує шкіру голови та пробуджує природний об'єм біля коренів.",
          en: "Invigorates the scalp and boosts natural root lift.",
        },
      },
    ],
    inci: "Aqua, Coco-Glucoside, Glycerin, Biotin, Panthenol, Rosmarinus Officinalis Leaf Extract",
    benefits: {
      uk: [
        "Природний прикореневий об'єм без обтяження",
        "Без агресивних сульфатів і силіконів",
        "М'яко очищує шкіру голови, подовжуючи свіжість",
      ],
      en: [
        "Natural root lift without weighing hair down",
        "Zero harsh sulfates or heavy silicones",
        "Balances the scalp for longer-lasting freshness",
      ],
    },
    usage: {
      uk: "Нанесіть на добре зволожене волосся, спіньте, помасажуйте шкіру голови 1–2 хвилини та змийте.",
      en: "Lather onto thoroughly wet hair, massage the scalp for 1–2 minutes and rinse clean.",
    },
    amPm: "am-pm",
  },
  {
    id: "scrub-soap",
    category: "body",
    ritualStep: "body",
    stepNumber: "05",
    badge: null,
    rating: 4.78,
    reviews: 64,
    image: "/assets/products/scrub-soap.jpg",
    gallery: ["/assets/products/scrub-soap.jpg"],
    line: { uk: "Крафтове мило", en: "Artisan Soap" },
    name: {
      uk: "Мило-скраб ручної роботи з пряною гвоздикою",
      en: "Handcrafted Spiced Clove Exfoliating Soap",
    },
    shortTagline: {
      uk: "Натуральне делікатне оновлення шкіри та теплий пряний аромат",
      en: "Small-batch botanical exfoliation with warm clove spice",
    },
    texture: {
      uk: "Крафтовий брусок у матовій чорній коробці з тисненням",
      en: "Artisanal bar in matte black botanical-foil gift box",
    },
    price: 270,
    variants: [{ label: { uk: "100 г", en: "100 g" }, price: 270 }],
    skinTypes: ["all"],
    concerns: ["body", "cleansing"],
    actives: [
      {
        id: "clove",
        name: { uk: "Мелена гвоздика", en: "Ground Clove" },
        role: { uk: "Природний ексфоліант", en: "Natural Exfoliant" },
        note: {
          uk: "М'яко полірує шкіру та стимулює мікроциркуляцію без мікропластику.",
          en: "Polishes skin smoothly and boosts circulation without microplastics.",
        },
      },
      {
        id: "plant-oils",
        name: { uk: "Омилені рослинні олії", en: "Saponified Plant Oils" },
        role: { uk: "М'яка піна", en: "Creamy Lather" },
        note: {
          uk: "Очищують шкіру, зберігаючи її м'якою й доглянутою.",
          en: "Cleanse effectively while leaving skin comfortable and velvety.",
        },
      },
    ],
    inci: "Sodium Palmate, Sodium Cocoate, Aqua, Glycerin, Eugenia Caryophyllus (Clove) Powder, Parfum",
    benefits: {
      uk: [
        "Зварене вручну малими партіями за авторським рецептом",
        "100% біорозкладний скраб без синтетичних часток",
        "Готове подарункове пакування у фірмовій чорно-золотій коробці",
      ],
      en: [
        "Small-batch handcrafted soap made from scratch",
        "100% biodegradable natural exfoliation",
        "Arrives gift-ready in signature matte black & gold box",
      ],
    },
    usage: {
      uk: "Спіньте у вологих руках або прямо по вологій шкірі тіла 2–3 рази на тиждень, змийте теплою водою.",
      en: "Lather onto wet skin 2–3 times weekly in circular motions, then rinse warm.",
    },
    amPm: "pm",
  },
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  image: assetPath(p.image),
  gallery: p.gallery.map(assetPath),
}));

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getBestsellers(limit = 4): Product[] {
  const best = PRODUCTS.filter((p) => p.badge === "bestseller");
  return best.slice(0, limit);
}

export function getRitualPairings(product: Product): Product[] {
  const stepOrder: Record<RitualStep, RitualStep[]> = {
    cleanse: ["tone", "treat", "seal"],
    tone: ["cleanse", "treat", "seal"],
    treat: ["tone", "seal", "cleanse"],
    seal: ["tone", "treat", "cleanse"],
    body: ["body", "hair"],
    hair: ["body", "face" as RitualStep],
  };
  const desired = stepOrder[product.ritualStep] ?? ["treat", "seal"];
  const picked: Product[] = [];
  for (const step of desired) {
    const match = PRODUCTS.find(
      (p) => p.id !== product.id && p.ritualStep === step && !picked.includes(p)
    );
    if (match) picked.push(match);
  }
  return picked.slice(0, 3);
}

export function getCategoryLabel(category: Category, lang: Lang): string {
  const map: Record<Category, LocalizedText> = {
    face: { uk: "Обличчя", en: "Face" },
    body: { uk: "Тіло", en: "Body" },
    hair: { uk: "Волосся", en: "Hair" },
  };
  return map[category][lang];
}

export function getStepLabel(step: RitualStep, lang: Lang): string {
  const map: Record<RitualStep, LocalizedText> = {
    cleanse: { uk: "Крок 01 · Очищення", en: "Step 01 · Cleanse" },
    tone: { uk: "Крок 02 · Тонізація", en: "Step 02 · Tone" },
    treat: { uk: "Крок 03 · Актив", en: "Step 03 · Treat" },
    seal: { uk: "Крок 04 · Крем", en: "Step 04 · Seal" },
    body: { uk: "Ритуал тіла", en: "Body Ritual" },
    hair: { uk: "Догляд за волоссям", en: "Hair Ritual" },
  };
  return map[step][lang];
}
