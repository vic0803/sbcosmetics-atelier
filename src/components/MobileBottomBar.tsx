"use client";

import { Grid2x2, Home, ShoppingBag, Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { lang, cartCount, user, openOverlay, activeOverlay } = useStore();

  // Hide on PDP because PDP has its own Sticky Buy bar
  if (pathname.startsWith("/product/")) {
    return null;
  }

  const labels = {
    home: lang === "uk" ? "Головна" : "Home",
    catalog: lang === "uk" ? "Каталог" : "Shop",
    quiz: lang === "uk" ? "Підбір" : "Quiz",
    account: lang === "uk" ? "Кабінет" : "Account",
    cart: lang === "uk" ? "Кошик" : "Bag",
  };

  const activeKey = activeOverlay
    ? activeOverlay
    : pathname === "/"
      ? "home"
      : pathname.startsWith("/catalog")
        ? "catalog"
        : pathname.startsWith("/quiz")
          ? "quiz"
          : "";

  const btnCls = (active: boolean) =>
    `relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-[10px] font-semibold tracking-[0.06em] uppercase transition-colors ${
      active ? "text-accent" : "text-muted hover:text-ink"
    }`;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(23,26,28,0.06)] backdrop-blur-lg lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-1">
        <Link href="/" className={btnCls(activeKey === "home")}>
          {activeKey === "home" && (
            <motion.span
              layoutId="mobile-tab-line"
              transition={{ type: "spring", stiffness: 450, damping: 34 }}
              className="absolute inset-x-3 top-0 h-[2.5px] rounded-full bg-accent"
            />
          )}
          <Home className="h-[19px] w-[19px]" strokeWidth={1.8} />
          <span className="whitespace-nowrap">{labels.home}</span>
        </Link>

        <Link href="/catalog" className={btnCls(activeKey === "catalog")}>
          {activeKey === "catalog" && (
            <motion.span
              layoutId="mobile-tab-line"
              transition={{ type: "spring", stiffness: 450, damping: 34 }}
              className="absolute inset-x-3 top-0 h-[2.5px] rounded-full bg-accent"
            />
          )}
          <Grid2x2 className="h-[19px] w-[19px]" strokeWidth={1.8} />
          <span className="whitespace-nowrap">{labels.catalog}</span>
        </Link>

        <Link href="/quiz" className={btnCls(activeKey === "quiz")}>
          {activeKey === "quiz" && (
            <motion.span
              layoutId="mobile-tab-line"
              transition={{ type: "spring", stiffness: 450, damping: 34 }}
              className="absolute inset-x-3 top-0 h-[2.5px] rounded-full bg-accent"
            />
          )}
          <Sparkles
            className={`h-[19px] w-[19px] ${
              activeKey === "quiz" ? "text-accent" : "text-accent"
            }`}
            strokeWidth={1.9}
          />
          <span className="whitespace-nowrap">{labels.quiz}</span>
        </Link>

        <button
          type="button"
          onClick={() => openOverlay("account")}
          className={btnCls(activeKey === "account")}
        >
          {activeKey === "account" && (
            <motion.span
              layoutId="mobile-tab-line"
              transition={{ type: "spring", stiffness: 450, damping: 34 }}
              className="absolute inset-x-3 top-0 h-[2.5px] rounded-full bg-accent"
            />
          )}
          <span className="relative">
            <User className="h-[19px] w-[19px]" strokeWidth={1.8} />
            {user && (
              <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-accent" />
            )}
          </span>
          <span className="whitespace-nowrap">{labels.account}</span>
        </button>

        <button
          type="button"
          onClick={() => openOverlay("cart")}
          className={btnCls(activeKey === "cart")}
        >
          {activeKey === "cart" && (
            <motion.span
              layoutId="mobile-tab-line"
              transition={{ type: "spring", stiffness: 450, damping: 34 }}
              className="absolute inset-x-3 top-0 h-[2.5px] rounded-full bg-accent"
            />
          )}
          <span className="relative">
            <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </span>
          <span className="whitespace-nowrap">{labels.cart}</span>
        </button>
      </div>
    </nav>
  );
}
