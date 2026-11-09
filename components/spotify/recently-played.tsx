'use client';

import { useEffect, useState } from 'react';
import { useDisclosure } from '@heroui/react';

import { SectionTab, SquircleChip } from '@/components/deck/card';
import { getApiBaseUrl } from '@/lib/utils';

import VinylModal, { type ModalTrack } from './vinyl-modal';

interface RecentTrackItem {
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
  if (Number.isNaN(date.getTime())) return 'Recent';
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

export default function SpotifyRecentlyPlayed() {
  const [tracks, setTracks] = useState<RecentTrackItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<ModalTrack | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const inspectTrackLyrics = (item: RecentTrackItem) => {
    setSelectedTrack({
      name: item.name,
      artists: item.artists,
      album: item.album,
      albumImageUrl: item.albumImageUrl || '/placeholder-album.png',
      duration_ms: item.duration_ms || 0,
      progress_ms: 0,
      url: item.url || '',
      is_playing: false,
    });
    onOpen();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let list: RecentTrackItem[] = [];

        // 1. Fetch from activity history first
        try {
          const actRes = await fetch(`${getApiBaseUrl()}/api/activity/history?limit=9`);
          if (actRes.ok) {
            const actData = await actRes.json();
            if (actData.success && Array.isArray(actData.data) && actData.data.length > 0) {
              list = actData.data.map((item: any) => ({
                name: item.title,
                artists: item.subtitle || 'Unknown Artist',
                album: item.details?.album || item.source || '',
                albumImageUrl: item.details?.album_art_url || '/placeholder-album.png',
                url: item.url || '',
                playedAt: item.started_at,
                duration_ms: item.details?.duration_ms,
              }));
            }
          }
        } catch (e) {
          console.warn('Failed to fetch activity history:', e);
        }

        // 2. Supplement or fallback to spotify DB history if fewer than 9
        if (list.length < 9) {
          try {
            const needed = 9 - list.length;
            const dbRes = await fetch(
              `${getApiBaseUrl()}/api/spotify/recently-played-db?limit=${needed}`
            );
            if (dbRes.ok) {
              const dbData = await dbRes.json();
              const dbTracks = dbData?.data?.data || [];
              if (Array.isArray(dbTracks)) {
                const mappedDb: RecentTrackItem[] = dbTracks.map((item: any) => ({
                  name: item.name,
                  artists: item.artists,
                  album: item.album,
                  albumImageUrl: item.albumImageUrl || '/placeholder-album.png',
                  url: item.url || '',
                  playedAt: item.created_at,
                  duration_ms: item.duration_ms,
                }));
                list = [...list, ...mappedDb];
              }
            }
          } catch (e) {
            console.warn('Failed to fetch spotify DB history:', e);
          }
        }

        setTracks(list);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  return (
    <>
      <section
        id="recent-history"
        className="relative border-t border-white/10 bg-[#06080f]"
      >
        <div className="mx-auto max-w-[1160px] border-x border-white/10">
          {/* Top Split Architectural Header */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] lg:divide-x lg:divide-white/10">
            <div className="flex flex-col justify-between">
              <div>
                <SectionTab label="RECENTLY PLAYED" />
              </div>

              <div className="px-7 pb-9 pt-8 sm:px-10 sm:pb-11 sm:pt-10">
                <h2 className="font-sans text-[26px] font-normal leading-[1.2] tracking-[-0.03em] text-white sm:text-[34px]">
                  Recent{" "}
                  <span className="font-serif italic font-normal text-[#a8ceff]">
                    listening log
                  </span>
                  .{" "}
                  <span className="text-[#95a0b8]">
                    Chronological playback history across desktop and Spotify sessions.
                  </span>
                </h2>
              </div>
            </div>

            <div className="lumina-dot-grid flex items-center justify-between border-t border-white/10 p-7 sm:p-10 lg:border-t-0">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#95a0b8]">
                  ▪ PLAYBACK LOG STATUS
                </span>
                <p className="mt-2 font-mono text-2xl font-semibold text-white sm:text-3xl">
                  {loading
                    ? 'LOADING...'
                    : error
                      ? 'OFFLINE'
                      : `${String(tracks.length).padStart(2, '0')} TRACKS`}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-sky-300">
                  SELECT ANY ROW TO INSPECT LYRICS
                </p>
              </div>
              <SquircleChip icon="activity" idPrefix="recent-chip" size="sm" />
            </div>
          </div>

          {/* Track Rows Matrix */}
          <div className="border-t border-white/10">
            {loading ? (
              <div className="divide-y divide-white/10">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-7 py-5 sm:px-10"
                  >
                    <div className="h-4 w-6 animate-pulse rounded bg-white/10" />
                    <div className="size-12 shrink-0 animate-pulse rounded-lg bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
                      <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="px-7 py-12 sm:px-10">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-amber-300">
                  HISTORY FEED UNAVAILABLE
                </p>
                <p className="mt-2 font-sans text-base text-[#95a0b8]">
                  We could not load the recent playback history right now. Please check back in a moment.
                </p>
              </div>
            ) : tracks.length === 0 ? (
              <div className="px-7 py-12 sm:px-10">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-sky-300">
                  EMPTY LOG
                </p>
                <p className="mt-2 font-sans text-base text-[#95a0b8]">
                  No recently played tracks are recorded yet.
                </p>
              </div>
            ) : (
              <ol className="divide-y divide-white/10">
                {tracks.map((item, index) => (
                  <li
                    key={`${item.name}-${index}`}
                    className="group flex flex-col justify-between gap-4 bg-[#06080f] px-7 py-4 transition-colors hover:bg-[#0a0f1c] sm:flex-row sm:items-center sm:px-10"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <span className="deck-readout w-6 shrink-0 text-xs font-medium text-[#95a0b8]">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <img
                        alt={`${item.name} album art`}
                        className="size-12 shrink-0 rounded-lg border border-white/10 object-cover"
                        src={item.albumImageUrl || '/placeholder-album.png'}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-base font-medium text-white transition-colors group-hover:text-[#a8ceff]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 truncate font-sans text-sm text-[#95a0b8]">
                          {item.artists}
                          {item.album ? ` · ${item.album}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pl-10 sm:justify-end sm:pl-0">
                      <div className="flex items-center gap-4">
                        <span className="deck-readout text-xs text-[#95a0b8]">
                          {item.playedAt ? formatTimeAgo(item.playedAt) : 'Recent'}
                        </span>
                        <span className="deck-readout w-12 text-right text-xs text-[#95a0b8]">
                          {item.duration_ms ? formatDuration(item.duration_ms) : '--:--'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => inspectTrackLyrics(item)}
                          className="min-h-[44px] rounded-lg border border-white/15 bg-[#0c111e] px-3.5 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:border-sky-300/50 hover:text-sky-300"
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
                  </li>
                ))}
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
