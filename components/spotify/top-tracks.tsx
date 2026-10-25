'use client';

import { useEffect, useState } from 'react';

import { Card } from "@/components/deck/card";
import { cn } from "@/lib/utils";

interface TopTrack {
  name: string;
  artists: string;
  album: string;
  albumImageUrl: string;
  url: string;
  // Nama field jumlah putar berbeda antar versi API.
  playCount?: number;
  play_count?: number;
  count?: number;
}

/** Baca jumlah putar dari field mana pun yang tersedia. */
function readPlayCount(track: TopTrack): number {
  return track.playCount ?? track.play_count ?? track.count ?? 0;
}

interface SectionHeaderProps {
  meta: string;
}

/** Kepala daftar bersama — eyebrow di kiri, meta redup di kanan. */
function SectionHeader({ meta }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="deck-eyebrow">Top tracks</span>
      <span className="deck-readout text-deck-sm text-deck-ink/60">{meta}</span>
    </div>
  );
}

export default function SpotifyTopTracks() {
  const [tracks, setTracks] = useState<TopTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://${process.env.NEXT_PUBLIC_API_URL}/api/spotify/top-tracks`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setTracks(data.data);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card contentClassName="p-6 sm:p-8">
        <SectionHeader meta="Loading" />
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-11 w-full animate-pulse rounded-card-sm bg-deck-ink/10" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card contentClassName="p-6 sm:p-8">
        <SectionHeader meta="Unavailable" />
        <p className="mt-6 text-deck-base text-deck-ink/70">
          We couldn&apos;t load the top tracks right now. Please check back in a
          moment.
        </p>
      </Card>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <Card contentClassName="p-6 sm:p-8">
        <SectionHeader meta="Empty" />
        <p className="deck-readout mt-6 text-deck-base text-deck-ink/70">
          No ranked tracks are available yet.
        </p>
      </Card>
    );
  }

  const maxCount = Math.max(...tracks.map(readPlayCount), 0);
  const hasCounts = maxCount > 0;

  return (
    <Card contentClassName="p-6 sm:p-8">
      <SectionHeader
        meta={`${tracks.length} ${tracks.length === 1 ? 'track' : 'tracks'}`}
      />

      <ol className="mt-5">
        {tracks.map((track, index) => {
          const count = readPlayCount(track);
          // Lebar sebanding jumlah putar; kalau data tidak ada, pakai bobot
          // peringkat supaya baris tetap terbaca sebagai ranking.
          const percent = hasCounts
            ? Math.max(4, Math.round((count / maxCount) * 100))
            : Math.round(((tracks.length - index) / tracks.length) * 100);
          const isTop = index < 3;

          return (
            <li key={`${track.name}-${index}`}>
              {index > 0 ? <div aria-hidden="true" className="deck-rule" /> : null}
              <a
                className="group flex items-center gap-4 py-4 focus-visible:outline-none"
                href={track.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="deck-readout w-6 shrink-0 text-deck-sm font-semibold text-deck-ink/50">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-deck-base font-medium text-deck-ink transition-colors group-hover:text-deck-red">
                    {track.name}
                  </p>
                  <p className="truncate text-deck-sm text-deck-ink/60">
                    {track.artists}
                  </p>
                  <div className="mt-2 h-[3px] w-full max-w-[240px] overflow-hidden rounded-pip bg-deck-ink/10">
                    <div
                      className={cn(
                        "h-full rounded-pip",
                        isTop ? "bg-deck-red" : "bg-deck-ink/30",
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {hasCounts ? (
                  <span className="deck-readout shrink-0 text-deck-sm text-deck-ink/60">
                    {count}
                  </span>
                ) : null}
              </a>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
