/** Build contact URL with pre-selected interest (works with Lenis + hash scroll). */
export function contactHref(interest?: string): string {
  if (!interest) return "/#contact";
  return `/?interest=${encodeURIComponent(interest)}#contact`;
}

/** Parse interest from current URL (search params or legacy hash). */
export function parseContactInterest(): string | null {
  if (typeof window === "undefined") return null;
  const fromSearch = new URLSearchParams(window.location.search).get("interest");
  if (fromSearch) return fromSearch;
  const hash = window.location.hash;
  const m = hash.match(/interest=([\w-]+)/);
  return m?.[1] ?? null;
}

export function scrollToContact(interest?: string) {
  if (typeof window === "undefined") return;
  if (interest) {
    const url = new URL(window.location.href);
    url.searchParams.set("interest", interest);
    url.hash = "contact";
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
  const el = document.getElementById("contact");
  if (!el) return;
  const lenis = (window as Window & { __lenis?: { scrollTo: (el: HTMLElement, opts: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -16, duration: 1.2 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
