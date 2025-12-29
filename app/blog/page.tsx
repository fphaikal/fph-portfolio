import { title } from "@/components/primitives";
import Link from "next/link";
import { Calendar } from "lucide-react";

async function getPosts() {
  // Ensure the URL matches your local API port
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2026";
  const res = await fetch(`${apiUrl}/api/blog`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  created_at: string;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className={title({ class: "mb-12" })}>Blog</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post: Post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            <article className="bg-default-50 dark:bg-default-100/50 rounded-2xl overflow-hidden border border-default-200 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
              <div className="aspect-video w-full overflow-hidden bg-default-200">
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-default-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-default-500 mb-3">
                  <Calendar size={14} />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-default-500 text-sm line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-default-500 mt-10">No posts found.</p>
      )}
    </div>
  );
}
