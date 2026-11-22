"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { SlideSheet } from "./SlideSheet";

export function MobileMenuDrawer() {
  const { activeOverlay, closeOverlay, t, lang, setLang } = useStore();

  const links = [
    { href: "/", label: t("nav.home"), num: "01" },
    { href: "/catalog", label: t("nav.catalog"), num: "02" },
    { href: "/quiz", label: t("nav.quiz"), num: "03", highlight: true },
    { href: "/atelier", label: t("nav.atelier"), num: "04" },
    { href: "/journal", label: t("nav.journal"), num: "05" },
    { href: "/contacts", label: t("nav.contacts"), num: "06" },
  ];

  return (
    <SlideSheet
      open={activeOverlay === "menu"}
      onClose={closeOverlay}
      title="Sophie Bilynska"
      subtitle="Botanical Skincare Atelier · Lviv"
      footer={
        <div className="flex items-center justify-between gap-4">
          <a
            href="https://www.instagram.com/sb.cosm/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.14em] text-ink uppercase hover:text-accent"
          >
            <span>Instagram @sb.cosm</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center rounded-full border border-line bg-surface p-0.5 text-xs">
            {(["uk", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`rounded-full px-3 py-1 font-medium uppercase ${
                  lang === code
                    ? "bg-ink text-pearl"
                    : "text-muted hover:text-ink"
                }`}
              >
                {code === "uk" ? "UA" : "EN"}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <nav className="flex flex-col divide-y divide-line/80">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeOverlay}
            className="group flex items-center justify-between py-4 text-ink transition-colors hover:text-accent"
          >
            <div className="flex items-center gap-3.5">
              <span className="text-[11px] font-medium tracking-[0.18em] text-muted">
                {item.num}
              </span>
              <span className="font-display font-bold tracking-[-0.02em] text-2xl">
                {item.label}
              </span>
              {item.highlight && (
                <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.6} />
              )}
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          </Link>
        ))}
      </nav>

      <div className="mt-6 rounded-2xl border border-line bg-paper/70 p-4 text-xs leading-relaxed text-muted">
        <p className="font-medium text-ink">+380 (63) 179-06-42</p>
        <p className="mt-1">sb.cosm@gmail.com · {t("footer.city")}</p>
        <p className="mt-1">{t("footer.hours")}</p>
      </div>
    </SlideSheet>
  );
}
