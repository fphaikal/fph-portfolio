import { title, subtitle } from "@/components/primitives";
import MarkdownRenderer from "@/components/blog/markdown-renderer";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";

async function getPost(slug: string) {
  const apiUrl = process.env.FPH_API_URL || "http://localhost:2026";
  const res = await fetch(`${apiUrl}/api/blog/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  return res.json();
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-default-500 hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>

      <article>
        <header className="mb-10 text-center">
          <h1 className={title({ size: "lg", color: "foreground", class: "mb-6" })}>
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-default-500 mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
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
