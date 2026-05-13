import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmadfx.xyz"),
  title: "Ahmad Firas — AI Researcher & Engineer",
  description:
    "Ahmad Firas — AI Researcher, Microsoft Solution Developer. Building agentic AI, autonomous UAV systems, and production-grade ML infrastructure.",
  keywords: ["AI Research", "Machine Learning", "Computer Engineering", "UAV", "MLOps", "Agentic AI"],
  authors: [{ name: "Ahmad Firas" }],
  openGraph: {
    type: "website",
    url: "https://ahmadfx.xyz/",
    title: "Ahmad Firas — AI Researcher & Engineer",
    description:
      "Building AI systems for uncertain environments: from UAV autonomy research to enterprise agentic workflows.",
    images: [{ url: "/Images/portfolio_logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Firas — AI Researcher & Engineer",
    images: ["/Images/portfolio_logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${spaceMono.variable} ${fraunces.variable}`}>
      <body>
        <div id="scroll-bar" />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                window.addEventListener('scroll',function(){
                  var p=window.scrollY/Math.max(1,document.body.scrollHeight-window.innerHeight);
                  var b=document.getElementById('scroll-bar');
                  if(b)b.style.transform='scaleX('+p+')';
                },{passive:true});
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
