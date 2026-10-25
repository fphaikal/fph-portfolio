"use client";

import Link from "next/link";

import { Card, suitForIndex } from "@/components/deck/card";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  created_at: string;
}

interface PostCardProps {
  post: Post;
  /** Posisi di dalam dek — menentukan peringkat dan lambang kartu. */
  index: number;
}

/** Peringkat kartu, berputar seperti satu dek: A, 2 … K. */
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

/** Tanggal ringkas, mis. "5 Jan 2026". */
function formatDate(iso: string): string {
  const parsed = new Date(iso);

  if (Number.isNaN(parsed.getTime())) {
    return "Undated";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

/** Satu catatan, disajikan sebagai kartu yang diletakkan di atas meja. */
export function PostCard({ post, index }: PostCardProps) {
  const rank = RANKS[index % RANKS.length];
  const suit = suitForIndex(index);

  return (
    <li className="motion-safe:animate-deal-in" style={{ animationDelay: `${index * 70}ms` }}>
      <Link className="group block focus-visible:outline-none" href={`/blog/${post.slug}`}>
        <Card
          indexSize="sm"
          label={post.title}
          rank={rank}
          suit={suit}
          className="transition-transform duration-500 ease-deck motion-safe:group-hover:-translate-y-1"
          contentClassName="flex h-full flex-col p-7 sm:p-8"
        >
          <time className="deck-readout text-deck-xs text-deck-ink/55" dateTime={post.created_at}>
            {formatDate(post.created_at)}
          </time>
          <h2 className="mt-3 text-deck-xl font-semibold text-deck-ink">{post.title}</h2>
          <p className="mt-3 text-deck-base text-deck-ink/65">{post.excerpt}</p>
          <span className="deck-link mt-6 inline-flex items-center gap-1 text-deck-sm font-medium">
            Read <span aria-hidden="true">›</span>
          </span>
        </Card>
      </Link>
    </li>
  );
}
