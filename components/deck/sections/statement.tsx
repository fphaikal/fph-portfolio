"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SquircleChip } from "@/components/deck/card";

gsap.registerPlugin(ScrollTrigger);

export function Statement() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          end: "bottom 48%",
          scrub: 0.6,
        },
      });

      tl.fromTo(
        "[data-stmt-chamber]",
        { scale: 0.93, opacity: 0.35 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
        0,
      )
        .fromTo(
          "[data-stmt-pill]",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
          0.05,
        )
        .fromTo(
          "[data-stmt-phrase]",
          { opacity: 0.1, y: 28, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.14,
            duration: 0.4,
            ease: "power2.out",
          },
          0.12,
        )
        .fromTo(
          "[data-stmt-meta]",
          { opacity: 0, letterSpacing: "0.28em", y: 14 },
          { opacity: 1, letterSpacing: "0.12em", y: 0, duration: 0.3, ease: "power2.out" },
          0.58,
        )
        .fromTo(
          "[data-stmt-chip]",
          { scale: 0.45, rotate: -18, y: 24, opacity: 0 },
          { scale: 1, rotate: 0, y: 0, opacity: 1, duration: 0.35, ease: "back.out(2.2)" },
          0.66,
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#06080f]"
    >
      <div
        data-stmt-chamber
        className="lumina-bridge-bg relative mx-auto max-w-[1160px] overflow-hidden border-x border-white/10 px-6 py-24 text-center will-change-transform sm:py-32"
      >
        <div
          aria-hidden="true"
          className="lumina-micro-matrix pointer-events-none absolute inset-0 opacity-45 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_85%)]"
        />

        <div className="relative z-10 mx-auto flex max-w-[820px] flex-col items-center">
          <div data-stmt-pill className="lumina-pill will-change-transform">
            <span aria-hidden="true" className="inline-block h-[5px] w-[5px] bg-white" />
            <span>SYSTEMS PHILOSOPHY</span>
          </div>

          <p className="mt-8 text-balance font-sans text-[30px] font-light leading-[1.14] tracking-[-0.03em] text-white sm:text-[44px] md:text-[52px]">
            <span data-stmt-phrase className="inline-block will-change-transform">
              Architecture works when{" "}
            </span>
            <span
              data-stmt-phrase
              className="inline-block font-serif italic font-normal text-[#a8ceff] will-change-transform"
            >
              every module{" "}
            </span>
            <span data-stmt-phrase className="inline-block will-change-transform">
              speaks the same protocol — from{" "}
            </span>
            <span
              data-stmt-phrase
              className="inline-block font-serif italic font-normal text-[#e6f1ff] will-change-transform"
            >
              microcontroller to cloud dashboard.
            </span>
          </p>

          <p
            data-stmt-meta
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 will-change-transform"
          >
            FAHREZA PASHA HAIKAL (FPHAIKAL) · INDONESIA (UTC+7)
          </p>

          <div data-stmt-chip className="mt-10 will-change-transform">
            <SquircleChip icon="network" idPrefix="statement-chip" size="md" />
          </div>
        </div>
      </div>
    </section>
  );
}
