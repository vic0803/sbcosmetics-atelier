"use client";

import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useState, type ReactNode } from "react";
import { LUXURY_EASE } from "./MotionPrimitives";

interface MobileCircularCarouselProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  prevLabel: string;
  nextLabel: string;
  theme?: "dark" | "light";
  arrowTopClass?: string;
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 72 : -72,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -72 : 72,
    opacity: 0,
    scale: 0.97,
  }),
};

export function MobileCircularCarousel<T>({
  items,
  getKey,
  renderItem,
  prevLabel,
  nextLabel,
  theme = "dark",
  arrowTopClass = "top-[36%]",
}: MobileCircularCarouselProps<T>) {
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  const total = items.length;

  if (total === 0) return null;

  const safeIndex = ((index % total) + total) % total;
  const currentItem = items[safeIndex];
  const isLight = theme === "light";

  const step = (delta: number) => {
    setPage(([curr]) => [((curr + delta) % total + total) % total, delta]);
  };

  const jumpTo = (target: number) => {
    if (target === safeIndex) return;
    setPage([target, target > safeIndex ? 1 : -1]);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -42 || info.velocity.x < -300) {
      step(1);
    } else if (info.offset.x > 42 || info.velocity.x > 300) {
      step(-1);
    }
  };

  const arrowColor = isLight
    ? "text-ink/45 hover:text-ink"
    : "text-pearl/60 hover:text-accent";

  return (
    <div className="mt-7 lg:hidden">
      {/* Centered Single-Card Circular Stage flanked by elongated hairline couture chevrons */}
      <div className="relative flex items-center justify-center px-9">
        {total > 1 && (
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={prevLabel}
            className={`btn-tactile absolute -left-1 ${arrowTopClass} z-20 flex h-20 w-10 -translate-y-1/2 items-center justify-center ${arrowColor}`}
          >
            <svg width="16" height="56" viewBox="0 0 16 56" fill="none" aria-hidden="true">
              <path
                d="M13 2L3 28L13 54"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Single Centered Draggable Card */}
        <div className="w-full max-w-[276px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={getKey(currentItem)}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: LUXURY_EASE }}
              drag={total > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.22}
              onDragEnd={handleDragEnd}
              className="cursor-grab touch-pan-y active:cursor-grabbing"
            >
              {renderItem(currentItem, safeIndex)}
            </motion.div>
          </AnimatePresence>
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={nextLabel}
            className={`btn-tactile absolute -right-1 ${arrowTopClass} z-20 flex h-20 w-10 -translate-y-1/2 items-center justify-center ${arrowColor}`}
          >
            <svg width="16" height="56" viewBox="0 0 16 56" fill="none" aria-hidden="true">
              <path
                d="M3 2L13 28L3 54"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Minimalist Progress Bar (clean counter + expanding gold progress pills) */}
      {total > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <span
            className={`text-[11px] font-bold tracking-[0.16em] tabular-nums ${
              isLight ? "text-muted" : "text-pearl/60"
            }`}
          >
            {String(safeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-1.5" role="tablist">
            {items.map((item, idx) => {
              const active = idx === safeIndex;
              return (
                <button
                  key={getKey(item)}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`${idx + 1} / ${total}`}
                  onClick={() => jumpTo(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active
                      ? "w-6 bg-accent"
                      : isLight
                        ? "w-1.5 bg-ink/20 hover:bg-ink/45"
                        : "w-1.5 bg-pearl/25 hover:bg-pearl/55"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
