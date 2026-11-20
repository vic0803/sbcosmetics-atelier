import type { LocalizedText } from "./products";

export interface ClientReview {
  id: string;
  author: LocalizedText;
  city: LocalizedText;
  productId: string;
  productName: LocalizedText;
  rating: number;
  text: LocalizedText;
}

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: "rev-1",
    author: { uk: "Анастасія К.", en: "Anastasiia K." },
    city: { uk: "Львів", en: "Lviv" },
    productId: "serum-gel",
    productName: { uk: "Гель-сироватка «Дотик шовку»", en: "Silk Touch Gel Serum" },
    rating: 5,
    text: {
      uk: "Це вже мій третій флакон! Вбирається за секунди, шкіра реально наче шовк, тональний лягає ідеально без жодного скочування.",
      en: "My third bottle already! Absorbs in seconds, leaves skin genuinely silky, and foundation glides on with zero pilling.",
    },
  },
  {
    id: "rev-2",
    author: { uk: "Олена М.", en: "Olena M." },
    city: { uk: "Київ", en: "Kyiv" },
    productId: "gel-mask",
    productName: { uk: "Гель-маска «Рідкі патчі»", en: "Liquid Patches Gel Mask" },
    rating: 5,
    text: {
      uk: "Тримаю баночку в холодильнику — зранку 10 хвилин під очі і набряків як не було. Набагато приємніше й економніше за звичайні патчі.",
      en: "I keep my jar chilled—10 minutes in the morning and puffiness disappears. So much nicer and longer-lasting than disposable patches.",
    },
  },
  {
    id: "rev-3",
    author: { uk: "Марта В.", en: "Marta V." },
    city: { uk: "Івано-Франківськ", en: "Ivano-Frankivsk" },
    productId: "day-cream",
    productName: { uk: "Щоденний крем «Базовий догляд»", en: "Essential Daily Cream" },
    rating: 5,
    text: {
      uk: "У мене дуже чутлива шкіра, яка червоніє майже від усього. Цей крем за тиждень прибрав сухість і подарував спокій. Окремий захват від баночки!",
      en: "My skin is ultra-reactive and flushes easily. Within a week this cream calmed all dryness. And the frosted jar with bronze lid feels truly luxurious!",
    },
  },
  {
    id: "rev-4",
    author: { uk: "Ірина Д.", en: "Iryna D." },
    city: { uk: "Одеса", en: "Odesa" },
    productId: "eye-cream",
    productName: { uk: "Крем 2в1 для очей та обличчя", en: "2-in-1 Eye & Face Cream" },
    rating: 5,
    text: {
      uk: "Брала Набір №1 на подарунок мамі і собі. Легка текстура, делікатний дозатор, а ефект зволоження тримається до самого вечора.",
      en: "Ordered Set No. 1 for both my mom and myself. Featherlight texture, hygienic pump, and hydration lasts all evening.",
    },
  },
];
