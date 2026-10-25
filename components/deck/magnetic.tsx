"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Magnetik / kemiringan 3D.
 *
 * Kartu terasa tertarik ke arah kursor lalu miring mengikuti posisi kursor
 * di dalamnya. Transform ditulis langsung ke DOM di dalam satu loop
 * requestAnimationFrame — tidak ada render ulang React saat kursor bergerak.
 */

export interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Kekuatan tarikan, 0..1. */
  strength?: number;
  /** Sudut kemiringan maksimum, derajat. */
  tilt?: number;
  /** Terapkan juga pada perangkat sentuh. Default false. */
  allowTouch?: boolean;
}

export function Magnetic({
  children,
  className,
  strength = 0.22,
  tilt = 6,
  allowTouch = false,
}: MagneticProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    if (reduce) return;
    if (coarse && !allowTouch) return;

    setEnabled(true);
  }, [allowTouch]);

  useEffect(() => {
    if (!enabled) return;

    const host = hostRef.current;
    const inner = innerRef.current;

    if (!host || !inner) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;
    let active = false;

    const loop = () => {
      // Peredaman yang tidak bergantung laju bingkai.
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;

      inner.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(
        2,
      )}px, 0) rotateX(${(-current.y * tilt * 0.06).toFixed(3)}deg) rotateY(${(
        current.x *
        tilt *
        0.06
      ).toFixed(3)}deg)`;

      if (active || Math.abs(current.x) > 0.05 || Math.abs(current.y) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;

      target.x = relX * strength;
      target.y = relY * strength;
      start();
    };

    const onEnter = () => {
      active = true;
      inner.style.transition = "none";
      start();
    };

    const onLeave = () => {
      active = false;
      target.x = 0;
      target.y = 0;
      inner.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
      start();
    };

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      inner.style.transform = "";
      inner.style.transition = "";
    };
  }, [enabled, strength, tilt]);

  return (
    <div className={cn("[perspective:1200px]", className)} ref={hostRef}>
      <div
        className="h-full w-full [transform-style:preserve-3d]"
        ref={innerRef}
        style={{ willChange: enabled ? "transform" : undefined }}
      >
        {children}
      </div>
    </div>
  );
}
