import type { Metadata } from "next";

import SpotifyNowPlaying from "@/components/spotify/now-playing";
import SpotifyRecentlyPlayed from "@/components/spotify/recently-played";
import SpotifyTopTracks from "@/components/spotify/top-tracks";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Spotify Activity | ${siteConfig.fullName}`,
  description: `Current and recently played music from ${siteConfig.fullName} (${siteConfig.name}).`,
  alternates: { canonical: "/spotify" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/spotify`,
    title: `Spotify Activity | ${siteConfig.fullName}`,
    description: `Music activity from ${siteConfig.fullName}.`,
  },
};

export default function SpotifyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24 pt-28 sm:pt-36">
      <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="lumina-pill">
          <span aria-hidden="true" className="inline-block h-[5px] w-[5px] bg-white" />
          <span>AUDIO TELEMETRY</span>
        </div>
        <h1 className="mt-6 text-balance font-sans text-4xl font-light tracking-[-0.035em] text-white sm:text-6xl">
          What I&apos;m{" "}
          <span className="font-serif italic font-normal text-[#a8ceff]">listening to</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-sans text-base text-[#8d96aa]">
          A live look at the music on my Spotify — what&apos;s playing right now and what I&apos;ve
          had on repeat lately.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-8 sm:mt-16">
        <SpotifyNowPlaying />
        <SpotifyRecentlyPlayed />
        <SpotifyTopTracks />
      </div>
    </div>
  );
}
