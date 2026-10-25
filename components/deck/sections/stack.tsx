"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SectionTab, SquircleChip } from "@/components/deck/card";
import { CHANNEL_GROUP_LABEL, type ChannelGroup, type SignalChannel } from "@/config/channels";

gsap.registerPlugin(ScrollTrigger);

const GROUP_ORDER: ChannelGroup[] = ["hardware", "software", "data"];

export interface StackProps {
  channels: SignalChannel[];
}

export function Stack({ channels }: StackProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const groups = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        group,
        items: channels.filter((channel) => channel.group === group),
      })).filter((entry) => entry.items.length > 0),
    [channels],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Horizontal Pipeline Impulse (Stage 1 -> Line 1 -> Stage 2 -> Line 2 -> Stage 3)
      const pipeTl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-stack-header]",
          start: "top 84%",
          end: "bottom 42%",
          scrub: 0.5,
        },
      });

      pipeTl
        .fromTo(
          "[data-stack-copy]",
          { y: 36, opacity: 0.08 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          0,
        )
        .fromTo(
          "[data-stack-stage='1']",
          { scale: 0.5, opacity: 0.1, rotate: -14 },
          { scale: 1, opacity: 1, rotate: 0, duration: 0.25, ease: "back.out(2)" },
          0.05,
        )
        .fromTo(
          "[data-stack-line='1']",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.22, ease: "none" },
          0.22,
        )
        .fromTo(
          "[data-stack-stage='2']",
          { scale: 0.5, opacity: 0.1, y: 16 },
          { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: "back.out(2.2)" },
          0.38,
        )
        .fromTo(
          "[data-stack-line='2']",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.22, ease: "none" },
          0.58,
        )
        .fromTo(
          "[data-stack-stage='3']",
          { scale: 0.5, opacity: 0.1, rotate: 14 },
          { scale: 1, opacity: 1, rotate: 0, duration: 0.25, ease: "back.out(2)" },
          0.74,
        );

      // 2. 3-Column Server-Blade Drop & Terminal Row Scan
      const cols = gsap.utils.toArray<HTMLElement>("[data-stack-col]");
      cols.forEach((col, colIdx) => {
        const rows = col.querySelectorAll<HTMLElement>("[data-stack-row]");
        gsap.fromTo(
          col,
          { y: 48 + colIdx * 18, opacity: 0.1 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "[data-stack-matrix]",
              start: "top 86%",
              end: "top 38%",
              scrub: 0.5,
            },
          },
        );

        gsap.fromTo(
          rows,
          { x: -24, opacity: 0.08 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: col,
              start: "top 84%",
              end: "bottom 55%",
              scrub: 0.5,
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#06080f]"
      id="stack"
    >
      <div className="mx-auto max-w-[1160px] border-x border-white/10">
        {/* Top Architectural Header + Node Pipeline */}
        <div
          data-stack-header
          className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-white/10"
        >
          <div className="flex flex-col justify-between">
            <div>
              <SectionTab label="TOOLKIT" />
            </div>

            <div
              data-stack-copy
              className="px-7 pb-10 pt-10 will-change-transform sm:px-10 sm:pb-14"
            >
              <p className="font-sans text-[24px] font-normal leading-[1.26] tracking-[-0.028em] sm:text-[31px]">
                <span className="font-medium text-white">Hardware, software, and data. </span>
                <span className="text-[#7d8597]">
                  {channels.length} tools I use daily across microcontrollers, full-stack web
                  frameworks, and workflow automation.
                </span>
              </p>
            </div>
          </div>

          {/* Right Column: Connected 3-Stage Node Diagram on Dot Matrix */}
          <div className="lumina-dot-grid relative flex min-h-[240px] items-center justify-center overflow-hidden border-t border-white/10 px-6 py-12 lg:border-t-0">
            <div className="relative z-10 flex items-center">
              {/* Stage 1: Device */}
              <div
                data-stack-stage="1"
                className="lumina-socket relative !p-3 will-change-transform"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-[4px] top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300 bg-sky-400"
                />
                <SquircleChip icon="hardware" idPrefix="stack-hw" size="sm" />
                <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-white/60">
                  01 · DEVICE
                </span>
              </div>

              {/* Connector 1 -> 2 */}
              <div
                aria-hidden="true"
                data-stack-line="1"
                className="relative flex w-10 items-center will-change-transform sm:w-16"
              >
                <span className="h-[1.5px] w-full border-t border-dashed border-sky-300/60" />
              </div>

              {/* Stage 2: Processor */}
              <div
                data-stack-stage="2"
                className="lumina-socket relative !p-3.5 will-change-transform"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[4px] top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300 bg-sky-400"
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-[4px] top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300 bg-sky-400"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4 -top-[1px] h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent"
                />
                <SquircleChip icon="code" idPrefix="stack-sw" size="md" />
                <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-sky-300/90">
                  02 · PROCESSOR
                </span>
              </div>

              {/* Connector 2 -> 3 */}
              <div
                aria-hidden="true"
                data-stack-line="2"
                className="relative flex w-10 items-center will-change-transform sm:w-16"
              >
                <span className="h-[1.5px] w-full border-t border-dashed border-sky-300/60" />
              </div>

              {/* Stage 3: Telemetry */}
              <div
                data-stack-stage="3"
                className="lumina-socket relative !p-3 will-change-transform"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[4px] top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full border border-sky-300 bg-sky-400"
                />
                <SquircleChip icon="chart" idPrefix="stack-data" size="sm" />
                <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-white/60">
                  03 · TELEMETRY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Stack Matrix */}
        <div
          data-stack-matrix
          className="grid grid-cols-1 divide-y divide-white/10 overflow-hidden border-t border-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0"
        >
          {groups.map((entry, idx) => (
            <div
              key={entry.group}
              data-stack-col
              className="flex flex-col bg-[#06080f] will-change-transform"
            >
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0b0e18] px-7 py-4">
                <span className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-white">
                  <span className="inline-block h-1.5 w-1.5 bg-sky-400" />
                  0{idx + 1} · {CHANNEL_GROUP_LABEL[entry.group]}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/45">
                  {String(entry.items.length).padStart(2, "0")} UNITS
                </span>
              </div>

              <ul className="divide-y divide-white/[0.06] px-7">
                {entry.items.map((channel) => (
                  <li
                    key={channel.id}
                    data-stack-row
                    className="flex items-center justify-between gap-4 py-4 transition-colors will-change-transform hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-white/35">
                        {channel.index}
                      </span>
                      <span className="font-sans text-[15px] font-medium text-white/90">
                        {channel.label}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] text-[#7d8597]">
                      {channel.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
