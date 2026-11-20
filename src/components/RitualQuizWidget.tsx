"use client";

import { ArrowLeft, BookmarkCheck, Check, RotateCcw, ShoppingBag, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  buildRitualRecommendation,
  QUIZ_STEPS,
  type QuizAnswers,
  type QuizExtra,
  type QuizGoal,
  type QuizIntensity,
  type QuizSkinType,
} from "@/data/quiz";
import { formatPrice } from "@/lib/format";
import { LUXURY_EASE } from "./MotionPrimitives";

const DEFAULT_ANSWERS: QuizAnswers = {
  skinType: "dry",
  goal: "hydration",
  intensity: "complete",
  extra: "none",
};

export function RitualQuizWidget() {
  const {
    lang,
    addMultipleProductsToCart,
    saveQuizResult,
    savedQuiz,
    openOverlay,
  } = useStore();

  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswers>(savedQuiz ?? DEFAULT_ANSWERS);

  const selectSkin = (val: QuizSkinType) => {
    setAnswers((a) => ({ ...a, skinType: val }));
    setStep(1);
  };

  const selectGoal = (val: QuizGoal) => {
    setAnswers((a) => ({ ...a, goal: val }));
    setStep(2);
  };

  const selectIntensity = (val: QuizIntensity) => {
    setAnswers((a) => ({ ...a, intensity: val }));
    setStep(3);
  };

  const selectExtra = (val: QuizExtra) => {
    const finalAnswers = { ...answers, extra: val };
    setAnswers(finalAnswers);
    setStep(4);
  };

  const recommendation = step === 4 ? buildRitualRecommendation(answers) : null;
  const progressPct = Math.min(100, (step / 4) * 100);

  return (
    <div className="mx-auto max-w-4xl">
      {step < 4 && (
        <div className="mb-7">
          <div className="flex items-center justify-between text-xs font-bold tracking-[0.16em] text-muted uppercase">
            <span>
              {step === 0 && QUIZ_STEPS.skinType.eyebrow[lang]}
              {step === 1 && QUIZ_STEPS.goal.eyebrow[lang]}
              {step === 2 && QUIZ_STEPS.intensity.eyebrow[lang]}
              {step === 3 && QUIZ_STEPS.extra.eyebrow[lang]}
            </span>
            <span className="text-accent-deep">{Math.round(progressPct + 25)}%</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${progressPct + 25}%` }}
              transition={{ duration: 0.45, ease: LUXURY_EASE }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="q0"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: LUXURY_EASE }}
          >
            <h2 className="font-display text-2xl leading-tight font-bold uppercase text-ink sm:text-4xl">
              {QUIZ_STEPS.skinType.question[lang]}
            </h2>
            <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
              {QUIZ_STEPS.skinType.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => selectSkin(opt.value)}
                  className={`btn-tactile flex flex-col items-start rounded-2xl border p-5 text-left transition-all sm:p-6 ${
                    answers.skinType === opt.value
                      ? "border-ink bg-ink text-surface"
                      : "border-line bg-surface text-ink hover:border-accent"
                  }`}
                >
                  <span className="font-display text-xl font-bold">
                    {opt.label[lang]}
                  </span>
                  <span
                    className={`mt-1.5 text-sm leading-relaxed ${
                      answers.skinType === opt.value ? "text-surface/75" : "text-muted"
                    }`}
                  >
                    {opt.hint[lang]}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="q1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: LUXURY_EASE }}
          >
            <button
              type="button"
              onClick={() => setStep(0)}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-muted uppercase hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{lang === "uk" ? "Назад" : "Back"}</span>
            </button>
            <h2 className="font-display text-2xl leading-tight font-bold uppercase text-ink sm:text-4xl">
              {QUIZ_STEPS.goal.question[lang]}
            </h2>
            <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
              {QUIZ_STEPS.goal.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => selectGoal(opt.value)}
                  className={`btn-tactile flex flex-col items-start rounded-2xl border p-5 text-left transition-all sm:p-6 ${
                    answers.goal === opt.value
                      ? "border-ink bg-ink text-surface"
                      : "border-line bg-surface text-ink hover:border-accent"
                  }`}
                >
                  <span className="font-display text-xl font-bold">
                    {opt.label[lang]}
                  </span>
                  <span
                    className={`mt-1.5 text-sm leading-relaxed ${
                      answers.goal === opt.value ? "text-surface/75" : "text-muted"
                    }`}
                  >
                    {opt.hint[lang]}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="q2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: LUXURY_EASE }}
          >
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-muted uppercase hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{lang === "uk" ? "Назад" : "Back"}</span>
            </button>
            <h2 className="font-display text-2xl leading-tight font-bold uppercase text-ink sm:text-4xl">
              {QUIZ_STEPS.intensity.question[lang]}
            </h2>
            <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
              {QUIZ_STEPS.intensity.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => selectIntensity(opt.value)}
                  className={`btn-tactile flex flex-col items-start rounded-2xl border p-6 text-left transition-all ${
                    answers.intensity === opt.value
                      ? "border-ink bg-ink text-surface"
                      : "border-line bg-surface text-ink hover:border-accent"
                  }`}
                >
                  <span className="font-display text-xl font-bold">
                    {opt.label[lang]}
                  </span>
                  <span
                    className={`mt-1.5 text-sm leading-relaxed ${
                      answers.intensity === opt.value ? "text-surface/75" : "text-muted"
                    }`}
                  >
                    {opt.hint[lang]}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="q3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: LUXURY_EASE }}
          >
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-muted uppercase hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{lang === "uk" ? "Назад" : "Back"}</span>
            </button>
            <h2 className="font-display text-2xl leading-tight font-bold uppercase text-ink sm:text-4xl">
              {QUIZ_STEPS.extra.question[lang]}
            </h2>
            <div className="mt-7 grid gap-3.5 sm:grid-cols-3">
              {QUIZ_STEPS.extra.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => selectExtra(opt.value)}
                  className={`btn-tactile flex flex-col items-start rounded-2xl border p-5 text-left transition-all sm:p-6 ${
                    answers.extra === opt.value
                      ? "border-ink bg-ink text-surface"
                      : "border-line bg-surface text-ink hover:border-accent"
                  }`}
                >
                  <span className="font-display text-lg font-bold">
                    {opt.label[lang]}
                  </span>
                  <span
                    className={`mt-1.5 text-xs leading-relaxed ${
                      answers.extra === opt.value ? "text-surface/75" : "text-muted"
                    }`}
                  >
                    {opt.hint[lang]}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && recommendation && (
          <motion.div
            key="q4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: LUXURY_EASE }}
            className="space-y-7"
          >
            <div className="rounded-3xl border border-accent/40 bg-ink p-6 text-surface sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1 text-[10px] font-bold tracking-[0.16em] text-ink uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  {lang === "uk"
                    ? "Персональний протокол готовий"
                    : "Your Protocol Is Ready"}
                </span>

                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-surface/70 uppercase hover:text-accent"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{lang === "uk" ? "Пройти заново" : "Retake Quiz"}</span>
                </button>
              </div>

              <h2 className="mt-4 font-display text-3xl leading-tight font-bold uppercase sm:text-4xl">
                {recommendation.title[lang]}
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-surface/75 sm:text-base">
                {recommendation.summary[lang]}
              </p>

              <div className="mt-7 flex flex-col items-start justify-between gap-5 border-t border-surface/15 pt-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                    {recommendation.steps.length}{" "}
                    {lang === "uk"
                      ? "засоби · −10% за промо SOPHIE10"
                      : "formulas · −10% with SOPHIE10"}
                  </p>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-display text-3xl font-bold text-surface">
                      {formatPrice(recommendation.bundlePrice, lang)}
                    </span>
                    <span className="text-sm text-surface/45 line-through">
                      {formatPrice(recommendation.totalPrice, lang)}
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      addMultipleProductsToCart(
                        recommendation.steps.map((s) => s.product.id),
                        lang === "uk"
                          ? "Увесь персональний ритуал додано в кошик!"
                          : "Your complete ritual has been added to bag!"
                      );
                      openOverlay("cart");
                    }}
                    className="btn-tactile inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-xs font-bold tracking-[0.16em] text-ink uppercase hover:bg-surface"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>
                      {lang === "uk" ? "Додати весь ритуал" : "Add Full Ritual"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => saveQuizResult(answers)}
                    className="btn-tactile inline-flex items-center justify-center gap-2 rounded-full border border-surface/30 px-5 py-4 text-xs font-bold tracking-[0.14em] text-surface uppercase hover:border-accent hover:text-accent"
                  >
                    <BookmarkCheck className="h-4 w-4" />
                    <span>{lang === "uk" ? "Зберегти" : "Save"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {recommendation.steps.map((item, idx) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 rounded-2xl border border-line bg-surface p-4"
                >
                  <Link
                    href={`/product/${item.product.id}`}
                    className="h-28 w-22 shrink-0 overflow-hidden rounded-xl border border-line"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name[lang]}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <span className="text-[10px] font-bold tracking-[0.14em] text-accent-deep uppercase">
                      0{idx + 1} · {item.slot[lang]}
                    </span>
                    <Link
                      href={`/product/${item.product.id}`}
                      className="mt-0.5 text-base leading-snug font-bold text-ink hover:text-accent-deep"
                    >
                      {item.product.line ? item.product.line[lang] : item.product.name[lang]}
                    </Link>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {item.reason[lang]}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2.5">
                      <span className="text-sm font-bold text-ink">
                        {formatPrice(item.product.price, lang)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-deep">
                        <Check className="h-3.5 w-3.5" />
                        {item.product.variants[0]?.label[lang]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
