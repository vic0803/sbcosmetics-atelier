# Sophie Bilynska Cosmetics — Atelier Storefront (`sbcosmetics-atelier`)

## Stack
- Next.js 15 App Router + React 19 + TypeScript (`strict: true`) + Tailwind CSS v4 + Lucide icons.
- Typography: Licensed local `Futura PT` (`src/fonts/FUTURAPT*.OTF`) + `Cormorant Garamond` editorial display serif (`src/fonts/CormorantGaramond*.ttf`).

## Brand & Design System
- **Brand spelling:** Always **Sophie Bilynska** (`@sb.cosm`, Lviv, Ukraine).
- **Palette:** Warm Travertine (`#F5F0E8`), Alabaster Surface (`#FBF8F3`), Deep Obsidian (`#12100E`), Charcoal Espresso (`#24201C`), Brushed Champagne Bronze (`#B58E58`).
- **Localization:** BCP 47 `"uk"` (default) and `"en"`.
- **Contacts:** `+380 (63) 179-06-42`, `sb.cosm@gmail.com`, Lviv, Ukraine, `Пн–Пт 9:00–21:00 · Сб 10:00–16:00 · Нд 10:00–14:00`.
- **Auth flow (Phase 1 UI / Phase 2 Backend):** Google & Apple OAuth only, followed by required email onboarding step before order/tracking access.
- **Asset paths:** Always use `assetPath()` from `src/lib/assets.ts`.

## Verification
```bash
npm run typecheck && npm run lint && npm run build
```
