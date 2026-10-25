"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SectionTab } from "@/components/deck/card";
import type { EducationEntry } from "@/config/education";

gsap.registerPlugin(ScrollTrigger);

function splitHighlight(text: string): { label: string | null; body: string } {
  const at = text.indexOf(": ");
  if (at === -1) return { label: null, body: text };
  return { label: text.slice(0, at), body: text.slice(at + 2) };
}

export interface EducationProps {
  entries: EducationEntry[];
}

export function Education({ entries }: EducationProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Left column headline & institution quick-badges pop-in
      gsap.fromTo(
        "[data-edu-left]",
        { x: -48, opacity: 0.08 },
        {
          x: 0,
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

      gsap.fromTo(
        "[data-edu-badge]",
        { scale: 0.72, y: 20, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          stagger: 0.14,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: "[data-edu-left]",
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.5,
          },
        },
      );

      // 2. Each Institution Card: 3D Top-Hinge Unfold + Emblem Spin-Lock + Coursework Wave
      const cards = gsap.utils.toArray<HTMLElement>("[data-edu-card]");
      cards.forEach((card) => {
        const emblem = card.querySelector("[data-edu-emblem]");
        const watermark = card.querySelector("[data-edu-watermark]");
        const highlights = card.querySelectorAll("[data-edu-highlight]");
        const pills = card.querySelectorAll("[data-edu-pill]");

        gsap.fromTo(
          card,
          {
            rotateX: -14,
            y: 56,
            opacity: 0.08,
            transformPerspective: 1050,
            transformOrigin: "top center",
          },
          {
            rotateX: 0,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 40%",
              scrub: 0.5,
            },
          },
        );

        if (emblem) {
          gsap.fromTo(
            emblem,
            { scale: 0.45, rotate: -22, opacity: 0 },
            {
              scale: 1,
              rotate: 0,
              opacity: 1,
              ease: "back.out(2.2)",
              scrollTrigger: {
                trigger: card,
                start: "top 84%",
                end: "top 44%",
                scrub: 0.5,
              },
            },
          );
        }

        if (watermark) {
          gsap.fromTo(
            watermark,
            { y: 28, rotate: 8, scale: 0.9 },
            {
              y: -24,
              rotate: -6,
              scale: 1.05,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }

        if (highlights.length) {
          gsap.fromTo(
            highlights,
            { y: 28, opacity: 0.08 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 72%",
                end: "bottom 55%",
                scrub: 0.5,
              },
            },
          );
        }

        if (pills.length) {
          gsap.fromTo(
            pills,
            { scale: 0.78, y: 16, opacity: 0.05 },
            {
              scale: 1,
              y: 0,
              opacity: 1,
              stagger: 0.06,
              ease: "back.out(1.8)",
              scrollTrigger: {
                trigger: card,
                start: "top 62%",
                end: "bottom 48%",
                scrub: 0.5,
              },
            },
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
      id="education"
    >
      <div className="mx-auto max-w-[1160px] border-x border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] lg:divide-x lg:divide-white/10">
          {/* Left Column */}
          <div className="flex flex-col justify-between overflow-hidden">
            <div>
              <SectionTab label="EDUCATION" />
            </div>

            <div
              data-edu-left
              className="px-7 pb-10 pt-10 will-change-transform sm:px-10 sm:pb-14"
            >
              <h2 className="font-sans text-[26px] font-normal leading-[1.2] tracking-[-0.028em] text-white sm:text-[34px]">
                Academic foundation.{" "}
                <span className="text-[#7d8597]">
                  Where industrial mechatronics meets computer science and software engineering.
                </span>
              </h2>

              <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-[#7d8597]">
                Trained in 4-year industrial mechatronics under the Ministry of Industry before
                advancing into undergraduate Informatics in Yogyakarta.
              </p>

              {/* Institution quick badges */}
              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    data-edu-badge
                    className="inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-[#0d111c] px-3 py-2 will-change-transform"
                  >
                    <img
                      alt={entry.shortName}
                      className="h-5 w-5 object-contain"
                      src={entry.logo}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/75">
                      {entry.shortName}
                    </span>
                  </div>
                ))}
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
                  data-edu-card
                  className="group relative isolate overflow-hidden p-7 will-change-transform sm:p-10"
                >
                  {/* Subtle ambient institution logo watermark in top-right */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
                  >
                    <div className="absolute right-2 top-2 h-[170px] w-[170px] rounded-full bg-[radial-gradient(circle,rgba(56,142,250,0.16)_0%,rgba(28,64,138,0.05)_55%,transparent_75%)] blur-xl" />

                    <img
                      alt=""
                      data-edu-watermark
                      className="absolute right-6 top-6 h-24 w-24 object-contain opacity-[0.1] saturate-50 drop-shadow-[0_0_18px_rgba(96,165,250,0.3)] transition-opacity duration-500 will-change-transform group-hover:opacity-[0.18] sm:right-8 sm:top-7 sm:h-28 sm:w-28"
                      src={entry.logo}
                    />
                  </div>

                  {/* Header with Official Logo in Squircle Frame */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        data-edu-emblem
                        className="lumina-squircle flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] p-2 will-change-transform"
                      >
                        <img
                          alt={`${entry.institution} logo`}
                          className="h-full w-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
                          src={entry.logo}
                        />
                      </div>

                      <div>
                        <h3 className="font-sans text-xl font-medium tracking-[-0.02em] text-white sm:text-2xl">
                          {entry.institution}
                        </h3>
                        <p className="mt-0.5 font-sans text-sm font-medium text-sky-300/90">
                          {entry.degree} · {entry.field}
                        </p>
                        <p className="mt-0.5 font-sans text-xs text-[#7d8597]">
                          {entry.facultyOrMinistry}
                        </p>
                      </div>
                    </div>

                    {current ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-sky-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        UNDERGRADUATE · ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/65">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                        GRADUATED
                      </span>
                    )}
                  </div>

                  {/* Metadata Strip */}
                  <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-y border-white/[0.08] py-3 font-mono text-[11px] uppercase tracking-[0.06em] text-white/55">
                    <span>
                      {entry.start} – {entry.end}
                    </span>
                    <span aria-hidden="true" className="text-white/25">
                      ·
                    </span>
                    <span>{entry.location}</span>
                    {entry.website ? (
                      <>
                        <span aria-hidden="true" className="text-white/25">
                          ·
                        </span>
                        <a
                          className="text-sky-300/80 transition-colors hover:text-sky-300"
                          href={entry.website}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {entry.website.replace(/^https?:\/\//, "")} ↗
                        </a>
                      </>
                    ) : null}
                  </div>

                  {/* Summary */}
                  <p className="mt-6 font-sans text-[15px] leading-relaxed text-[#95a0b5]">
                    {entry.summary}
                  </p>

                  {/* Highlights */}
                  <ul className="mt-6 flex flex-col gap-3.5">
                    {entry.highlights.map((highlight) => {
                      const { label, body } = splitHighlight(highlight);

                      return (
                        <li
                          key={highlight}
                          data-edu-highlight
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

                  {/* Focus & Coursework Pills */}
                  {entry.coursework.length > 0 ? (
                    <div className="mt-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                        KEY FOCUS & COURSEWORK
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {entry.coursework.map((course) => (
                          <span
                            key={course}
                            data-edu-pill
                            className="rounded-md border border-white/[0.08] bg-[#0b0f19] px-2.5 py-1 font-mono text-[11px] text-white/70 will-change-transform"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
