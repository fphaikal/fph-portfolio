import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Blog by ${siteConfig.fullName}`,
  description: `Articles and technical notes written by ${siteConfig.fullName} (${siteConfig.name}) about web development, IT support, automation, and technology.`,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/blog`,
    title: `Blog by ${siteConfig.fullName}`,
    description: `Articles and technical notes by ${siteConfig.fullName}.`,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      {children}
    </section>
  );
}
