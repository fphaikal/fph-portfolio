'use client';

import { useDisclosure } from "@heroui/react";

import { Card } from "@/components/deck/card";
import { useSpotify } from "@/context/spotify-context";
import { cn } from "@/lib/utils";
import type { Track } from "@/types";

import VinylModal from './vinyl-modal';

/** Format milliseconds as MM:SS. */
function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Progress percentage, clamped to 0–100. */
function progressPercent(progress: number, duration: number): number {
  if (duration <= 0) return 0;
  return Math.min(100, Math.max(0, (progress / duration) * 100));
}

interface ActiveTrackProps {
  track: Track;
  progress: number;
  onOpen: () => void;
}

/** Lagu yang sedang diputar. */
function ActiveTrack({ track, progress, onOpen }: ActiveTrackProps) {
  const duration = track.duration_ms || 0;
  const percent = progressPercent(progress, duration);

  return (
    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
      <button
        aria-label={`Open details for ${track.name}`}
        className="group shrink-0 rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deck-red"
        type="button"
        onClick={onOpen}
      >
        <img
          alt={`${track.name} album cover`}
          className="size-40 rounded-card object-cover sm:size-48"
          src={track.albumImageUrl || '/placeholder-album.png'}
        />
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="min-w-0">
          <h2 className="truncate text-deck-xl font-semibold text-deck-ink">
            {track.name}
          </h2>
          <p className="mt-1 truncate text-deck-base text-deck-ink/65">
            {track.artists}
            <span aria-hidden="true" className="px-1.5 text-deck-ink/40">
              ·
            </span>
            {track.album}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="deck-readout shrink-0 text-deck-xs text-deck-ink/60">
            {formatTime(progress)}
          </span>
          <div className="h-[3px] flex-1 overflow-hidden rounded-pip bg-deck-ink/10">
            <div
              className="h-full rounded-pip bg-deck-red"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="deck-readout shrink-0 text-deck-xs text-deck-ink/60">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

interface IdleTrackProps {
  lastKnown: Track | null;
  onOpen: () => void;
}

/** Keadaan menganggur — tidak ada yang diputar. */
function IdleTrack({ lastKnown, onOpen }: IdleTrackProps) {
  if (!lastKnown) {
    return (
      <p className="deck-readout mt-6 text-deck-base text-deck-ink/70">
        Nothing is on the table right now.
      </p>
    );
  }

  return (
    <button
      className="group mt-6 flex w-full items-center gap-4 rounded-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deck-red"
      type="button"
      onClick={onOpen}
    >
      <img
        alt={`${lastKnown.name} album cover`}
        className="size-12 shrink-0 rounded-card-sm object-cover"
        src={lastKnown.albumImageUrl || '/placeholder-album.png'}
      />
      <div className="min-w-0 flex-1">
        <span className="deck-eyebrow block">Last played</span>
        <p className="mt-1 truncate text-deck-base font-medium text-deck-ink">
          {lastKnown.name}
        </p>
        <p className="truncate text-deck-sm text-deck-ink/60">
          {lastKnown.artists}
        </p>
      </div>
      {lastKnown.duration_ms ? (
        <span className="deck-readout shrink-0 text-deck-xs text-deck-ink/60">
          {formatTime(lastKnown.duration_ms)}
        </span>
      ) : null}
    </button>
  );
}

export default function SpotifyNowPlaying({ className }: { className?: string }) {
  const { track, recentTrack, progress, loading, error, isPlaying } = useSpotify();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Skeleton hanya saat pemuatan awal tanpa data sama sekali.
  const showSkeleton = loading && !track && !recentTrack;
  const lastKnown = track ?? recentTrack;
  const isLive = isPlaying && Boolean(track);

  const header = (
    <div className="flex items-center justify-between gap-3">
      <span className="deck-eyebrow">Now playing</span>
      {isLive ? (
        <span className="deck-readout inline-flex items-center gap-2 text-deck-xs text-deck-ink/60">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-deck-red" />
          Streaming
        </span>
      ) : (
        <span className="deck-readout text-deck-xs text-deck-ink/60">Idle</span>
      )}
    </div>
  );

  if (showSkeleton) {
    return (
      <Card className={cn(className)} contentClassName="p-6 sm:p-8">
        {header}
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="size-40 shrink-0 animate-pulse rounded-card bg-deck-ink/10 sm:size-48" />
          <div className="flex w-full flex-col gap-3">
            <div className="h-3 w-24 animate-pulse rounded-pip bg-deck-ink/10" />
            <div className="h-6 w-3/4 animate-pulse rounded-pip bg-deck-ink/10" />
            <div className="h-4 w-1/2 animate-pulse rounded-pip bg-deck-ink/10" />
            <div className="mt-4 h-[3px] w-full animate-pulse rounded-pip bg-deck-ink/10" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn(className)} contentClassName="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="deck-eyebrow">Now playing</span>
          <span className="deck-readout text-deck-xs text-deck-ink/60">Unavailable</span>
        </div>
        <p className="mt-6 text-deck-base text-deck-ink/70">
          We couldn&apos;t reach Spotify right now. Please check back in a
          moment.
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn(className)} contentClassName="p-6 sm:p-8">
        {header}
        {isLive && track ? (
          <ActiveTrack onOpen={onOpen} progress={progress} track={track} />
        ) : (
          <IdleTrack lastKnown={lastKnown} onOpen={onOpen} />
        )}
      </Card>

      <VinylModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        progress={progress}
        track={lastKnown}
      />
    </>
  );
}
