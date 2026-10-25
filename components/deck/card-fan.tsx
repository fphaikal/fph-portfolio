"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Kipas kartu.
 *
 * Cara kerjanya: poros putar diletakkan di BAWAH dek (`transform-origin:
 * 50% 132%`), lalu tiap kartu hanya diputar sebesar sudut yang diturunkan
 * dari indeksnya. Karena porosnya jauh di bawah, memutar kartu otomatis
 * mendorongnya keluar ke samping SEKALIGUS turun ke bawah — itulah yang
 * membentuk busur, bukan sekadar kartu miring di tempatnya.
 *
 * Bayangannya mengikuti jarak kartu dari lampu di tengah: makin jauh dari
 * lampu, makin panjang dan makin lembut bayangannya.
 */

export interface CardFanProps {
  /** Isi tiap kartu, berurutan dari kiri ke kanan. */
  items: ReactNode[];
  /** Total sudut sebaran kipas, dalam derajat. */
  spread?: number;
  /** Lebar maksimum satu kartu, dalam px. */
  cardWidth?: number;
  /** Lebar minimum satu kartu, dalam px — dipakai di layar sempit. */
  minCardWidth?: number;
  /** Kekuatan cahaya lampu di atas kipas, 0..1. */
  light?: number;
  /** Kartu terangkat saat disorot. */
  interactive?: boolean;
  /** Kelas untuk wadah. */
  className?: string;
  /** Label untuk pembaca layar; kipas sendiri bersifat dekoratif. */
  label?: string;
}

/** Rasio kartu remi sungguhan: 2.5 : 3.5 inci. */
const CARD_RATIO = 7 / 5;

export function CardFan({
  items,
  spread = 56,
  cardWidth = 232,
  minCardWidth = 108,
  light = 0.55,
  interactive = true,
  className,
  label,
}: CardFanProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [slotWidth, setSlotWidth] = useState(cardWidth);

  const count = items.length;
  const mid = (count - 1) / 2;

  // Lebar kartu menyesuaikan lebar wadah: kartu harus tetap bertumpuk
  // membentuk kipas, bukan berjejer seperti galeri.
  useEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const compute = () => {
      const available = el.clientWidth;

      if (!available) return;

      const steps = Math.max(1, count - 1);
      const fit = available / (1 + steps * 0.34);

      setSlotWidth(Math.max(minCardWidth, Math.min(cardWidth, Math.round(fit))));
    };

    compute();

    const observer = new ResizeObserver(compute);

    observer.observe(el);

    return () => observer.disconnect();
  }, [count, cardWidth, minCardWidth]);

  const cardHeight = slotWidth * CARD_RATIO;
  const step = count > 1 ? spread / (count - 1) : 0;
  // Ruang ekstra di bawah untuk busur dan bayangan yang menjuntai.
  const height = Math.round(cardHeight * 1.2 + slotWidth * 0.24);

  return (
    <div
      aria-label={label}
      className={cn("relative w-full", interactive && "card-fan--interactive", className)}
      ref={containerRef}
      role={label ? "group" : undefined}
      style={{ height }}
    >
      {/* Lampu di atas kipas — sumber cahaya yang menghasilkan bayangan. */}
      {light > 0 ? (
        <span
          aria-hidden="true"
          className="card-fan__lamp animate-lamp-flicker"
          style={{ opacity: light }}
        />
      ) : null}

      <div className="card-fan relative h-full w-full">
        {items.map((item, index) => {
          const offset = index - mid;
          // Sudut dari indeks. Kartu paling kiri bernilai negatif (berputar
          // berlawanan arah jarum jam), kartu paling kanan positif.
          const angle = offset * step;
          // Jarak ternormalisasi dari lampu di tengah, 0 (tengah) .. 1 (tepi).
          const distance = mid === 0 ? 0 : Math.abs(offset) / mid;

          // Makin jauh dari lampu: bayangan makin panjang, makin lembut,
          // dan kartunya sedikit meredup karena cahaya berkurang.
          const shadow = [
            `0 ${Math.round(5 + 12 * distance)}px ${Math.round(12 + 26 * distance)}px -8px rgba(0,0,0,${
              (0.4 + 0.28 * distance).toFixed(2)
            })`,
            `0 ${Math.round(22 + 44 * distance)}px ${Math.round(44 + 76 * distance)}px -26px rgba(0,0,0,${
              (0.48 + 0.24 * distance).toFixed(2)
            })`,
          ].join(", ");

          return (
            <div
              key={index}
              className="card-fan__slot absolute top-0"
              style={{
                width: slotWidth,
                height: cardHeight,
                left: `calc(50% - ${slotWidth / 2}px)`,
                // Kartu tengah paling atas, tepi paling bawah — seperti
                // kipas sungguhan yang dipegang dari bawah.
                zIndex: count - Math.abs(offset),
                transform: `rotate(${angle.toFixed(3)}deg)`,
                ["--fan-shadow" as string]: shadow,
              }}
            >
              <div
                className="card-fan__enter h-full w-full"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div
                  className="card-fan__lift h-full w-full"
                  style={{ filter: `brightness(${(1 - 0.07 * distance).toFixed(3)})` }}
                >
                  {item}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
