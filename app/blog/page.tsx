import { title } from "@/components/primitives";
import Link from "next/link";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { RiQuillPenFill } from "react-icons/ri";

async function getPosts() {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2026";

  if (!apiUrl.startsWith("http")) {
    apiUrl = `https://${apiUrl}`;
  }

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
    <div className="flex flex-col w-full gap-8 pb-16">
      {/* Header Section - Same style as Spotify */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-violet-500/20 rounded-2xl">
          <RiQuillPenFill size={32} className="text-violet-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">Blog</h1>
          <p className="text-foreground/60 text-sm">Tulisan dan catatan saya</p>
        </div>
      </div>

      {/* Posts Section */}
      <section className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Artikel Terbaru</h2>
        </div>

        {posts.length === 0 ? (
          <div className="py-12">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-violet-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Belum ada artikel</h3>
            <p className="text-foreground/60">Artikel akan segera hadir!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post: Post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article className="flex gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-white/5">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 group-hover:text-violet-400 transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-foreground/60 text-sm line-clamp-1 mb-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-foreground/40">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        5 min
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
