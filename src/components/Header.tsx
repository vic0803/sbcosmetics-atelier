"use client";

import { Menu, ShoppingBag, User } from "lucide-react";
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

  // Only 4 clean primary nav links on desktop for maximum luxury breathing room
  const navLinks = [
    { href: "/catalog", label: t("nav.catalog"), match: (p: string) => p === "/catalog" },
    { href: "/quiz", label: t("nav.quiz"), match: (p: string) => p.startsWith("/quiz") },
    {
      href: "/catalog?category=sets",
      label: t("common.sets"),
      match: () => false,
    },
    { href: "/atelier", label: t("nav.atelier"), match: (p: string) => p.startsWith("/atelier") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Act 0A: Ultra-slim Announcement Bar (32px) */}
      <div className="flex h-8 items-center justify-center bg-ink px-3 text-center text-[10px] font-medium tracking-[0.11em] text-pearl/90 uppercase sm:px-4 sm:text-[11px] sm:tracking-[0.14em]">
        <p className="truncate sm:hidden">
          {lang === "uk" ? (
            <>
              Безкоштовна НП від 2 000 ₴
              <span className="mx-1.5 text-accent">·</span>
              <strong className="font-bold text-accent">SOPHIE10</strong> −10%
            </>
          ) : (
            <>
              Free delivery from ₴2,000
              <span className="mx-1.5 text-accent">·</span>
              <strong className="font-bold text-accent">SOPHIE10</strong> −10%
            </>
          )}
        </p>
        <p className="hidden truncate sm:block">
          {lang === "uk" ? (
            <>
              Безкоштовна доставка Новою Поштою від 2 000 ₴
              <span className="mx-2 text-accent">·</span>
              Промокод <strong className="font-bold text-accent">SOPHIE10</strong> на −10%
            </>
          ) : (
            <>
              Complimentary Nova Poshta delivery from ₴2,000
              <span className="mx-2 text-accent">·</span>
              Code <strong className="font-bold text-accent">SOPHIE10</strong> for −10%
            </>
          )}
        </p>
      </div>

      {/* Act 0B: Airy Main Navigation Bar (68px) */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-line/90 bg-paper/92 text-ink shadow-[0_1px_0_rgba(23,26,28,0.05)] backdrop-blur-md"
            : isHome
              ? "bg-transparent text-ink"
              : "border-b border-line/70 bg-paper/90 text-ink backdrop-blur-md"
        }`}
      >
        <div className="grid h-[64px] w-full grid-cols-3 items-center px-4 sm:px-6 lg:h-[68px] lg:grid-cols-[1fr_auto_1fr] lg:px-8 xl:px-10">
          {/* Left: Mobile Burger / Desktop Monogram + Wordmark */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openOverlay("menu")}
              aria-label={t("nav.menu")}
              className="btn-tactile flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <Link
              href="/"
              className="group hidden items-center gap-2.5 lg:flex"
            >
              <img
                src={assetPath("/assets/logo/monogram.png")}
                alt="Sophie Bilynska monogram"
                className="h-8 w-8 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="whitespace-nowrap text-[16px] font-bold tracking-[0.16em] uppercase">
                Sophie Bilynska
              </span>
            </Link>
          </div>

          {/* Center: Mobile Centered Wordmark / Desktop 4-Link Nav */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="whitespace-nowrap text-[14px] font-bold tracking-[0.16em] uppercase lg:hidden"
            >
              Sophie Bilynska
            </Link>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-9 lg:flex xl:gap-11"
            >
              {navLinks.map((item) => {
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-2 text-[12px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                      active ? "text-accent" : "text-ink-soft/85 hover:text-ink"
                    }`}
                  >
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
          </div>

          {/* Right: Desktop minimal UA / EN + Account + Bag; Mobile ONLY Bag */}
          <div className="flex items-center justify-end gap-4">
            {/* Minimalist slash UA / EN switcher (desktop only; mobile lives in drawer) */}
            <div className="hidden items-center gap-1.5 text-[12px] font-semibold tracking-[0.12em] uppercase lg:flex">
              <button
                type="button"
                onClick={() => setLang("uk")}
                className={`transition-colors ${
                  lang === "uk" ? "text-ink" : "text-muted/60 hover:text-ink"
                }`}
              >
                UA
              </button>
              <span className="text-line-strong">/</span>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`transition-colors ${
                  lang === "en" ? "text-ink" : "text-muted/60 hover:text-ink"
                }`}
              >
                EN
              </button>
            </div>

            {/* Desktop Account icon */}
            <button
              type="button"
              onClick={() => openOverlay("account")}
              aria-label={t("nav.account")}
              className="btn-tactile relative hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:flex"
            >
              <User className="h-[19px] w-[19px]" strokeWidth={1.7} />
              {user && (
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-surface"
                />
              )}
            </button>

            {/* Cart trigger (Desktop + Mobile right slot) */}
            <button
              type="button"
              onClick={() => openOverlay("cart")}
              aria-label={t("nav.cart")}
              className="btn-tactile relative flex h-10 items-center gap-2 rounded-full px-2.5 text-ink hover:bg-ink/5 lg:bg-ink lg:px-4 lg:text-surface lg:hover:bg-accent lg:hover:text-ink"
            >
              <ShoppingBag className="h-[18px] w-[18px] lg:h-[16px] lg:w-[16px]" strokeWidth={1.8} />
              <span className="hidden text-[11px] font-semibold tracking-[0.15em] uppercase lg:inline">
                {t("nav.cart")}
              </span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-ink">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
