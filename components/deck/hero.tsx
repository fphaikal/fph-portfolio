"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SquircleChip } from "@/components/deck/card";

gsap.registerPlugin(ScrollTrigger);

/**
 * Procedural Halftone Arrow-Matrix Canvas with Luxury Radial Boot-Up Wave
 * & Subtle Living Shimmer.
 *
 * Recreates the exact background pattern from the reference image:
 * - A uniform grid of cells across the hero canvas.
 * - Two large crescent/toroidal clusters on the left and right flanks
 *   plus upper header arcs where cells render bold geometric `↗` arrows.
 * - On initial page load, a radial wave sweeps outward from the center horizon,
 *   progressively igniting the dots and scaling the `↗` arrows into place,
 *   followed by a gentle atmospheric breathing pulse.
 */
function ArrowMatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let pointerX = -1000;
    let pointerY = -1000;
    const startTime = performance.now();

    const drawArrow = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      alpha: number,
      lineWidth: number,
    ) => {
      if (size <= 0.5 || alpha <= 0.01) return;
      const half = size * 0.5;
      const x0 = cx - half;
      const y0 = cy + half;
      const x1 = cx + half;
      const y1 = cy - half;
      const head = size * 0.68;

      c.strokeStyle = `rgba(145, 196, 255, ${alpha.toFixed(3)})`;
      c.lineWidth = lineWidth;
      c.lineCap = "square";
      c.lineJoin = "miter";

      c.beginPath();
      // Diagonal shaft from bottom-left to top-right
      c.moveTo(x0, y0);
      c.lineTo(x1, y1);
      // Top-right arrowhead (horizontal + vertical legs)
      c.moveTo(x1 - head, y1);
      c.lineTo(x1, y1);
      c.lineTo(x1, y1 + head);
      c.stroke();
    };

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      // Radial boot-up wave progresses over first 1.9 seconds
      const bootProgress = reduceMotion ? 1 : Math.min(1, elapsed / 1.85);
      // Smooth cubic-out easing for the radial wave front
      const waveRadius = (1 - Math.pow(1 - bootProgress, 3)) * 1.45;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cell = width < 640 ? 15 : 17;
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cell + cell * 0.5;
          const y = r * cell + cell * 0.5;

          const nx = x / width;
          const ny = y / height;

          // Distance from center-horizon for the initial radial boot wave
          const radialDist = Math.hypot((nx - 0.5) * 1.35, (ny - 0.52) * 1.1);
          const cellReveal = reduceMotion
            ? 1
            : Math.max(0, Math.min(1, (waveRadius - radialDist * 0.85) / 0.38));

          if (cellReveal <= 0.01) continue;

          // Crest highlight as the boot wave passes over the cell
          const waveCrest =
            !reduceMotion && bootProgress < 1
              ? Math.exp(-Math.pow((radialDist * 0.85 - (waveRadius - 0.12)) / 0.11, 2)) * 0.38
              : 0;

          // Left orbital crescent band (matches left cluster in reference)
          const lDx = (nx - 0.06) / 0.24;
          const lDy = (ny - 0.52) / 0.44;
          const lDist = Math.hypot(lDx, lDy);
          const leftBand = Math.exp(-Math.pow((lDist - 0.62) / 0.26, 2));

          // Right orbital crescent band (matches right cluster in reference)
          const rDx = (nx - 0.94) / 0.24;
          const rDy = (ny - 0.52) / 0.44;
          const rDist = Math.hypot(rDx, rDy);
          const rightBand = Math.exp(-Math.pow((rDist - 0.62) / 0.26, 2));

          // Top header left/right clusters (visible near navbar in reference)
          const tlDist = Math.hypot((nx - 0.28) / 0.14, (ny - 0.04) / 0.16);
          const trDist = Math.hypot((nx - 0.72) / 0.14, (ny - 0.04) / 0.16);
          const topBands =
            0.85 * Math.exp(-Math.pow(tlDist / 0.75, 2)) +
            0.85 * Math.exp(-Math.pow(trDist / 0.75, 2));

          // Deterministic subtle organic noise per cell so cluster edges look digital-halftone
          const hash = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
          const noise = hash - Math.floor(hash);

          // Gentle living optical shimmer wave across the arrow clusters
          const shimmer = reduceMotion
            ? 0
            : Math.sin(elapsed * 1.65 - r * 0.16 + c * 0.14 + noise * 2.2) * 0.055;

          // Optional subtle cursor proximity boost
          const pDist = Math.hypot(x - pointerX, y - pointerY);
          const cursorBoost = pDist < 140 ? (1 - pDist / 140) * 0.35 : 0;

          // Keep center headline zone clean
          const centerDist = Math.hypot((nx - 0.5) / 0.27, (ny - 0.43) / 0.22);
          const centerMask = centerDist < 1 ? Math.pow(centerDist, 2.2) : 1;

          const intensity =
            (Math.max(leftBand, rightBand, topBands) * (0.78 + noise * 0.32) + shimmer) *
              centerMask +
            cursorBoost;

          if (intensity > 0.46) {
            // Large bold ↗ arrow
            const alpha = Math.min(0.82, (0.22 + intensity * 0.48 + waveCrest) * cellReveal);
            const arrowSize = cell * 0.56 * (0.35 + 0.65 * cellReveal);
            drawArrow(ctx, x, y, arrowSize, alpha, 1.65);
          } else if (intensity > 0.24) {
            // Medium/small ↗ arrow
            const alpha = Math.min(0.5, (0.12 + intensity * 0.35 + waveCrest * 0.7) * cellReveal);
            const arrowSize = cell * 0.42 * (0.35 + 0.65 * cellReveal);
            drawArrow(ctx, x, y, arrowSize, alpha, 1.15);
          } else {
            // Background grid dot
            const dotAlpha = (ny > 0.85 ? 0.22 : 0.12 + intensity * 0.2 + waveCrest * 0.4) * cellReveal;
            ctx.fillStyle = `rgba(170, 210, 255, ${dotAlpha.toFixed(3)})`;
            ctx.fillRect(x - 0.9, y - 0.9, 1.8, 1.8);
          }
        }
      }

      ctx.restore();

      if (!reduceMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    rafId = requestAnimationFrame(render);

    const onResize = () => {
      if (reduceMotion) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(render);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointerX = -1000;
      pointerY = -1000;
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-hero-canvas
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export function Hero() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // =========================================================================
      // A. LUXURY INITIAL LOAD ENTRANCE TIMELINE (Plays immediately on mount)
      // =========================================================================
      const introTl = gsap.timeline({
        defaults: { ease: "expo.out" },
      });

      // 1. Atmospheric veil lifts while bottom horizon light bloom rises
      introTl
        .fromTo(
          "[data-hero-veil]",
          { opacity: 0.92 },
          { opacity: 0, duration: 1.5, ease: "power3.out" },
          0,
        )
        .fromTo(
          "[data-hero-bloom-inner]",
          { scaleY: 0.15, opacity: 0, transformOrigin: "bottom center" },
          { scaleY: 1, opacity: 1, duration: 1.6, ease: "expo.out" },
          0.08,
        )
        // 2. Top spotlight beam softly expands behind the title
        .fromTo(
          "[data-hero-spotlight]",
          { scale: 0.65, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.7, ease: "power2.out" },
          0.12,
        )
        // 3. Pill Badge unfolds horizontally with optical blur-to-crisp focus
        .fromTo(
          "[data-hero-pill]",
          {
            y: 22,
            scale: 0.88,
            opacity: 0,
            filter: "blur(10px)",
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.15,
          },
          0.22,
        )
        // 4. Headline phrases rise in 3D perspective with staggered editorial cadence
        .fromTo(
          "[data-hero-word]",
          {
            y: 52,
            rotateX: -40,
            scale: 0.94,
            opacity: 0,
            filter: "blur(12px)",
            transformPerspective: 1000,
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.11,
            duration: 1.35,
            ease: "expo.out",
          },
          0.34,
        )
        // 5. Dual CTA buttons lock in with a subtle spring
        .fromTo(
          "[data-hero-cta]",
          {
            y: 26,
            scale: 0.92,
            opacity: 0,
            filter: "blur(6px)",
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.1,
            duration: 1.05,
            ease: "back.out(1.6)",
          },
          0.72,
        );

      // =========================================================================
      // B. SCROLL-TRIGGERED DEPTH PARALLAX & BRIDGE LASER IGNITION
      // =========================================================================
      // 1. Top Hero: Camera depth fly-through parallax on scroll down
      gsap.to("[data-hero-stage]", {
        y: 90,
        scale: 0.93,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-top]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-hero-bloom]", {
        scaleY: 1.6,
        opacity: 1,
        transformOrigin: "bottom center",
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-top]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. Bridge Section: Statement focus reveal + 3D chip dock + Laser beam ignition
      const bridgeTl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-hero-bridge]",
          start: "top 82%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      });

      bridgeTl
        .fromTo(
          "[data-bridge-heading]",
          { y: 56, opacity: 0.08, scale: 0.96, filter: "blur(6px)" },
          { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power2.out" },
        )
        .fromTo(
          "[data-bridge-chip]",
          { y: -32, scale: 0.68, rotate: -12, opacity: 0 },
          { y: 0, scale: 1, rotate: 0, opacity: 1, duration: 0.35, ease: "back.out(1.8)" },
          "-=0.15",
        )
        .fromTo(
          "[data-bridge-laser]",
          { scaleY: 0, transformOrigin: "top center" },
          { scaleY: 1, duration: 0.4, ease: "none" },
          "-=0.05",
        )
        .fromTo(
          "[data-bridge-flare]",
          { scaleX: 0.1, opacity: 0 },
          { scaleX: 1.25, opacity: 1, duration: 0.2, ease: "power2.out" },
          "-=0.08",
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* ==================== TOP HERO: SKY-TO-HORIZON + ARROW MATRIX ==================== */}
      <section
        data-hero-top
        className="lumina-hero-bg relative isolate flex min-h-[580px] flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-32 sm:min-h-[680px] sm:pb-36 sm:pt-40"
      >
        {/* Halftone ↗ arrow and dot matrix canvas */}
        <ArrowMatrixCanvas />

        {/* Atmospheric radial spotlight behind headline */}
        <div
          aria-hidden="true"
          data-hero-spotlight
          className="pointer-events-none absolute left-1/2 top-[42%] h-[360px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(135,196,255,0.22)_0%,rgba(44,108,214,0.08)_52%,transparent_75%)] blur-2xl will-change-transform"
        />

        {/* Initial luxury dark-cobalt aperture veil that lifts on page load */}
        <div
          aria-hidden="true"
          data-hero-veil
          className="pointer-events-none absolute inset-0 z-[1] bg-[#040711] opacity-0"
        />

        {/* Subtle bottom horizon atmospheric bloom */}
        <div
          aria-hidden="true"
          data-hero-bloom
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28"
        >
          <div
            data-hero-bloom-inner
            className="h-full w-full bg-gradient-to-t from-[#e3f1ff]/90 via-[#a6cdfd]/35 to-transparent will-change-transform"
          />
        </div>

        <div
          data-hero-stage
          className="relative z-10 mx-auto flex max-w-[920px] flex-col items-center text-center will-change-transform"
        >
          {/* Pill Badge */}
          <div data-hero-pill className="lumina-pill will-change-transform">
            <span
              aria-hidden="true"
              className="inline-block h-[5px] w-[5px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
            />
            <span>FPHAIKAL · IT SUPPORT &amp; FULL-STACK DEVELOPER</span>
          </div>

          {/* Mixed Sans + Italic Editorial Serif Headline with 3D Phrase Reveal */}
          <h1 className="mt-7 select-none text-balance text-[42px] font-light leading-[1.04] tracking-[-0.035em] text-[#e8f2ff] drop-shadow-[0_4px_24px_rgba(12,28,68,0.45)] sm:text-[64px] md:text-[74px]">
            <span
              data-hero-word
              className="inline-block font-sans font-light text-[#e6f1ff] will-change-transform"
            >
              Engineer Who&nbsp;
            </span>
            <span
              data-hero-word
              className="inline-block font-serif italic font-normal tracking-[-0.01em] text-[#a8ceff] drop-shadow-[0_0_28px_rgba(147,197,253,0.35)] will-change-transform"
            >
              Connects Hardware
            </span>
            <br />
            <span
              data-hero-word
              className="inline-block font-serif italic font-normal tracking-[-0.01em] text-[#e6f1ff] will-change-transform"
            >
              And Code&nbsp;
            </span>
            <span
              data-hero-word
              className="inline-block font-sans font-light text-[#d2e6ff] will-change-transform"
            >
              to Get Work Done
            </span>
          </h1>

          {/* Dual CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              data-hero-cta
              className="lumina-btn-primary will-change-transform"
              href="#work"
            >
              VIEW PROJECTS
            </a>
            <a
              data-hero-cta
              className="lumina-btn-secondary will-change-transform"
              href="https://github.com/fphaikal"
              rel="noopener noreferrer"
              target="_blank"
            >
              GITHUB · @FPHAIKAL
            </a>
          </div>
        </div>

        {/* Screen-reader quick links */}
        <p className="sr-only">
          Fahreza Pasha Haikal (FPHaikal) — IT Support Specialist &amp; Full-Stack Developer.{" "}
          <Link href="/blog">Read the notes</Link> — <Link href="/spotify">What is playing</Link>
        </p>
      </section>

      {/* ==================== SECTION 2: BRIDGE STATEMENT + 3D SQUIRCLE + LASER BEAM ==================== */}
      <section
        data-hero-bridge
        className="lumina-bridge-bg relative isolate overflow-hidden px-6 pt-20 sm:pt-28"
      >
        {/* Subtle micro dot-matrix texture on upper left and right flanks */}
        <div
          aria-hidden="true"
          className="lumina-micro-matrix pointer-events-none absolute inset-x-0 top-0 h-64 opacity-55 [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black_80%)]"
        />

        <div className="relative z-10 mx-auto flex max-w-[780px] flex-col items-center text-center">
          <h2
            data-bridge-heading
            className="text-balance font-sans text-[26px] font-normal leading-[1.15] tracking-[-0.03em] text-white will-change-transform sm:text-[36px] md:text-[42px]"
          >
            Fahreza Pasha Haikal.
            <br />
            IT Support Specialist, mechatronics student,
            and full-stack developer in Indonesia.
          </h2>

          {/* 3D Glossy Squircle Hardware Chip + Vertical Laser Line down to next section */}
          <div className="mt-12 flex flex-col items-center sm:mt-14">
            <div data-bridge-chip className="will-change-transform">
              <SquircleChip icon="terminal" idPrefix="bridge-chip" size="lg" />
            </div>

            {/* Vertical glowing laser line connecting the squircle to the bottom border */}
            <div aria-hidden="true" className="relative flex h-24 w-8 justify-center sm:h-32">
              <div data-bridge-laser className="relative flex h-full w-full justify-center will-change-transform">
                {/* Soft outer cyan-blue glow */}
                <span className="h-full w-[3px] bg-gradient-to-b from-sky-400/10 via-sky-400/45 to-sky-300/90 blur-[3px]" />
                {/* Crisp 1px core beam */}
                <span className="absolute inset-y-0 left-1/2 w-[1px] -translate-x-1/2 bg-gradient-to-b from-white/15 via-sky-300/75 to-white" />
              </div>
              {/* Bottom intersection flare where the beam meets the horizontal border */}
              <span
                data-bridge-flare
                className="absolute -bottom-1 left-1/2 h-2.5 w-16 -translate-x-1/2 rounded-full bg-sky-300/70 blur-[6px] will-change-transform"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
