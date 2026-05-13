import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  variable: "--font-chakra",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
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
    <html lang="en" className={chakraPetch.variable}>
      <body>
        <div id="scroll-bar" suppressHydrationWarning />
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
