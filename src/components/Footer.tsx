"use client";

import { Instagram, Mail, Phone, Send } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { assetPath } from "@/lib/assets";

export function Footer() {
  const { t, lang, openOverlay } = useStore();

  return (
    <footer
      data-header-theme="navy"
      data-hide-mobile-header="true"
      className="flex min-h-[100svh] flex-col border-t border-pearl/10 bg-ink pb-[calc(56px+env(safe-area-inset-bottom,0px))] text-pearl lg:block lg:min-h-0 lg:pb-0"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-between px-8 pt-8 pb-7 sm:px-10 lg:block lg:px-12 lg:pt-16 lg:pb-12">
        <div>
          {/* Top Concierge Band: Personal Technologist + Message on Telegram */}
          <div className="flex flex-col items-start justify-between gap-4 border-b border-pearl/12 pb-6 lg:flex-row lg:items-center lg:gap-8 lg:pb-12">
            <div>
              <p className="eyebrow text-accent">
                {lang === "uk"
                  ? "Персональна консультація технолога"
                  : "Personal Technologist Concierge"}
              </p>
              <h2 className="mt-1.5 font-display text-lg leading-[1.1] font-bold text-pearl uppercase sm:text-3xl lg:text-4xl">
                {lang === "uk"
                  ? "Сумніваєтесь у виборі? Підберемо догляд разом"
                  : "Unsure what to pick? Let's build your ritual together"}
              </h2>
            </div>

            <a
              href="https://t.me/+380631790642"
              target="_blank"
              rel="noreferrer"
              className="btn-tactile inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-none bg-surface px-7 py-3 text-xs font-bold tracking-[0.16em] text-ink uppercase hover:bg-accent sm:w-auto lg:min-h-[52px] lg:py-3.5"
            >
              <Send className="h-4 w-4 shrink-0" />
              <span>
                {lang === "uk" ? "Написати в Telegram" : "Message on Telegram"}
              </span>
            </a>
          </div>

          {/* Brand Crest & Wordmark Logo in White (Centered Stacked on Mobile, Horizontal on sm+) */}
          <div className="flex flex-col items-center border-b border-pearl/12 py-5 text-center lg:py-12">
            <Link
              href="/"
              className="group inline-flex flex-col items-center justify-center gap-5 transition-opacity hover:opacity-90 sm:flex-row sm:gap-6 lg:gap-8"
            >
              <img
                src={assetPath("/assets/logo/monogram-white.png")}
                alt="Sophie Bilynska Monogram"
                className="h-[172px] w-[172px] shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-36 sm:w-36 lg:h-36 lg:w-36"
              />
              <img
                src={assetPath("/assets/logo/wordmark-white.png")}
                alt="Sophie Bilynska Cosmetics"
                className="h-20 w-auto max-w-[82vw] object-contain sm:h-24 sm:max-w-none lg:h-32 xl:h-36"
              />
            </Link>
          </div>
        </div>

        {/* 4 Clean Columns (Balanced 4+4 / 3+3 on Mobile, 16px Headings, 18px Links) */}
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:mt-12 lg:gap-12">
          <div>
            <p className="text-[16px] leading-none font-semibold tracking-[0.14em] text-accent uppercase lg:text-[0.72rem] lg:tracking-[0.18em]">
              {t("footer.shop")}
            </p>
            <ul className="mt-2 space-y-1 text-[18px] leading-[1.2] text-pearl/85 lg:mt-4 lg:space-y-2.5 lg:text-sm lg:leading-normal">
              <li>
                <Link href="/catalog" className="hover:text-pearl">
                  {t("nav.catalog")}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=face" className="hover:text-pearl">
                  {lang === "uk" ? "Обличчя" : "Face"}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=body" className="hover:text-pearl">
                  {lang === "uk" ? "Тіло" : "Body"}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=hair" className="hover:text-pearl">
                  {lang === "uk" ? "Волосся" : "Hair"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[16px] leading-none font-semibold tracking-[0.14em] text-accent uppercase lg:text-[0.72rem] lg:tracking-[0.18em]">
              {t("footer.brand")}
            </p>
            <ul className="mt-2 space-y-1 text-[18px] leading-[1.2] text-pearl/85 lg:mt-4 lg:space-y-2.5 lg:text-sm lg:leading-normal">
              <li>
                <Link href="/atelier" className="hover:text-pearl">
                  {t("nav.atelier")}
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-pearl">
                  {t("nav.quiz")}
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-pearl">
                  {t("nav.journal")}
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-pearl">
                  {t("nav.contacts")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[16px] leading-none font-semibold tracking-[0.14em] text-accent uppercase lg:text-[0.72rem] lg:tracking-[0.18em]">
              {lang === "uk" ? "Клієнтам" : "Client Care"}
            </p>
            <ul className="mt-2 space-y-1 text-[18px] leading-[1.2] text-pearl/85 lg:mt-4 lg:space-y-2.5 lg:text-sm lg:leading-normal">
              <li>
                <button
                  type="button"
                  onClick={() => openOverlay("account")}
                  className="hover:text-pearl"
                >
                  {t("nav.account")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openOverlay("cart")}
                  className="hover:text-pearl"
                >
                  {t("nav.cart")}
                </button>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-pearl">
                  {lang === "uk" ? "Доставка та оплата" : "Shipping & Payment"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[16px] leading-none font-semibold tracking-[0.14em] text-accent uppercase lg:text-[0.72rem] lg:tracking-[0.18em]">
              {t("footer.contact")}
            </p>
            <ul className="mt-2 space-y-1 text-[18px] leading-[1.2] text-pearl/85 lg:mt-4 lg:space-y-3 lg:text-sm lg:leading-normal">
              <li className="flex items-center gap-2">
                <Phone
                  className="h-4 w-4 shrink-0 text-accent"
                  strokeWidth={1.6}
                />
                <a
                  href="tel:+380631790642"
                  className="text-[17px] whitespace-nowrap hover:text-pearl lg:text-sm"
                >
                  +380 (63) 179-06-42
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram
                  className="h-4 w-4 shrink-0 text-accent"
                  strokeWidth={1.6}
                />
                <a
                  href="https://www.instagram.com/sb.cosm/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-pearl"
                >
                  @sb.cosm
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail
                  className="h-4 w-4 shrink-0 text-accent"
                  strokeWidth={1.6}
                />
                <a
                  href="mailto:sb.cosm@gmail.com"
                  className="hover:text-pearl"
                >
                  sb.cosm@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Working Hours (single line) & Copyright */}
        <div className="mt-3 flex flex-col items-start justify-between gap-1 border-t border-pearl/10 pt-3 text-xs text-pearl/55 sm:flex-row sm:items-center lg:mt-12 lg:gap-1.5 lg:pt-6">
          <p className="text-[11px] tracking-[0.04em] text-pearl/70 sm:text-xs">
            {t("footer.hours")}
          </p>
          <p className="text-[11px] text-pearl/50 sm:text-xs">
            © {new Date().getFullYear()} Sophie Bilynska Cosmetics®.{" "}
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
