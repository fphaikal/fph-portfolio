import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import Link from "next/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { ibrand, fontSans } from "@/config/fonts";
import { Sidebar } from "@/components/sidebar";
import FluidBackground from "@/components/ui/fluid-background";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "IZG0T7Kur6rnPfSLhdjXz-sYLqiE_tAK_jJ51-58VUE",
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
