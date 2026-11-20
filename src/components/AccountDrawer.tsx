"use client";

import {
  CheckCircle2,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/data/products";
import { buildRitualRecommendation } from "@/data/quiz";
import { formatPrice } from "@/lib/format";
import { SlideSheet } from "./SlideSheet";

type AccountTab = "ritual" | "orders" | "wishlist" | "profile";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

export function AccountDrawer() {
  const {
    activeOverlay,
    closeOverlay,
    lang,
    t,
    user,
    pendingProvider,
    startOAuthLogin,
    completeEmailOnboarding,
    updateProfileDelivery,
    logout,
    savedQuiz,
    orders,
    wishlist,
    addProductToCart,
    addMultipleProductsToCart,
    toggleWishlist,
    openOverlay,
  } = useStore();

  const [tab, setTab] = useState<AccountTab>("ritual");
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [emailError, setEmailError] = useState("");

  const [cityEdit, setCityEdit] = useState(user?.city ?? "Львів");
  const [branchEdit, setBranchEdit] = useState(user?.npBranch ?? "Відділення №12");
  const [phoneEdit, setPhoneEdit] = useState(user?.phone ?? "");

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = emailInput.trim();
    if (!cleaned || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      setEmailError(
        lang === "uk"
          ? "Вкажіть коректну адресу електронної пошти"
          : "Please enter a valid email address"
      );
      return;
    }
    setEmailError("");
    completeEmailOnboarding({
      name: nameInput,
      email: cleaned,
      phone: phoneInput,
    });
  };

  const savedRecommendation = savedQuiz ? buildRitualRecommendation(savedQuiz) : null;

  return (
    <SlideSheet
      open={activeOverlay === "account"}
      onClose={closeOverlay}
      title={user ? user.name : t("auth.title")}
      subtitle={
        user
          ? `${user.email} · ${user.provider === "apple" ? "Apple ID" : "Google"}`
          : "Sophie Bilynska Atelier Club"
      }
      footer={
        user ? (
          <button
            type="button"
            onClick={logout}
            className="btn-tactile flex w-full items-center justify-center gap-2 rounded-full border border-sand-dark bg-alabaster px-4 py-3 text-xs font-medium tracking-[0.14em] text-obsidian uppercase hover:border-obsidian"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{t("auth.logout")}</span>
          </button>
        ) : undefined
      }
    >
      {/* STEP 1: Unauthenticated -> Exclusively Apple & Google OAuth */}
      {!user && !pendingProvider && (
        <div className="space-y-6 py-2">
          <div className="rounded-2xl border border-sand bg-travertine/70 p-5">
            <p className="eyebrow text-bronze-dark">Atelier Membership</p>
            <p className="mt-2 text-sm leading-relaxed text-espresso">
              {t("auth.subtitle")}
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => startOAuthLogin("apple")}
              className="btn-tactile flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-obsidian px-6 py-3.5 text-sm font-medium text-pearl hover:bg-espresso"
            >
              <AppleIcon />
              <span>{t("auth.apple")}</span>
            </button>

            <button
              type="button"
              onClick={() => startOAuthLogin("google")}
              className="btn-tactile flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full border border-sand-dark bg-white px-6 py-3.5 text-sm font-medium text-obsidian hover:border-obsidian"
            >
              <GoogleIcon />
              <span>{t("auth.google")}</span>
            </button>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-sand/80 bg-alabaster p-4 text-xs leading-relaxed text-umber">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" strokeWidth={1.6} />
            <p>{t("auth.note")}</p>
          </div>

          {/* Preview perks */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              {
                icon: Sparkles,
                title: lang === "uk" ? "Профіль шкіри" : "Skin Profile",
                desc: lang === "uk" ? "Збережений ритуал з квизу" : "Saved quiz routine",
              },
              {
                icon: Package,
                title: lang === "uk" ? "ТТН Нової Пошти" : "NP Tracking",
                desc: lang === "uk" ? "Історія та статуси" : "Live order history",
              },
            ].map((perk) => (
              <div
                key={perk.title}
                className="rounded-2xl border border-sand bg-travertine/40 p-4"
              >
                <perk.icon className="h-4 w-4 text-bronze-dark" strokeWidth={1.6} />
                <p className="mt-2 text-xs font-medium text-obsidian">{perk.title}</p>
                <p className="mt-0.5 text-[11px] text-umber">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Mandatory Email Completion after Apple / Google */}
      {!user && pendingProvider && (
        <form onSubmit={handleCompleteOnboarding} className="space-y-5 py-2">
          <div className="flex items-center gap-2.5 rounded-full border border-sage/30 bg-sage/10 px-4 py-2 text-xs font-medium text-sage">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              {pendingProvider === "apple"
                ? lang === "uk"
                  ? "Apple ID підключено · Крок 2 з 2"
                  : "Apple ID connected · Step 2 of 2"
                : lang === "uk"
                  ? "Google акаунт підключено · Крок 2 з 2"
                  : "Google connected · Step 2 of 2"}
            </span>
          </div>

          <div>
            <h3 className="font-editorial text-2xl font-medium text-obsidian">
              {t("auth.emailTitle")}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-umber">
              {t("auth.emailSubtitle")}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="onboarding-name"
                className="mb-1.5 block text-xs font-medium tracking-wide text-espresso"
              >
                {t("auth.nameLabel")}
              </label>
              <input
                id="onboarding-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={lang === "uk" ? "Олена Коваленко" : "Olena Kovalenko"}
                className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian placeholder:text-umber/60 focus:border-bronze"
              />
            </div>

            <div>
              <label
                htmlFor="onboarding-email"
                className="mb-1.5 block text-xs font-medium tracking-wide text-espresso"
              >
                {t("auth.emailLabel")} *
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-umber" />
                <input
                  id="onboarding-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-sand bg-travertine/60 py-3 pl-10 pr-4 text-base text-obsidian placeholder:text-umber/60 focus:border-bronze"
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-xs text-red-700">{emailError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="onboarding-phone"
                className="mb-1.5 block text-xs font-medium tracking-wide text-espresso"
              >
                {t("auth.phoneLabel")}
              </label>
              <input
                id="onboarding-phone"
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+380 (__) ___-__-__"
                className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-3 text-base text-obsidian placeholder:text-umber/60 focus:border-bronze"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-tactile w-full rounded-full bg-obsidian px-6 py-4 text-xs font-medium tracking-[0.16em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
          >
            {t("auth.completeBtn")}
          </button>
        </form>
      )}

      {/* STEP 3: Authenticated Cabinet */}
      {user && (
        <div className="space-y-5">
          {/* Tabs */}
          <div className="grid grid-cols-4 gap-1 rounded-full border border-sand bg-travertine p-1 text-[11px] font-medium">
            {(
              [
                { id: "ritual", label: t("account.tabRitual") },
                { id: "orders", label: t("account.tabOrders") },
                { id: "wishlist", label: t("account.tabWishlist") },
                { id: "profile", label: t("account.tabProfile") },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-2 py-2 transition-colors ${
                  tab === item.id
                    ? "bg-obsidian text-pearl"
                    : "text-umber hover:text-obsidian"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Tab: My Ritual */}
          {tab === "ritual" && (
            <div className="space-y-4">
              {savedRecommendation ? (
                <>
                  <div className="rounded-2xl border border-bronze/35 bg-travertine/80 p-4">
                    <p className="eyebrow text-bronze-dark">
                      {lang === "uk" ? "Збережений протокол" : "Saved Protocol"}
                    </p>
                    <h3 className="mt-1 font-editorial text-2xl font-medium text-obsidian">
                      {savedRecommendation.title[lang]}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-umber">
                      {savedRecommendation.summary[lang]}
                    </p>
                  </div>

                  <ul className="space-y-2.5">
                    {savedRecommendation.steps.map((s) => (
                      <li
                        key={s.product.id}
                        className="flex items-center gap-3 rounded-xl border border-sand bg-alabaster p-3"
                      >
                        <img
                          src={s.product.image}
                          alt={s.product.name[lang]}
                          className="h-14 w-11 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-medium tracking-[0.14em] text-bronze-dark uppercase">
                            {s.slot[lang]}
                          </p>
                          <p className="truncate font-editorial text-base font-medium text-obsidian">
                            {s.product.line ? s.product.line[lang] : s.product.name[lang]}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-obsidian">
                          {formatPrice(s.product.price, lang)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      addMultipleProductsToCart(
                        savedRecommendation.steps.map((s) => s.product.id)
                      );
                      openOverlay("cart");
                    }}
                    className="btn-tactile w-full rounded-full bg-obsidian px-5 py-3.5 text-xs font-medium tracking-[0.16em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
                  >
                    {lang === "uk" ? "Додати весь ритуал у кошик" : "Add Full Ritual to Bag"}
                  </button>
                </>
              ) : (
                <div className="rounded-2xl border border-sand bg-travertine/60 p-6 text-center">
                  <Sparkles className="mx-auto h-6 w-6 text-bronze-dark" strokeWidth={1.5} />
                  <p className="mt-3 font-editorial text-xl font-medium text-obsidian">
                    {lang === "uk"
                      ? "Ще немає збереженого ритуалу"
                      : "No saved ritual yet"}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-umber">
                    {lang === "uk"
                      ? "Пройдіть 30-секундний підбір — формули автоматично збережуться тут."
                      : "Take our 30-second Ritual Finder to save your tailored routine here."}
                  </p>
                  <Link
                    href="/quiz"
                    onClick={closeOverlay}
                    className="btn-tactile mt-4 inline-flex items-center gap-2 rounded-full bg-obsidian px-5 py-3 text-xs font-medium tracking-[0.16em] text-pearl uppercase"
                  >
                    {t("home.quizCta")}
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Tab: Orders */}
          {tab === "orders" && (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-sand bg-travertine/55 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold tracking-wide text-obsidian">
                      {order.id}
                    </span>
                    <span className="rounded-full bg-obsidian/90 px-2.5 py-0.5 text-[10px] font-medium tracking-[0.12em] text-bronze-light uppercase">
                      {order.status === "delivered"
                        ? lang === "uk"
                          ? "Доставлено"
                          : "Delivered"
                        : lang === "uk"
                          ? "В обробці"
                          : "Processing"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-espresso">
                    {order.itemsSummary}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-sand pt-2.5 text-[11px] text-umber">
                    <span>
                      {order.date} · НП {order.trackingNumber}
                    </span>
                    <span className="font-medium text-obsidian">
                      {formatPrice(order.total, lang)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Wishlist */}
          {tab === "wishlist" && (
            <div className="space-y-3">
              {wishlist.length === 0 ? (
                <div className="rounded-2xl border border-sand bg-travertine/60 p-6 text-center">
                  <Heart className="mx-auto h-6 w-6 text-umber" strokeWidth={1.4} />
                  <p className="mt-2 text-sm text-umber">
                    {lang === "uk"
                      ? "Натисніть сердечко на будь-якому засобі, щоб зберегти його тут."
                      : "Tap the heart on any formula to save it here."}
                  </p>
                </div>
              ) : (
                wishlist.map((pid) => {
                  const p = getProductById(pid);
                  if (!p) return null;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-2xl border border-sand bg-travertine/50 p-3"
                    >
                      <img
                        src={p.image}
                        alt={p.name[lang]}
                        className="h-16 w-12 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${p.id}`}
                          onClick={closeOverlay}
                          className="block truncate font-editorial text-base font-medium text-obsidian hover:text-bronze-dark"
                        >
                          {p.line ? p.line[lang] : p.name[lang]}
                        </Link>
                        <p className="text-xs text-umber">
                          {formatPrice(p.price, lang)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addProductToCart(p.id, 1, 0)}
                        className="btn-tactile rounded-full bg-obsidian px-3 py-2 text-[11px] font-medium tracking-[0.12em] text-pearl uppercase"
                      >
                        + {t("common.quickAdd")}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(p.id)}
                        aria-label="Remove"
                        className="p-2 text-umber hover:text-obsidian"
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab: Profile */}
          {tab === "profile" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfileDelivery(cityEdit, branchEdit, phoneEdit);
              }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-sand bg-travertine/60 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-obsidian text-bronze-light">
                  <UserIcon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-obsidian">{user.name}</p>
                  <p className="truncate text-xs text-umber">{user.email}</p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="prof-city"
                  className="mb-1 block text-xs font-medium text-espresso"
                >
                  <MapPin className="mr-1 inline h-3.5 w-3.5 text-bronze-dark" />
                  {lang === "uk" ? "Місто (Нова Пошта)" : "City (Nova Poshta)"}
                </label>
                <input
                  id="prof-city"
                  type="text"
                  value={cityEdit}
                  onChange={(e) => setCityEdit(e.target.value)}
                  className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-2.5 text-base text-obsidian"
                />
              </div>

              <div>
                <label
                  htmlFor="prof-branch"
                  className="mb-1 block text-xs font-medium text-espresso"
                >
                  {lang === "uk" ? "Відділення / Поштомат" : "Branch / Locker"}
                </label>
                <input
                  id="prof-branch"
                  type="text"
                  value={branchEdit}
                  onChange={(e) => setBranchEdit(e.target.value)}
                  className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-2.5 text-base text-obsidian"
                />
              </div>

              <div>
                <label
                  htmlFor="prof-phone"
                  className="mb-1 block text-xs font-medium text-espresso"
                >
                  {lang === "uk" ? "Телефон" : "Phone"}
                </label>
                <input
                  id="prof-phone"
                  type="tel"
                  value={phoneEdit}
                  onChange={(e) => setPhoneEdit(e.target.value)}
                  className="w-full rounded-xl border border-sand bg-travertine/60 px-4 py-2.5 text-base text-obsidian"
                />
              </div>

              <button
                type="submit"
                className="btn-tactile w-full rounded-full bg-obsidian px-5 py-3.5 text-xs font-medium tracking-[0.16em] text-pearl uppercase hover:bg-bronze hover:text-obsidian"
              >
                {t("common.save")}
              </button>
            </form>
          )}
        </div>
      )}
    </SlideSheet>
  );
}
