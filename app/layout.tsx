import type { Metadata, Viewport } from "next";
import { inter, jetbrains } from "@/lib/fonts";
import { profile } from "@/content/profile";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Nav } from "@/components/chrome/Nav";
import { Cursor } from "@/components/chrome/Cursor";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { BootSequence } from "@/components/chrome/BootSequence";
import { Footer } from "@/components/chrome/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NoCodeZiggy — AI Systems & Automation Architect",
    template: "%s · NoCodeZiggy",
  },
  description:
    "Operator-grade AI systems, n8n + Make automations, and Bubble SaaS builds. I design and ship the kind of leverage your team didn't know it was missing.",
  keywords: [
    "NoCodeZiggy",
    "AI automation",
    "AI agents",
    "n8n",
    "Make.com",
    "Bubble.io",
    "no-code",
    "workflow automation",
    "SaaS",
  ],
  authors: [{ name: profile.handle }],
  creator: profile.handle,
  metadataBase: new URL("https://nocodeziggy.com"),
  openGraph: {
    type: "website",
    title: "NoCodeZiggy — AI Systems & Automation Architect",
    description:
      "Operator-grade AI systems, n8n + Make automations, and Bubble SaaS builds.",
    siteName: "NoCodeZiggy",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nocodeziggy",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-[var(--color-void)] text-[var(--color-hi)] antialiased">
        <BootSequence />
        <SmoothScroll>
          <Cursor />
          <ScrollProgress />
          <Nav />
          <main id="content">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
