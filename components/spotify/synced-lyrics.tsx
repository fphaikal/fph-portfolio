'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { parseLRC, findCurrentLineIndex } from '@/lib/lrc-parser';
import { cn } from '@/lib/utils';

interface SyncedLyricsProps {
  artist: string;
  track: string;
  album: string;
  progress: number;
  isPlaying: boolean;
}

interface LyricsData {
  syncedLyrics: string | null;
  plainLyrics: string | null;
  instrumental: boolean;
}

/** Format milliseconds as MM:SS for lyric timestamps. */
function formatTimestamp(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Neutral status message for states without lyrics. */
function LyricsMessage({ children }: { children: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <span className="deck-readout text-deck-sm font-medium text-deck-ink/60">
        {children}
      </span>
    </div>
  );
}

export default function SyncedLyrics({
  artist,
  track,
  album,
  progress,
}: SyncedLyricsProps) {
  const [lyricsData, setLyricsData] = useState<LyricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hormati preferensi gerak minimal: tampilkan isi langsung, tanpa animasi.
  const reduceMotion = useReducedMotion();

  // Cache untuk melacak lagu terakhir yang diambil — mencegah pengambilan ulang.
  const lastFetchedTrack = useRef<string | null>(null);

  // Parse lyrics once when data changes
  const parsedLyrics = useMemo(() => {
    if (!lyricsData?.syncedLyrics) return [];
    return parseLRC(lyricsData.syncedLyrics);
  }, [lyricsData?.syncedLyrics]);

  // Find current line based on progress
  const currentIndex = useMemo(() => {
    return findCurrentLineIndex(parsedLyrics, progress);
  }, [parsedLyrics, progress]);

  // Get visible lyrics (previous, current, next)
  const visibleLyrics = useMemo(() => {
    if (parsedLyrics.length === 0) return [];

    const lines = [];
    for (let i = currentIndex - 1; i <= currentIndex + 2; i++) {
      if (i >= 0 && i < parsedLyrics.length) {
        lines.push({
          ...parsedLyrics[i],
          index: i,
          position: i - currentIndex, // -1, 0, 1, 2
        });
      }
    }
    return lines;
  }, [parsedLyrics, currentIndex]);

  // Fetch lyrics only when track actually changes
  useEffect(() => {
    const trackKey = `${artist}-${track}`;

    // Skip if same track already fetched
    if (lastFetchedTrack.current === trackKey) {
      return;
    }

    const fetchLyrics = async () => {
      if (!artist || !track) return;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          artist,
          track,
          ...(album && { album }),
        });

        const response = await fetch(`/api/lyrics?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setLyricsData(data.data);
          lastFetchedTrack.current = trackKey;
        } else {
          setError(data.error || 'Lyrics not found');
        }
      } catch {
        setError('Failed to fetch lyrics');
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [artist, track, album]);

  if (loading) {
    return <LyricsMessage>Loading lyrics…</LyricsMessage>;
  }

  if (error || !lyricsData) {
    return <LyricsMessage>{error || 'No lyrics available'}</LyricsMessage>;
  }

  if (lyricsData.instrumental) {
    return <LyricsMessage>Instrumental</LyricsMessage>;
  }

  // No synced lyrics, show plain lyrics (scrollable)
  if (!lyricsData.syncedLyrics && lyricsData.plainLyrics) {
    const plainLines = lyricsData.plainLyrics.split('\n');
    return (
      <div className="scrollbar-none h-[280px] overflow-y-auto">
        <div className="flex flex-col gap-3 py-4">
          {plainLines.map((line, index) => (
            <p
              key={index}
              className="font-sans text-deck-base text-deck-ink/70"
            >
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // Synced lyrics — baris aktif memakai tinta merah kartu.
  return (
    <div className="flex h-[250px] flex-col justify-center gap-2 overflow-hidden">
      {visibleLyrics.map((line) => {
        const isCurrent = line.position === 0;
        const isPast = line.position < 0;

        return (
          <motion.div
            key={line.index}
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{
              opacity: isCurrent ? 1 : isPast ? 0.35 : 0.45,
              y: 0,
            }}
            exit={{ opacity: 0, y: -12 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                  }
            }
            className={cn(
              'flex items-baseline gap-3 border-l-2 py-1 pl-4',
              isCurrent ? 'border-deck-red' : 'border-transparent',
            )}
          >
            <span className="deck-readout shrink-0 text-deck-xs text-deck-ink/50">
              {formatTimestamp(line.time)}
            </span>
            <span
              className={cn(
                'font-sans text-deck-base',
                isCurrent
                  ? 'font-semibold text-deck-red'
                  : 'text-deck-ink/60',
              )}
            >
              {line.text}
            </span>
          </motion.div>
        );
      })}

      {/* Line not started yet */}
      {currentIndex < 0 && parsedLyrics.length > 0 && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="border-l-2 border-transparent pl-4"
        >
          <span className="text-deck-sm font-medium text-deck-ink/60">
            Waiting for the first line…
          </span>
        </motion.div>
      )}
    </div>
  );
}
