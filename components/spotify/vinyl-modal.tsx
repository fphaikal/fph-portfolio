'use client';

import { Modal, ModalContent, ModalBody } from '@heroui/react';

import { SectionTab } from '@/components/deck/card';
import SyncedLyrics from './synced-lyrics';

export interface ModalTrack {
  name: string;
  artists: string;
  album: string;
  albumImageUrl: string;
  progress_ms?: number;
  duration_ms?: number;
  url?: string;
  is_playing?: boolean;
}

interface VinylModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  track: ModalTrack | null;
  progress: number;
}

/** Format milliseconds as MM:SS. */
function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function VinylModal({
  isOpen,
  onOpenChange,
  track,
  progress,
}: VinylModalProps) {
  if (!track) return null;

  const duration = track.duration_ms || 0;
  const activeProgress = track.is_playing ? progress : 0;
  const percent =
    duration > 0
      ? Math.min(100, Math.max(0, (activeProgress / duration) * 100))
      : 0;

  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: 'bg-transparent shadow-none',
        closeButton:
          'z-50 top-3 right-3 h-11 w-11 flex items-center justify-center rounded-lg border border-white/15 bg-[#0a0f1c]/90 text-white hover:border-sky-300/50 hover:bg-[#131b2e]',
        body: 'p-0',
      }}
      isOpen={isOpen}
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <ModalBody className="overflow-hidden rounded-2xl border border-white/15 bg-[#06080f] p-0 shadow-2xl">
            <div className="relative flex min-h-[520px] flex-col overflow-hidden">
              {/* Blurred Album Art Background with high-contrast obsidian scrim */}
              {track.albumImageUrl ? (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                  <img
                    alt=""
                    src={track.albumImageUrl}
                    className="h-full w-full scale-125 object-cover opacity-30 blur-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#06080f]/85 via-[#06080f]/90 to-[#06080f]/95" />
                </div>
              ) : null}

              {/* Top Chamfered Section Tab */}
              <div className="relative z-10 flex items-center justify-between pr-16">
                <SectionTab
                  label={track.is_playing ? 'LIVE LYRICS STREAM' : 'TRACK LYRICS INSPECTOR'}
                />
              </div>

              {/* Track Header */}
              <div className="relative z-10 flex flex-col gap-4 border-b border-white/10 px-6 pb-5 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <img
                    alt={`${track.name} album cover`}
                    src={track.albumImageUrl || '/placeholder-album.png'}
                    className="size-16 shrink-0 rounded-xl border border-white/15 object-cover shadow-lg sm:size-20"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1220] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/90">
                      <span
                        aria-hidden="true"
                        className={
                          track.is_playing
                            ? 'size-2 rounded-full bg-sky-400'
                            : 'size-2 rounded-full bg-[#95a0b8]'
                        }
                      />
                      <span>{track.is_playing ? 'NOW PLAYING' : 'RECORDED TRACK'}</span>
                    </div>
                    <h2 className="mt-1.5 truncate font-sans text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                      {track.name}
                    </h2>
                    <p className="mt-0.5 truncate font-sans text-sm text-[#95a0b8]">
                      {track.artists}
                      {track.album ? ` · ${track.album}` : ''}
                    </p>
                  </div>
                </div>

                {track.url ? (
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lumina-btn-secondary shrink-0 self-start sm:self-center"
                  >
                    <span>OPEN TRACK</span>
                    <span aria-hidden="true" className="text-sky-300">
                      ↗
                    </span>
                  </a>
                ) : null}
              </div>

              {/* Center: Synced Lyrics Stage */}
              <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-5">
                <SyncedLyrics
                  artist={track.artists}
                  track={track.name}
                  album={track.album}
                  progress={activeProgress}
                  isPlaying={Boolean(track.is_playing)}
                  variant="modal"
                />
              </div>

              {/* Bottom: Progress Telemetry Bar */}
              <div className="relative z-10 mt-auto border-t border-white/10 bg-[#070a13]/90 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="deck-readout shrink-0 text-xs text-[#95a0b8]">
                    {formatTime(activeProgress)}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-sky-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="deck-readout shrink-0 text-xs text-[#95a0b8]">
                    {duration > 0 ? formatTime(duration) : '--:--'}
                  </span>
                </div>
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
