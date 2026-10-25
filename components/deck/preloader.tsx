"use client";

import { useEffect, useState } from "react";

import { SUITS, SuitMark, isRedSuit } from "@/components/deck/card";

/**
 * Tirai pembuka: kata "hello" digambar dengan animasi goresan.
 *
 * Triknya `pathLength="1"`: panjang jalur dinormalkan jadi 1, lalu
 * `stroke-dasharray: 1` menutup seluruh jalur dan `stroke-dashoffset`
 * dianimasikan 1 -> 0 supaya garisnya terbentuk dari awal ke akhir
 * seperti ditulis tangan. Semuanya CSS, bukan loop rAF.
 *
 * Nilai waktu di <style> sengaja disamakan dengan konstanta di bawah.
 */

const DRAW_MS = 1500;
const HOLD_MS = 350;
const FADE_MS = 600;

/** Waktu overlay mulai memudar (gambar + jeda). */
const FADE_DELAY_MS = DRAW_MS + HOLD_MS;

/** "hello" — satu jalur bersambung, gaya script mengalir. */
const WORDMARK_PATH = `M36 148
C40 120 52 74 62 50
C66 42 74 44 72 56
C68 88 62 118 64 140
C66 120 78 90 94 90
C106 90 110 116 110 140
C112 118 124 90 140 90
C152 90 156 118 156 140
C158 152 172 152 182 138
C176 128 174 108 186 96
C196 84 214 86 216 102
C218 118 202 128 192 118
C184 110 194 102 208 108
C224 114 236 126 246 138
C250 110 262 70 274 46
C278 38 286 42 282 56
C276 86 270 116 272 138
C274 152 288 150 296 136
C300 110 312 70 324 46
C328 38 336 42 332 56
C326 86 320 116 322 138
C324 152 338 150 348 136
C342 122 348 98 368 92
C392 86 410 102 406 122
C402 142 378 152 362 142
C354 137 352 128 360 122
C372 114 392 118 404 132
C420 146 432 150 444 146
C470 142 520 132 566 148
C590 156 600 150 606 138`;

export function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  // Gerbang hidrasi: server dan render klien pertama sama-sama null.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Hormati preferensi gerak — langsung ke konten.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Sudah diputar di sesi ini? Lewati.
    try {
      if (window.sessionStorage.getItem("deck-booted") === "1") return;
      window.sessionStorage.setItem("deck-booted", "1");
    } catch {
      /* mode privat: anggap belum pernah */
    }

    setActive(true);

    const timer = window.setTimeout(() => setActive(false), FADE_DELAY_MS + FADE_MS);

    return () => window.clearTimeout(timer);
  }, [mounted]);

  /**
   * Kunci gulir hanya selama tirai tampil.
   *
   * Catatan penting: kunci ini HARUS selalu dilepas. Kalau `overflow`
   * tertinggal "hidden", seluruh halaman jadi tidak bisa digulir maupun
   * diklik — dan itu terlihat persis seperti "tidak bisa pindah halaman".
   * Karena itu kita (a) memakai penanda di <html> alih-alih mengganti
   * `body.style.overflow`, dan (b) menambahkan jaring pengaman `unmount`
   * yang melepas kunci apa pun yang masih tersisa.
   */
  useEffect(() => {
    const root = document.documentElement;

    if (!active) {
      root.removeAttribute("data-deck-locked");
      return;
    }

    root.setAttribute("data-deck-locked", "1");

    return () => root.removeAttribute("data-deck-locked");
  }, [active]);

  // Jaring pengaman: lepas kunci saat komponen dibongkar, apa pun kondisinya.
  useEffect(() => () => document.documentElement.removeAttribute("data-deck-locked"), []);

  if (!mounted || !active) return null;

  return (
    <div
      aria-hidden="true"
      className="deck-preload fixed inset-0 z-[10000] grid place-items-center bg-background text-deck-ivory"
    >
      <style>{`
        .deck-preload {
          animation: deck-preload-out ${FADE_MS}ms ease ${FADE_DELAY_MS}ms forwards;
        }
        @keyframes deck-preload-out {
          to { opacity: 0; visibility: hidden; }
        }
        .deck-preload__stroke {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: deck-preload-draw ${DRAW_MS}ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        @keyframes deck-preload-draw {
          to { stroke-dashoffset: 0; }
        }
        .deck-preload__rule {
          transform: scaleX(0);
          transform-origin: center;
          animation: deck-preload-rule 450ms cubic-bezier(0.22, 1, 0.36, 1) 1300ms both;
        }
        @keyframes deck-preload-rule {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .deck-preload__suit {
          opacity: 0;
          animation: deck-preload-suit 350ms ease both;
        }
        @keyframes deck-preload-suit {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex flex-col items-center gap-6">
        <svg
          aria-hidden="true"
          className="h-auto w-[min(78vw,560px)]"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: "drop-shadow(0 0 18px hsl(var(--deck-red) / 0.55))" }}
          viewBox="0 0 640 200"
        >
          <path
            className="deck-preload__stroke"
            d={WORDMARK_PATH}
            fill="none"
            pathLength={1}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
          />
        </svg>

        <div className="deck-rule deck-preload__rule w-[min(52vw,340px)]" />

        <div className="flex items-center gap-4">
          {SUITS.map((suit, index) => (
            <div
              key={suit}
              className="deck-preload__suit inline-flex"
              style={{ animationDelay: `${1300 + index * 60}ms` }}
            >
              <SuitMark
                color={isRedSuit(suit) ? "hsl(var(--deck-red-bright))" : "hsl(var(--deck-ivory))"}
                size={22}
                suit={suit}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
