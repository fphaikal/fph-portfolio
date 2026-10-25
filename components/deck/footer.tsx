"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LuminaMark } from "@/components/deck/card";
import { EXTERNAL_LINKS, NAV_MODULES } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  const [year, setYear] = useState<string | null>(null);

  useEffect(() => setYear(String(new Date().getFullYear())), []);

  return (
    <footer className="relative border-t border-white/10 bg-[#05070d]">
      <div className="mx-auto max-w-[1160px] border-x border-white/10 px-7 py-12 sm:px-10 sm:py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div>
            <Link className="inline-flex items-center gap-2.5 text-white" href="/">
              <LuminaMark idPrefix="footer-logo" size={22} />
              <span className="font-sans text-base font-medium tracking-[-0.02em] text-white">
                {siteConfig.fullName}
              </span>
            </Link>
            <p className="mt-3 max-w-[38ch] font-sans text-sm leading-relaxed text-[#7d8597]">
              IT Support Specialist at PT Astra Graphia Tbk, mechatronics engineering student, and
              full-stack developer in Jakarta, Indonesia.
            </p>
          </div>

          <div className="flex gap-14">
            <nav aria-label="Footer navigation">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                ▪ PLATFORM
              </p>
              <ul className="mt-4 space-y-2.5">
                {NAV_MODULES.map((module) => (
                  <li key={module.id}>
                    <Link
                      className="font-mono text-xs uppercase tracking-[0.08em] text-[#8d96aa] transition-colors hover:text-white"
                      href={module.href}
                    >
                      {module.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                ▪ ELSEWHERE
              </p>
              <ul className="mt-4 space-y-2.5">
                {EXTERNAL_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.08em] text-[#8d96aa] transition-colors hover:text-white"
                      href={link.href}
                      rel="me noopener noreferrer"
                      target="_blank"
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true" className="text-sky-400/80">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    className="font-mono text-xs uppercase tracking-[0.08em] text-[#8d96aa] transition-colors hover:text-white"
                    href="mailto:abufahreza@gmail.com"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-white/40">
          <p>
            &#169; {year ?? "----"} {siteConfig.name} · ALL RIGHTS RESERVED
          </p>
          <p>{siteConfig.url.replace("https://", "")}</p>
        </div>
      </div>
    </footer>
  );
}
