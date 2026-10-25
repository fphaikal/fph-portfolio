"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SectionTab, SquircleChip } from "@/components/deck/card";
import type { ExperienceEntry } from "@/config/experience";

gsap.registerPlugin(ScrollTrigger);

function splitHighlight(text: string): { label: string | null; body: string } {
  const at = text.indexOf(": ");
  if (at === -1) return { label: null, body: text };
  return { label: text.slice(0, at), body: text.slice(at + 2) };
}

export interface JourneyProps {
  entries: ExperienceEntry[];
}

export function Journey({ entries }: JourneyProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Left column editorial block reveal
      gsap.fromTo(
        "[data-exp-left]",
        { y: 48, opacity: 0.08 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            end: "top 36%",
            scrub: 0.5,
          },
        },
      );

      // 2. Ambient 'g' monogram slow parallax drift
      gsap.fromTo(
        "[data-exp-watermark]",
        { y: -26, rotate: -7, scale: 0.92 },
        {
          y: 26,
          rotate: 5,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // 3. Right entry dossier sequence: Header -> Metadata Strip Draw -> Staggered Operational Logs
      const cards = gsap.utils.toArray<HTMLElement>("[data-exp-card]");
      cards.forEach((card) => {
        const header = card.querySelector("[data-exp-header]");
        const meta = card.querySelector("[data-exp-meta]");
        const summary = card.querySelector("[data-exp-summary]");
        const highlights = card.querySelectorAll("[data-exp-highlight]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 52%",
            scrub: 0.5,
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { y: 28, opacity: 0.08 },
            { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
            0,
          );
        }

        if (meta) {
          tl.fromTo(
            meta,
            { scaleX: 0.85, opacity: 0, transformOrigin: "left center" },
            { scaleX: 1, opacity: 1, duration: 0.25, ease: "power2.out" },
            0.12,
          );
        }

        if (summary) {
          tl.fromTo(
            summary,
            { y: 20, opacity: 0.08 },
            { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
            0.22,
          );
        }

        if (highlights.length) {
          tl.fromTo(
            highlights,
            { x: 64, opacity: 0.06 },
            {
              x: 0,
              opacity: 1,
              stagger: 0.14,
              duration: 0.35,
              ease: "power2.out",
            },
            0.3,
          );
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#06080f]"
      id="journey"
    >
      <div className="mx-auto max-w-[1160px] border-x border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] lg:divide-x lg:divide-white/10">
          {/* Left Column */}
          <div className="flex flex-col justify-between">
            <div>
              <SectionTab label="EXPERIENCE" />
            </div>

            <div
              data-exp-left
              className="px-7 pb-10 pt-10 will-change-transform sm:px-10 sm:pb-14"
            >
              <h2 className="font-sans text-[26px] font-normal leading-[1.2] tracking-[-0.028em] text-white sm:text-[34px]">
                Operational track record.{" "}
                <span className="text-[#7d8597]">
                  Enterprise IT support, KPI systems, and workflow automation on the floor.
                </span>
              </h2>

              <div className="mt-8 inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0d111c] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/65">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400" />
                {String(entries.length).padStart(2, "0")} VERIFIED ROLE
                {entries.length === 1 ? "" : "S"}
              </div>
            </div>
          </div>

          {/* Right Entries Column */}
          <div className="divide-y divide-white/10 border-t border-white/10 lg:border-t-0">
            {entries.map((entry) => {
              const current = entry.status === "current";

              return (
                <article
                  key={entry.id}
                  data-exp-card
                  className="group relative isolate overflow-hidden p-7 sm:p-10"
                >
                  {/* Single ambient 'g' monogram watermark (/astra-graphia-icon.svg) */}
                  {entry.icon ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
                    >
                      {/* Soft sky-blue spotlight behind the 'g' logo */}
                      <div className="absolute right-2 top-2 h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(56,142,250,0.2)_0%,rgba(28,64,138,0.06)_55%,transparent_75%)] blur-xl" />

                      <img
                        alt=""
                        data-exp-watermark
                        className="absolute right-6 top-6 h-24 w-24 object-contain opacity-[0.14] brightness-0 invert drop-shadow-[0_0_20px_rgba(96,165,250,0.4)] transition-opacity duration-500 will-change-transform group-hover:opacity-[0.22] sm:right-8 sm:top-7 sm:h-32 sm:w-32"
                        src={entry.icon}
                      />
                    </div>
                  ) : null}

                  <div
                    data-exp-header
                    className="flex flex-wrap items-start justify-between gap-4 will-change-transform"
                  >
                    <div className="flex items-center gap-4">
                      <SquircleChip icon="briefcase" idPrefix={`exp-${entry.id}`} size="sm" />
                      <div>
                        <h3 className="font-sans text-xl font-medium tracking-[-0.02em] text-white sm:text-2xl">
                          {entry.title}
                        </h3>
                        <p className="mt-0.5 font-sans text-sm text-[#95a0b5]">{entry.org}</p>
                      </div>
                    </div>

                    {current ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-sky-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        CURRENT
                      </span>
                    ) : null}
                  </div>

                  {/* Metadata Strip */}
                  <div
                    data-exp-meta
                    className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-y border-white/[0.08] py-3 font-mono text-[11px] uppercase tracking-[0.06em] text-white/55 will-change-transform"
                  >
                    <span>{entry.type}</span>
                    <span aria-hidden="true" className="text-white/25">
                      ·
                    </span>
                    <span>
                      {entry.start} – {entry.end}
                    </span>
                    <span aria-hidden="true" className="text-white/25">
                      ·
                    </span>
                    <span>{entry.duration}</span>
                    <span aria-hidden="true" className="text-white/25">
                      ·
                    </span>
                    <span>{entry.location}</span>
                    <span aria-hidden="true" className="text-white/25">
                      ·
                    </span>
                    <span>{entry.locationType}</span>
                  </div>

                  <p
                    data-exp-summary
                    className="mt-6 font-sans text-[15px] leading-relaxed text-[#95a0b5] will-change-transform"
                  >
                    {entry.summary}
                  </p>

                  <ul className="mt-6 flex flex-col gap-3.5">
                    {entry.highlights.map((highlight) => {
                      const { label, body } = splitHighlight(highlight);

                      return (
                        <li
                          key={highlight}
                          data-exp-highlight
                          className="flex gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 font-sans text-sm leading-relaxed text-[#8d96aa] will-change-transform"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-sky-400"
                          />
                          <span>
                            {label ? (
                              <span className="font-medium text-white">{label}: </span>
                            ) : null}
                            {body}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
