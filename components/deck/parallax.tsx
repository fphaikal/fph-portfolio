"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax vertikal yang di-scrub gulir.
 *
 * Jarak gerak dihitung sebagai pecahan tinggi viewport, bukan piksel tetap —
 * supaya terasa sama di laptop maupun monitor besar, dan dihitung ulang
 * saat ukuran jendela berubah.
 *
 * PENTING: komponen ini menolak berjalan kalau induknya grid atau baris
 * flex. Dulu panel proyek diberi kecepatan berbeda di dalam grid, dan
 * kolomnya jadi bergerak tidak sinkron — itu terbaca sebagai tata letak
 * rusak, bukan sebagai efek.
 */

export interface ParallaxProps {
  children: ReactNode;
  /** Geseran awal dalam pecahan tinggi viewport. Positif = mulai lebih rendah. */
  from?: number;
  /** Geseran akhir dalam pecahan tinggi viewport. Negatif = berakhir lebih tinggi. */
  to?: number;
  className?: string;
}

export function Parallax({ children, from = 0.1, to = -0.1, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const parent = el.parentElement;

    if (parent) {
      const style = window.getComputedStyle(parent);
      const display = style.display;
      const isGrid = display === "grid" || display === "inline-grid";
      const isRowFlex =
        (display === "flex" || display === "inline-flex") &&
        style.flexDirection !== "column" &&
        style.flexDirection !== "column-reverse";

      if (isGrid || isRowFlex) return;
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        el,
        { yPercent: from * 100 },
        {
          yPercent: to * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(el, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, [from, to]);

  return (
    <div className={cn("will-change-transform", className)} ref={ref}>
      {children}
    </div>
  );
}
