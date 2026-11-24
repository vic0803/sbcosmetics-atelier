"use client";

import { Menu, ShoppingBag, User } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { assetPath } from "@/lib/assets";

type HeaderTheme = "paper" | "surface" | "navy" | "sapphire";

const THEME_BAR_CLASS: Record<HeaderTheme, string> = {
  paper: "bg-paper/68 text-ink backdrop-blur-md",
  surface: "bg-surface/72 text-ink backdrop-blur-md",
  navy: "bg-ink/72 text-pearl backdrop-blur-md",
  sapphire: "bg-espresso/72 text-pearl backdrop-blur-md",
};

export function Header() {
  const pathname = usePathname();
  const { lang, setLang, t, cartCount, user, openOverlay } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [sectionTheme, setSectionTheme] = useState<HeaderTheme>("paper");

  const isHome = pathname === "/";

  useEffect(() => {
    let rafId = 0;

    const sampleHeaderState = () => {
      rafId = 0;
      setScrolled(window.scrollY > 24);

      const sampleY = 66; // vertical midpoint of the 68px nav bar below the 32px announcement bar
      const sections = document.querySelectorAll<HTMLElement>("[data-header-theme]");
      let detected: HeaderTheme = "paper";

      // The Home hero is sticky and later sections slide over it, so several themed
      // elements can overlap the nav bar. Later DOM nodes paint on top: keep the last match.
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= sampleY && rect.bottom > sampleY) {
          const val = el.dataset.headerTheme as HeaderTheme | undefined;
          if (val && val in THEME_BAR_CLASS) {
            detected = val;
          }
        }
      }

      setSectionTheme((prev) => (prev === detected ? prev : detected));
    };

    const scheduleSample = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(sampleHeaderState);
      }
    };

    sampleHeaderState();
    window.addEventListener("scroll", scheduleSample, { passive: true });
    window.addEventListener("resize", scheduleSample, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleSample);
      window.removeEventListener("resize", scheduleSample);
    };
  }, [pathname]);

  const isDarkTheme = scrolled && (sectionTheme === "navy" || sectionTheme === "sapphire");

  // Primary nav links on desktop: Catalog, Ritual, Atelier & Journal
  const navLinks = [
    { href: "/catalog", label: t("nav.catalog"), match: (p: string) => p === "/catalog" },
    { href: "/quiz", label: t("nav.quiz"), match: (p: string) => p.startsWith("/quiz") },
    { href: "/atelier", label: t("nav.atelier"), match: (p: string) => p.startsWith("/atelier") },
    { href: "/journal", label: t("nav.journal"), match: (p: string) => p.startsWith("/journal") },
  ];

  const navBarClass = scrolled
    ? THEME_BAR_CLASS[sectionTheme]
    : isHome
      ? "bg-transparent text-ink"
      : THEME_BAR_CLASS.paper;

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

      {/* Act 0B: Translucent Section-Adaptive Navigation Bar (zero bottom border line) */}
      <div className={`transition-colors duration-300 ${navBarClass}`}>
        <div className="grid h-[64px] w-full grid-cols-3 items-center px-4 sm:px-6 lg:h-[68px] lg:grid-cols-[1fr_auto_1fr] lg:px-8 xl:px-10">
          {/* Left: Mobile Burger / Desktop Monogram + Wordmark */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openOverlay("menu")}
              aria-label={t("nav.menu")}
              className={`btn-tactile flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${
                isDarkTheme
                  ? "text-pearl hover:bg-pearl/10"
                  : "text-ink hover:bg-ink/5"
              }`}
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
              <span className="whitespace-nowrap text-[19px] font-bold tracking-[0.15em] uppercase">
                Sophie Bilynska
              </span>
            </Link>
          </div>

          {/* Center: Mobile Centered Wordmark / Desktop 4-Link Nav */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="whitespace-nowrap text-[16px] font-bold tracking-[0.15em] uppercase lg:hidden"
            >
              Sophie Bilynska
            </Link>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-5 lg:flex xl:gap-9"
            >
              {navLinks.map((item) => {
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative whitespace-nowrap py-2 text-[13px] font-semibold tracking-[0.09em] uppercase transition-colors xl:text-[14px] xl:tracking-[0.1em] ${
                      active
                        ? "text-accent"
                        : isDarkTheme
                          ? "text-pearl/80 hover:text-pearl"
                          : "text-ink-soft/85 hover:text-ink"
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

          {/* Right: UA / EN on all screens; Account + Bag on desktop only (mobile Bag lives in MobileBottomBar) */}
          <div className="flex items-center justify-end gap-3 lg:gap-4">
            {/* Minimalist slash UA / EN switcher (visible on both mobile and desktop) */}
            <div className="flex items-center gap-1 text-[12px] font-semibold tracking-[0.1em] uppercase lg:gap-1.5 lg:text-[13px]">
              <button
                type="button"
                onClick={() => setLang("uk")}
                className={`py-1 transition-colors ${
                  lang === "uk"
                    ? isDarkTheme
                      ? "text-pearl"
                      : "text-ink"
                    : isDarkTheme
                      ? "text-pearl/45 hover:text-pearl"
                      : "text-muted/60 hover:text-ink"
                }`}
              >
                UA
              </button>
              <span className={isDarkTheme ? "text-pearl/30" : "text-line-strong"}>/</span>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`py-1 transition-colors ${
                  lang === "en"
                    ? isDarkTheme
                      ? "text-pearl"
                      : "text-ink"
                    : isDarkTheme
                      ? "text-pearl/45 hover:text-pearl"
                      : "text-muted/60 hover:text-ink"
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
              className={`btn-tactile relative hidden h-10 w-10 items-center justify-center rounded-full lg:flex ${
                isDarkTheme
                  ? "text-pearl hover:bg-pearl/10"
                  : "text-ink hover:bg-ink/5"
              }`}
            >
              <User className="h-[19px] w-[19px]" strokeWidth={1.7} />
              {user && (
                <span
                  aria-hidden="true"
                  className={`absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ${
                    isDarkTheme ? "ring-ink" : "ring-surface"
                  }`}
                />
              )}
            </button>

            {/* Desktop Cart trigger (mobile already has Bag in MobileBottomBar) */}
            <button
              type="button"
              onClick={() => openOverlay("cart")}
              aria-label={t("nav.cart")}
              className={`btn-tactile relative hidden h-10 items-center gap-2 rounded-full px-4 lg:flex ${
                isDarkTheme
                  ? "bg-pearl text-ink hover:bg-accent hover:text-ink"
                  : "bg-ink text-surface hover:bg-accent hover:text-ink"
              }`}
            >
              <ShoppingBag className="h-[16px] w-[16px]" strokeWidth={1.8} />
              <span className="text-[12px] font-semibold tracking-[0.12em] uppercase">
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
