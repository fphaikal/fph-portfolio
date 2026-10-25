"use client";

import { useEffect, useRef, useState } from "react";

import { SUITS, SUIT_GLYPH, isRedSuit } from "@/components/deck/card";

/**
 * Kursor khas dek: cincin yang menyeret lambang kartu.
 *
 * Cincin bergerak dengan lerp (tertinggal sedikit), sedangkan lambang dan
 * readout menempel persis di pointer. Posisi disimpan di ref dan ditulis
 * langsung ke node lewat satu loop rAF — tidak ada setState per gerakan.
 *
 * Hanya untuk pointer presisi (mouse) dan saat gerak tidak dibatasi.
 */

const LERP = 0.18;
/** Jarak tempuh (px) untuk mengganti lambang — dek terasa dikocok. */
const SUIT_STEP = 140;
const RING_SIZE = 44;
const GLYPH_SIZE = 20;
const PING_SIZE = 40;

/** Bulatkan ke 4 digit, mis. 41 -> "0041". */
function pad(value: number): string {
  return String(Math.max(0, Math.round(value))).padStart(4, "0");
}

export function CursorSuit() {
  const [enabled, setEnabled] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const glyphRef = useRef<HTMLSpanElement | null>(null);
  const readoutRef = useRef<HTMLDivElement | null>(null);
  const pingRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!fine || reduced) return;

    setEnabled(true);

    return () => setEnabled(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("deck-cursor");

    const target = { x: -200, y: -200 };
    const ring = { x: -200, y: -200 };
    const last = { x: 0, y: 0, travelled: 0, index: 0 };
    let visible = false;
    let raf = 0;

    const show = () => {
      if (visible) return;
      visible = true;
      // Snap cincin supaya tidak meluncur dari posisi lama.
      ring.x = target.x;
      ring.y = target.y;
      if (rootRef.current) rootRef.current.style.opacity = "1";
    };

    const hide = () => {
      if (!visible) return;
      visible = false;
      if (rootRef.current) rootRef.current.style.opacity = "0";
    };

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      show();
    };

    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };

    const onDown = (event: PointerEvent) => {
      const ping = pingRef.current;

      if (!ping) return;

      const x = event.clientX - PING_SIZE / 2;
      const y = event.clientY - PING_SIZE / 2;

      ping.animate(
        [
          { transform: `translate3d(${x}px, ${y}px, 0) scale(0.4)`, opacity: 0.85 },
          { transform: `translate3d(${x}px, ${y}px, 0) scale(2.1)`, opacity: 0 },
        ],
        { duration: 620, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    };

    const tick = () => {
      ring.x += (target.x - ring.x) * LERP;
      ring.y += (target.y - ring.y) * LERP;

      const travelled = Math.hypot(target.x - last.x, target.y - last.y);

      last.travelled += travelled;
      last.x = target.x;
      last.y = target.y;

      if (last.travelled > SUIT_STEP) {
        last.travelled = 0;
        last.index = (last.index + 1) % SUITS.length;

        const suit = SUITS[last.index];
        const glyph = glyphRef.current;

        if (glyph) {
          glyph.textContent = SUIT_GLYPH[suit];
          glyph.style.color = isRedSuit(suit)
            ? "hsl(var(--deck-red-bright))"
            : "hsl(var(--deck-ivory))";
        }
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x - RING_SIZE / 2}px, ${
          ring.y - RING_SIZE / 2
        }px, 0)`;
      }

      if (glyphRef.current) {
        glyphRef.current.style.transform = `translate3d(${target.x - GLYPH_SIZE / 2}px, ${
          target.y - GLYPH_SIZE / 2
        }px, 0)`;
      }

      if (readoutRef.current) {
        readoutRef.current.textContent = `X ${pad(target.x)} · Y ${pad(target.y)}`;
        readoutRef.current.style.transform = `translate3d(${target.x + 22}px, ${
          target.y + 18
        }px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerout", onOut);
    window.addEventListener("blur", hide);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", hide);
      root.classList.remove("deck-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] select-none opacity-0 transition-opacity duration-300"
      style={{ pointerEvents: "none" }}
    >
      {/* Cincin yang tertinggal di belakang pointer. */}
      <div
        ref={ringRef}
        className="pointer-events-none absolute left-0 top-0 h-11 w-11 rounded-full border border-deck-red/60 will-change-transform"
        style={{ transform: "translate3d(-999px, -999px, 0)" }}
      />

      {/* Lambang yang menempel persis di pointer. */}
      <span
        ref={glyphRef}
        className="pointer-events-none absolute left-0 top-0 inline-block h-5 w-5 text-center text-[15px] leading-5 will-change-transform"
        style={{ color: "hsl(var(--deck-ivory))", transform: "translate3d(-999px, -999px, 0)" }}
      >
        {SUIT_GLYPH[SUITS[0]]}
      </span>

      {/* Ping "bagikan kartu" saat klik. */}
      <span
        ref={pingRef}
        className="pointer-events-none absolute left-0 top-0 h-10 w-10 rounded-full border border-deck-red-bright/70 opacity-0"
      />

      {/* Readout koordinat. */}
      <div
        ref={readoutRef}
        className="deck-readout pointer-events-none absolute left-0 top-0 whitespace-nowrap text-deck-xs text-deck-ivory/70"
        style={{ transform: "translate3d(-999px, -999px, 0)" }}
      >
        X 0000 · Y 0000
      </div>
    </div>
  );
}
