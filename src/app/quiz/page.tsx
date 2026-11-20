import type { Metadata } from "next";
import { QuizPageClient } from "@/components/QuizPageClient";

export const metadata: Metadata = {
  title: "Підбір догляду за шкірою",
  description:
    "Інтерактивний підбір персонального ритуалу Sophie Bilynska Cosmetics за 30 секунд.",
};

export default function QuizPage() {
  return <QuizPageClient />;
}
