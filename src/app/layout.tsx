import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Caveat } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { PostHogProvider } from "@/components/PostHogProvider";
import { MotionProvider } from "@/lib/motion/lazy";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { RouteTracker } from "@/components/ui/route-tracker";
import { OffscreenAnimationPauser } from "@/components/effects/OffscreenAnimationPauser";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/data/site";
import { THEME_SCRIPT } from "@/components/ui/theme-toggle";

// One typeface for everything a reader reads: DM Sans (variable, 400/500 used).
const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Code blocks only.
const codeFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

// Handwriting: only the sign-off (far down the homepage) and the easter egg use
// it, so don't preload it on every route.
const handFont = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmadfx.xyz"),
  title: {
    default: "Ahmad Firas - Agentic AI Engineer",
    template: "%s · Ahmad Firas",
  },
  description:
    "Ahmad Firas - Agentic AI Engineer, Sports Analytics, Researcher. Building agentic AI, autonomous UAV systems, sports analytics, and production-grade ML infrastructure.",
  keywords: [
    "Agentic AI",
    "AI Research",
    "Machine Learning",
    "Sports Analytics",
    "Computer Engineering",
    "UAV",
    "MLOps",
    "Reinforcement Learning",
    "Computer Vision",
    "Sports Technology",
  ],
  authors: [{ name: "Ahmad Firas", url: "https://ahmadfx.xyz" }],
  creator: "Ahmad Firas",
  publisher: "Ahmad Firas",
  category: "Technology",
  classification: "Artificial Intelligence, Machine Learning, Sports Analytics",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/Images/optimized/favicon-192.png",
    shortcut: "/Images/optimized/favicon-192.png",
    apple: "/Images/optimized/favicon-512.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: "https://ahmadfx.xyz/",
    siteName: "Ahmad Firas",
    locale: "en_US",
    title: "Ahmad Firas - Agentic AI Engineer",
    description:
      "Building AI systems for uncertain environments: from UAV autonomy research to enterprise agentic workflows.",
    images: [
      {
        url: "/Images/optimized/og.png",
        width: 1200,
        height: 630,
        alt: "Ahmad Firas - Agentic AI Engineer portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ahmadfirasazfar",
    title: "Ahmad Firas - Agentic AI Engineer",
    description:
      "Building AI systems for uncertain environments: from UAV autonomy research to enterprise agentic workflows.",
    images: ["/Images/optimized/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#121314" },
  ],
  colorScheme: "light dark",
  // Lets the existing env(safe-area-inset-*) rules (chat, now-playing bar)
  // take effect on notched phones; body pads the sides in landscape.
  viewportFit: "cover",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ahmad Firas",
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: "Agentic AI Engineer",
  worksFor: { "@type": "Organization", name: "First Solar" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Toledo" },
  address: { "@type": "PostalAddress", addressLocality: "Toledo", addressRegion: "OH" },
  sameAs: [site.socials.github, site.socials.linkedin],
  knowsAbout: [
    "Agentic AI",
    "Machine Learning",
    "Reinforcement Learning",
    "Computer Vision",
    "Sports Analytics",
    "MLOps",
    "UAV Autonomy",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ahmad Firas - Agentic AI Engineer",
  url: site.url,
  inLanguage: "en",
  author: { "@type": "Person", name: "Ahmad Firas" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${codeFont.variable} ${handFont.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <PostHogProvider>
        <MotionProvider>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <RevealObserver />
        <ViewTransition
          default="page-enter"
        >
          {children}
        </ViewTransition>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }}
        />
        <RouteTracker />
        <OffscreenAnimationPauser />
        <ChatLauncher />
        </MotionProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
