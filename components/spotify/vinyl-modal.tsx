'use client';

import { Modal, ModalContent, ModalBody, Image, Slider } from "@heroui/react";
import { RiSpotifyFill } from "react-icons/ri";
import SyncedLyrics from './synced-lyrics';

interface Track {
    [x: string]: any;
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

export default function VinylModal({ isOpen, onOpenChange, track, progress }: VinylModalProps) {
    if (!track) return null;

    const formatTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');
        return `${paddedMinutes}:${paddedSeconds}`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xl"
            backdrop="blur"
            classNames={{
                base: "bg-transparent shadow-none outline-none",
                closeButton: "text-white hover:bg-white/10 active:bg-white/20 z-50",
                body: "outline-none",
                wrapper: "outline-none",
            }}
        >
            <ModalContent className="outline-none">
                {(onClose) => (
                    <ModalBody className="p-0 overflow-hidden rounded-3xl select-none outline-none">
                        {/* Container with blurred background and glass border */}
                        <div
                            className="relative min-h-[500px] flex flex-col outline-none rounded-3xl border border-white/20 overflow-hidden"
                            style={{
                                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -1px 1px rgba(0,0,0,0.1)"
                            }}
                        >
                            {/* Blurred Album Art Background */}
                            <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                                <img
                                    alt="Background"
                                    src={track.albumImageUrl}
                                    className="w-full h-full object-cover scale-125 blur-2xl"
                                />
                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-black/60" />
                            </div>

                            {/* Top-left highlight for 3D glass effect */}
                            <div
                                className="absolute inset-0 pointer-events-none rounded-3xl z-[1]"
                                style={{
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 30%, transparent 100%)",
                                }}
                            />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col min-h-[500px] p-6">
                                {/* Top: Album art + Title */}
                                <div className="flex items-center gap-4 mb-4">
                                    <Image
                                        alt="Album cover"
                                        src={track.albumImageUrl}
                                        className="w-16 h-16 rounded-lg object-cover shadow-lg"
                                        removeWrapper
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className={`flex gap-2 items-center mb-1 ${track.is_playing ? "text-green-400" : "text-white/70"}`}>
                                            <RiSpotifyFill size={18} />
                                            <span className="text-sm font-medium">{track.is_playing ? 'Now Playing' : 'Paused'}</span>
                                        </div>
                                        <h2 className="text-white text-lg font-bold leading-tight truncate">{track.name}</h2>
                                        <p className="text-white/70 text-sm truncate">{track.artists}</p>
                                    </div>
                                </div>

                                {/* Center: Lyrics - takes remaining space */}
                                <div className="flex-1 flex items-center justify-center min-h-[280px]">
                                    <div className="w-full h-full">
                                        <SyncedLyrics
                                            artist={track.artists}
                                            track={track.name}
                                            album={track.album}
                                            progress={progress}
                                            isPlaying={track.is_playing}
                                        />
                                    </div>
                                </div>

                                {/* Bottom: Progress bar - always at bottom */}
                                <div className="mt-auto pt-4">
                                    <Slider
                                        aria-label="Music progress"
                                        classNames={{
                                            track: "bg-white/20",
                                            filler: "bg-white",
                                            thumb: "w-3 h-3 after:w-3 after:h-3 after:bg-white",
                                        }}
                                        color="foreground"
                                        value={progress}
                                        maxValue={track.duration_ms}
                                        size="sm"
                                        isDisabled
                                    />
                                    <div className="flex justify-between text-xs text-white/60 mt-1">
                                        <span>{formatTime(progress)}</span>
                                        <span>{formatTime(track.duration_ms)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                )}
            </ModalContent>
        </Modal>
    );
}
