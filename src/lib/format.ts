export type Lang = "uk" | "en";

export function formatPrice(value: number, lang: Lang = "uk"): string {
  if (lang === "en") {
    return `₴${value.toLocaleString("en-US")}`;
  }
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0")}\u00A0₴`;
}
