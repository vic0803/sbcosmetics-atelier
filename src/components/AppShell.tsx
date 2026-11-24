"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { AccountDrawer } from "./AccountDrawer";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileBottomBar } from "./MobileBottomBar";
import { MobileMenuDrawer } from "./MobileMenuDrawer";
import { ScrollProgressBar } from "./MotionPrimitives";
import { Toast } from "./Toast";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgressBar />
      <Header />
      <div className="grid min-h-screen grid-cols-1 grid-rows-[1fr_auto]">
        <main className="min-w-0">{children}</main>
        <Footer />
      </div>
      <MobileBottomBar />
      <MobileMenuDrawer />
      <CartDrawer />
      <AccountDrawer />
      <Toast />
    </MotionConfig>
  );
}
