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
      <div className="flex min-h-screen flex-col">
        <ScrollProgressBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomBar />
        <MobileMenuDrawer />
        <CartDrawer />
        <AccountDrawer />
        <Toast />
      </div>
    </MotionConfig>
  );
}
