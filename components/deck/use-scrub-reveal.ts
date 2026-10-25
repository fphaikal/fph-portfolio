"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pengungkap berbasis gulir.
 *
 * Semua elemen yang diberi `data-scrub` di dalam sebuah wadah akan
 * di-scrub oleh ScrollTrigger — maju saat digulir turun, berbalik saat
 * digulir naik. Bukan animasi sekali jalan.
 *
 * Kenapa dibuat: sebelumnya tiap bagian hanya menggerakkan kartunya,
 * sementara judul, subjudul, label, dan isi kartu tampil begitu saja.
 * Dengan satu hook ini, SEMUA elemen bisa ikut bergerak tanpa menulis
 * tween berulang di tiap komponen.
 *
 * Pemakaian:
 *   const ref = useRef<HTMLElement>(null);
 *   useScrubReveal(ref);
 *   ...
 *   <p data-scrub="rise">…</p>
 *   <li data-scrub="deal" data-scrub-delay="6">…</li>
 */

export type ScrubMode =
  | "rise"
  | "rise-sm"
  | "fade"
  | "scale"
  | "left"
  | "right"
  | "deal"
  | "grow"
  | "draw";

interface Preset {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
}

/**
 * Tiap mode punya jarak dan opasitas awal sendiri.
 * Semuanya berakhir di keadaan natural (0 / 1), jadi tidak ada elemen
 * yang berhenti dalam keadaan setengah transparan.
 *
 * Jaraknya sengaja BESAR. Versi pertama memakai 18–34 px, dan hasilnya
 * tidak terlihat sama sekali — pada layar 800 px itu cuma 2–4%, dan
 * selesai sebelum elemennya sampai ke tengah layar. Sekarang 60–110 px
 * supaya pergerakannya benar-benar terbaca.
 */
const PRESETS: Record<ScrubMode, Preset> = {
  rise: { from: { y: 110, opacity: 0.04 }, to: { y: 0, opacity: 1 } },
  "rise-sm": { from: { y: 60, opacity: 0.12 }, to: { y: 0, opacity: 1 } },
  fade: { from: { opacity: 0.04 }, to: { opacity: 1 } },
  scale: { from: { scale: 0.82, opacity: 0.15 }, to: { scale: 1, opacity: 1 } },
  left: { from: { x: -96, opacity: 0.08 }, to: { x: 0, opacity: 1 } },
  right: { from: { x: 96, opacity: 0.08 }, to: { x: 0, opacity: 1 } },
  deal: { from: { rotate: -12, y: 90, opacity: 0.12 }, to: { rotate: 0, y: 0, opacity: 1 } },
  grow: { from: { scaleY: 0 }, to: { scaleY: 1 } },
  draw: { from: { scaleX: 0 }, to: { scaleX: 1 } },
};

/** Garis butuh titik asal; tanpa ini `scaleY`/`scaleX` tumbuh dari tengah. */
const ORIGIN: Partial<Record<ScrubMode, string>> = {
  grow: "top center",
  draw: "left center",
};

export interface ScrubRevealOptions {
  /**
   * Posisi mulai, dalam persen tinggi viewport. Default 100 — yaitu saat
   * tepi atas elemen baru menyentuh dasar layar.
   */
  start?: number;
  /**
   * Posisi selesai. Default 25 — yaitu saat elemen sudah naik ke sepertiga
   * atas layar. Rentang 100 → 25 berarti animasinya berlangsung melewati
   * PUSAT layar, tempat mata benar-benar melihatnya.
   */
  end?: number;
}

export function useScrubReveal(
  root: RefObject<HTMLElement | null>,
  { start = 100, end = 25 }: ScrubRevealOptions = {},
) {
  useEffect(() => {
    const el = root.current;

    if (!el) return;

    // Gerak dibatasi: biarkan semuanya tampil apa adanya.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-scrub]", el);

    if (!items.length) return;

    const tweens = items.map((item) => {
      const mode = (item.dataset.scrub || "rise") as ScrubMode;
      const preset = PRESETS[mode] ?? PRESETS.rise;
      const origin = ORIGIN[mode];

      // `data-scrub-delay` menggeser jadwal satu elemen tanpa mengubah
      // milik tetangganya — dipakai untuk membuat baris yang sejajar
      // (mis. tiga kartu metrik) tidak menyala serentak.
      const delay = Number(item.dataset.scrubDelay ?? 0);

      if (origin) gsap.set(item, { transformOrigin: origin });

      return gsap.fromTo(item, preset.from, {
        ...preset.to,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: item.dataset.scrubStart ?? `top ${start - delay}%`,
          end: item.dataset.scrubEnd ?? `top ${end - delay}%`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      gsap.set(items, { clearProps: "transform,opacity,transformOrigin" });
    };
  }, [root, start, end]);
}
