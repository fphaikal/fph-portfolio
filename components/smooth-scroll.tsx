"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children?: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Hormati preferensi pengurangan gerak: pakai gulir native tanpa smoothing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Selaraskan ScrollTrigger dengan posisi gulir Lenis, agar animasi
    // scroll-driven tidak bergetar.
    lenis.on("scroll", ScrollTrigger.update);

    // Pacu Lenis dari ticker GSAP supaya keduanya berbagi satu clock.
    // Ticker GSAP memberi waktu dalam detik; Lenis mengharapkan milidetik.
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Segarkan sekali setelah semuanya terpasang.
    ScrollTrigger.refresh();

    // Posisi trigger dihitung dari tata letak. Tata letak bergeser saat font
    // web dan gambar selesai dimuat, jadi trigger harus dihitung ulang —
    // kalau tidak, animasi mulai di posisi yang salah (ini penyebab utama
    // animasi terasa "melompat").
    let cancelled = false;

    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    window.addEventListener("load", refresh);

    // Cleanup
    return () => {
      cancelled = true;
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /**
   * Perpindahan halaman.
   *
   * Lenis mengelola posisi gulirnya sendiri, jadi saat rute berubah ia
   * masih memegang offset dari halaman sebelumnya. Akibatnya halaman baru
   * terbuka di tengah — terasa seperti "tidak terjadi apa-apa", dan sisa
   * `overflow` bisa membuat gulir berikutnya macet.
   *
   * Di sini kita (a) melepas kunci gulir apa pun yang tertinggal dari
   * tirai pembuka, (b) mengembalikan posisi ke puncak, dan (c) menghitung
   * ulang trigger untuk tata letak halaman baru.
   */
  useEffect(() => {
    document.documentElement.removeAttribute("data-deck-locked");

    const lenis = lenisRef.current;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    // Tunggu satu bingkai supaya DOM halaman baru sudah terpasang.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return <>{children}</>;
}
