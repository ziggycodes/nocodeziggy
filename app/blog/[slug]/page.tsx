import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { PostCta } from "@/components/blog/PostCta";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-[720px] px-6 py-24 md:px-10 md:py-32">
      <Link
        href="/blog"
        className="mb-8 inline-block text-[13px] text-[var(--color-mid)] hover:text-[var(--color-accent)]"
      >
        ← All posts
      </Link>
      <header className="mb-10">
        <time
          dateTime={post.date}
          className="text-[12px] tracking-[0.04em] text-[var(--color-mid)]"
        >
          {post.date}
        </time>
        <h1 className="mt-2 text-[clamp(2rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-mid)]">
          {post.description}
        </p>
      </header>

      {post.youtubeId && (
        <div className="mb-10 aspect-video w-full overflow-hidden border border-[var(--color-grid)] bg-[var(--color-void)]">
          <iframe
            title={post.title}
            src={`https://www.youtube.com/embed/${post.youtubeId}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="prose-blog">
        <Markdown>{post.content}</Markdown>
      </div>

      <PostCta />
    </article>
  );
}
