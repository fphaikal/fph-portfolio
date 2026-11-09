'use client';

import { useState } from 'react';
import { useDisclosure } from '@heroui/react';

import { SectionTab, SquircleChip } from '@/components/deck/card';
import { useSpotify } from '@/context/spotify-context';
import { cn } from '@/lib/utils';

import SyncedLyrics, { type LyricsStatus } from './synced-lyrics';
import VinylModal from './vinyl-modal';

/** Format milliseconds as MM:SS. */
function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Progress percentage, clamped to 0-100. */
function progressPercent(progress: number, duration: number): number {
  if (duration <= 0) return 0;
  return Math.min(100, Math.max(0, (progress / duration) * 100));
}

const LYRICS_BADGE: Record<LyricsStatus, { label: string; dotClass: string }> = {
  loading: { label: 'FETCHING LRC', dotClass: 'bg-sky-300 animate-pulse' },
  synced: { label: 'SYNCED · LRC', dotClass: 'bg-sky-400' },
  plain: { label: 'PLAIN LYRICS', dotClass: 'bg-sky-300' },
  instrumental: { label: 'INSTRUMENTAL', dotClass: 'bg-[#95a0b8]' },
  unavailable: { label: 'NO LYRICS', dotClass: 'bg-[#95a0b8]' },
};

export default function SpotifyNowPlaying({ className }: { className?: string }) {
  const { track, recentTrack, progress, loading, error, isPlaying, dominantColor } =
    useSpotify();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [lyricsStatus, setLyricsStatus] = useState<LyricsStatus>('loading');

  const showSkeleton = loading && !track && !recentTrack;
  const displayTrack = track ?? recentTrack;
  const isLive = isPlaying && Boolean(track);

  const duration = displayTrack?.duration_ms || 0;
  const currentProgress = isLive ? progress : 0;
  const percent = progressPercent(currentProgress, duration);
  const badgeInfo = LYRICS_BADGE[lyricsStatus];

  return (
    <>
      <section
        id="now-playing"
        className={cn('relative border-t border-white/10 bg-[#06080f]', className)}
      >
        {/* Top border laser intersection highlight matching landing page */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-[1px] left-1/2 h-[2px] w-48 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-200 to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rounded-full bg-sky-400/25 blur-md"
        />

        <div className="mx-auto max-w-[1160px] border-x border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.06fr_0.94fr] lg:divide-x lg:divide-white/10">
            {/* ==================== LEFT COLUMN: ACTIVE PLAYER & TELEMETRY ==================== */}
            <div className="relative flex flex-col justify-between overflow-hidden">
              {/* Subtle ambient glow when a track is loaded */}
              {displayTrack ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle at 20% 35%, ${
                      dominantColor || '#38bdf8'
                    } 0%, transparent 70%)`,
                  }}
                />
              ) : null}

              {/* Top Section Tab + Live Status Pill */}
              <div className="relative z-10 flex items-center justify-between pr-6">
                <SectionTab label="NOW PLAYING" />
                <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d111c] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/90">
                  <span className="relative flex h-2 w-2">
                    {isLive ? (
                      <span className="signal-ping absolute inline-flex h-full w-full rounded-full bg-sky-400" />
                    ) : null}
                    <span
                      className={cn(
                        'relative inline-flex h-2 w-2 rounded-full',
                        isLive
                          ? 'bg-sky-400'
                          : showSkeleton
                            ? 'bg-sky-300 animate-pulse'
                            : error
                              ? 'bg-red-400'
                              : 'bg-[#95a0b8]'
                      )}
                    />
                  </span>
                  {showSkeleton
                    ? 'PROBING STREAM'
                    : error
                      ? 'STREAM OFFLINE'
                      : isLive
                        ? 'LIVE STREAMING'
                        : 'IDLE · LAST PLAYED'}
                </span>
              </div>

              {/* Player Body */}
              <div className="relative z-10 px-7 pb-10 pt-8 sm:px-10 sm:pb-12 sm:pt-10">
                {showSkeleton ? (
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="size-40 shrink-0 animate-pulse rounded-2xl border border-white/10 bg-white/[0.06] sm:size-44" />
                    <div className="flex w-full flex-col gap-3">
                      <div className="h-3.5 w-28 animate-pulse rounded bg-white/10" />
                      <div className="h-7 w-3/4 animate-pulse rounded bg-white/10" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                      <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-white/10" />
                      <p className="mt-1 font-mono text-xs text-[#95a0b8]">
                        Syncing playback state from audio telemetry...
                      </p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="rounded-xl border border-white/10 bg-[#0b0f1a]/90 p-6">
                    <p className="font-mono text-xs uppercase tracking-[0.1em] text-amber-300">
                      TELEMETRY INTERRUPTED
                    </p>
                    <p className="mt-2 font-sans text-base text-white">
                      Spotify telemetry could not be reached right now.
                    </p>
                    <p className="mt-1 font-sans text-sm text-[#95a0b8]">
                      The live playback feed will automatically reconnect on the next 10-second poll cycle.
                    </p>
                  </div>
                ) : !displayTrack ? (
                  <div className="rounded-xl border border-white/10 bg-[#0b0f1a]/90 p-6">
                    <p className="font-mono text-xs uppercase tracking-[0.1em] text-sky-300">
                      NO ACTIVE SIGNAL
                    </p>
                    <p className="mt-2 font-sans text-base text-white">
                      No track is currently playing or recorded in recent session state.
                    </p>
                    <p className="mt-1 font-sans text-sm text-[#95a0b8]">
                      Browse the recent listening log or top rotation below.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-7">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-7">
                      {/* Hardware Socket Frame for Album Artwork */}
                      <button
                        type="button"
                        onClick={onOpen}
                        aria-label={`Open full lyrics modal for ${displayTrack.name}`}
                        className="lumina-socket group relative shrink-0 self-start !p-2.5 text-left transition-transform hover:-translate-y-0.5 sm:!p-3"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -left-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300 bg-sky-400"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute -right-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300 bg-sky-400"
                        />
                        <div className="relative overflow-hidden rounded-2xl">
                          <img
                            alt={`${displayTrack.name} album cover`}
                            src={displayTrack.albumImageUrl || '/placeholder-album.png'}
                            className="size-36 object-cover transition-transform duration-300 group-hover:scale-105 sm:size-44"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06080f]/90 via-[#06080f]/45 to-transparent px-3 py-2">
                            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-sky-200">
                              INSPECT LYRICS ↗
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Track Metadata & Progress Bar */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sky-300">
                            {isLive ? '▪ ACTIVE AUDIO CHANNEL' : '▪ LAST PLAYED RECORD'}
                          </span>
                          <h2 className="mt-2 text-balance font-sans text-2xl font-medium leading-tight tracking-[-0.025em] text-white sm:text-3xl">
                            {displayTrack.name}
                          </h2>
                          <p className="mt-1.5 font-sans text-base text-[#95a0b8]">
                            <span className="text-white/90">{displayTrack.artists}</span>
                            {displayTrack.album ? (
                              <>
                                <span aria-hidden="true" className="px-2 text-[#95a0b8]">
                                  ·
                                </span>
                                <span>{displayTrack.album}</span>
                              </>
                            ) : null}
                          </p>
                        </div>

                        {/* Progress Readout */}
                        <div className="rounded-xl border border-white/10 bg-[#0a0e18]/90 p-4">
                          <div className="flex items-center justify-between font-mono text-[11px] text-[#95a0b8]">
                            <span>{isLive ? 'PLAYBACK POSITION' : 'TRACK DURATION'}</span>
                            <span className="deck-readout text-white">
                              {formatTime(currentProgress)} /{' '}
                              {duration > 0 ? formatTime(duration) : '--:--'}
                            </span>
                          </div>
                          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-sky-400 transition-all duration-500"
                              style={{ width: `${isLive ? percent : 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                      <button
                        type="button"
                        onClick={onOpen}
                        className="lumina-btn-primary min-h-[44px]"
                      >
                        <span>OPEN LYRICS MODAL</span>
                      </button>

                      {displayTrack.url ? (
                        <a
                          href={displayTrack.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lumina-btn-secondary min-h-[44px]"
                        >
                          <span>OPEN IN SPOTIFY</span>
                          <span aria-hidden="true" className="text-sky-300">
                            ↗
                          </span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ==================== RIGHT COLUMN: INLINE LIVE SYNCED LYRICS CONSOLE ==================== */}
            <div className="lumina-dot-grid relative flex flex-col justify-between border-t border-white/10 p-7 sm:p-10 lg:border-t-0">
              {/* Top Console Header */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#95a0b8]">
                    ▪ LIVE LYRICS CONSOLE · LRCLIB
                  </span>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={cn('h-2 w-2 rounded-full', badgeInfo.dotClass)}
                    />
                    <span className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-white">
                      {displayTrack ? badgeInfo.label : 'STANDBY'}
                    </span>
                  </div>
                </div>
                <SquircleChip icon="music" idPrefix="now-playing-chip" size="sm" />
              </div>

              {/* Center Inline Lyrics Box */}
              <div className="my-6 rounded-xl border border-white/10 bg-[#0b0f1a]/95 p-5 shadow-lg backdrop-blur-md">
                {showSkeleton ? (
                  <div className="flex min-h-[240px] flex-col items-center justify-center gap-3">
                    <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
                    <div className="h-5 w-64 animate-pulse rounded bg-white/10" />
                    <div className="h-4 w-52 animate-pulse rounded bg-white/10" />
                    <p className="mt-2 font-mono text-xs text-[#95a0b8]">
                      Preparing lyric synchronization...
                    </p>
                  </div>
                ) : displayTrack ? (
                  <SyncedLyrics
                    artist={displayTrack.artists}
                    track={displayTrack.name}
                    album={displayTrack.album}
                    progress={currentProgress}
                    isPlaying={isLive}
                    variant="inline"
                    onStatusChange={setLyricsStatus}
                  />
                ) : (
                  <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-sky-300">
                      LYRICS ENGINE STANDBY
                    </span>
                    <p className="mt-2 max-w-[32ch] font-sans text-sm text-[#95a0b8]">
                      When a track plays and lyrics are available, time-synced lines appear here automatically.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Console Metadata & Expand Trigger */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#95a0b8]">
                  {isLive
                    ? 'AUTO-SYNCING WITH PLAYBACK PROGRESS'
                    : 'SHOWING TRANSCRIPT FOR LAST TRACK'}
                </span>

                {displayTrack ? (
                  <button
                    type="button"
                    onClick={onOpen}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-sky-300 transition-colors hover:text-white"
                  >
                    <span>EXPAND MODAL</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <VinylModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        progress={currentProgress}
        track={displayTrack}
      />
    </>
  );
}
