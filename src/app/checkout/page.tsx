import type { Metadata } from "next";
import { CheckoutClient } from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Оформлення замовлення",
  description: "Оформлення замовлення Sophie Bilynska Cosmetics з доставкою Новою Поштою.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
