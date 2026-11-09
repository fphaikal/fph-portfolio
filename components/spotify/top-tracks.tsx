'use client';

import { useEffect, useState } from 'react';
import { useDisclosure } from '@heroui/react';

import { SectionTab, SquircleChip } from '@/components/deck/card';
import { cn, getApiBaseUrl } from '@/lib/utils';

import VinylModal, { type ModalTrack } from './vinyl-modal';

interface TopTrack {
  name: string;
  artists: string;
  album: string;
  albumImageUrl: string;
  url: string;
  playCount?: number;
  play_count?: number;
  count?: number;
}

/** Read play count from whichever field is returned by the API. */
function readPlayCount(track: TopTrack): number {
  return track.playCount ?? track.play_count ?? track.count ?? 0;
}

export default function SpotifyTopTracks() {
  const [tracks, setTracks] = useState<TopTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<ModalTrack | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const inspectTrackLyrics = (item: TopTrack) => {
    setSelectedTrack({
      name: item.name,
      artists: item.artists,
      album: item.album,
      albumImageUrl: item.albumImageUrl || '/placeholder-album.png',
      duration_ms: 0,
      progress_ms: 0,
      url: item.url || '',
      is_playing: false,
    });
    onOpen();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/spotify/top-tracks`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setTracks(data.data);
            setLoading(false);
            return;
          }
        }
        // Fallback to spotify-history DB if top-tracks returns non-200 or empty
        const dbRes = await fetch(
          `${getApiBaseUrl()}/api/spotify/recently-played-db?limit=10`
        );
        if (dbRes.ok) {
          const dbData = await dbRes.json();
          const dbList = dbData?.data?.data || [];
          if (Array.isArray(dbList) && dbList.length > 0) {
            setTracks(
              dbList.map((item: any) => ({
                name: item.name,
                artists: item.artists,
                album: item.album,
                albumImageUrl: item.albumImageUrl || '/placeholder-album.png',
                url: item.url || '',
              }))
            );
            setLoading(false);
            return;
          }
        }
        setTracks([]);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  const maxCount = Math.max(...tracks.map(readPlayCount), 0);
  const hasCounts = maxCount > 0;

  return (
    <>
      <section
        id="top-tracks"
        className="relative border-t border-white/10 bg-[#06080f]"
      >
        <div className="mx-auto max-w-[1160px] border-x border-white/10">
          {/* Top Split Architectural Header */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] lg:divide-x lg:divide-white/10">
            <div className="flex flex-col justify-between">
              <div>
                <SectionTab label="TOP ROTATION" />
              </div>

              <div className="px-7 pb-9 pt-8 sm:px-10 sm:pb-11 sm:pt-10">
                <h2 className="font-sans text-[26px] font-normal leading-[1.2] tracking-[-0.03em] text-white sm:text-[34px]">
                  Heavy{" "}
                  <span className="font-serif italic font-normal text-[#a8ceff]">
                    rotation index
                  </span>
                  .{" "}
                  <span className="text-[#95a0b8]">
                    Most replayed tracks ranked by listening frequency.
                  </span>
                </h2>
              </div>
            </div>

            <div className="lumina-dot-grid flex items-center justify-between border-t border-white/10 p-7 sm:p-10 lg:border-t-0">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#95a0b8]">
                  ▪ RANKED FREQUENCY MATRIX
                </span>
                <p className="mt-2 font-mono text-2xl font-semibold text-sky-300 sm:text-3xl">
                  {loading
                    ? 'LOADING...'
                    : error
                      ? 'OFFLINE'
                      : `TOP ${String(tracks.length).padStart(2, '0')}`}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#95a0b8]">
                  {hasCounts ? 'WEIGHTED BY PLAY COUNT' : 'RANKED BY ROTATION PRIORITY'}
                </p>
              </div>
              <SquircleChip icon="chart" idPrefix="top-tracks-chip" size="sm" />
            </div>
          </div>

          {/* 2-Column Architectural Grid for Top Tracks */}
          <div className="border-t border-white/10">
            {loading ? (
              <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-2 md:divide-y-0">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-center gap-4 p-7 sm:p-8',
                      idx % 2 === 1 && 'md:border-l md:border-white/10',
                      idx >= 2 && 'md:border-t md:border-white/10'
                    )}
                  >
                    <div className="size-14 shrink-0 animate-pulse rounded-xl bg-white/10" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 w-44 animate-pulse rounded bg-white/10" />
                      <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
                      <div className="h-1.5 w-full animate-pulse rounded-full bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="px-7 py-12 sm:px-10">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-amber-300">
                  RANKING FEED UNAVAILABLE
                </p>
                <p className="mt-2 font-sans text-base text-[#95a0b8]">
                  We could not load the top rotation tracks right now. Please check back in a moment.
                </p>
              </div>
            ) : tracks.length === 0 ? (
              <div className="px-7 py-12 sm:px-10">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-sky-300">
                  NO RANKED DATA
                </p>
                <p className="mt-2 font-sans text-base text-[#95a0b8]">
                  No ranked tracks are available yet.
                </p>
              </div>
            ) : (
              <ol className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-2 md:divide-y-0">
                {tracks.map((item, index) => {
                  const count = readPlayCount(item);
                  const percent = hasCounts
                    ? Math.max(6, Math.round((count / maxCount) * 100))
                    : Math.round(((tracks.length - index) / tracks.length) * 100);
                  const isTopThree = index < 3;
                  const isRightCol = index % 2 === 1;
                  const isAfterFirstRow = index >= 2;

                  return (
                    <li
                      key={`${item.name}-${index}`}
                      className={cn(
                        'group flex flex-col justify-between gap-5 bg-[#06080f] p-7 transition-colors hover:bg-[#090d18] sm:p-8',
                        isRightCol && 'md:border-l md:border-white/10',
                        isAfterFirstRow && 'md:border-t md:border-white/10'
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          <img
                            alt={`${item.name} album art`}
                            src={item.albumImageUrl || '/placeholder-album.png'}
                            className="size-14 shrink-0 rounded-xl border border-white/10 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'deck-readout inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                                  isTopThree
                                    ? 'border-sky-400/40 bg-sky-400/10 text-sky-300'
                                    : 'border-white/10 bg-white/[0.03] text-[#95a0b8]'
                                )}
                              >
                                #{String(index + 1).padStart(2, '0')}
                              </span>
                              {hasCounts ? (
                                <span className="deck-readout text-xs text-[#95a0b8]">
                                  {count} PLAYS
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1.5 truncate font-sans text-lg font-medium text-white transition-colors group-hover:text-[#a8ceff]">
                              {item.name}
                            </p>
                            <p className="truncate font-sans text-sm text-[#95a0b8]">
                              {item.artists}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => inspectTrackLyrics(item)}
                            className="min-h-[44px] rounded-lg border border-white/15 bg-[#0c111e] px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:border-sky-300/50 hover:text-sky-300"
                          >
                            LYRICS
                          </button>
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${item.name} on Spotify`}
                              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/10 bg-[#0c111e] px-3 py-2 font-mono text-xs text-sky-300 transition-colors hover:border-sky-300/50 hover:text-white"
                            >
                              ↗
                            </a>
                          ) : null}
                        </div>
                      </div>

                      {/* Frequency Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[#95a0b8]">
                          <span>ROTATION WEIGHT</span>
                          <span className="deck-readout text-white">{percent}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              isTopThree ? 'bg-sky-400' : 'bg-[#64748b]'
                            )}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>
      </section>

      <VinylModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        progress={0}
        track={selectedTrack}
      />
    </>
  );
}
