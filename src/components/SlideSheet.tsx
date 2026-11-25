"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { LUXURY_EASE } from "./MotionPrimitives";

interface SlideSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  surface?: "default" | "parchment";
  children: ReactNode;
  footer?: ReactNode;
}

export function SlideSheet({
  open,
  onClose,
  title,
  subtitle,
  surface = "default",
  children,
  footer,
}: SlideSheetProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const isParchment = surface === "parchment";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className={`absolute inset-0 ${
              isParchment
                ? "bg-ink/40 backdrop-blur-[3px]"
                : "bg-ink/50 backdrop-blur-[4px]"
            }`}
          />

          {/* Mobile Bottom Sheet / Desktop Right Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={
              isDesktop ? { x: 40, opacity: 0 } : { y: 40, opacity: 0 }
            }
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={
              isDesktop ? { x: 36, opacity: 0 } : { y: 36, opacity: 0 }
            }
            transition={{ duration: 0.34, ease: LUXURY_EASE }}
            className={`fixed inset-x-0 bottom-0 flex max-h-[90dvh] flex-col rounded-none text-ink lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-[460px] lg:border-t-0 ${
              isParchment
                ? "border-t border-parchment-line bg-parchment shadow-[0_0_40px_rgba(14,22,30,0.12)] lg:border-l"
                : "border-t border-line bg-surface shadow-2xl lg:border-l"
            }`}
          >
            {/* Mobile grab bar */}
            <div className="flex justify-center pt-3 lg:hidden">
              <span
                className={`w-10 rounded-none ${
                  isParchment
                    ? "h-[2px] bg-parchment-line"
                    : "h-[3px] bg-line-strong"
                }`}
              />
            </div>

            {/* Header */}
            <div
              className={`flex items-center justify-between gap-4 border-b px-6 ${
                isParchment
                  ? "border-parchment-line py-5"
                  : "border-line py-4"
              }`}
            >
              <div>
                <h2
                  className={`font-display text-ink uppercase ${
                    isParchment
                      ? "text-sm font-bold tracking-[0.16em]"
                      : "text-base font-semibold tracking-[0.14em]"
                  }`}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-0.5 text-xs font-normal tracking-wide text-muted tabular-nums">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className={
                  isParchment
                    ? "-mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-none text-ink/70 transition-colors hover:text-ink"
                    : "btn-tactile flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-line bg-surface-soft text-ink hover:border-ink hover:bg-ink hover:text-surface"
                }
              >
                <X className="h-4 w-4" strokeWidth={1.7} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="atelier-scroll flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>

            {/* Optional Sticky Footer */}
            {footer && (
              <div
                className={`border-t px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] ${
                  isParchment
                    ? "border-parchment-line bg-parchment"
                    : "border-line bg-paper/75"
                }`}
              >
                {footer}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
