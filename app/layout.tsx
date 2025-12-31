import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import Link from "next/link";
import clsx from "clsx";

import { Providers } from "./providers";
import StructuredData from "./structured-data";

import { siteConfig } from "@/config/site";
import { ibrand, fontSans } from "@/config/fonts";
import { Sidebar } from "@/components/sidebar";
import FluidBackground from "@/components/ui/fluid-background";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title, // Use the new title from config
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
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
    creator: "@fp_haikal", // Assuming this handle from Instagram/Github context, or generic
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
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={clsx(
          "min-h-screen font-sans antialiased",
          ibrand.variable,
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <StructuredData />
          <FluidBackground />
          <div className="flex w-full min-h-screen">
            <Sidebar />
            <main className="flex-1">
              <div className="container mx-auto max-w-7xl pt-16 px-6">
                {children}
                <footer className="w-full flex items-center justify-center py-3">
                  <Link
                    className="flex items-center gap-1 text-current"
                    href="/"
                    title="Home"
                  >
                    <span className="text-default-600">Made with ❤️ by</span>
                    <p className="text-primary">FPHaikal</p>
                  </Link>
                </footer>
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
