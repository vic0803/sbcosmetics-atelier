import type { Metadata } from "next";
import { AtelierClient } from "@/components/AtelierClient";

export const metadata: Metadata = {
  title: "Ательє та філософія бренду",
  description:
    "Історія Sophie Bilynska Cosmetics: сертифікований технолог, 100% еко-складники та малі партії у Львові.",
};

export default function AtelierPage() {
  return <AtelierClient />;
}
