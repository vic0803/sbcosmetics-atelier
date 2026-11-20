"use client";

import { Sparkles } from "lucide-react";
import { RitualQuizWidget } from "@/components/RitualQuizWidget";
import { useStore } from "@/context/StoreContext";

export function QuizPageClient() {
  const { lang } = useStore();

  return (
    <div className="pt-28 pb-24 lg:pt-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow inline-flex items-center gap-2 text-bronze-dark">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {lang === "uk"
                ? "Персональний підбір технолога"
                : "Technologist Ritual Consultation"}
            </span>
          </p>
          <h1 className="mt-3 font-editorial text-4xl font-medium text-obsidian sm:text-6xl">
            {lang === "uk"
              ? "Створіть свій ритуал догляду"
              : "Build Your Personal Skincare Ritual"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-umber sm:text-base">
            {lang === "uk"
              ? "Відповідайте на 4 короткі запитання — підберемо узгоджені формули Sophie Bilynska саме для вашого стану шкіри."
              : "Answer 4 quick questions to receive a tailored Sophie Bilynska routine calibrated to your skin today."}
          </p>
        </div>

        <div className="mt-12 rounded-[32px] border border-sand bg-travertine/50 p-6 sm:p-10 lg:p-14">
          <RitualQuizWidget />
        </div>
      </div>
    </div>
  );
}
