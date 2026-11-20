"use client";

import { Menu, ShoppingBag, Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { assetPath } from "@/lib/assets";

export function Header() {
  const pathname = usePathname();
  const { lang, setLang, t, cartCount, user, openOverlay } = useStore();
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/catalog", label: t("nav.catalog") },
    { href: "/quiz", label: t("nav.quiz"), accent: true },
    { href: "/atelier", label: t("nav.atelier") },
    { href: "/journal", label: t("nav.journal") },
    { href: "/contacts", label: t("nav.contacts") },
  ];

  // On mobile home top, hero video is full-bleed dark-scrimmed at top; desktop home top is light warm cream (#efe9df)
  const mobileOverVideo = isHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/90 bg-paper/90 text-ink shadow-[0_1px_0_rgba(23,26,28,0.05)] backdrop-blur-md"
          : mobileOverVideo
            ? "bg-gradient-to-b from-ink/55 to-transparent text-surface lg:bg-none lg:bg-transparent lg:text-ink"
            : "border-b border-line/60 bg-paper/85 text-ink backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-2 px-4 sm:px-6 lg:h-[76px] lg:px-10">
        {/* Left: Mobile Menu + Crisp Brand Wordmark */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => openOverlay("menu")}
            aria-label={t("nav.menu")}
            className={`btn-tactile flex h-10 w-10 shrink-0 items-center justify-center rounded-full lg:hidden ${
              mobileOverVideo
                ? "bg-ink/30 text-surface backdrop-blur-md"
                : "text-ink hover:bg-ink/5"
            }`}
          >
            <Menu className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <Link href="/" className="group flex min-w-0 items-center gap-2.5">
            <img
              src={assetPath(
                mobileOverVideo
                  ? "/assets/logo/monogram-white.png"
                  : "/assets/logo/monogram.png"
              )}
              alt="Sophie Bilynska monogram"
              className="h-8 w-8 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 lg:hidden"
            />
            <img
              src={assetPath("/assets/logo/monogram.png")}
              alt="Sophie Bilynska monogram"
              className="hidden h-9 w-9 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 lg:block"
            />
            <span className="whitespace-nowrap text-[15px] font-bold tracking-[0.14em] uppercase sm:text-[17px]">
              Sophie Bilynska
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 lg:flex xl:gap-9"
        >
          {navLinks.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-1.5 py-2 text-[12px] font-semibold tracking-[0.15em] uppercase transition-colors ${
                  active
                    ? "text-accent-deep"
                    : "text-ink-soft/80 hover:text-ink"
                }`}
              >
                {item.accent && (
                  <Sparkles
                    className="h-3.5 w-3.5 text-accent-deep"
                    strokeWidth={2}
                  />
                )}
                <span>{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="desktop-nav-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Sliding Lang Switcher + Desktop Account & Bag */}
        <div className="flex shrink-0 items-center gap-2">
          <div
            className={`relative flex items-center rounded-full border p-0.5 text-[11px] font-semibold tracking-[0.1em] ${
              mobileOverVideo
                ? "border-surface/30 bg-ink/30 backdrop-blur-md lg:border-line-strong lg:bg-surface/80"
                : "border-line-strong bg-surface/80"
            }`}
          >
            {(["uk", "en"] as const).map((code) => {
              const active = lang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors ${
                    active
                      ? mobileOverVideo
                        ? "text-ink lg:text-surface"
                        : "text-surface"
                      : mobileOverVideo
                        ? "text-surface/80 hover:text-surface lg:text-muted lg:hover:text-ink"
                        : "text-muted hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="lang-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className={`absolute inset-0 -z-10 rounded-full ${
                        mobileOverVideo
                          ? "bg-surface lg:bg-ink"
                          : "bg-ink"
                      }`}
                    />
                  )}
                  {code === "uk" ? "UA" : "EN"}
                </button>
              );
            })}
          </div>

          {/* Desktop Account */}
          <button
            type="button"
            onClick={() => openOverlay("account")}
            aria-label={t("nav.account")}
            className="btn-tactile relative hidden h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/85 text-ink hover:border-ink hover:bg-ink hover:text-surface lg:flex"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {user && (
              <span
                aria-hidden="true"
                className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-surface"
              />
            )}
          </button>

          {/* Desktop Bag */}
          <button
            type="button"
            onClick={() => openOverlay("cart")}
            aria-label={t("nav.cart")}
            className="btn-tactile relative hidden h-10 items-center gap-2 rounded-full bg-ink px-4 text-surface hover:bg-accent-deep lg:flex"
          >
            <ShoppingBag className="h-[16px] w-[16px]" strokeWidth={1.8} />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase">
              {t("nav.cart")}
            </span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-ink">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
