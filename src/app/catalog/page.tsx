import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";

export const metadata: Metadata = {
  title: "Каталог догляду",
  description:
    "Сертифікована натуральна косметика Sophie Bilynska для обличчя, тіла та волосся.",
};

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-5 pt-32 pb-24 text-sm text-umber">
          Loading collection…
        </div>
      }
    >
      <CatalogClient />
    </Suspense>
  );
}
