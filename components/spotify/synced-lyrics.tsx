'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { parseLRC, findCurrentLineIndex } from '@/lib/lrc-parser';
import { RiMusicFill } from 'react-icons/ri';

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

export default function SyncedLyrics({
  artist,
  track,
  album,
  progress,
}: SyncedLyricsProps) {
  const [lyricsData, setLyricsData] = useState<LyricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache to track last fetched song - prevents re-fetching same lyrics
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

  // Get visible lyrics (3 lines: previous, current, next)
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
      } catch (err) {
        setError('Failed to fetch lyrics');
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [artist, track, album]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <RiMusicFill size={24} className="text-white/40" />
          </motion.div>
          <p className="text-sm text-white/40">Loading lyrics...</p>
        </div>
      </div>
    );
  }

  if (error || !lyricsData) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-white/40">{error || 'No lyrics available'}</p>
      </div>
    );
  }

  if (lyricsData.instrumental) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <RiMusicFill size={24} className="text-white/40" />
          <p className="text-sm text-white/40">Instrumental</p>
        </div>
      </div>
    );
  }

  // No synced lyrics, show plain lyrics (scrollable)
  if (!lyricsData.syncedLyrics && lyricsData.plainLyrics) {
    const plainLines = lyricsData.plainLyrics.split('\n');
    return (
      <div className="h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div className="space-y-3 py-4 px-2">
          {plainLines.map((line, index) => (
            <p key={index} className="text-sm text-white/70 text-center leading-relaxed">
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // Synced lyrics with smooth animation
  return (
    <div className="overflow-hidden h-[250px]">
      <div className="flex flex-col items-center justify-center h-full gap-3">
        {visibleLyrics.map((line) => {
          const isCurrent = line.position === 0;
          const isPast = line.position < 0;

          return (
            <motion.div
              key={line.index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isCurrent ? 1 : isPast ? 0.4 : 0.5,
                scale: isCurrent ? 1 : 0.9,
                y: 0,
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25,
              }}
              className={`
                text-center w-full px-4 leading-relaxed
                ${isCurrent
                  ? 'text-white font-bold text-4xl'
                  : 'text-white/50 text-base font-normal'
                }
              `}
            >
              {line.text}
            </motion.div>
          );
        })}

        {/* Show waiting message when no current line */}
        {currentIndex < 0 && parsedLyrics.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="text-lg text-white/40 text-center"
          >
            ♪ ♪ ♪
          </motion.div>
        )}
      </div>
    </div>
  );
}

