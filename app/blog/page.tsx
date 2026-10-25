import { PostCard, type Post } from "@/components/blog/post-card";
import { Card } from "@/components/deck/card";

async function getPosts(): Promise<Post[]> {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2026";

  if (!apiUrl.startsWith("http")) {
    apiUrl = `https://${apiUrl}`;
  }

  const res = await fetch(`${apiUrl}/api/blog`, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return (await res.json()) as Post[];
}

interface BlogHeaderProps {
  subhead: string;
}

function BlogHeader({ subhead }: BlogHeaderProps) {
  return (
    <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <div className="lumina-pill">
        <span aria-hidden="true" className="inline-block h-[5px] w-[5px] bg-white" />
        <span>TECHNICAL ARCHIVE</span>
      </div>
      <h1 className="mt-6 text-balance font-sans text-4xl font-light tracking-[-0.035em] text-white sm:text-6xl">
        Notes &amp;{" "}
        <span className="font-serif italic font-normal text-[#a8ceff]">articles</span>
      </h1>
      <p className="mx-auto mt-5 max-w-xl font-sans text-base text-[#8d96aa]">{subhead}</p>
    </header>
  );
}

export default async function BlogPage() {
  let posts: Post[] = [];
  let failed = false;

  try {
    posts = await getPosts();
  } catch {
    failed = true;
  }

  if (failed) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 pb-24 pt-28 sm:pt-36">
        <BlogHeader subhead="We couldn't load the posts just now. Please try again in a little while." />

        <Card className="mt-12" contentClassName="p-7 sm:p-8">
          <p className="deck-readout text-deck-sm text-white/75">
            The archive couldn&apos;t be reached right now.
          </p>
          <a className="lumina-btn-secondary mt-5" href="/blog">
            RETRY
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24 pt-28 sm:pt-36">
      <BlogHeader subhead="Write-ups on web development, IT support, automation, and mechatronics." />

      {posts.length === 0 ? (
        <div className="mt-16 flex flex-col items-center">
          <Card back ratio className="w-48" />
          <p className="deck-readout mt-6 text-deck-sm text-muted-foreground">NO ENTRIES</p>
        </div>
      ) : (
        <ul className="mt-12 flex flex-col gap-6 sm:mt-16">
          {posts.map((post, index) => (
            <PostCard key={post.id} index={index} post={post} />
          ))}
        </ul>
      )}
    </div>
  );
}
