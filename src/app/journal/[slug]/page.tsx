import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalArticleClient } from "@/components/JournalArticleClient";
import { getArticleBySlug, JOURNAL_ARTICLES } from "@/data/journal";

export function generateStaticParams() {
  return JOURNAL_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Статтю не знайдено" };
  return {
    title: article.title.uk,
    description: article.excerpt.uk,
    openGraph: { images: [article.cover] },
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return <JournalArticleClient article={article} />;
}
