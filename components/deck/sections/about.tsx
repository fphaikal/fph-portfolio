"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  SectionTab,
  SquircleChip,
  type SquircleIconVariant,
} from "@/components/deck/card";

gsap.registerPlugin(ScrollTrigger);

const AREAS: Array<{
  index: string;
  title: string;
  role: string;
  body: string;
  icon: SquircleIconVariant;
}> = [
  {
    index: "01",
    title: "Reliability & Ops",
    role: "PT Astra Graphia Tbk",
    body: "Keeping critical systems online and making anomalies visible early with automated monitoring and KPI telemetry.",
    icon: "activity",
  },
  {
    index: "02",
    title: "Hardware ↔ Software",
    role: "Mechatronics Engineering",
    body: "Bridging ESP32, Arduino, and Raspberry Pi sensors directly to real-time web interfaces and access control gates.",
    icon: "hardware",
  },
  {
    index: "03",
    title: "Automation & Data",
    role: "n8n · Power BI · APIs",
    body: "Transforming repetitive operational workflows into autonomous pipelines and live executive dashboards.",
    icon: "workflow",
  },
];

export function About() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Left editorial copy slides & unclips from the left architectural border
      gsap.fromTo(
        "[data-about-copy]",
        { x: -56, opacity: 0.06, filter: "blur(5px)" },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-about-top]",
            start: "top 82%",
            end: "top 32%",
            scrub: 0.5,
          },
        },
      );

      // 2. Right Circuit Stage: Sequential signal propagation along SVG trace + Node power-up
      const circuitTl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-about-circuit]",
          start: "top 84%",
          end: "bottom 42%",
          scrub: 0.6,
        },
      });

      circuitTl
        .fromTo(
          "[data-about-signal]",
          { strokeDasharray: 660, strokeDashoffset: 660 },
          { strokeDashoffset: 0, duration: 1, ease: "none" },
          0,
        )
        .fromTo(
          "[data-circuit-node='1']",
          { scale: 0.55, opacity: 0.12, y: 18 },
          { scale: 1, opacity: 1, y: 0, duration: 0.32, ease: "back.out(2)" },
          0.05,
        )
        .fromTo(
          "[data-circuit-node='2']",
          { scale: 0.5, opacity: 0.12, y: 18 },
          { scale: 1, opacity: 1, y: 0, duration: 0.36, ease: "back.out(2.2)" },
          0.34,
        )
        .fromTo(
          "[data-circuit-node='3']",
          { scale: 0.55, opacity: 0.12, y: 18 },
          { scale: 1, opacity: 1, y: 0, duration: 0.32, ease: "back.out(2)" },
          0.66,
        );

      // 3. Bottom 3 Architectural Pillars: 3D perspective unfold cascade
      const pillars = gsap.utils.toArray<HTMLElement>("[data-about-pillar]");
      gsap.fromTo(
        pillars,
        {
          rotateX: 28,
          y: 56,
          opacity: 0.08,
          transformPerspective: 950,
          transformOrigin: "top center",
        },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-about-pillars]",
            start: "top 86%",
            end: "top 38%",
            scrub: 0.5,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative border-t border-white/10 bg-[#06080f]"
    >
      {/* Center top border laser intersection highlight matching the screenshot */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[1px] left-1/2 h-[2px] w-48 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-200 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 left-1/2 h-6 w-36 -translate-x-1/2 rounded-full bg-sky-400/25 blur-md"
      />

      <div className="mx-auto max-w-[1160px] border-x border-white/10">
        {/* Primary 2-column split */}
        <div
          data-about-top
          className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-white/10"
        >
          {/* Left Cell: ▪ WHAT I DO + Dual-tone typography */}
          <div className="relative flex flex-col justify-between overflow-hidden">
            <div>
              <SectionTab label="WHAT I DO" />
            </div>

            <div
              data-about-copy
              className="px-7 pb-10 pt-10 will-change-transform sm:px-10 sm:pb-14 sm:pt-12"
            >
              <p className="font-sans text-[24px] font-normal leading-[1.26] tracking-[-0.028em] sm:text-[31px]">
                <span className="font-medium text-white">From sensor to screen. </span>
                <span className="text-[#7d8597]">
                  I keep enterprise IT systems running, wire microcontrollers and physical hardware
                  to the web, and turn manual routines into automated data workflows.
                </span>
              </p>

              <p className="mt-6 font-sans text-sm leading-relaxed text-[#7d8597]">
                Currently working as an{" "}
                <span className="text-white/90">IT Support Specialist at PT Astra Graphia Tbk</span>{" "}
                since February 2025, while studying mechatronics engineering and building
                full-stack web applications in Jakarta, Indonesia (WIB · UTC+7).
              </p>
            </div>
          </div>

          {/* Right Cell: Unified 1:1 Coordinate Dot-Matrix Circuit Stage */}
          <div
            data-about-circuit
            className="lumina-dot-grid relative flex min-h-[340px] items-center justify-center overflow-hidden border-t border-white/10 p-4 sm:p-6 lg:min-h-[390px] lg:border-t-0"
          >
            {/* Ambient radial glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,116,220,0.14)_0%,rgba(6,8,15,0.68)_78%)]"
            />

            {/* Aspect-locked 500x320 coordinate stage so SVG traces and sockets always connect 100% */}
            <div className="relative aspect-[500/320] w-full max-w-[520px] select-none">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
                fill="none"
                viewBox="0 0 500 320"
              >
                <defs>
                  <linearGradient id="trace-glow" x1="0%" x2="100%" y1="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(147, 197, 253, 0.25)" />
                    <stop offset="50%" stopColor="rgba(147, 197, 253, 0.65)" />
                    <stop offset="100%" stopColor="rgba(147, 197, 253, 0.25)" />
                  </linearGradient>
                  <linearGradient id="signal-beam" x1="0%" x2="100%" y1="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.35)" />
                    <stop offset="50%" stopColor="rgba(224, 242, 254, 0.95)" />
                    <stop offset="100%" stopColor="rgba(56, 189, 248, 0.55)" />
                  </linearGradient>
                </defs>

                {/* Base solid subtle circuit under-track */}
                <path
                  d="M 12 224 H 95 H 172 V 160 H 250 H 328 V 96 H 405 H 488"
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeWidth="1.5"
                />

                {/* Crisp dashed orthogonal circuit trace connecting Node 1 -> Node 2 -> Node 3 */}
                <path
                  d="M 12 224 H 95 H 172 V 160 H 250 H 328 V 96 H 405 H 488"
                  stroke="url(#trace-glow)"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />

                {/* Scroll-scrubbed live signal beam propagating from left to right */}
                <path
                  data-about-signal
                  d="M 12 224 H 95 H 172 V 160 H 250 H 328 V 96 H 405 H 488"
                  stroke="url(#signal-beam)"
                  strokeLinecap="round"
                  strokeWidth="2"
                />

                {/* Secondary parallel data bus line entering & exiting Center Node */}
                <path
                  d="M 95 244 H 250 V 160"
                  stroke="rgba(255, 255, 255, 0.14)"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                />
                <path
                  d="M 250 160 V 76 H 405"
                  stroke="rgba(255, 255, 255, 0.14)"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                />

                {/* Corner junction nodes */}
                <circle cx="172" cy="224" fill="#0b101d" r="3.5" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5" />
                <circle cx="172" cy="160" fill="#38bdf8" r="2.5" />
                <circle cx="328" cy="160" fill="#38bdf8" r="2.5" />
                <circle cx="328" cy="96" fill="#0b101d" r="3.5" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5" />
                <circle cx="250" cy="244" fill="rgba(147,197,253,0.45)" r="2" />
                <circle cx="250" cy="76" fill="rgba(147,197,253,0.45)" r="2" />
              </svg>

              {/* Node 1 (Bottom-Left): Centered at x=95 (19%), y=224 (70%) */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: "19%", top: "70%" }}
              >
                <div
                  data-circuit-node="1"
                  className="lumina-socket relative !p-2.5 will-change-transform sm:!p-3"
                >
                  {/* Left & Right socket port pins */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300/70 bg-[#090d16]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -right-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300 bg-sky-400"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-3 -top-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  />
                  <SquircleChip icon="hardware" idPrefix="node-left" size="md" />
                  <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-white/55">
                    01 · SENSOR
                  </span>
                </div>
              </div>

              {/* Node 2 (Center Primary): Centered at x=250 (50%), y=160 (50%) */}
              <div
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: "50%", top: "50%" }}
              >
                <div
                  data-circuit-node="2"
                  className="lumina-socket relative !p-3 will-change-transform sm:!p-4"
                >
                  {/* Left & Right socket port pins */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300 bg-sky-400"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -right-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300 bg-sky-400"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-4 -top-[1px] h-[1.5px] bg-gradient-to-r from-transparent via-white/85 to-transparent"
                  />
                  <SquircleChip icon="code" idPrefix="node-center" size="lg" />
                  <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-sky-300/90">
                    02 · FULL-STACK
                  </span>
                </div>
              </div>

              {/* Node 3 (Top-Right): Centered at x=405 (81%), y=96 (30%) */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: "81%", top: "30%" }}
              >
                <div
                  data-circuit-node="3"
                  className="lumina-socket relative !p-2.5 will-change-transform sm:!p-3"
                >
                  {/* Left & Right socket port pins */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300 bg-sky-400"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -right-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300/70 bg-[#090d16]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-3 -top-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  />
                  <SquircleChip icon="workflow" idPrefix="node-right" size="md" />
                  <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-white/55">
                    03 · WORKFLOW
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-grid: 3 Architectural Pillars with Contextual Squircle Icons */}
        <div
          data-about-pillars
          className="grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0"
        >
          {AREAS.map((area) => (
            <div
              key={area.index}
              data-about-pillar
              className="group relative flex flex-col justify-between p-7 transition-colors will-change-transform hover:bg-white/[0.015] sm:p-9"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <SquircleChip
                    icon={area.icon}
                    idPrefix={`area-${area.index}`}
                    size="sm"
                  />
                  <div className="text-right font-mono text-[10px] uppercase tracking-[0.1em] text-white/45">
                    <span className="block text-sky-300/80">NODE {area.index}</span>
                    <span className="mt-0.5 block">{area.role}</span>
                  </div>
                </div>

                <h3 className="mt-6 font-sans text-xl font-medium tracking-[-0.02em] text-white">
                  {area.title}
                </h3>

                <p className="mt-2.5 font-sans text-sm leading-relaxed text-[#7d8597]">
                  {area.body}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 group-hover:text-sky-300/80">
                <span>ACTIVE MODULE</span>
                <span>↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
