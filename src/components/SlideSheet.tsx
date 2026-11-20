"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { LUXURY_EASE } from "./MotionPrimitives";

interface SlideSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function SlideSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: SlideSheetProps) {
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
            className="absolute inset-0 bg-ink/50 backdrop-blur-[4px]"
          />

          {/* Mobile Bottom Sheet / Desktop Right Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 36, opacity: 0 }}
            transition={{ duration: 0.34, ease: LUXURY_EASE }}
            className="fixed inset-x-0 bottom-0 flex max-h-[90dvh] flex-col rounded-t-[26px] border-t border-line bg-surface text-ink shadow-2xl lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-[460px] lg:rounded-none lg:border-l lg:border-t-0"
          >
            {/* Mobile grab bar */}
            <div className="flex justify-center pt-3 lg:hidden">
              <span className="h-1 w-10 rounded-full bg-line-strong" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-0.5 text-xs font-medium tracking-wide text-muted">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="btn-tactile flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-soft text-ink hover:border-ink hover:bg-ink hover:text-surface"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="atelier-scroll flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>

            {/* Optional Sticky Footer */}
            {footer && (
              <div className="border-t border-line bg-paper/75 px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                {footer}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
