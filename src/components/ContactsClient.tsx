"use client";

import { Clock, Instagram, Mail, MapPin, Phone, Send, Truck } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

export function ContactsClient() {
  const { lang, showToast } = useStore();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;
    setSent(true);
    setName("");
    setContact("");
    setMessage("");
    showToast(
      lang === "uk"
        ? "Повідомлення надіслано · відповімо найближчим часом"
        : "Message sent · we'll respond shortly"
    );
  };

  return (
    <div className="pt-24 pb-24 lg:pt-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="eyebrow text-bronze-dark">
            {lang === "uk" ? "Зв'язок та доставка" : "Concierge & Delivery"}
          </p>
          <h1 className="mt-2 font-editorial text-5xl font-medium text-obsidian sm:text-6xl">
            {lang === "uk" ? "Контакти ательє" : "Atelier Concierge"}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-umber">
            {lang === "uk"
              ? "Допоможемо підібрати догляд під ваш тип шкіри, відповімо щодо замовлення або порадимо подарунковий набір."
              : "Need help choosing a routine, checking an order, or selecting a gift set? Reach our Lviv atelier directly."}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Left: Direct Contacts + Nova Poshta Info */}
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-3xl border border-sand bg-alabaster p-7">
              <p className="eyebrow text-bronze-dark">
                {lang === "uk" ? "Прямий зв'язок" : "Direct Lines"}
              </p>

              <ul className="mt-5 space-y-4 text-sm text-espresso">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" />
                  <div>
                    <a
                      href="tel:+380631790642"
                      className="text-base font-medium text-obsidian hover:text-bronze-dark"
                    >
                      +380 (63) 179-06-42
                    </a>
                    <p className="text-xs text-umber">Telegram · Viber · WhatsApp</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" />
                  <a
                    href="mailto:sb.cosm@gmail.com"
                    className="font-medium text-obsidian hover:text-bronze-dark"
                  >
                    sb.cosm@gmail.com
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" />
                  <a
                    href="https://www.instagram.com/sb.cosm/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-obsidian hover:text-bronze-dark"
                  >
                    @sb.cosm (Instagram Direct)
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" />
                  <span>{lang === "uk" ? "Львів, Україна" : "Lviv, Ukraine"}</span>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" />
                  <span>
                    {lang === "uk"
                      ? "Пн–Пт 9:00–21:00 · Сб 10:00–16:00 · Нд 10:00–14:00"
                      : "Mon–Fri 9:00–21:00 · Sat 10:00–16:00 · Sun 10:00–14:00"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-sand bg-obsidian p-7 text-pearl">
              <div className="flex items-center gap-2.5 text-bronze-light">
                <Truck className="h-5 w-5" strokeWidth={1.5} />
                <span className="eyebrow">
                  {lang === "uk" ? "Доставка та оплата" : "Shipping & Payment"}
                </span>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-pearl/78">
                <li>
                  •{" "}
                  {lang === "uk"
                    ? "Нова Пошта: відділення, поштомат або адресний кур'єр по всій Україні (1–2 дні)."
                    : "Nova Poshta: branch, locker, or courier across Ukraine (1–2 days)."}
                </li>
                <li>
                  •{" "}
                  {lang === "uk"
                    ? "Безкоштовна доставка при замовленні від 2 000 ₴."
                    : "Complimentary delivery on orders from ₴2,000."}
                </li>
                <li>
                  •{" "}
                  {lang === "uk"
                    ? "Онлайн-оплата карткою / Apple Pay / Monobank або післяплата."
                    : "Online card / Apple Pay / Monobank or pay on pickup."}
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Consultation Form */}
          <div className="rounded-3xl border border-sand bg-alabaster p-7 sm:p-10 lg:col-span-7">
            <p className="eyebrow text-bronze-dark">
              {lang === "uk" ? "Запитати технолога" : "Ask Our Technologist"}
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium text-obsidian">
              {lang === "uk" ? "Напишіть нам" : "Send Us a Note"}
            </h2>

            {sent ? (
              <div className="mt-8 rounded-2xl border border-sage/30 bg-sage/10 p-6 text-sm text-espresso">
                <p className="font-medium text-obsidian">
                  {lang === "uk"
                    ? "Дякуємо! Ваше повідомлення отримано."
                    : "Thank you! Your message has been received."}
                </p>
                <p className="mt-1 text-umber">
                  {lang === "uk"
                    ? "Ми відповімо вам у робочі години за вказаним контактом."
                    : "We will reply during atelier hours via your preferred contact."}
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-4 text-xs font-medium tracking-[0.14em] text-obsidian uppercase underline"
                >
                  {lang === "uk" ? "Надіслати ще одне" : "Send another"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-xs font-medium text-espresso"
                    >
                      {lang === "uk" ? "Ваше ім'я" : "Your Name"}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === "uk" ? "Софія" : "Sophie"}
                      className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-way"
                      className="mb-1.5 block text-xs font-medium text-espresso"
                    >
                      {lang === "uk" ? "Email або Telegram / Телефон" : "Email or Phone / Telegram"}
                    </label>
                    <input
                      id="contact-way"
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="+380... / email"
                      className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-msg"
                    className="mb-1.5 block text-xs font-medium text-espresso"
                  >
                    {lang === "uk" ? "Ваше запитання" : "Your Message"}
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      lang === "uk"
                        ? "Розкажіть про вашу шкіру або запитання щодо замовлення..."
                        : "Tell us about your skin or your question..."
                    }
                    className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-tactile inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-obsidian px-8 py-3.5 text-xs font-medium tracking-[0.16em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
                >
                  <Send className="h-4 w-4" />
                  <span>{lang === "uk" ? "Надіслати" : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
