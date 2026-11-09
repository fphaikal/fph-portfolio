import type { Metadata } from "next";

import MusicHero from "@/components/spotify/music-hero";
import SpotifyNowPlaying from "@/components/spotify/now-playing";
import SpotifyRecentlyPlayed from "@/components/spotify/recently-played";
import SpotifyTopTracks from "@/components/spotify/top-tracks";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Music Activity | ${siteConfig.fullName}`,
  description: `Current and recently played music with live synced lyrics from ${siteConfig.fullName} (${siteConfig.name}).`,
  alternates: { canonical: "/music" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/music`,
    title: `Music Activity | ${siteConfig.fullName}`,
    description: `Music activity and live synced lyrics from ${siteConfig.fullName}.`,
  },
};

export default function MusicPage() {
  return (
    <>
      <MusicHero />
      <SpotifyNowPlaying />
      <SpotifyRecentlyPlayed />
      <SpotifyTopTracks />
    </>
  );
}
