import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import Script from "next/script";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { ibrand, fontMono, fontSans, fontSerif } from "@/config/fonts";
import { Footer } from "@/components/deck/footer";
import { Nav } from "@/components/deck/nav";
import { ScrollProgress } from "@/components/deck/scroll-progress";
import { VoiceAssistant } from "@/components/deck/voice-assistant";

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-F3Z55Y6Y59";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "IZG0T7Kur6rnPfSLhdjXz-sYLqiE_tAK_jJ51-58VUE",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#06080f" },
    { media: "(prefers-color-scheme: dark)", color: "#06080f" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="dark" lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>

      <body
        className={clsx(
          "min-h-screen bg-[#06080f] font-sans text-foreground antialiased",
          ibrand.variable,
          fontSans.variable,
          fontSerif.variable,
          fontMono.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <a className="skip-link" href="#content">
            Skip to content
          </a>

          <ScrollProgress />
          <Nav />

          <main className="relative z-10" id="content" tabIndex={-1}>
            {children}
          </main>

          <Footer />
          <VoiceAssistant />
        </Providers>
      </body>
    </html>
  );
}
