'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from "@heroui/react";
import { RiSpotifyFill, RiPlayFill } from 'react-icons/ri';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';

interface Track {
  name: string;
  artists: string;
  album: string;
  albumImageUrl: string;
  url: string;
  playedAt?: string;
}

export default function SpotifyRecentlyPlayed() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://${process.env.NEXT_PUBLIC_API_URL}/api/spotify/recently-played?limit=9`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setTracks(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard intensity="medium" className="p-6">
        <div className="flex items-center justify-center gap-3">
          <RiSpotifyFill size={24} className="text-red-500" />
          <p className="text-red-500">Failed to load recently played</p>
        </div>
      </GlassCard>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <GlassCard intensity="medium" className="p-6">
        <div className="flex items-center justify-center gap-3">
          <RiSpotifyFill size={24} className="text-foreground/40" />
          <p className="text-foreground/60">No recently played tracks</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tracks.map((track, index) => (
        <motion.a
          key={`${track.name}-${index}`}
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
        >
          <GlassCard
            intensity="low"
            className="p-4 h-full transition-all duration-300 group-hover:bg-white/10 dark:group-hover:bg-white/10"
          >
            <div className="flex items-center gap-4">
              {/* Album Art */}
              <div className="relative shrink-0 overflow-hidden rounded-lg">
                <img
                  alt={`${track.name} album cover`}
                  src={track.albumImageUrl}
                  className="w-14 h-14 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Play overlay on hover */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <RiPlayFill size={24} className="text-white" />
                </div>
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-green-400 transition-colors duration-300">
                  {track.name}
                </h3>
                <p className="text-sm text-foreground/60 truncate">
                  {track.artists}
                </p>
                {track.playedAt && (
                  <p className="text-xs text-foreground/40">
                    {formatTimeAgo(track.playedAt)}
                  </p>
                )}
              </div>

              {/* Spotify Icon */}
              <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <RiSpotifyFill size={20} className="text-green-500" />
              </div>
            </div>
          </GlassCard>
        </motion.a>
      ))}
    </div>
  );
}
