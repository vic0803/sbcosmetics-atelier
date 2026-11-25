import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { StoreProvider } from "@/context/StoreContext";
import { assetPath } from "@/lib/assets";
import "./globals.css";

const futura = localFont({
  src: [
    { path: "../fonts/futura-pt-light.otf", weight: "300", style: "normal" },
    { path: "../fonts/futura-pt-book.otf", weight: "400", style: "normal" },
    { path: "../fonts/futura-pt-medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/futura-pt-demi.otf", weight: "600", style: "normal" },
    { path: "../fonts/futura-pt-bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-futura",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbcosmetics.com.ua"
  ),
  title: {
    default: "Sophie Bilynska Cosmetics — Botanical Skincare",
    template: "%s — Sophie Bilynska Cosmetics",
  },
  description:
    "Сертифікована натуральна косметика ручної роботи зі Львова. Створена сертифікованим технологом зі 100% еко-складників та прозорим INCI.",
  icons: {
    icon: [
      { url: assetPath("/favicon.svg"), type: "image/svg+xml" },
      { url: assetPath("/favicon.ico"), sizes: "48x48" },
    ],
    apple: assetPath("/apple-icon.png"),
  },
  openGraph: {
    type: "website",
    siteName: "Sophie Bilynska Cosmetics",
    title: "Sophie Bilynska Cosmetics — Botanical Skincare",
    description:
      "Чисті CO₂-екстракти, гіалуронова кислота та холоднопресовані олії малими партіями зі Львова.",
    images: [assetPath("/assets/editorial/campaign-giftset.jpg")],
  },
};

const LANG_BOOT_SCRIPT = `try{var l=localStorage.getItem("sb_atelier_lang");if(l==="en"){document.documentElement.lang="en";document.documentElement.dataset.langReady="pending";setTimeout(function(){delete document.documentElement.dataset.langReady;},1500);}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={futura.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
