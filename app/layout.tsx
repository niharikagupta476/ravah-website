import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { PageViewTracker } from "@/components/PageViewTracker";
import { siteConfig, structuredData } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Ravah.ai | AI DevOps Copilot for Faster MTTR",
    template: "%s | Ravah.ai",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    title: "Ravah.ai",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Ravah.ai",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Ravah.ai",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravah.ai",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AnalyticsProvider />
        <PageViewTracker />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.organization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.website),
          }}
        />
      </body>
    </html>
  );
}
