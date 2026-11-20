import type { Metadata } from "next";
import { ContactsClient } from "@/components/ContactsClient";

export const metadata: Metadata = {
  title: "Контакти та доставка",
  description:
    "Зв'язатися з Sophie Bilynska Cosmetics у Львові: +380 (63) 179-06-42, sb.cosm@gmail.com, доставка Новою Поштою.",
};

export default function ContactsPage() {
  return <ContactsClient />;
}
