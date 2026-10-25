"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Lampu meja: kerucut cahaya merah hangat yang mengikuti pointer dan
 * menyinari kain meja.
 *
 * Satu div saja. Titik pusat gradien ditulis ke properti kustom
 * `--lamp-x` / `--lamp-y` langsung di node, di dalam loop rAF — tidak ada
 * setState saat pointer bergerak. Lampu bergerak dengan lerp halus supaya
 * terasa seperti lampu yang digantung, bukan sorotan kaku.
 *
 * Mati total di pointer kasar dan saat gerak dibatasi.
 */

const LERP = 0.12;

export function Spotlight() {
  const [enabled, setEnabled] = useState(false);
  const lampRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!fine || reduced) return;

    setEnabled(true);

    return () => setEnabled(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const node = lampRef.current;

    if (!node) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight * 0.42 };
    const lamp = { x: target.x, y: target.y };
    let visible = false;
    let raf = 0;

    const show = () => {
      if (visible) return;
      visible = true;
      node.style.opacity = "1";
    };

    const hide = () => {
      if (!visible) return;
      visible = false;
      node.style.opacity = "0";
    };

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      show();
    };

    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };

    const tick = () => {
      lamp.x += (target.x - lamp.x) * LERP;
      lamp.y += (target.y - lamp.y) * LERP;

      node.style.setProperty("--lamp-x", `${lamp.x.toFixed(1)}px`);
      node.style.setProperty("--lamp-y", `${lamp.y.toFixed(1)}px`);

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut);
    window.addEventListener("blur", hide);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", hide);
    };
  }, [enabled]);

  if (!enabled) return null;

  const style = {
    backgroundImage:
      "radial-gradient(circle 680px at var(--lamp-x, 50%) var(--lamp-y, 50%), hsl(var(--deck-red-bright) / 0.16) 0%, hsl(var(--deck-red) / 0.11) 22%, hsl(210 16% 60% / 0.05) 46%, transparent 72%)",
    transition: "opacity 0.7s ease",
    opacity: 0,
  } as CSSProperties;

  return (
    <div
      ref={lampRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5]"
      style={style}
    />
  );
}
