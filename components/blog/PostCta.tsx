import Link from "next/link";
import { profile } from "@/content/profile";

export function PostCta() {
  return (
    <aside className="mt-12 border border-[var(--color-grid)] bg-[color:rgb(0_0_0/0.35)] p-6 md:p-8">
      <p className="mb-4 text-[15px] text-[var(--color-hi)]">
        Want this built for your business, or the n8n template to start?
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={profile.booking.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-[var(--color-accent)] px-5 py-3 text-[13px] font-medium text-[var(--color-void)] hover:brightness-110"
          style={{ boxShadow: "0 0 18px var(--color-accent-glow)" }}
        >
          {profile.booking.label} →
        </Link>
        <Link
          href="/#contact"
          className="inline-flex items-center justify-center border border-[var(--color-grid)] px-5 py-3 text-[13px] text-[var(--color-hi)] hover:border-[var(--color-hi)]"
        >
          Contact me
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-3 text-[13px] text-[var(--color-mid)] hover:text-[var(--color-accent)]"
        >
          Get the free template
        </Link>
      </div>
    </aside>
  );
}
