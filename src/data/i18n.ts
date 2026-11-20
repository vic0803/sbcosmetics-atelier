import type { Lang } from "@/lib/format";

const UK = {
  // Navigation
  "nav.home": "Головна",
  "nav.catalog": "Каталог",
  "nav.quiz": "Підбір догляду",
  "nav.atelier": "Ательє",
  "nav.journal": "Журнал",
  "nav.contacts": "Контакти",
  "nav.cart": "Кошик",
  "nav.account": "Кабінет",
  "nav.menu": "Меню",

  // Hero
  "hero.eyebrow": "Ательє натуральної косметики · Львів",
  "hero.titleLine1": "Чиста ботаніка,",
  "hero.titleLine2": "створена технологом.",
  "hero.subtitle":
    "Сертифіковані формули малих партій на основі CO₂-екстрактів, гіалуронової кислоти та холоднопресованих рослинних олій.",
  "hero.ctaPrimary": "Відкрити каталог",
  "hero.ctaSecondary": "Підібрати ритуал за 30 с",
  "hero.trust1": "Сертифікований технолог",
  "hero.trust2": "100% еко-складники",
  "hero.trust3": "Малі партії · Львів",
  "hero.trust4": "Нова Пошта по Україні",

  // Home sections
  "home.bestsellersEyebrow": "Обране клієнтами",
  "home.bestsellersTitle": "Культові формули",
  "home.viewAll": "Дивитись усі 11 засобів",

  "home.quizEyebrow": "Персональна діагностика",
  "home.quizTitle": "Не знаєте, з чого почати? Складіть свій ритуал за 30 секунд",
  "home.quizDesc":
    "4 короткі запитання про стан шкіри — і система технолога підбере узгоджений ранковий та вечірній догляд зі знижкою −10% на набір.",
  "home.quizCta": "Пройти підбір догляду",

  "home.activesEyebrow": "Бібліотека активів",
  "home.activesTitle": "Прозора наука у кожній краплі",
  "home.activesSub":
    "Оберіть активний компонент, щоб побачити його дію та формули Sophie Bilynska, де він працює.",

  "home.setsEyebrow": "Готові ритуали",
  "home.setsTitle": "Подарункові набори Atelier",
  "home.setsSub":
    "Узгоджені комплекси у фірмовому чорно-бронзовому пакуванні — вигідніше до −12%.",

  "home.atelierEyebrow": "Філософія Sophie Bilynska",
  "home.atelierTitle": "Кожна формула народжується руками сертифікованого технолога",
  "home.atelierBody":
    "Ми не працюємо за масовими шаблонами контрактних виробництв. У нашій львівській лабораторії Софія Білинська особисто створює рецептури, перевіряє кожну партію та обирає лише чисті сертифіковані активи з прозорим INCI.",
  "home.atelierStat1Value": "100%",
  "home.atelierStat1Label": "Еко-складники та прозорий INCI",
  "home.atelierStat2Value": "16.5K+",
  "home.atelierStat2Label": "Спільнота бренду @sb.cosm",
  "home.atelierStat3Value": "4.9 ★",
  "home.atelierStat3Label": "Середня оцінка засобів",
  "home.atelierCta": "Історія бренду та сертифікати",

  "home.journalEyebrow": "Журнал ательє",
  "home.journalTitle": "Нотатки технолога про шкіру",
  "home.journalAll": "Усі статті журналу",

  "home.reviewsEyebrow": "Відгуки · @sb.cosm",
  "home.reviewsTitle": "Довіра, що відчувається шкірою",

  // Common actions
  "common.addToCart": "У кошик",
  "common.added": "Додано в кошик",
  "common.addedSet": "Набір додано в кошик",
  "common.quickAdd": "Додати",
  "common.readMore": "Читати статтю",
  "common.details": "Детальніше",
  "common.all": "Усі",
  "common.sets": "Набори",
  "common.save": "Зберегти",
  "common.savedToWishlist": "Додано в обране",
  "common.removedFromWishlist": "Прибрано з обраного",
  "common.freeShippingAt": "Безкоштовна доставка Новою Поштою від",
  "common.freeShippingUnlocked": "Безкоштовна доставка Новою Поштою активована",

  // Catalog
  "catalog.eyebrow": "Колекція Sophie Bilynska",
  "catalog.title": "Каталог догляду",
  "catalog.subtitle":
    "11 сертифікованих формул для обличчя, тіла та волосся, створених малими партіями у Львові.",
  "catalog.sortPopular": "Популярні",
  "catalog.sortPriceAsc": "Спочатку дешевші",
  "catalog.sortPriceDesc": "Спочатку дорожчі",
  "catalog.empty": "За обраним фільтром засобів не знайдено.",
  "catalog.reset": "Скинути фільтри",

  // PDP
  "pdp.volume": "Об'єм",
  "pdp.quantity": "Кількість",
  "pdp.keyActives": "Ключові активи формули",
  "pdp.benefits": "Дія та переваги",
  "pdp.usage": "Спосіб застосування",
  "pdp.inci": "Повний склад (INCI)",
  "pdp.delivery": "Доставка та оплата",
  "pdp.deliveryText":
    "Відправляємо Новою Поштою по всій Україні (відділення, поштомат або кур'єр) протягом 1–2 робочих днів. Безкоштовна доставка при замовленні від 2 000 ₴.",
  "pdp.pairTitle": "Поєднайте у щоденному ритуалі",
  "pdp.pairSub": "Формули, що підсилюють дію цього засобу",
  "pdp.reviewsLabel": "відгуків",

  // Cart
  "cart.title": "Ваш кошик",
  "cart.emptyTitle": "Кошик поки порожній",
  "cart.emptySub":
    "Оберіть засоби в каталозі або пройдіть 30-секундний підбір персонального ритуалу.",
  "cart.promoPlaceholder": "Промокод (спробуйте SOPHIE10)",
  "cart.promoApply": "Застосувати",
  "cart.promoApplied": "Промокод SOPHIE10 (−10%) активовано",
  "cart.promoInvalid": "Спробуйте промокод SOPHIE10 для знижки −10%",
  "cart.subtotal": "Сума товарів",
  "cart.discount": "Знижка",
  "cart.shipping": "Доставка Нова Пошта",
  "cart.shippingFree": "Безкоштовно",
  "cart.shippingCalc": "За тарифами НП (~80 ₴)",
  "cart.total": "Разом до сплати",
  "cart.checkout": "Оформити замовлення",
  "cart.continue": "Продовжити покупки",

  // Account & Auth (Apple + Google -> Email)
  "auth.title": "Особистий кабінет",
  "auth.subtitle":
    "Увійдіть через Apple або Google, щоб зберігати персональний ритуал шкіри, обрані засоби та відстежувати замовлення Нової Пошти.",
  "auth.apple": "Продовжити з Apple",
  "auth.google": "Продовжити з Google",
  "auth.note":
    "Реєстрація доступна лише через захищений вхід Apple або Google. Пароль вигадувати не потрібно.",
  "auth.emailTitle": "Завершіть налаштування профілю",
  "auth.emailSubtitle":
    "Додайте ваш актуальний email — без нього ми не зможемо надсилати електронні чеки, персональний протокол догляду та статуси доставки Нової Пошти.",
  "auth.nameLabel": "Ім'я та прізвище",
  "auth.emailLabel": "Електронна пошта (обов'язково)",
  "auth.phoneLabel": "Телефон для Нової Пошти (необов'язково)",
  "auth.completeBtn": "Зберегти та увійти в кабінет",
  "auth.logout": "Вийти з акаунта",
  "account.tabRitual": "Мій ритуал",
  "account.tabOrders": "Замовлення",
  "account.tabWishlist": "Обране",
  "account.tabProfile": "Профіль",

  // Checkout
  "checkout.eyebrow": "Оформлення замовлення",
  "checkout.title": "Доставка та оплата",
  "checkout.step1": "1. Отримувач",
  "checkout.step2": "2. Доставка Нова Пошта",
  "checkout.step3": "3. Оплата",
  "checkout.placeOrder": "Підтвердити замовлення",
  "checkout.successTitle": "Дякуємо за замовлення!",
  "checkout.successDesc":
    "Ми зберегли замовлення у вашому особистому кабінеті. Після підключення платіжного шлюзу тут відкриватиметься оплата Monobank / Apple Pay та автоматичне створення ТТН Нової Пошти.",
  "checkout.backCatalog": "Повернутись до каталогу",

  // Footer
  "footer.tagline":
    "Натуральна сертифікована косметика ручної роботи зі Львова. Створена сертифікованим технологом зі 100% еко-складників.",
  "footer.shop": "Магазин",
  "footer.brand": "Ательє",
  "footer.contact": "Контакти",
  "footer.hours": "Пн–Пт 9:00–21:00 · Сб 10:00–16:00 · Нд 10:00–14:00",
  "footer.city": "Львів, Україна",
  "footer.rights": "Усі права захищено.",
} as const;

export type TranslationKey = keyof typeof UK;

const EN: Record<TranslationKey, string> = {
  "nav.home": "Home",
  "nav.catalog": "Shop",
  "nav.quiz": "Skin Ritual",
  "nav.atelier": "Atelier",
  "nav.journal": "Journal",
  "nav.contacts": "Contacts",
  "nav.cart": "Bag",
  "nav.account": "Account",
  "nav.menu": "Menu",

  "hero.eyebrow": "Botanical Skincare Atelier · Lviv",
  "hero.titleLine1": "Pure botanicals,",
  "hero.titleLine2": "crafted by a technologist.",
  "hero.subtitle":
    "Certified small-batch formulas built with CO₂ plant extracts, hyaluronic acid, and cold-pressed botanical oils.",
  "hero.ctaPrimary": "Explore Collection",
  "hero.ctaSecondary": "30-Sec Ritual Finder",
  "hero.trust1": "Certified Technologist",
  "hero.trust2": "100% Eco Ingredients",
  "hero.trust3": "Small-Batch · Lviv",
  "hero.trust4": "Nova Poshta Ukraine",

  "home.bestsellersEyebrow": "Client Favorites",
  "home.bestsellersTitle": "Signature Formulas",
  "home.viewAll": "View all 11 formulas",

  "home.quizEyebrow": "Personal Consultation",
  "home.quizTitle": "Not sure where to begin? Build your ritual in 30 seconds",
  "home.quizDesc":
    "Answer 4 tactile questions about your skin and get a technologist-matched AM/PM protocol with −10% set savings.",
  "home.quizCta": "Start Ritual Finder",

  "home.activesEyebrow": "Actives Library",
  "home.activesTitle": "Transparent Science in Every Drop",
  "home.activesSub":
    "Select a botanical active to explore how it works and which Sophie Bilynska formulas feature it.",

  "home.setsEyebrow": "Curated Rituals",
  "home.setsTitle": "Atelier Gift Sets",
  "home.setsSub":
    "Harmonized routines in signature matte-black & bronze gift boxes — save up to −12%.",

  "home.atelierEyebrow": "The Sophie Bilynska Ethos",
  "home.atelierTitle": "Every vessel is compounded by a certified cosmetic technologist",
  "home.atelierBody":
    "We never use white-label factory templates. Inside our Lviv laboratory, Sophie Bilynska personally formulates each recipe, verifies every small batch, and works exclusively with certified clean botanical actives.",
  "home.atelierStat1Value": "100%",
  "home.atelierStat1Label": "Eco actives & transparent INCI",
  "home.atelierStat2Value": "16.5K+",
  "home.atelierStat2Label": "Community on @sb.cosm",
  "home.atelierStat3Value": "4.9 ★",
  "home.atelierStat3Label": "Average client rating",
  "home.atelierCta": "Our Story & Certifications",

  "home.journalEyebrow": "Atelier Journal",
  "home.journalTitle": "Technologist Notes on Skin",
  "home.journalAll": "Read all journal notes",

  "home.reviewsEyebrow": "Reviews · @sb.cosm",
  "home.reviewsTitle": "Trust You Can Feel on Skin",

  "common.addToCart": "Add to Bag",
  "common.added": "Added to bag",
  "common.addedSet": "Ritual set added to bag",
  "common.quickAdd": "Add",
  "common.readMore": "Read article",
  "common.details": "Explore",
  "common.all": "All",
  "common.sets": "Sets",
  "common.save": "Save",
  "common.savedToWishlist": "Saved to wishlist",
  "common.removedFromWishlist": "Removed from wishlist",
  "common.freeShippingAt": "Complimentary Nova Poshta shipping from",
  "common.freeShippingUnlocked": "Complimentary Nova Poshta shipping unlocked",

  "catalog.eyebrow": "Sophie Bilynska Collection",
  "catalog.title": "Skincare Collection",
  "catalog.subtitle":
    "11 certified small-batch formulas for face, body, and hair handcrafted in Lviv.",
  "catalog.sortPopular": "Most Popular",
  "catalog.sortPriceAsc": "Price: Low to High",
  "catalog.sortPriceDesc": "Price: High to Low",
  "catalog.empty": "No formulas match this filter yet.",
  "catalog.reset": "Reset filters",

  "pdp.volume": "Volume",
  "pdp.quantity": "Quantity",
  "pdp.keyActives": "Key Botanical Actives",
  "pdp.benefits": "Benefits",
  "pdp.usage": "How to Apply",
  "pdp.inci": "Full Ingredients (INCI)",
  "pdp.delivery": "Delivery & Payment",
  "pdp.deliveryText":
    "Dispatched via Nova Poshta across Ukraine (branch, locker, or courier) within 1–2 business days. Complimentary delivery on orders from ₴2,000.",
  "pdp.pairTitle": "Pair in Your Daily Ritual",
  "pdp.pairSub": "Complementary steps formulated to work together",
  "pdp.reviewsLabel": "reviews",

  "cart.title": "Your Bag",
  "cart.emptyTitle": "Your bag is currently empty",
  "cart.emptySub":
    "Explore our collection or take the 30-second Skin Ritual Finder for a tailored protocol.",
  "cart.promoPlaceholder": "Promo code (try SOPHIE10)",
  "cart.promoApply": "Apply",
  "cart.promoApplied": "Promo SOPHIE10 (−10%) applied",
  "cart.promoInvalid": "Try promo code SOPHIE10 for −10% off",
  "cart.subtotal": "Subtotal",
  "cart.discount": "Discount",
  "cart.shipping": "Nova Poshta Shipping",
  "cart.shippingFree": "Complimentary",
  "cart.shippingCalc": "Standard NP rate (~₴80)",
  "cart.total": "Total",
  "cart.checkout": "Proceed to Checkout",
  "cart.continue": "Continue Shopping",

  "auth.title": "Personal Account",
  "auth.subtitle":
    "Sign in with Apple or Google to save your Skin Ritual profile, wishlist, and track Nova Poshta orders.",
  "auth.apple": "Continue with Apple",
  "auth.google": "Continue with Google",
  "auth.note":
    "Sign-in is exclusively via secure Apple or Google authentication. No passwords to remember.",
  "auth.emailTitle": "Complete Your Profile",
  "auth.emailSubtitle":
    "Add your active email address — it is required for order receipts, your saved skincare protocol, and Nova Poshta delivery updates.",
  "auth.nameLabel": "Full Name",
  "auth.emailLabel": "Email Address (required)",
  "auth.phoneLabel": "Phone for Nova Poshta (optional)",
  "auth.completeBtn": "Save & Enter Account",
  "auth.logout": "Sign Out",
  "account.tabRitual": "My Ritual",
  "account.tabOrders": "Orders",
  "account.tabWishlist": "Wishlist",
  "account.tabProfile": "Profile",

  "checkout.eyebrow": "Checkout",
  "checkout.title": "Delivery & Payment",
  "checkout.step1": "1. Recipient",
  "checkout.step2": "2. Nova Poshta Delivery",
  "checkout.step3": "3. Payment Method",
  "checkout.placeOrder": "Confirm Order",
  "checkout.successTitle": "Thank You for Your Order!",
  "checkout.successDesc":
    "Your order has been saved to your Account history. Once backend integrations are connected, this step opens Monobank / Apple Pay checkout and generates a live Nova Poshta waybill.",
  "checkout.backCatalog": "Back to Collection",

  "footer.tagline":
    "Certified handmade botanical cosmetics from Lviv. Crafted by a certified technologist with 100% eco ingredients.",
  "footer.shop": "Shop",
  "footer.brand": "Atelier",
  "footer.contact": "Contact",
  "footer.hours": "Mon–Fri 9:00–21:00 · Sat 10:00–16:00 · Sun 10:00–14:00",
  "footer.city": "Lviv, Ukraine",
  "footer.rights": "All rights reserved.",
};

export const I18N: Record<Lang, Record<TranslationKey, string>> = {
  uk: UK,
  en: EN,
};
