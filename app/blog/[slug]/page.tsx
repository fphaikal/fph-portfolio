import type { Metadata } from "next";
import { cache } from "react";
import MarkdownRenderer from "@/components/blog/markdown-renderer";
import ViewTracker from "@/components/blog/view-tracker";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";
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

  const res = await fetch(`${apiUrl}/api/blog/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  return res.json();
});

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
    <div className="w-full pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />
      <ViewTracker slug={slug} />
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-default-500 hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>

      <article>
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-black/50 dark:to-white/50 tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-default-500 mb-8">
            <Link className="flex items-center gap-2 hover:text-primary" href="/" rel="author">
              <User size={18} />
              <span>{siteConfig.fullName}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
          </div>

          {post.cover_image && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-default-200/50">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
        </header>

        <section className="bg-background/60 backdrop-blur-sm rounded-2xl p-0 md:p-4">
          <MarkdownRenderer content={post.content} />
        </section>
      </article>

      <div className="mt-16 pt-8 border-t border-default-200">
        <p className="text-center text-default-500 italic">
          Thanks for reading!
        </p>
      </div>
    </div>
  );
}
