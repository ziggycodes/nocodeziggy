import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — AI automation, n8n, Bubble, voice agents",
  description:
    "Guides on n8n lead generation, AI voice receptionists, and Bubble SaaS builds from NoCodeZiggy.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto w-full max-w-[800px] px-6 py-24 md:px-10 md:py-32">
      <Link
        href="/"
        className="mb-8 inline-block text-[13px] text-[var(--color-mid)] hover:text-[var(--color-accent)]"
      >
        ← Back to site
      </Link>
      <h1 className="mb-3 text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-tight">
        Build logs &amp; guides
      </h1>
      <p className="mb-12 max-w-[52ch] text-[16px] leading-relaxed text-[var(--color-mid)]">
        Written versions of what I ship on YouTube — n8n, AI agents, Bubble, and
        operator-grade automation.
      </p>
      <ul className="flex flex-col gap-6" role="list">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="border border-[var(--color-grid)] p-6 transition-colors hover:border-[color:rgb(143_176_214/0.40)]">
              <time
                dateTime={post.date}
                className="text-[12px] tracking-[0.04em] text-[var(--color-mid)]"
              >
                {post.date}
              </time>
              <h2 className="mt-2 text-[22px] font-medium leading-tight">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-mid)]">
                {post.description}
              </p>
              {post.tags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2" role="list">
                  {post.tags.map((t) => (
                    <li
                      key={t}
                      className="border border-[var(--color-grid)] px-2 py-0.5 text-[11px] text-[var(--color-mid)]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
