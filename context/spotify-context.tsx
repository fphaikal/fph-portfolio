'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef, useMemo } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { Track } from '@/types';
import { getApiBaseUrl } from '@/lib/utils';

interface SpotifyContextType {
  track: Track | null;
  recentTrack: Track | null;
  dominantColor: string | null;
  colorPalette: string[]; // Array of 3 colors for the 3 blobs
  isPlaying: boolean;
  progress: number;
  loading: boolean;
  error: boolean;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [recentTrack, setRecentTrack] = useState<Track | null>(null);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [colorPalette, setColorPalette] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const initialLoadDone = useRef(false);
  const previousTrackRef = useRef<Track | null>(null);

  // Memoize FastAverageColor instance to avoid recreation on every render
  const fac = useMemo(() => new FastAverageColor(), []);

  // Helper function to adjust color brightness/saturation
  const adjustColor = (hex: string, hueShift: number, saturationMult: number, lightnessMult: number): string => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Convert RGB to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
        case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
        case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
      }
    }

    // Adjust HSL values
    h = (h + hueShift / 360) % 1;
    if (h < 0) h += 1;
    s = Math.min(1, Math.max(0, s * saturationMult));
    l = Math.min(1, Math.max(0, l * lightnessMult));

    // Convert HSL back to RGB
    let rOut, gOut, bOut;
    if (s === 0) {
      rOut = gOut = bOut = Math.round(l * 255);
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      rOut = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
      gOut = Math.round(hue2rgb(p, q, h) * 255);
      bOut = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    }

    return `#${rOut.toString(16).padStart(2, '0')}${gOut.toString(16).padStart(2, '0')}${bOut.toString(16).padStart(2, '0')}`;
  };

  const extractColors = async (imageUrl: string) => {
    try {
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
      const color = await fac.getColorAsync(proxyUrl, {
        algorithm: 'dominant',
        ignoredColor: [
          [0, 0, 0, 255, 100],
          [255, 255, 255, 255, 100],
        ],
      });

      const dominantHex = color.hex;
      setDominantColor(dominantHex);

      // Create 3 color variations for the blobs
      const color1 = adjustColor(dominantHex, 0, 1.2, 0.9);
      const color2 = adjustColor(dominantHex, 30, 1.0, 1.1);
      const color3 = adjustColor(dominantHex, -30, 0.9, 0.8);

      setColorPalette([color1, color2, color3]);
    } catch (err) {
      console.error("Failed to extract colors:", err);
      // Fallback colors
      const fallbackPalette = ['#e91e63', '#9c27b0', '#673ab7'];
      setDominantColor('#e91e63');
      setColorPalette(fallbackPalette);
    }
  };

  const fetchNowPlaying = async () => {
    try {
      let activeTrack: Track | null = null;

      // 1. Primary: Activity API (Windows, YouTube, Nocan, browser)
      try {
        const actRes = await fetch(`${getApiBaseUrl()}/api/activity/now-playing`);
        if (actRes.ok) {
          const actData = await actRes.json();
          if (actData.success && actData.data && actData.data.is_playing && actData.data.title) {
            const item = actData.data;
            activeTrack = {
              name: item.title,
              artists: item.artist || 'Unknown Artist',
              album: item.album || '',
              albumImageUrl: item.album_art_url || '/placeholder-album.png',
              progress_ms: item.position_ms ?? 0,
              duration_ms: item.duration_ms ?? 0,
              url: item.url || '',
              is_playing: true,
            };
          }
        }
      } catch (err) {
        console.warn("Failed to fetch activity now playing:", err);
      }

      // 2. Secondary fallback: Spotify API
      if (!activeTrack) {
        try {
          const spRes = await fetch(`${getApiBaseUrl()}/api/spotify/now-playing`);
          if (spRes.ok) {
            const spData = await spRes.json();
            if (spData.success && spData.data && spData.data.is_playing) {
              activeTrack = spData.data;
            }
          }
        } catch {
          // ignore spotify fallback error
        }
      }

      if (activeTrack) {
        // If track changed, move previous track to recent
        if (previousTrackRef.current && previousTrackRef.current.name !== activeTrack.name) {
          setRecentTrack(previousTrackRef.current);
        }

        previousTrackRef.current = activeTrack;
        setTrack(activeTrack);
        setProgress(activeTrack.progress_ms || 0);
        setIsPlaying(true);
        setError(false);

        if (activeTrack.albumImageUrl && activeTrack.albumImageUrl !== '/placeholder-album.png') {
          await extractColors(activeTrack.albumImageUrl);
        }
      } else {
        // No song playing
        if (previousTrackRef.current) {
          setRecentTrack(previousTrackRef.current);
        }

        setTrack(null);
        setIsPlaying(false);
        setProgress(0);
        setDominantColor(null);
        setColorPalette([]);
        setError(false);
      }

      setLoading(false);
      initialLoadDone.current = true;
    } catch (err) {
      console.error("Failed to fetch now playing:", err);
      setError(true);
      setLoading(false);
    }
  };

  const fetchRecentTrack = async () => {
    if (recentTrack) return;

    try {
      // 1. Try activity history first
      try {
        const actRes = await fetch(`${getApiBaseUrl()}/api/activity/history?limit=1`);
        if (actRes.ok) {
          const actData = await actRes.json();
          if (actData.success && Array.isArray(actData.data) && actData.data.length > 0) {
            const item = actData.data[0];
            setRecentTrack({
              name: item.title,
              artists: item.subtitle || 'Unknown Artist',
              album: item.details?.album || item.source || '',
              albumImageUrl: item.details?.album_art_url || '/placeholder-album.png',
              progress_ms: 0,
              duration_ms: item.details?.duration_ms || 0,
              url: item.url || '',
              is_playing: false,
            });
            return;
          }
        }
      } catch {}

      // 2. Fallback to spotify history DB
      const response = await fetch(`${getApiBaseUrl()}/api/spotify/recently-played-db?limit=1&offset=0`);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.data?.data && Array.isArray(responseData.data.data) && responseData.data.data.length > 0) {
          const result: Track = responseData.data.data[0];
          setRecentTrack(result);
        }
      }
    } catch (err) {
      console.error("Failed to fetch recent track:", err);
    }
  };
  useEffect(() => {
    // Initial fetch
    fetchNowPlaying();
    fetchRecentTrack();

    // Poll every 10 seconds for more balanced updates (was 5s, now 10s for performance)
    const interval = setInterval(() => {
      fetchNowPlaying();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Progress update effect
  useEffect(() => {
    if (!isPlaying || !track) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1000;
        if (track.duration_ms && newProgress >= track.duration_ms) {
          // Song ended, fetch new data
          fetchNowPlaying();
          return 0;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [isPlaying, track]);

  return (
    <SpotifyContext.Provider value={{
      track,
      recentTrack,
      dominantColor,
      colorPalette,
      isPlaying,
      progress,
      loading,
      error
    }}>
      {children}
    </SpotifyContext.Provider>
  );
};
