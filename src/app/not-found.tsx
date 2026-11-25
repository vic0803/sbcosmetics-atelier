import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="font-display text-[5.5rem] leading-none font-bold tracking-[-0.03em] text-accent sm:text-[6rem]">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl">
        Сторінку не знайдено
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Схоже, ця сторінка перемістилась або була видалена. Поверніться до каталогу Sophie Bilynska Cosmetics.
      </p>
      <Link
        href="/catalog"
        className="btn-tactile mt-7 rounded-none bg-ink px-7 py-3.5 text-xs font-bold tracking-[0.16em] text-pearl uppercase hover:bg-accent hover:text-ink"
      >
        Відкрити каталог
      </Link>
    </div>
  );
}
