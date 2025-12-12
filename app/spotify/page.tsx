import SpotifyNowPlaying from "@/components/spotify/now-playing";
import SpotifyRecentlyPlayed from "@/components/spotify/recently-played";
import { RiSpotifyFill } from "react-icons/ri";

export default function SpotifyPage() {
  return (
    <div className="flex flex-col w-full gap-8 pb-16">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-green-500/20 rounded-2xl">
          <RiSpotifyFill size={32} className="text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-spotify-gradient">Spotify</h1>
          <p className="text-foreground/60 text-sm">My music activity</p>
        </div>
      </div>

      {/* Now Playing - Hero Section */}
      <section className="w-full">
        <SpotifyNowPlaying />
      </section>

      {/* Recently Played Section */}
      <section className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Recently Played</h2>
        </div>
        <SpotifyRecentlyPlayed />
      </section>
    </div>
  );
}
