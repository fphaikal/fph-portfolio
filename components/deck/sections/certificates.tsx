"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SectionTab, SquircleChip } from "@/components/deck/card";
import type { Certificate } from "@/config/certificates";

gsap.registerPlugin(ScrollTrigger);

export interface CertificatesProps {
  items: Certificate[];
}

export function Certificates({ items }: CertificatesProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Left header rises into place
      gsap.fromTo(
        "[data-cert-left]",
        { y: 40, opacity: 0.08 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            end: "top 40%",
            scrub: 0.5,
          },
        },
      );

      // 2. Precision Socket Zoom-Out Lock-In for each credential card
      const cards = gsap.utils.toArray<HTMLElement>("[data-cert-card]");
      gsap.fromTo(
        cards,
        {
          scale: 1.14,
          y: 28,
          opacity: 0.06,
          filter: "blur(7px)",
        },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "top 34%",
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
      id="certificates"
      className="relative border-t border-white/10 bg-[#06080f]"
    >
      <div className="mx-auto max-w-[1160px] border-x border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] lg:divide-x lg:divide-white/10">
          {/* Left Header */}
          <div className="flex flex-col justify-between">
            <div>
              <SectionTab label="CERTIFICATIONS" />
            </div>

            <div
              data-cert-left
              className="px-7 pb-10 pt-10 will-change-transform sm:px-10 sm:pb-14"
            >
              <h2 className="font-sans text-[26px] font-normal leading-[1.2] tracking-[-0.028em] text-white sm:text-[34px]">
                Verified credentials.{" "}
                <span className="text-[#7d8597]">
                  Industrial mechatronics and web engineering programs completed.
                </span>
              </h2>
            </div>
          </div>

          {/* Right Certificates Grid */}
          <div className="grid grid-cols-1 divide-y divide-white/10 overflow-hidden border-t border-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:border-t-0">
            {items.map((item) => (
              <div
                key={item.id}
                data-cert-card
                className="lumina-dot-grid flex flex-col justify-between p-7 will-change-transform sm:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <SquircleChip
                    icon={item.id.includes("mechatronics") ? "hardware" : "award"}
                    idPrefix={`cert-${item.id}`}
                    size="sm"
                  />

                  <span className="rounded-md border border-white/15 bg-[#0c101b] px-2.5 py-1 font-mono text-[11px] font-medium text-white/85">
                    {item.year}
                  </span>
                </div>

                <div className="mt-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300/85">
                    ▪ {item.issuer}
                  </p>
                  <h3 className="mt-2 font-sans text-lg font-medium leading-snug tracking-[-0.015em] text-white">
                    {item.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
