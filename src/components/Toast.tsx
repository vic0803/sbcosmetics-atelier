"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "@/context/StoreContext";
import { LUXURY_EASE } from "./MotionPrimitives";

export function Toast() {
  const { toastMessage } = useStore();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-24 z-[85] flex justify-center lg:bottom-8"
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.28, ease: LUXURY_EASE }}
            className="flex items-center gap-2.5 rounded-full border border-accent/40 bg-ink px-5 py-3 text-sm font-medium text-surface shadow-2xl"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-ink">
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
