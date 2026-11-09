'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { parseLRC, findCurrentLineIndex } from '@/lib/lrc-parser';
import { cn } from '@/lib/utils';

export type LyricsStatus =
  | 'loading'
  | 'synced'
  | 'plain'
  | 'instrumental'
  | 'unavailable';

interface SyncedLyricsProps {
  artist: string;
  track: string;
  album: string;
  progress: number;
  isPlaying: boolean;
  variant?: 'inline' | 'modal';
  onStatusChange?: (status: LyricsStatus) => void;
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

export default function SyncedLyrics({
  artist,
  track,
  album,
  progress,
  isPlaying,
  variant = 'inline',
  onStatusChange,
}: SyncedLyricsProps) {
  const [lyricsData, setLyricsData] = useState<LyricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'synced' | 'full'>('synced');

  const reduceMotion = useReducedMotion();
  const lastFetchedTrack = useRef<string | null>(null);

  const parsedLyrics = useMemo(() => {
    if (!lyricsData?.syncedLyrics) return [];
    return parseLRC(lyricsData.syncedLyrics);
  }, [lyricsData?.syncedLyrics]);

  const currentIndex = useMemo(() => {
    return findCurrentLineIndex(parsedLyrics, progress);
  }, [parsedLyrics, progress]);

  const visibleLyrics = useMemo(() => {
    if (parsedLyrics.length === 0) return [];

    // Before first line starts (or when paused at 00:00), preview first 4 lines
    if (currentIndex < 0) {
      return parsedLyrics.slice(0, 4).map((item, idx) => ({
        ...item,
        index: idx,
        position: idx === 0 && !isPlaying ? 0 : idx + 1,
      }));
    }

    const lines = [];
    for (let i = currentIndex - 1; i <= currentIndex + 2; i++) {
      if (i >= 0 && i < parsedLyrics.length) {
        lines.push({
          ...parsedLyrics[i],
          index: i,
          position: i - currentIndex,
        });
      }
    }
    return lines;
  }, [parsedLyrics, currentIndex, isPlaying]);

  useEffect(() => {
    const trackKey = `${artist}-${track}`;

    if (lastFetchedTrack.current === trackKey) {
      return;
    }

    const fetchLyrics = async () => {
      if (!artist || !track) return;

      setLoading(true);
      setError(null);
      onStatusChange?.('loading');

      try {
        const params = new URLSearchParams({
          artist,
          track,
          ...(album && { album }),
        });

        const response = await fetch(`/api/lyrics?${params.toString()}`);
        const data = await response.json();

        if (data.success && data.data) {
          const payload: LyricsData = data.data;
          setLyricsData(payload);
          lastFetchedTrack.current = trackKey;

          if (payload.instrumental) {
            onStatusChange?.('instrumental');
          } else if (payload.syncedLyrics) {
            onStatusChange?.('synced');
          } else if (payload.plainLyrics) {
            onStatusChange?.('plain');
          } else {
            onStatusChange?.('unavailable');
          }
        } else {
          setLyricsData(null);
          setError(data.error || 'Lyrics not found');
          onStatusChange?.('unavailable');
        }
      } catch {
        setLyricsData(null);
        setError('Failed to fetch lyrics');
        onStatusChange?.('unavailable');
      } finally {
        setLoading(false);
      }
    };

    void fetchLyrics();
  }, [artist, track, album, onStatusChange]);

  const containerHeight = variant === 'modal' ? 'min-h-[280px]' : 'min-h-[240px]';

  if (loading) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3 py-10', containerHeight)}>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400/70 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400/40 [animation-delay:300ms]" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#95a0b8]">
          Loading lyrics from LRCLIB...
        </p>
      </div>
    );
  }

  if (error || !lyricsData) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-2 py-10 text-center', containerHeight)}>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-sky-300">
          NO LYRICS RECORDED
        </span>
        <p className="max-w-[34ch] font-sans text-sm text-[#95a0b8]">
          {error === 'Lyrics not found'
            ? 'Lyrics are not available in the LRCLIB catalog for this track yet.'
            : error || 'Lyrics are currently unavailable for this track.'}
        </p>
      </div>
    );
  }

  if (lyricsData.instrumental) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-2 py-10 text-center', containerHeight)}>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-sky-300">
          INSTRUMENTAL TRACK
        </span>
        <p className="font-sans text-sm text-[#95a0b8]">
          This composition is instrumental with no vocal transcript.
        </p>
      </div>
    );
  }

  // Plain lyrics fallback (when synced LRC is not available)
  if (!lyricsData.syncedLyrics && lyricsData.plainLyrics) {
    const plainLines = lyricsData.plainLyrics.split('\n');
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#95a0b8]">
            UNSYNCED TRANSCRIPT ({plainLines.filter(Boolean).length} LINES)
          </span>
        </div>
        <div
          className={cn(
            ' overflow-y-auto pr-2',
            variant === 'modal' ? 'max-h-[300px]' : 'max-h-[240px]'
          )}
          tabIndex={0}
          role="region"
          aria-label={`Lyrics for ${track}`}
        >
          <div className="flex flex-col gap-2.5 py-2">
            {plainLines.map((line, index) => (
              <p
                key={index}
                className="font-sans text-sm leading-relaxed text-[#d8e3f5] sm:text-base"
              >
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Synced LRC lyrics (with toggle between Live Sync Focus and Full Scrollable Transcript)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#95a0b8]">
          {currentIndex < 0 && parsedLyrics.length > 0
            ? isPlaying
              ? `INTRO · VOCALS AT ${formatTimestamp(parsedLyrics[0].time)}`
              : `LINE 01 / ${String(parsedLyrics.length).padStart(2, '0')}`
            : `LINE ${String(currentIndex + 1).padStart(2, '0')} / ${String(parsedLyrics.length).padStart(2, '0')}`}
        </span>

        <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#070a12] p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('synced')}
            className={cn(
              'min-h-[32px] rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors',
              viewMode === 'synced'
                ? 'bg-white font-semibold text-[#06080f]'
                : 'text-[#95a0b8] hover:text-white'
            )}
          >
            LIVE SYNC
          </button>
          <button
            type="button"
            onClick={() => setViewMode('full')}
            className={cn(
              'min-h-[32px] rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors',
              viewMode === 'full'
                ? 'bg-white font-semibold text-[#06080f]'
                : 'text-[#95a0b8] hover:text-white'
            )}
          >
            ALL ({parsedLyrics.length})
          </button>
        </div>
      </div>

      {viewMode === 'full' ? (
        <div
          className={cn(
            'overflow-y-auto pr-2',
            variant === 'modal' ? 'max-h-[300px]' : 'max-h-[240px]'
          )}
          tabIndex={0}
          role="region"
          aria-label={`Full timestamped lyrics for ${track}`}
        >
          <div className="flex flex-col gap-2 py-1">
            {parsedLyrics.map((line, index) => {
              const isCurrent = index === currentIndex;
              return (
                <div
                  key={index}
                  className={cn(
                    'flex items-baseline gap-3 rounded-lg border-l-2 px-3 py-1.5 transition-colors',
                    isCurrent
                      ? 'border-sky-400 bg-sky-400/10'
                      : 'border-transparent'
                  )}
                >
                  <span className="deck-readout shrink-0 text-xs text-[#95a0b8]">
                    {formatTimestamp(line.time)}
                  </span>
                  <span
                    className={cn(
                      'font-sans text-sm leading-relaxed sm:text-base',
                      isCurrent ? 'font-semibold text-white' : 'text-[#c2cee3]'
                    )}
                  >
                    {line.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'flex flex-col justify-center gap-2.5 overflow-hidden py-2',
            variant === 'modal' ? 'min-h-[260px]' : 'min-h-[220px]'
          )}
          aria-live="polite"
        >
          {visibleLyrics.map((line) => {
            const isCurrent = line.position === 0;
            const isPast = line.position < 0;

            return (
              <motion.div
                key={line.index}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{
                  opacity: isCurrent ? 1 : isPast ? 0.65 : 0.75,
                  scale: isCurrent ? 1 : 0.98,
                  y: 0,
                }}
                exit={{ opacity: 0, y: -14 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        type: 'spring',
                        stiffness: 210,
                        damping: 26,
                      }
                }
                className={cn(
                  'flex items-baseline gap-3.5 rounded-r-xl border-l-2 py-2 pl-4 pr-3 transition-colors',
                  isCurrent
                    ? 'border-sky-400 bg-sky-400/[0.08]'
                    : 'border-white/10'
                )}
              >
                <span
                  className={cn(
                    'deck-readout shrink-0 text-xs',
                    isCurrent ? 'font-medium text-sky-300' : 'text-[#95a0b8]'
                  )}
                >
                  {formatTimestamp(line.time)}
                </span>
                <span
                  className={cn(
                    'font-sans leading-snug',
                    isCurrent
                      ? variant === 'modal'
                        ? 'text-xl font-semibold text-white sm:text-2xl'
                        : 'text-lg font-semibold text-white sm:text-xl'
                      : 'text-sm font-normal text-[#95a0b8] sm:text-base'
                  )}
                >
                  {line.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
