"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  SectionTab,
  SquircleChip,
  type SquircleIconVariant,
} from "@/components/deck/card";
import type { ProjectGroup, ProjectItem } from "@/config/projects";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ProjectRow {
  item: ProjectItem;
  groupTitle: string;
  groupIndex: string;
  groupId: string;
}

export interface ProjectsProps {
  groups: ProjectGroup[];
}

/** Map each project to its specific contextual 3D squircle icon. */
function iconForProject(id: string, groupId: string): SquircleIconVariant {
  switch (id) {
    case "meytrics":
      return "activity";
    case "spm-dashboard":
      return "chart";
    case "gaskan":
      return "shield";
    case "dashboard-iot":
      return "hardware";
    case "natslock":
      return "lock";
    case "qc-report-api":
      return "api";
    case "qc-report-app":
      return "clipboard";
    case "chemicfest-8":
    case "fase-7":
    case "touch-14":
      return "globe";
    default:
      if (groupId === "hardware") return "hardware";
      if (groupId === "automation") return "workflow";
      if (groupId === "reliability") return "activity";
      return "code";
  }
}

export function Projects({ groups }: ProjectsProps) {
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const sectionRef = useRef<HTMLElement | null>(null);

  const rows = useMemo<ProjectRow[]>(
    () =>
      groups.flatMap((group) =>
        group.items.map((item) => ({
          item,
          groupTitle: group.title,
          groupIndex: group.index,
          groupId: group.id,
        })),
      ),
    [groups],
  );

  const filtered = useMemo(
    () =>
      activeGroup === "all"
        ? rows
        : rows.filter((r) => r.groupId === activeGroup),
    [rows, activeGroup],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Split-Shutter Header Convergence (Left & Right panels slide in from opposite poles)
      gsap.fromTo(
        "[data-proj-header-left]",
        { x: -64, opacity: 0.06 },
        {
          x: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-proj-header]",
            start: "top 85%",
            end: "top 35%",
            scrub: 0.5,
          },
        },
      );

      gsap.fromTo(
        "[data-proj-header-right]",
        { x: 64, opacity: 0.06 },
        {
          x: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-proj-header]",
            start: "top 85%",
            end: "top 35%",
            scrub: 0.5,
          },
        },
      );

      // 2. Opposing 3D Vault-Door Card Reveal per Project Card
      const cards = gsap.utils.toArray<HTMLElement>("[data-proj-card]");
      cards.forEach((card, i) => {
        const isRight = i % 2 === 1;
        gsap.fromTo(
          card,
          {
            x: isRight ? 60 : -60,
            y: 44,
            rotateY: isRight ? -12 : 12,
            opacity: 0.08,
            transformPerspective: 1100,
            transformOrigin: isRight ? "right center" : "left center",
          },
          {
            x: 0,
            y: 0,
            rotateY: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 42%",
              scrub: 0.5,
            },
          },
        );
      });
    }, el);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [activeGroup]);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#06080f]"
      id="work"
    >
      <div className="mx-auto max-w-[1160px] border-x border-white/10">
        {/* Top Split Header */}
        <div
          data-proj-header
          className="grid grid-cols-1 overflow-hidden lg:grid-cols-[1.15fr_0.85fr] lg:divide-x lg:divide-white/10"
        >
          <div className="flex flex-col justify-between">
            <div>
              <SectionTab label="SELECTED WORK" />
            </div>

            <div
              data-proj-header-left
              className="px-7 pb-10 pt-10 will-change-transform sm:px-10 sm:pb-12"
            >
              <h2 className="font-sans text-[28px] font-normal leading-[1.18] tracking-[-0.03em] text-white sm:text-[38px]">
                Shipped systems that{" "}
                <span className="font-serif italic font-normal text-[#a8ceff]">
                  connect hardware
                </span>{" "}
                to the web.{" "}
                <span className="text-[#7d8597]">
                  {rows.length} production repositories across reliability, IoT, and automation.
                </span>
              </h2>
            </div>
          </div>

          {/* Right Filter Matrix Panel */}
          <div
            data-proj-header-right
            className="lumina-dot-grid flex flex-col justify-between border-t border-white/10 p-7 will-change-transform sm:p-10 lg:border-t-0"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                ▪ FILTER BY DOMAIN
              </span>
              <span className="font-mono text-[11px] text-sky-300/85">
                {String(filtered.length).padStart(2, "0")} / {String(rows.length).padStart(2, "0")} MODULES
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                className={cn(
                  "rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] transition-all",
                  activeGroup === "all"
                    ? "border-white bg-white font-semibold text-[#06080f]"
                    : "border-white/15 bg-[#0c101b]/90 text-white/75 hover:border-white/35 hover:text-white",
                )}
                onClick={() => setActiveGroup("all")}
                type="button"
              >
                ALL ({rows.length})
              </button>
              {groups.map((g) => (
                <button
                  key={g.id}
                  className={cn(
                    "rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] transition-all",
                    activeGroup === g.id
                      ? "border-white bg-white font-semibold text-[#06080f]"
                      : "border-white/15 bg-[#0c101b]/90 text-white/75 hover:border-white/35 hover:text-white",
                  )}
                  onClick={() => setActiveGroup(g.id)}
                  type="button"
                >
                  {g.index} · {g.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Architectural Project Grid */}
        <div className="grid grid-cols-1 divide-y divide-white/10 overflow-hidden border-t border-white/10 md:grid-cols-2 md:divide-y-0">
          {filtered.map((row, idx) => {
            const isRightCol = idx % 2 === 1;
            const isAfterFirstRow = idx >= 2;
            const projectIcon = iconForProject(row.item.id, row.groupId);

            return (
              <article
                key={row.item.id}
                data-proj-card
                className={cn(
                  "group relative flex flex-col justify-between bg-[#06080f] p-7 transition-colors will-change-transform hover:bg-[#090d18] sm:p-10",
                  isRightCol && "md:border-l md:border-white/10",
                  isAfterFirstRow && "md:border-t md:border-white/10",
                )}
              >
                {/* Top Meta Bar */}
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#111521] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.09em] text-white/80">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          row.item.status === "active" ? "bg-sky-400" : "bg-white/40",
                        )}
                      />
                      {row.groupIndex} · {row.groupTitle}
                    </span>

                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/45">
                      {row.item.year} — {row.item.stateLabel}
                    </span>
                  </div>

                  {/* Project Title + Contextual 3D Squircle Icon */}
                  <div className="mt-7 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-sans text-2xl font-medium tracking-[-0.025em] text-white sm:text-[26px]">
                        {row.item.name}
                      </h3>
                      <p className="mt-3 font-sans text-[15px] leading-relaxed text-[#7d8597]">
                        {row.item.description}
                      </p>
                    </div>

                    <SquircleChip
                      className="hidden shrink-0 sm:block"
                      icon={projectIcon}
                      idPrefix={`proj-${row.item.id}`}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Tech Stack Pills + Repository Link */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
                  <ul className="flex flex-wrap gap-1.5">
                    {row.item.tech.map((tech) => (
                      <li
                        key={tech}
                        className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white/70"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  {row.item.url ? (
                    <a
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:text-sky-300"
                      href={row.item.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>REPOSITORY</span>
                      <span aria-hidden="true" className="text-sky-400">
                        ↗
                      </span>
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
