"use client";

import { useEffect, useRef, type ComponentType, type ReactNode, type Ref } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Teks yang menyala kata per kata mengikuti posisi gulir.
 *
 * Dipakai di judul-judul besar. Tiap kata dibungkus span, lalu GSAP
 * menganimasikan opacity-nya dengan `scrub` — jadi maju saat menggulir
 * turun dan berbalik saat menggulir naik.
 *
 * Tanpa JavaScript teks tetap terlihat penuh: keadaan awalnya ditulis di
 * dalam tween (`gsap.from`), bukan di CSS.
 */

export interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  /** Opacity awal tiap kata. */
  from?: number;
  /** Jarak antar-kata dalam animasi, dalam satuan timeline. */
  stagger?: number;
  /** Titik mulai relatif viewport. */
  start?: string;
  /** Titik selesai relatif viewport. */
  end?: string;
}

export function TextReveal({
  text,
  as = "h2",
  className,
  from = 0.14,
  stagger = 0.08,
  start = "top 82%",
  end = "top 42%",
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const words = el.querySelectorAll<HTMLElement>("[data-word]");

    if (!words.length) return;

    // Hormati pengurangan gerak: langsung tampil penuh.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(words, { opacity: 1 });

      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(words, {
        opacity: from,
        stagger,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: true,
        },
      });
    }, el);

    // Ukur ulang setelah tween dibuat supaya tidak meleset saat tata letak
    // baru bergeser (font web, gambar).
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [text, from, stagger, start, end]);

  // Cast eksplisit: `@react-three/fiber` menambah augmentasi pada namespace
  // JSX global, sehingga inferensi `children` pada union `ElementType`
  // gagal dan terbaca sebagai `never`.
  const Tag = as as unknown as ComponentType<{
    className?: string;
    ref?: Ref<HTMLElement>;
    children?: ReactNode;
  }>;

  return (
    <Tag className={cn(className)} ref={ref}>
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`}>
          <span data-word className="inline-block">
            {word}
          </span>
          {index < text.split(" ").length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
