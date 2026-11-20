"use client";

import { ArrowUpRight, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { assetPath } from "@/lib/assets";

export function Footer() {
  const { t, lang } = useStore();

  return (
    <footer className="border-t border-pearl/10 bg-obsidian text-pearl pb-safe-nav">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3.5">
              <img
                src={assetPath("/assets/logo/monogram-white.png")}
                alt="Sophie Bilynska"
                className="h-11 w-11 object-contain"
              />
              <div>
                <p className="font-editorial text-2xl font-medium tracking-wide text-pearl">
                  Sophie Bilynska
                </p>
                <p className="text-[10px] font-medium tracking-[0.28em] text-bronze-light uppercase">
                  Cosmetics Atelier · Lviv
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-pearl/70">
              {t("footer.tagline")}
            </p>

            <a
              href="https://www.instagram.com/sb.cosm/"
              target="_blank"
              rel="noreferrer"
              className="btn-tactile mt-6 inline-flex items-center gap-2.5 rounded-full border border-bronze/40 bg-bronze/10 px-5 py-2.5 text-xs font-medium tracking-[0.16em] text-bronze-light uppercase hover:border-bronze hover:bg-bronze hover:text-obsidian"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.6} />
              <span>@sb.cosm · 16.5K</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Shop Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="eyebrow text-bronze-light">{t("footer.shop")}</p>
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
                  <Link href="/quiz" className="text-bronze-light hover:text-pearl">
                    {t("nav.quiz")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="eyebrow text-bronze-light">{t("footer.brand")}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-pearl/75">
                <li>
                  <Link href="/atelier" className="hover:text-pearl">
                    {t("nav.atelier")}
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
                <li>
                  <Link href="/checkout" className="hover:text-pearl">
                    {t("cart.checkout")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow text-bronze-light">{t("footer.contact")}</p>
              <ul className="mt-4 space-y-3 text-sm text-pearl/75">
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-bronze" strokeWidth={1.5} />
                  <a href="tel:+380631790642" className="hover:text-pearl">
                    +380 (63) 179-06-42
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-bronze" strokeWidth={1.5} />
                  <a href="mailto:sb.cosm@gmail.com" className="hover:text-pearl">
                    sb.cosm@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze" strokeWidth={1.5} />
                  <span>{t("footer.city")}</span>
                </li>
                <li className="pt-1 text-xs leading-relaxed text-pearl/55">
                  {t("footer.hours")}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-pearl/10 pt-6 text-xs text-pearl/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Sophie Bilynska Cosmetics®. {t("footer.rights")}</p>
          <p>Novа Poshta · Apple Pay · Google Pay · Monobank Ready</p>
        </div>
      </div>
    </footer>
  );
}
