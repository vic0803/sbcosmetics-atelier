"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BUNDLES } from "@/data/bundles";
import { I18N, type TranslationKey } from "@/data/i18n";
import { getProductById } from "@/data/products";
import type { QuizAnswers } from "@/data/quiz";
import type { Lang } from "@/lib/format";

export type OverlayKind = "menu" | "cart" | "account" | null;
export type AuthProviderKind = "apple" | "google";

export interface CartItem {
  kind: "product" | "bundle";
  id: string;
  variantIndex: number;
  qty: number;
}

export interface UserProfile {
  provider: AuthProviderKind;
  name: string;
  email: string;
  phone: string;
  city: string;
  npBranch: string;
  emailVerified: boolean;
}

export interface OrderRecord {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered";
  trackingNumber: string;
  city: string;
  branch: string;
  total: number;
  itemsSummary: string;
}

interface StoreContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;

  // Cart
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  promoCode: string | null;
  discountAmount: number;
  cartTotal: number;
  freeShippingThreshold: number;
  addProductToCart: (productId: string, qty?: number, variantIndex?: number) => void;
  addBundleToCart: (bundleId: string) => void;
  addMultipleProductsToCart: (productIds: string[], toastLabel?: string) => void;
  updateCartQty: (kind: "product" | "bundle", id: string, variantIndex: number, delta: number) => void;
  removeCartItem: (kind: "product" | "bundle", id: string, variantIndex: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Saved Skin Quiz
  savedQuiz: QuizAnswers | null;
  saveQuizResult: (answers: QuizAnswers) => void;

  // Auth & Account (Apple / Google -> required Email)
  pendingProvider: AuthProviderKind | null;
  user: UserProfile | null;
  orders: OrderRecord[];
  startOAuthLogin: (provider: AuthProviderKind) => void;
  completeEmailOnboarding: (data: { name: string; email: string; phone: string }) => void;
  updateProfileDelivery: (city: string, npBranch: string, phone: string) => void;
  logout: () => void;
  recordOrder: (order: Omit<OrderRecord, "id" | "date" | "status" | "trackingNumber">) => OrderRecord;

  // Overlays & Toast
  activeOverlay: OverlayKind;
  openOverlay: (overlay: Exclude<OverlayKind, null>) => void;
  toggleOverlay: (overlay: Exclude<OverlayKind, null>) => void;
  closeOverlay: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEYS = {
  lang: "sb_atelier_lang",
  cart: "sb_atelier_cart",
  promo: "sb_atelier_promo",
  wishlist: "sb_atelier_wishlist",
  quiz: "sb_atelier_quiz",
  user: "sb_atelier_user",
  orders: "sb_atelier_orders",
} as const;

const FREE_SHIPPING_THRESHOLD = 2000;

const INITIAL_DEMO_ORDERS: OrderRecord[] = [
  {
    id: "SB-2026-0842",
    date: "14.11.2026",
    status: "delivered",
    trackingNumber: "20 4509 8841 2910",
    city: "Львів",
    branch: "Відділення №12 (вул. Сахарова, 42)",
    total: 2150,
    itemsSummary: "Гель-сироватка «Дотик шовку» (50 мл) × 1, Щоденний крем «Базовий догляд» × 1",
  },
];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [lang, setLangState] = useState<Lang>("uk");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [savedQuiz, setSavedQuiz] = useState<QuizAnswers | null>(null);
  const [pendingProvider, setPendingProvider] = useState<AuthProviderKind | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_DEMO_ORDERS);
  const [activeOverlay, setActiveOverlay] = useState<OverlayKind>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore saved language synchronously before first browser paint so EN reloads never flash UA
  useIsomorphicLayoutEffect(() => {
    let targetLang: Lang = "uk";
    try {
      const savedLang = window.localStorage.getItem(STORAGE_KEYS.lang);
      if (savedLang === "en" || savedLang === "uk") {
        targetLang = savedLang;
      }
    } catch {
      // ignore
    }

    if (targetLang !== "uk") {
      setLangState(targetLang);
    } else {
      delete document.documentElement.dataset.langReady;
    }

    setCartItems(readJSON<CartItem[]>(STORAGE_KEYS.cart, []));
    setPromoCode(readJSON<string | null>(STORAGE_KEYS.promo, null));
    setWishlist(readJSON<string[]>(STORAGE_KEYS.wishlist, []));
    setSavedQuiz(readJSON<QuizAnswers | null>(STORAGE_KEYS.quiz, null));
    setUser(readJSON<UserProfile | null>(STORAGE_KEYS.user, null));
    setOrders(readJSON<OrderRecord[]>(STORAGE_KEYS.orders, INITIAL_DEMO_ORDERS));
    setHydrated(true);
  }, []);

  // Reveal body synchronously once the committed DOM matches the saved language
  useIsomorphicLayoutEffect(() => {
    document.documentElement.lang = lang;
    if (!hydrated) return;
    try {
      const savedLang = window.localStorage.getItem(STORAGE_KEYS.lang);
      if (!savedLang || savedLang === lang) {
        delete document.documentElement.dataset.langReady;
      }
    } catch {
      delete document.documentElement.dataset.langReady;
    }
  }, [lang, hydrated]);

  // Keep language synced across open browser tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.lang && (e.newValue === "en" || e.newValue === "uk")) {
        setLangState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.cart, cartItems);
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.promo, promoCode);
  }, [promoCode, hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.wishlist, wishlist);
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.quiz, savedQuiz);
  }, [savedQuiz, hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.user, user);
  }, [user, hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.orders, orders);
  }, [orders, hydrated]);

  useEffect(() => {
    document.body.style.overflow = activeOverlay ? "hidden" : "";
    if (!activeOverlay) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveOverlay(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeOverlay]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 2400);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.lang, next);
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
      delete document.documentElement.dataset.langReady;
    }
    setLangState(next);
  }, []);
  const t = useCallback((key: TranslationKey) => I18N[lang][key], [lang]);

  const addProductToCart = useCallback(
    (productId: string, qty = 1, variantIndex = 0) => {
      if (!getProductById(productId) || qty < 1) return;
      setCartItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.kind === "product" && i.id === productId && i.variantIndex === variantIndex
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...prev, { kind: "product", id: productId, variantIndex, qty }];
      });
      showToast(I18N[lang]["common.added"]);
    },
    [lang, showToast]
  );

  const addBundleToCart = useCallback(
    (bundleId: string) => {
      if (!BUNDLES.some((b) => b.id === bundleId)) return;
      setCartItems((prev) => {
        const idx = prev.findIndex((i) => i.kind === "bundle" && i.id === bundleId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
          return next;
        }
        return [...prev, { kind: "bundle", id: bundleId, variantIndex: 0, qty: 1 }];
      });
      showToast(I18N[lang]["common.addedSet"]);
    },
    [lang, showToast]
  );

  const addMultipleProductsToCart = useCallback(
    (productIds: string[], toastLabel?: string) => {
      setCartItems((prev) => {
        const next = [...prev];
        for (const pid of productIds) {
          if (!getProductById(pid)) continue;
          const idx = next.findIndex(
            (i) => i.kind === "product" && i.id === pid && i.variantIndex === 0
          );
          if (idx >= 0) {
            next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
          } else {
            next.push({ kind: "product", id: pid, variantIndex: 0, qty: 1 });
          }
        }
        return next;
      });
      showToast(toastLabel ?? I18N[lang]["common.addedSet"]);
    },
    [lang, showToast]
  );

  const updateCartQty = useCallback(
    (kind: "product" | "bundle", id: string, variantIndex: number, delta: number) => {
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.kind === kind && item.id === id && item.variantIndex === variantIndex
              ? { ...item, qty: item.qty + delta }
              : item
          )
          .filter((item) => item.qty > 0)
      );
    },
    []
  );

  const removeCartItem = useCallback(
    (kind: "product" | "bundle", id: string, variantIndex: number) => {
      setCartItems((prev) =>
        prev.filter(
          (item) => !(item.kind === kind && item.id === id && item.variantIndex === variantIndex)
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setPromoCode(null);
  }, []);

  const applyPromo = useCallback(
    (raw: string): boolean => {
      const normalized = raw.trim().toUpperCase();
      if (normalized === "SOPHIE10" || normalized === "ATELIER10") {
        setPromoCode(normalized);
        showToast(I18N[lang]["cart.promoApplied"]);
        return true;
      }
      showToast(I18N[lang]["cart.promoInvalid"]);
      return false;
    },
    [lang, showToast]
  );

  const clearPromo = useCallback(() => setPromoCode(null), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        showToast(
          exists
            ? I18N[lang]["common.removedFromWishlist"]
            : I18N[lang]["common.savedToWishlist"]
        );
        return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      });
    },
    [lang, showToast]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const saveQuizResult = useCallback(
    (answers: QuizAnswers) => {
      setSavedQuiz(answers);
      showToast(
        lang === "uk"
          ? "Ваш персональний ритуал збережено в кабінеті"
          : "Your personal ritual has been saved to Account"
      );
    },
    [lang, showToast]
  );

  const startOAuthLogin = useCallback((provider: AuthProviderKind) => {
    setPendingProvider(provider);
  }, []);

  const completeEmailOnboarding = useCallback(
    (data: { name: string; email: string; phone: string }) => {
      const provider = pendingProvider ?? "google";
      setUser({
        provider,
        name: data.name.trim() || (lang === "uk" ? "Гостя Atelier" : "Atelier Guest"),
        email: data.email.trim(),
        phone: data.phone.trim(),
        city: "Львів",
        npBranch: "Відділення №12",
        emailVerified: true,
      });
      setPendingProvider(null);
      showToast(
        lang === "uk"
          ? "Профіль активовано · Ласкаво просимо!"
          : "Profile active · Welcome to Atelier!"
      );
    },
    [pendingProvider, lang, showToast]
  );

  const updateProfileDelivery = useCallback(
    (city: string, npBranch: string, phone: string) => {
      setUser((prev) => (prev ? { ...prev, city, npBranch, phone } : prev));
      showToast(lang === "uk" ? "Дані доставки збережено" : "Delivery details saved");
    },
    [lang, showToast]
  );

  const logout = useCallback(() => {
    setUser(null);
    setPendingProvider(null);
    showToast(lang === "uk" ? "Ви вийшли з кабінету" : "Signed out");
  }, [lang, showToast]);

  const recordOrder = useCallback(
    (order: Omit<OrderRecord, "id" | "date" | "status" | "trackingNumber">): OrderRecord => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yyyy = now.getFullYear();
      const suffix = String(Math.floor(1000 + Math.random() * 9000));
      const created: OrderRecord = {
        ...order,
        id: `SB-${yyyy}-${suffix}`,
        date: `${dd}.${mm}.${yyyy}`,
        status: "processing",
        trackingNumber: `20 4510 ${suffix} 1024`,
      };
      setOrders((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const openOverlay = useCallback((o: Exclude<OverlayKind, null>) => setActiveOverlay(o), []);
  const toggleOverlay = useCallback(
    (o: Exclude<OverlayKind, null>) => setActiveOverlay((c) => (c === o ? null : o)),
    []
  );
  const closeOverlay = useCallback(() => setActiveOverlay(null), []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.qty, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      if (item.kind === "bundle") {
        const b = BUNDLES.find((x) => x.id === item.id);
        return sum + (b ? b.bundlePrice * item.qty : 0);
      }
      const p = getProductById(item.id);
      if (!p) return sum;
      const v = p.variants[item.variantIndex] ?? p.variants[0];
      return sum + (v ? v.price : p.price) * item.qty;
    }, 0);
  }, [cartItems]);

  const discountAmount = useMemo(
    () => (promoCode ? Math.round(cartSubtotal * 0.1) : 0),
    [cartSubtotal, promoCode]
  );

  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const value = useMemo<StoreContextValue>(
    () => ({
      lang,
      setLang,
      t,
      cartItems,
      cartCount,
      cartSubtotal,
      promoCode,
      discountAmount,
      cartTotal,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      addProductToCart,
      addBundleToCart,
      addMultipleProductsToCart,
      updateCartQty,
      removeCartItem,
      clearCart,
      applyPromo,
      clearPromo,
      wishlist,
      toggleWishlist,
      isWishlisted,
      savedQuiz,
      saveQuizResult,
      pendingProvider,
      user,
      orders,
      startOAuthLogin,
      completeEmailOnboarding,
      updateProfileDelivery,
      logout,
      recordOrder,
      activeOverlay,
      openOverlay,
      toggleOverlay,
      closeOverlay,
      toastMessage,
      showToast,
    }),
    [
      lang,
      setLang,
      t,
      cartItems,
      cartCount,
      cartSubtotal,
      promoCode,
      discountAmount,
      cartTotal,
      addProductToCart,
      addBundleToCart,
      addMultipleProductsToCart,
      updateCartQty,
      removeCartItem,
      clearCart,
      applyPromo,
      clearPromo,
      wishlist,
      toggleWishlist,
      isWishlisted,
      savedQuiz,
      saveQuizResult,
      pendingProvider,
      user,
      orders,
      startOAuthLogin,
      completeEmailOnboarding,
      updateProfileDelivery,
      logout,
      recordOrder,
      activeOverlay,
      openOverlay,
      toggleOverlay,
      closeOverlay,
      toastMessage,
      showToast,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
