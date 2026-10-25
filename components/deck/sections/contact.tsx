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

const LINKS: Array<{
  name: string;
  handle: string;
  code: string;
  href: string;
  external: boolean;
  icon: SquircleIconVariant;
}> = [
  {
    name: "GitHub",
    handle: "@fphaikal",
    code: "01",
    href: "https://github.com/fphaikal",
    external: true,
    icon: "github",
  },
  {
    name: "LinkedIn",
    handle: "in/fphaikal",
    code: "02",
    href: "https://linkedin.com/in/fphaikal",
    external: true,
    icon: "linkedin",
  },
  {
    name: "Instagram",
    handle: "@fp_haikal",
    code: "03",
    href: "https://instagram.com/fp_haikal",
    external: true,
    icon: "instagram",
  },
  {
    name: "Direct Email",
    handle: "abufahreza@gmail.com",
    code: "04",
    href: "mailto:abufahreza@gmail.com",
    external: false,
    icon: "mail",
  },
];

function linkAttrs(external: boolean) {
  return external ? { target: "_blank", rel: "me noopener noreferrer" } : {};
}

export function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Horizon Portal Convergence (Top chip descends while headline & CTA converge upward)
      const portalTl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-contact-banner]",
          start: "top 84%",
          end: "bottom 50%",
          scrub: 0.5,
        },
      });

      portalTl
        .fromTo(
          "[data-contact-chip]",
          { y: -44, scale: 0.55, rotate: 16, opacity: 0 },
          { y: 0, scale: 1, rotate: 0, opacity: 1, duration: 0.35, ease: "back.out(2.2)" },
          0,
        )
        .fromTo(
          "[data-contact-heading]",
          { y: 44, scale: 0.94, opacity: 0.08, filter: "blur(5px)" },
          { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "power2.out" },
          0.08,
        )
        .fromTo(
          "[data-contact-cta]",
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
          0.24,
        );

      // 2. 4-Column Channel Wave Dock (rising wave stagger across CH 01 -> 04)
      gsap.fromTo(
        "[data-contact-channel]",
        { y: 64, opacity: 0.06, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-contact-channels]",
            start: "top 92%",
            end: "bottom 72%",
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
      id="contact"
      className="relative border-t border-white/10 bg-[#06080f]"
    >
      <div className="mx-auto max-w-[1160px] border-x border-white/10">
        {/* Top Heroic Call-to-Action Banner */}
        <div
          data-contact-banner
          className="lumina-bridge-bg relative overflow-hidden border-b border-white/10 px-7 py-20 text-center sm:px-12 sm:py-28"
        >
          <div className="absolute left-0 top-0">
            <SectionTab label="CONNECT" />
          </div>

          <div
            aria-hidden="true"
            className="lumina-micro-matrix pointer-events-none absolute inset-0 opacity-45 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_85%)]"
          />

          <div className="relative z-10 mx-auto flex max-w-[740px] flex-col items-center">
            <div data-contact-chip className="will-change-transform">
              <SquircleChip icon="mail" idPrefix="contact-chip" size="lg" />
            </div>

            <div data-contact-heading className="will-change-transform">
              <h2 className="mt-8 text-balance font-sans text-[34px] font-light leading-[1.08] tracking-[-0.032em] text-white sm:text-[50px]">
                Ready to{" "}
                <span className="font-serif italic font-normal text-[#a8ceff]">
                  connect your tools
                </span>{" "}
                and build together?
              </h2>

              <p className="mx-auto mt-5 max-w-[54ch] font-sans text-base leading-relaxed text-[#95a0b8]">
                Open for conversations on IT infrastructure, workflow automation, mechatronics
                systems, and full-stack web engineering.
              </p>
            </div>

            <div
              data-contact-cta
              className="mt-9 flex flex-wrap items-center justify-center gap-3 will-change-transform"
            >
              <a className="lumina-btn-primary" href="mailto:abufahreza@gmail.com">
                SEND AN EMAIL
              </a>
              <a
                className="lumina-btn-secondary"
                href="https://github.com/fphaikal"
                rel="noopener noreferrer"
                target="_blank"
              >
                VIEW GITHUB ↗
              </a>
            </div>
          </div>
        </div>

        {/* 4-Column Channel Matrix with Contextual 3D Squircle Icons */}
        <div
          data-contact-channels
          className="grid grid-cols-1 divide-y divide-white/10 overflow-hidden sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x"
        >
          {LINKS.map((link) => (
            <a
              key={link.name}
              data-contact-channel
              href={link.href}
              {...linkAttrs(link.external)}
              className="group flex flex-col justify-between bg-[#06080f] p-7 transition-colors will-change-transform hover:bg-[#0b101d] sm:p-8"
            >
              <div className="flex items-start justify-between gap-3">
                <SquircleChip
                  icon={link.icon}
                  idPrefix={`contact-link-${link.code}`}
                  size="sm"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/45 transition-colors group-hover:text-sky-300">
                  CH · {link.code} ↗
                </span>
              </div>

              <div className="mt-7">
                <p className="font-sans text-xl font-medium tracking-[-0.02em] text-white">
                  {link.name}
                </p>
                <p className="mt-1 font-mono text-xs text-[#7d8597] group-hover:text-sky-200/80">
                  {link.handle}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
