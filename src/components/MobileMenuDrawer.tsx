"use client";

import { ArrowUpRight, Instagram, Send } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { SlideSheet } from "./SlideSheet";

export function MobileMenuDrawer() {
  const { activeOverlay, closeOverlay, t } = useStore();

  // Only secondary brand/info routes (Home, Catalog, Quiz, Account, Cart live in MobileBottomBar)
  const links = [
    { href: "/atelier", label: t("nav.atelier") },
    { href: "/journal", label: t("nav.journal") },
    { href: "/contacts", label: t("nav.contacts") },
  ];

  return (
    <SlideSheet
      open={activeOverlay === "menu"}
      onClose={closeOverlay}
      title={t("nav.menu")}
      footer={
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href="https://www.instagram.com/sb.cosm/"
            target="_blank"
            rel="noreferrer"
            className="btn-tactile group flex min-h-[44px] items-center justify-between rounded-none border border-line-strong bg-surface px-3.5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink uppercase transition-colors hover:border-ink hover:bg-ink hover:text-pearl"
          >
            <span className="inline-flex items-center gap-2">
              <Instagram
                className="h-3.5 w-3.5 text-accent"
                strokeWidth={1.7}
              />
              <span>Instagram</span>
            </span>
            <ArrowUpRight
              className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              strokeWidth={1.6}
            />
          </a>

          <a
            href="https://t.me/+380631790642"
            target="_blank"
            rel="noreferrer"
            className="btn-tactile group flex min-h-[44px] items-center justify-between rounded-none border border-line-strong bg-surface px-3.5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink uppercase transition-colors hover:border-ink hover:bg-ink hover:text-pearl"
          >
            <span className="inline-flex items-center gap-2">
              <Send className="h-3.5 w-3.5 text-accent" strokeWidth={1.7} />
              <span>Telegram</span>
            </span>
            <ArrowUpRight
              className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              strokeWidth={1.6}
            />
          </a>
        </div>
      }
    >
      <nav aria-label={t("nav.menu")} className="flex flex-col gap-1 py-1">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeOverlay}
            className="group flex items-center justify-between py-3.5 text-[17px] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:text-accent"
          >
            <span>{item.label}</span>
            <ArrowUpRight
              className="h-4 w-4 text-ink/35 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              strokeWidth={1.5}
            />
          </Link>
        ))}
      </nav>
    </SlideSheet>
  );
}
