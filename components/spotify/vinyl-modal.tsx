'use client';

import { Modal, ModalContent, ModalBody } from "@heroui/react";

import SyncedLyrics from './synced-lyrics';

interface Track {
    name: string;
    artists: string;
    album: string;
    albumImageUrl: string;
    progress_ms: number;
    duration_ms: number;
    url: string;
    is_playing: boolean;
}

interface VinylModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    track: Track | null;
    progress: number;
}

/** Format milliseconds as MM:SS. */
function formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function VinylModal({ isOpen, onOpenChange, track, progress }: VinylModalProps) {
    if (!track) return null;

    const duration = track.duration_ms || 0;
    const percent = duration > 0 ? Math.min(100, Math.max(0, (progress / duration) * 100)) : 0;

    return (
        <Modal
            backdrop="blur"
            classNames={{
                base: "bg-transparent shadow-none outline-none",
                closeButton: "z-50 rounded-full text-deck-ink/60 hover:bg-deck-ink/10 active:bg-deck-ink/15",
                body: "outline-none",
                wrapper: "outline-none",
            }}
            isOpen={isOpen}
            size="xl"
            onOpenChange={onOpenChange}
        >
            <ModalContent className="outline-none">
                {() => (
                    <ModalBody className="select-none overflow-hidden rounded-card p-0 outline-none">
                        <div className="card-face relative flex min-h-[500px] flex-col">
                            {/* Kepala — lagu dan status pemutaran */}
                            <div className="flex items-center gap-4 border-b border-deck-ink/10 p-5">
                                <img
                                    alt={`${track.name} album cover`}
                                    src={track.albumImageUrl}
                                    className="size-16 shrink-0 rounded-card-sm object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    {track.is_playing ? (
                                        <span className="deck-readout inline-flex items-center gap-2 text-deck-sm text-deck-ink/60">
                                            <span aria-hidden="true" className="size-1.5 rounded-full bg-deck-red" />
                                            Streaming
                                        </span>
                                    ) : (
                                        <span className="deck-readout text-deck-sm text-deck-ink/60">
                                            Paused
                                        </span>
                                    )}
                                    <h2 className="mt-1 truncate text-deck-lg font-semibold text-deck-ink">
                                        {track.name}
                                    </h2>
                                    <p className="truncate text-deck-sm text-deck-ink/60">
                                        {track.artists}
                                    </p>
                                </div>
                            </div>

                            {/* Tengah — lirik tersinkron */}
                            <div className="flex flex-1 items-center justify-center p-5">
                                <div className="h-full w-full">
                                    <SyncedLyrics
                                        artist={track.artists}
                                        track={track.name}
                                        album={track.album}
                                        progress={progress}
                                        isPlaying={track.is_playing}
                                    />
                                </div>
                            </div>

                            {/* Bawah — bilah kemajuan tipis */}
                            <div className="mt-auto border-t border-deck-ink/10 p-5">
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
                    </ModalBody>
                )}
            </ModalContent>
        </Modal>
    );
}
