'use client';

import { Card, CardBody, Skeleton, Slider, useDisclosure } from "@heroui/react";
import GlassCard from "@/components/ui/glass-card";
import { RiSpotifyFill } from 'react-icons/ri';
import VinylModal from './vinyl-modal';
import { useSpotify } from "@/context/spotify-context";
import { motion } from 'framer-motion';

// Music Wave Component
const MusicWave = () => (
  <div className="music-wave">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

export default function SpotifyNowPlaying({ className }: { className?: string }) {
  const { track, recentTrack, progress, loading, error, isPlaying } = useSpotify();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  // Show skeleton only on initial load when we have no data at all
  const showSkeleton = loading && !track && !recentTrack;

  // Determine which track to display - either currently playing or most recent
  const displayTrack = track || recentTrack;

  if (showSkeleton) return (
    <div className="relative w-full h-[300px] rounded-3xl overflow-hidden">
      <Skeleton className="w-full h-full rounded-3xl" />
    </div>
  );

  if (error) return (
    <GlassCard intensity="medium" className="w-full p-8">
      <div className="flex items-center justify-center gap-3">
        <RiSpotifyFill size={24} className="text-red-500" />
        <p className="text-red-500">Failed to load Spotify data</p>
      </div>
    </GlassCard>
  );

  // No track data at all
  if (!displayTrack) return (
    <GlassCard intensity="medium" className="w-full p-12">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-foreground/5 rounded-full">
          <RiSpotifyFill size={48} className="text-foreground/30" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground/70">No recent tracks</h3>
          <p className="text-sm text-foreground/50">Start listening on Spotify</p>
        </div>
      </div>
    </GlassCard>
  );

  // Check if currently playing a track
  const showIdleState = !isPlaying && !track;

  return (
    <>
      {/* Hero Now Playing Card */}
      <motion.div
        onClick={displayTrack ? onOpen : undefined}
        className={`cursor-pointer group ${className}`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative w-full rounded-3xl overflow-hidden hover-glow">
          {/* Blurred Album Art Background */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Background"
              src={displayTrack?.albumImageUrl || '/placeholder-album.png'}
              className="w-full h-full object-cover scale-125 blur-2xl opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
          </div>

          {/* Glass Overlay */}
          <div className="relative z-10 backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl">
            <div className="p-6 md:p-8">
              {showIdleState ? (
                // Idle state - not listening to anything
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="relative">
                    <RiSpotifyFill size={64} className="text-white/20" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-white/70">Not listening right now</h3>
                    <p className="text-sm text-white/50 mt-1">Spotify is idle</p>
                  </div>
                </div>
              ) : (
                // Playing or last played state
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                  {/* Album Art */}
                  <motion.div
                    className="relative shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      alt="Album cover"
                      className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl shadow-2xl"
                      src={displayTrack?.albumImageUrl || '/placeholder-album.png'}
                    />
                    {isPlaying && (
                      <div className="absolute -bottom-2 -right-2 p-2 bg-green-500 rounded-full shadow-lg spotify-glow">
                        <RiSpotifyFill size={20} className="text-white" />
                      </div>
                    )}
                  </motion.div>

                  {/* Track Info */}
                  <div className="flex-1 flex flex-col justify-center text-center md:text-left min-w-0">
                    {/* Status Badge */}
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      {isPlaying ? (
                        <>
                          <MusicWave />
                          <span className="text-green-400 text-sm font-medium uppercase tracking-wider">Now Playing</span>
                        </>
                      ) : (
                        <>
                          <RiSpotifyFill size={16} className="text-white/60" />
                          <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Last Played</span>
                        </>
                      )}
                    </div>

                    {/* Song Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-white truncate mb-2">
                      {displayTrack?.name}
                    </h1>

                    {/* Artist & Album */}
                    <p className="text-white/70 text-lg truncate mb-6">
                      {displayTrack?.artists}
                      <span className="mx-2 text-white/30">•</span>
                      <span className="text-white/50">{displayTrack?.album}</span>
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full">
                      <Slider
                        aria-label="Music progress"
                        classNames={{
                          base: "w-full",
                          track: "bg-white/20 h-1",
                          filler: "bg-gradient-to-r from-green-400 to-green-500 h-1",
                          thumb: "w-3 h-3 after:w-3 after:h-3 after:bg-white opacity-0 group-hover:opacity-100 transition-opacity",
                        }}
                        color="success"
                        value={isPlaying ? progress : 0}
                        maxValue={displayTrack?.duration_ms || 100}
                        size="sm"
                        isDisabled
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-white/50">{isPlaying ? formatTime(progress) : '00:00'}</span>
                        <span className="text-xs text-white/50">{formatTime(displayTrack?.duration_ms || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <VinylModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        track={displayTrack}
        progress={progress}
      />
    </>
  );
}
