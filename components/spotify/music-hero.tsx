'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import { SquircleChip } from '@/components/deck/card';
import { useSpotify } from '@/context/spotify-context';

export default function MusicHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const { track, isPlaying } = useSpotify();
  const isLive = isPlaying && Boolean(track);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo(
        '[data-music-pill]',
        { y: 18, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9 },
        0.05
      )
        .fromTo(
          '[data-music-word]',
          { y: 36, opacity: 0, rotateX: -24, transformPerspective: 900 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.09,
            duration: 1.1,
          },
          0.15
        )
        .fromTo(
          '[data-music-sub]',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          0.35
        )
        .fromTo(
          '[data-music-cta]',
          { y: 18, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.85 },
          0.45
        )
        .fromTo(
          '[data-music-chip]',
          { y: -20, scale: 0.72, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'back.out(1.7)' },
          0.55
        )
        .fromTo(
          '[data-music-laser]',
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, duration: 0.7, ease: 'power2.out' },
          0.7
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="lumina-bridge-bg relative isolate overflow-hidden px-6 pt-28 sm:pt-36"
    >
      {/* Micro dot-matrix texture on left and right flanks matching landing page */}
      <div
        aria-hidden="true"
        className="lumina-micro-matrix pointer-events-none absolute inset-x-0 top-0 h-80 opacity-55 [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black_82%)]"
      />

      {/* Atmospheric radial spotlight behind headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] h-[340px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(135,196,255,0.2)_0%,rgba(44,108,214,0.07)_52%,transparent_75%)] blur-2xl"
      />

      <div className="relative z-10 mx-auto flex max-w-[860px] flex-col items-center text-center">
        {/* Pill Badge */}
        <div data-music-pill className="lumina-pill will-change-transform">
          <span
            aria-hidden="true"
            className={
              isLive
                ? 'inline-block h-[6px] w-[6px] rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]'
                : 'inline-block h-[5px] w-[5px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
            }
          />
          <span>
            {isLive && track
              ? `STREAMING NOW · ${track.name.toUpperCase()}`
              : 'AUDIO TELEMETRY · LIVE PLAYBACK & LRC SYNC'}
          </span>
        </div>

        {/* Mixed Sans + Italic Serif Headline matching Landing Page */}
        <h1 className="mt-7 text-balance text-[38px] font-light leading-[1.06] tracking-[-0.035em] text-[#e8f2ff] drop-shadow-[0_4px_24px_rgba(12,28,68,0.45)] sm:text-[58px] md:text-[68px]">
          <span
            data-music-word
            className="inline-block font-sans font-light text-[#e6f1ff] will-change-transform"
          >
            What I&apos;m&nbsp;
          </span>
          <span
            data-music-word
            className="inline-block font-serif italic font-normal tracking-[-0.01em] text-[#a8ceff] drop-shadow-[0_0_28px_rgba(147,197,253,0.35)] will-change-transform"
          >
            Listening To
          </span>
          <br />
          <span
            data-music-word
            className="inline-block font-serif italic font-normal tracking-[-0.01em] text-[#e6f1ff] will-change-transform"
          >
            With Live&nbsp;
          </span>
          <span
            data-music-word
            className="inline-block font-sans font-light text-[#d2e6ff] will-change-transform"
          >
            Synced Lyrics
          </span>
        </h1>

        <p
          data-music-sub
          className="mx-auto mt-5 max-w-[54ch] font-sans text-base leading-relaxed text-[#95a0b8] will-change-transform sm:text-lg"
        >
          Real-time audio telemetry from my desktop and Spotify sessions, paired with
          time-synced LRCLIB lyrics, recent playback history, and heavy rotation rankings.
        </p>

        {/* Dual Action Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            data-music-cta
            href="#now-playing"
            className="lumina-btn-primary min-h-[44px] will-change-transform"
          >
            NOW PLAYING &amp; LYRICS
          </a>
          <a
            data-music-cta
            href="#top-tracks"
            className="lumina-btn-secondary min-h-[44px] will-change-transform"
          >
            TOP ROTATION INDEX
          </a>
        </div>

        {/* 3D Glossy Squircle Hardware Chip + Vertical Laser Line connecting to #now-playing */}
        <div className="mt-12 flex flex-col items-center sm:mt-14">
          <div data-music-chip className="will-change-transform">
            <SquircleChip icon="music" idPrefix="music-hero-chip" size="lg" />
          </div>

          <div aria-hidden="true" className="relative flex h-20 w-8 justify-center sm:h-24">
            <div
              data-music-laser
              className="relative flex h-full w-full justify-center will-change-transform"
            >
              <span className="h-full w-[3px] bg-gradient-to-b from-sky-400/10 via-sky-400/45 to-sky-300/90 blur-[3px]" />
              <span className="absolute inset-y-0 left-1/2 w-[1px] -translate-x-1/2 bg-gradient-to-b from-white/15 via-sky-300/75 to-white" />
            </div>
            <span className="absolute -bottom-1 left-1/2 h-2.5 w-16 -translate-x-1/2 rounded-full bg-sky-300/70 blur-[6px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
