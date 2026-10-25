'use client';

import { useEffect, useState } from 'react';

import { Card } from "@/components/deck/card";

interface Track {
  name: string;
  artists: string;
  album: string;
  albumImageUrl: string;
  url: string;
  playedAt?: string;
  duration_ms?: number;
}

/** Format milliseconds as MM:SS. */
function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

interface SectionHeaderProps {
  meta: string;
}

/** Kepala daftar bersama — eyebrow di kiri, meta redup di kanan. */
function SectionHeader({ meta }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="deck-eyebrow">Recently played</span>
      <span className="deck-readout text-deck-sm text-deck-ink/60">{meta}</span>
    </div>
  );
}

export default function SpotifyRecentlyPlayed() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://${process.env.NEXT_PUBLIC_API_URL}/api/spotify/recently-played?limit=9`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setTracks(data.data || []);
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
          We couldn&apos;t load the recent tracks right now. Please check back
          in a moment.
        </p>
      </Card>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <Card contentClassName="p-6 sm:p-8">
        <SectionHeader meta="Empty" />
        <p className="deck-readout mt-6 text-deck-base text-deck-ink/70">
          Nothing has been played recently.
        </p>
      </Card>
    );
  }

  return (
    <Card contentClassName="p-6 sm:p-8">
      <SectionHeader
        meta={`${tracks.length} ${tracks.length === 1 ? 'track' : 'tracks'}`}
      />

      <ol className="mt-5">
        {tracks.map((track, index) => (
          <li key={`${track.name}-${index}`}>
            {index > 0 ? <div aria-hidden="true" className="deck-rule" /> : null}
            <a
              className="group flex items-center gap-4 py-4 focus-visible:outline-none"
              href={track.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {track.albumImageUrl ? (
                <img
                  alt=""
                  className="size-11 shrink-0 rounded-card-sm object-cover"
                  src={track.albumImageUrl}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="size-11 shrink-0 rounded-card-sm bg-deck-ink/10"
                />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-deck-base font-medium text-deck-ink transition-colors group-hover:text-deck-red">
                  {track.name}
                </p>
                <p className="truncate text-deck-sm text-deck-ink/60">
                  {track.artists}
                </p>
              </div>

              <span className="deck-readout shrink-0 text-deck-sm text-deck-ink/60">
                {track.playedAt ? formatTimeAgo(track.playedAt) : '—'}
              </span>
              <span className="deck-readout hidden shrink-0 text-deck-sm text-deck-ink/60 sm:block">
                {track.duration_ms ? formatDuration(track.duration_ms) : '--:--'}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </Card>
  );
}
