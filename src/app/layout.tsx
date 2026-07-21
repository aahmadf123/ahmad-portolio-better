import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Figtree, JetBrains_Mono, Caveat } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { ChapterNav } from "@/components/layout/ChapterNav";
import { NowPlayingBar } from "@/components/layout/NowPlayingBar";
import { FootballEasterEgg } from "@/components/effects/FootballEasterEgg";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/data/site";

// Display: editorial serif for headlines and ghost numerals.
const displayFont = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Body: Figtree stands in for Satoshi (Fontshare download is manual — to swap,
// drop Satoshi-Variable.woff2 into src/app/fonts and switch this loader to
// next/font/local; every component reads var(--font-body).
const bodyFont = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const codeFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

const handFont = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmadfx.xyz"),
  title: {
    default: "Ahmad Firas — Agentic AI Engineer",
    template: "%s · Ahmad Firas",
  },
  icons: {
    icon: "/Images/optimized/favicon-192.png",
    shortcut: "/Images/optimized/favicon-192.png",
    apple: "/Images/optimized/favicon-512.png",
  },
  description:
    "Ahmad Firas — Agentic AI Engineer, Sports Analytics, Researcher. Building agentic AI, autonomous UAV systems, sports analytics, and production-grade ML infrastructure.",
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
    "Autonomous Systems",
  ],
  authors: [{ name: "Ahmad Firas" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://ahmadfx.xyz/",
    siteName: "Ahmad Firas",
    locale: "en_US",
    title: "Ahmad Firas — Agentic AI Engineer",
    description:
      "Building AI systems for uncertain environments: from UAV autonomy research to enterprise agentic workflows.",
    images: [{ url: "/Images/optimized/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Firas — Agentic AI Engineer",
    images: ["/Images/optimized/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0e12",
  colorScheme: "dark",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${bodyFont.variable} ${codeFont.variable} ${handFont.variable}`}
    >
      <body suppressHydrationWarning>
        <PostHogProvider>
        <a href="#hero" className="skip-link">
          Skip to main content
        </a>
        <MagneticCursor />
        <div id="scroll-bar" suppressHydrationWarning />
        <ViewTransition
          default="page-enter"
          enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'page-enter' }}
          exit={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'page-enter' }}
        >
          {children}
        </ViewTransition>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){window.addEventListener('scroll',function(){var p=window.scrollY/Math.max(1,document.body.scrollHeight-window.innerHeight);var b=document.getElementById('scroll-bar');if(b)b.style.transform='scaleX('+p+')';},{passive:true});})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <ChapterNav />
        <NowPlayingBar />
        <FootballEasterEgg />
        <ChatLauncher />
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
