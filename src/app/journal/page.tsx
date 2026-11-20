import type { Metadata } from "next";
import { JournalListClient } from "@/components/JournalListClient";

export const metadata: Metadata = {
  title: "Журнал ательє",
  description:
    "Нотатки сертифікованого технолога Sophie Bilynska про догляд за шкірою, CO₂-екстракти та бар'єр шкіри.",
};

export default function JournalPage() {
  return <JournalListClient />;
}
