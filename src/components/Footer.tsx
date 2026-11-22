"use client";

import { ArrowUpRight, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export function Footer() {
  const { t, lang, openOverlay } = useStore();

  return (
    <footer className="border-t border-surface/10 bg-ink text-pearl pb-safe-nav">
      <div className="mx-auto max-w-[1440px] px-5 pt-14 pb-12 sm:px-8 lg:px-12 lg:pt-20">
        {/* Magazine-scale full-width wordmark */}
        <div className="border-b border-pearl/12 pb-10 lg:pb-14">
          <Link
            href="/"
            className="block text-center font-display text-[clamp(2rem,8.4vw,7.4rem)] leading-[0.9] font-bold tracking-[0.06em] text-pearl uppercase transition-colors hover:text-accent"
          >
            Sophie Bilynska
          </Link>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
            <span>Botanical Skincare Atelier</span>
            <span>·</span>
            <span>{t("footer.city")}</span>
            <span>·</span>
            <a
              href="https://www.instagram.com/sb.cosm/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-pearl"
            >
              <Instagram className="h-3.5 w-3.5" />
              <span>@sb.cosm · 16.5K</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* 4 Clean Columns */}
        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
          <div>
            <p className="eyebrow text-accent">{t("footer.shop")}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-pearl/75">
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
              <li>
                <Link href="/catalog?category=sets" className="text-accent hover:text-pearl">
                  {t("common.sets")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-accent">{t("footer.brand")}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-pearl/75">
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
            <p className="eyebrow text-accent">
              {lang === "uk" ? "Клієнтам" : "Client Care"}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-pearl/75">
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
                <Link href="/checkout" className="hover:text-pearl">
                  {t("cart.checkout")}
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-pearl">
                  {lang === "uk" ? "Доставка Нова Пошта" : "Nova Poshta Delivery"}
                </Link>
              </li>
              <li className="text-xs text-pearl/50">
                {lang === "uk" ? "Безкоштовно від 2 000 ₴" : "Free from ₴2,000"}
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-accent">{t("footer.contact")}</p>
            <ul className="mt-4 space-y-3 text-sm text-pearl/75">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
                <a href="tel:+380631790642" className="hover:text-pearl">
                  +380 (63) 179-06-42
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
                <a href="mailto:sb.cosm@gmail.com" className="hover:text-pearl">
                  sb.cosm@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
                <span>{t("footer.city")}</span>
              </li>
              <li className="pt-0.5 text-xs leading-relaxed text-pearl/50">
                {t("footer.hours")}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Payment & Copyright Strip */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-pearl/10 pt-6 text-xs text-pearl/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Sophie Bilynska Cosmetics®. {t("footer.rights")}</p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold tracking-[0.12em] text-pearl/70 uppercase">
            <span>Нова Пошта</span>
            <span className="text-accent">·</span>
            <span>Apple Pay</span>
            <span className="text-accent">·</span>
            <span>Google Pay</span>
            <span className="text-accent">·</span>
            <span>Monobank</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
