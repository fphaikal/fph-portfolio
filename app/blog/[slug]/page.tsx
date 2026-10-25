import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import MarkdownRenderer from "@/components/blog/markdown-renderer";
import ViewTracker from "@/components/blog/view-tracker";
import { Card } from "@/components/deck/card";
import { siteConfig } from "@/config/site";

interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  created_at: string;
  updated_at?: string;
}

const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2026";

  if (!apiUrl.startsWith("http")) {
    apiUrl = `https://${apiUrl}`;
  }

  const res = await fetch(`${apiUrl}/api/blog/${slug}`, { next: { revalidate: 300 } });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  return res.json();
});

function formatDate(iso: string): string {
  const parsed = new Date(iso);

  if (Number.isNaN(parsed.getTime())) {
    return "Undated";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return {};

  const url = `${siteConfig.url}/blog/${post.slug || slug}`;
  const description = post.excerpt || `An article by ${siteConfig.fullName}.`;

  return {
    title: post.title,
    description,
    authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      publishedTime: post.created_at,
      modifiedTime: post.updated_at || post.created_at,
      authors: [siteConfig.fullName],
      images: post.cover_image ? [{ url: post.cover_image, alt: post.title }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const date = formatDate(post.created_at);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || `An article by ${siteConfig.fullName}.`,
    url: `${siteConfig.url}/blog/${post.slug || slug}`,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    image: post.cover_image || undefined,
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
    publisher: { "@id": `${siteConfig.url}/#person` },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug || slug}`,
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24 pt-28 sm:pt-36">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <ViewTracker slug={slug} />

      <Link
        className="deck-link group inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.08em]"
        href="/blog"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-300 ease-deck group-hover:-translate-x-0.5"
        >
          ‹
        </span>
        BACK TO NOTES
      </Link>

      <Card
        indexSize="md"
        label={post.title}
        rank="01"
        suit="spade"
        className="mt-8"
        contentClassName="p-8 pt-14 sm:p-12 sm:pt-16"
      >
        <header>
          <h1 className="text-balance font-sans text-3xl font-medium tracking-[-0.03em] text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="deck-readout mt-5 text-xs uppercase tracking-[0.08em] text-white/55">
            {date}
            <span aria-hidden="true" className="px-2">
              ·
            </span>
            REF {post.slug || slug}
          </p>
        </header>

        {post.cover_image ? (
          <img
            alt={post.title}
            className="measure-deck mx-auto mt-10 w-full rounded-card border border-white/10 object-cover"
            decoding="async"
            src={post.cover_image}
          />
        ) : null}

        <div className="measure-deck mx-auto mt-10">
          <MarkdownRenderer content={post.content} />
        </div>
      </Card>

      <div className="mt-12">
        <Link
          className="deck-link group inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.08em]"
          href="/blog"
        >
          MORE NOTES
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-deck group-hover:translate-x-0.5"
          >
            ›
          </span>
        </Link>
      </div>
    </div>
  );
}
