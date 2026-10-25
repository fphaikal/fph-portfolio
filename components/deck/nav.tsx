"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { LuminaMark } from "@/components/deck/card";
import { EXTERNAL_LINKS, NAV_MODULES } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const CENTER_LINKS = [
  { id: "home", label: "HOME", href: "/" },
  { id: "about", label: "ABOUT", href: "/#about" },
  { id: "work", label: "PROJECTS", href: "/#work" },
  { id: "stack", label: "TOOLKIT", href: "/#stack" },
  { id: "notes", label: "NOTES", href: "/blog" },
  { id: "music", label: "MUSIC", href: "/spotify" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        "[data-nav-brand]",
        { y: -20, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1 },
        0.08,
      )
        .fromTo(
          "[data-nav-item]",
          { y: -16, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.055,
            duration: 0.95,
          },
          0.16,
        )
        .fromTo(
          "[data-nav-toggle]",
          { y: -18, opacity: 0, scale: 0.85 },
          { y: 0, opacity: 1, scale: 1, duration: 0.95 },
          0.32,
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || menuOpen
          ? "border-b border-white/[0.08] bg-[#050811]/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 sm:px-10"
      >
        {/* Top-left brand mark + wordmark matching Lumina */}
        <Link
          aria-label={`${siteConfig.fullName} — home`}
          data-nav-brand
          className="group flex items-center gap-2.5 text-white will-change-transform"
          href="/"
        >
          <LuminaMark
            className="transition-transform duration-300 group-hover:scale-105"
            idPrefix="nav-logo"
            size={22}
          />
          <span className="font-sans text-[15px] font-medium tracking-[-0.02em] text-white/95">
            {siteConfig.name}
          </span>
        </Link>

        {/* Center uppercase monospace navigation */}
        <ul className="hidden items-center gap-7 md:flex lg:gap-9">
          {CENTER_LINKS.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <li key={item.id} data-nav-item className="will-change-transform">
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors",
                    active
                      ? "text-white"
                      : "text-white/75 hover:text-white",
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Top-right minimal menu icon matching the reference image */}
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          data-nav-toggle
          className="touch-target flex h-9 w-9 flex-col items-end justify-center gap-[4px] rounded-md text-white/85 transition-colors will-change-transform hover:text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          type="button"
        >
          <span
            className={cn(
              "block h-[1.5px] bg-current transition-all duration-200",
              menuOpen ? "w-5 translate-y-[5.5px] rotate-45" : "w-5",
            )}
          />
          <span
            className={cn(
              "block h-[1.5px] bg-current transition-all duration-200",
              menuOpen ? "w-0 opacity-0" : "w-5",
            )}
          />
          <span
            className={cn(
              "block h-[1.5px] bg-current transition-all duration-200",
              menuOpen ? "w-5 -translate-y-[5.5px] -rotate-45" : "w-3.5",
            )}
          />
        </button>
      </nav>

      {/* Architectural dropdown drawer */}
      {menuOpen ? (
        <div className="border-b border-white/10 bg-[#060913]/95 px-6 py-8 backdrop-blur-2xl sm:px-10">
          <div className="mx-auto grid max-w-[1200px] gap-8 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                ▪ Navigation
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {CENTER_LINKS.map((item) => (
                  <li key={item.id}>
                    <Link
                      className="font-mono text-xs uppercase tracking-[0.1em] text-white/80 transition-colors hover:text-white"
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                ▪ Modules
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {NAV_MODULES.map((mod) => (
                  <li key={mod.id}>
                    <Link
                      className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-white/80 transition-colors hover:text-white"
                      href={mod.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="text-sky-400/70">{mod.index}</span>
                      <span>{mod.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                ▪ Channels
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {EXTERNAL_LINKS.map((ext) => (
                  <li key={ext.id}>
                    <a
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-white/80 transition-colors hover:text-white"
                      href={ext.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>{ext.label}</span>
                      <span aria-hidden="true" className="text-sky-400">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
