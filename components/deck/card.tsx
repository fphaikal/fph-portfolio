"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * LUMINA ARCHITECTURAL PRIMITIVES & CONTEXTUAL 3D SQUIRCLE ICONS.
 */

export type Suit = "spade" | "heart" | "diamond" | "club";

export const SUIT_GLYPH: Record<Suit, string> = {
  spade: "↗",
  heart: "▪",
  diamond: "◈",
  club: "⊹",
};

export const SUITS: Suit[] = ["spade", "heart", "diamond", "club"];

export function isRedSuit(suit: Suit): boolean {
  return suit === "heart" || suit === "diamond";
}

export function suitForIndex(index: number): Suit {
  return SUITS[((index % SUITS.length) + SUITS.length) % SUITS.length];
}

export type SquircleIconVariant =
  | "brand"
  | "terminal"
  | "hardware"
  | "code"
  | "workflow"
  | "activity"
  | "chart"
  | "shield"
  | "lock"
  | "api"
  | "clipboard"
  | "globe"
  | "network"
  | "briefcase"
  | "award"
  | "github"
  | "mail"
  | "linkedin"
  | "instagram";

/**
 * Sculpted 3D White-to-Ice-Blue Icon System.
 * Matches the exact shading, bevel, and two-tone depth of the reference squircle icon,
 * tailored to the context of each section and module.
 */
export function SquircleIcon({
  variant = "brand",
  size = 36,
  className,
  idPrefix = "sq-icon",
}: {
  variant?: SquircleIconVariant;
  size?: number;
  className?: string;
  idPrefix?: string;
}) {
  const mainGrad = `${idPrefix}-${variant}-main`;
  const subGrad = `${idPrefix}-${variant}-sub`;

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "inline-block shrink-0 select-none drop-shadow-[0_4px_12px_rgba(140,195,255,0.28)]",
        className,
      )}
      fill="none"
      height={size}
      viewBox="0 0 40 40"
      width={size}
    >
      <defs>
        <linearGradient id={mainGrad} x1="15%" x2="85%" y1="10%" y2="90%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="62%" stopColor="#e1effe" />
          <stop offset="100%" stopColor="#9ec2ec" />
        </linearGradient>
        <linearGradient id={subGrad} x1="15%" x2="90%" y1="15%" y2="92%">
          <stop offset="0%" stopColor="#f5faff" />
          <stop offset="55%" stopColor="#c4dffc" />
          <stop offset="100%" stopColor="#7ba8e0" />
        </linearGradient>
      </defs>

      {variant === "brand" && (
        <>
          <ellipse
            cx="17.8"
            cy="18.2"
            fill={`url(#${mainGrad})`}
            rx="12.2"
            ry="7.8"
            transform="rotate(-38 17.8 18.2)"
          />
          <ellipse
            cx="24.2"
            cy="25.2"
            fill="#0b101b"
            opacity="0.55"
            rx="8.2"
            ry="5.2"
            transform="rotate(-30 24.2 25.2)"
          />
          <ellipse
            cx="25.2"
            cy="26.2"
            fill={`url(#${subGrad})`}
            rx="7.8"
            ry="4.8"
            transform="rotate(-30 25.2 26.2)"
          />
        </>
      )}

      {variant === "terminal" && (
        <>
          {/* Main terminal screen body */}
          <rect
            fill={`url(#${mainGrad})`}
            height="20"
            rx="5"
            width="24"
            x="6"
            y="8"
          />
          {/* Terminal prompt cutout */}
          <path
            d="M12.5 15L16.5 18L12.5 21"
            stroke="#0d121d"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
          <line
            stroke="#0d121d"
            strokeLinecap="round"
            strokeWidth="2.4"
            x1="18.5"
            x2="23"
            y1="21"
            y2="21"
          />
          {/* Overlapping status node badge */}
          <rect
            fill="#0b101b"
            height="11"
            opacity="0.6"
            rx="3.5"
            width="13"
            x="21"
            y="21"
          />
          <rect
            fill={`url(#${subGrad})`}
            height="10"
            rx="3"
            width="12"
            x="22"
            y="22"
          />
          <circle cx="28" cy="27" fill="#0d121d" r="2" />
        </>
      )}

      {variant === "hardware" && (
        <>
          {/* Microcontroller pins */}
          <g fill={`url(#${subGrad})`}>
            <rect height="3.5" rx="1" width="2.5" x="13" y="5" />
            <rect height="3.5" rx="1" width="2.5" x="18.75" y="5" />
            <rect height="3.5" rx="1" width="2.5" x="24.5" y="5" />
            <rect height="3.5" rx="1" width="2.5" x="13" y="31.5" />
            <rect height="3.5" rx="1" width="2.5" x="18.75" y="31.5" />
            <rect height="3.5" rx="1" width="2.5" x="24.5" y="31.5" />
            <rect height="2.5" rx="1" width="3.5" x="5" y="13" />
            <rect height="2.5" rx="1" width="3.5" x="5" y="18.75" />
            <rect height="2.5" rx="1" width="3.5" x="5" y="24.5" />
            <rect height="2.5" rx="1" width="3.5" x="31.5" y="13" />
            <rect height="2.5" rx="1" width="3.5" x="31.5" y="18.75" />
            <rect height="2.5" rx="1" width="3.5" x="31.5" y="24.5" />
          </g>
          {/* Outer IC package */}
          <rect
            fill={`url(#${mainGrad})`}
            height="21"
            rx="5"
            width="21"
            x="9.5"
            y="9.5"
          />
          {/* Inner silicon die */}
          <rect
            fill="#0d121d"
            height="11"
            rx="2.5"
            width="11"
            x="14.5"
            y="14.5"
          />
          <rect
            fill={`url(#${subGrad})`}
            height="6"
            rx="1.5"
            width="6"
            x="17"
            y="17"
          />
        </>
      )}

      {variant === "code" && (
        <>
          {/* Back layer card */}
          <rect
            fill={`url(#${subGrad})`}
            height="17"
            rx="4"
            transform="rotate(6 22 20)"
            width="21"
            x="13"
            y="13"
          />
          <rect
            fill="#0b101b"
            height="18"
            opacity="0.55"
            rx="4.5"
            width="22"
            x="7"
            y="9.5"
          />
          {/* Front code window */}
          <rect
            fill={`url(#${mainGrad})`}
            height="18"
            rx="4.5"
            width="22"
            x="6.5"
            y="8.5"
          />
          <path
            d="M14.5 15L11.5 17.5L14.5 20M20.5 15L23.5 17.5L20.5 20M18.2 14L16.8 21"
            stroke="#0d121d"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </>
      )}

      {variant === "workflow" && (
        <>
          {/* Connector pipes */}
          <path
            d="M15 14H24C25.6569 14 27 15.3431 27 17V23"
            stroke={`url(#${subGrad})`}
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M14 16V24C14 25.6569 15.3431 27 17 27H23"
            stroke={`url(#${subGrad})`}
            strokeLinecap="round"
            strokeWidth="3"
          />
          {/* Primary node */}
          <rect
            fill={`url(#${mainGrad})`}
            height="11"
            rx="3.5"
            width="11"
            x="7.5"
            y="7.5"
          />
          {/* Secondary node */}
          <rect
            fill={`url(#${mainGrad})`}
            height="11"
            rx="3.5"
            width="11"
            x="21.5"
            y="21.5"
          />
          {/* Accent trigger dot */}
          <circle cx="27" cy="13" fill={`url(#${subGrad})`} r="3.5" />
        </>
      )}

      {variant === "activity" && (
        <>
          {/* Monitor screen */}
          <rect
            fill={`url(#${mainGrad})`}
            height="22"
            rx="5.5"
            width="26"
            x="7"
            y="9"
          />
          {/* Heartbeat / Uptime wave cutout */}
          <path
            d="M11 20H15L17.5 14.5L21 25L23.5 18L25.5 20H29"
            stroke="#0d121d"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
          {/* Live status beacon */}
          <circle cx="30" cy="11" fill="#0b101b" r="4.5" />
          <circle cx="30" cy="11" fill={`url(#${subGrad})`} r="3.2" />
        </>
      )}

      {variant === "chart" && (
        <>
          {/* Bar 1 */}
          <rect
            fill={`url(#${subGrad})`}
            height="12"
            rx="2.5"
            width="6"
            x="8"
            y="20"
          />
          {/* Bar 2 */}
          <rect
            fill={`url(#${mainGrad})`}
            height="18"
            rx="2.5"
            width="6"
            x="17"
            y="14"
          />
          {/* Bar 3 */}
          <rect
            fill={`url(#${mainGrad})`}
            height="24"
            rx="2.5"
            width="6"
            x="26"
            y="8"
          />
          {/* Trend dot */}
          <circle cx="11" cy="14" fill={`url(#${subGrad})`} r="2.5" />
        </>
      )}

      {variant === "shield" && (
        <>
          {/* Sculpted Shield */}
          <path
            d="M20 6.5L31 11V19.5C31 26.5 26.2 31.8 20 34C13.8 31.8 9 26.5 9 19.5V11L20 6.5Z"
            fill={`url(#${mainGrad})`}
          />
          {/* Inner keyhole / check cutout */}
          <path
            d="M16.5 20.2L19 22.7L24.2 17.5"
            stroke="#0d121d"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.6"
          />
        </>
      )}

      {variant === "lock" && (
        <>
          {/* Shackle */}
          <path
            d="M14.5 17V13.5C14.5 10.4624 16.9624 8 20 8C23.0376 8 25.5 10.4624 25.5 13.5V17"
            stroke={`url(#${subGrad})`}
            strokeLinecap="round"
            strokeWidth="3.2"
          />
          {/* Lock body */}
          <rect
            fill={`url(#${mainGrad})`}
            height="16"
            rx="4.5"
            width="22"
            x="9"
            y="16.5"
          />
          <circle cx="20" cy="23.5" fill="#0d121d" r="2.2" />
          <path
            d="M20 25V28"
            stroke="#0d121d"
            strokeLinecap="round"
            strokeWidth="2.2"
          />
        </>
      )}

      {variant === "api" && (
        <>
          {/* Top server blade */}
          <rect
            fill={`url(#${mainGrad})`}
            height="9"
            rx="3"
            width="25"
            x="7.5"
            y="9"
          />
          <circle cx="12.5" cy="13.5" fill="#0d121d" r="1.6" />
          <circle cx="16.5" cy="13.5" fill="#0d121d" r="1.6" />
          {/* Bottom server blade */}
          <rect
            fill={`url(#${subGrad})`}
            height="9"
            rx="3"
            width="25"
            x="7.5"
            y="22"
          />
          <circle cx="12.5" cy="26.5" fill="#0d121d" r="1.6" />
          <line
            stroke="#0d121d"
            strokeLinecap="round"
            strokeWidth="2"
            x1="22"
            x2="28"
            y1="26.5"
            y2="26.5"
          />
        </>
      )}

      {variant === "clipboard" && (
        <>
          {/* Board */}
          <rect
            fill={`url(#${mainGrad})`}
            height="24"
            rx="4.5"
            width="20"
            x="10"
            y="9"
          />
          {/* Top clip */}
          <rect
            fill="#0b101b"
            height="5.5"
            rx="2"
            width="11"
            x="14.5"
            y="6.5"
          />
          <rect
            fill={`url(#${subGrad})`}
            height="4.5"
            rx="1.8"
            width="9"
            x="15.5"
            y="6.5"
          />
          {/* Check & lines */}
          <path
            d="M15 19.5L17.5 22L24.5 16"
            stroke="#0d121d"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
          <line
            stroke="#0d121d"
            strokeLinecap="round"
            strokeWidth="2.2"
            x1="15"
            x2="25"
            y1="26.5"
            y2="26.5"
          />
        </>
      )}

      {variant === "globe" && (
        <>
          {/* Browser / Web card */}
          <rect
            fill={`url(#${mainGrad})`}
            height="22"
            rx="5"
            width="26"
            x="7"
            y="9"
          />
          {/* Top window bar */}
          <circle cx="11.5" cy="13" fill="#0d121d" r="1.2" />
          <circle cx="15" cy="13" fill="#0d121d" r="1.2" />
          <line
            stroke="#0d121d"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            x1="7"
            x2="33"
            y1="16.5"
            y2="16.5"
          />
          {/* Launch arrow */}
          <path
            d="M16.5 26L23.5 19M23.5 19H18.5M23.5 19V24"
            stroke="#0d121d"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
          />
        </>
      )}

      {variant === "network" && (
        <>
          <path
            d="M20 12L11 26H29L20 12Z"
            stroke={`url(#${subGrad})`}
            strokeLinejoin="round"
            strokeWidth="2.6"
          />
          <circle cx="20" cy="11" fill={`url(#${mainGrad})`} r="4.5" />
          <circle cx="11" cy="26.5" fill={`url(#${mainGrad})`} r="4.5" />
          <circle cx="29" cy="26.5" fill={`url(#${subGrad})`} r="4.5" />
        </>
      )}

      {variant === "briefcase" && (
        <>
          {/* Handle */}
          <path
            d="M15.5 12V9.8C15.5 8.80589 16.3059 8 17.3 8H22.7C23.6941 8 24.5 8.80589 24.5 9.8V12"
            stroke={`url(#${subGrad})`}
            strokeWidth="2.6"
          />
          {/* Case body */}
          <rect
            fill={`url(#${mainGrad})`}
            height="19"
            rx="4.5"
            width="26"
            x="7"
            y="12"
          />
          {/* Clasp & seam */}
          <path
            d="M7 20.5H33"
            stroke="#0d121d"
            strokeOpacity="0.45"
            strokeWidth="1.8"
          />
          <rect
            fill="#0d121d"
            height="4.5"
            rx="1.5"
            width="6"
            x="17"
            y="18.25"
          />
        </>
      )}

      {variant === "award" && (
        <>
          {/* Ribbons */}
          <path
            d="M15.5 23L13 33L20 29.5L27 33L24.5 23"
            fill={`url(#${subGrad})`}
          />
          <circle cx="20" cy="16.5" fill="#0b101b" opacity="0.5" r="10.2" />
          {/* Medallion */}
          <circle cx="20" cy="16" fill={`url(#${mainGrad})`} r="9.5" />
          <path
            d="M16.5 16L19 18.5L24 13.5"
            stroke="#0d121d"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
        </>
      )}

      {variant === "github" && (
        <>
          <path
            clipRule="evenodd"
            d="M20 7.5C13.0964 7.5 7.5 13.0964 7.5 20C7.5 25.525 11.0812 30.2063 16.05 31.8625C16.675 31.975 16.9 31.5938 16.9 31.2625C16.9 30.9625 16.8875 29.975 16.8812 28.925C13.7375 29.6063 12.9188 27.5875 12.6688 26.8813C12.525 26.5188 11.9188 25.4 11.3875 25.1C10.95 24.8625 10.325 24.2813 11.3688 24.2688C12.3562 24.2563 13.0625 25.175 13.3 25.55C14.425 27.4438 16.225 26.9125 16.95 26.5875C17.0625 25.775 17.3875 25.225 17.75 24.9125C14.975 24.6 12.075 23.525 12.075 18.75C12.075 17.3875 12.5625 16.2688 13.3625 15.3938C13.2375 15.0813 12.8 13.8063 13.4875 12.0938C13.4875 12.0938 14.5375 11.7625 16.925 13.375C17.925 13.0938 18.9875 12.9563 20.05 12.9563C21.1125 12.9563 22.175 13.0938 23.175 13.375C25.5625 11.75 26.6125 12.0938 26.6125 12.0938C27.3 13.8063 26.8625 15.0813 26.7375 15.3938C27.5375 16.2688 28.025 17.375 28.025 18.75C28.025 23.5375 25.1125 24.6 22.3375 24.9125C22.7875 25.3 23.175 26.05 23.175 27.2125C23.175 28.875 23.1625 30.85 23.1625 31.2625C23.1625 31.5938 23.3875 31.9875 24.025 31.8625C28.9688 30.2 32.5 25.5125 32.5 20C32.5 13.0964 26.9036 7.5 20 7.5Z"
            fill={`url(#${mainGrad})`}
            fillRule="evenodd"
          />
        </>
      )}

      {variant === "mail" && (
        <>
          {/* Envelope body */}
          <rect
            fill={`url(#${mainGrad})`}
            height="19"
            rx="4.5"
            width="26"
            x="7"
            y="10.5"
          />
          {/* Envelope flap crease */}
          <path
            d="M9.5 13.5L20 21L30.5 13.5"
            stroke="#0d121d"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.3"
          />
        </>
      )}

      {variant === "linkedin" && (
        <>
          <rect
            fill={`url(#${mainGrad})`}
            height="24"
            rx="5.5"
            width="24"
            x="8"
            y="8"
          />
          <circle cx="14.5" cy="14.5" fill="#0d121d" r="1.8" />
          <path
            d="M14.5 18.2V25.5M19 25.5V21.2C19 19.5 20.1 18.4 21.8 18.4C23.4 18.4 24.5 19.5 24.5 21.2V25.5M19 18.2V25.5"
            stroke="#0d121d"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.3"
          />
        </>
      )}

      {variant === "instagram" && (
        <>
          <rect
            fill={`url(#${mainGrad})`}
            height="24"
            rx="6.5"
            width="24"
            x="8"
            y="8"
          />
          <circle
            cx="20"
            cy="20"
            r="5"
            stroke="#0d121d"
            strokeWidth="2.3"
          />
          <circle cx="26" cy="14" fill="#0d121d" r="1.5" />
        </>
      )}
    </svg>
  );
}

/**
 * The signature Lumina organic double-pebble mark (used for navbar/footer brand mark).
 */
export function LuminaMark({
  size = 28,
  className,
  idPrefix = "lumina-mark",
}: {
  size?: number;
  className?: string;
  idPrefix?: string;
}) {
  return (
    <SquircleIcon
      className={className}
      idPrefix={idPrefix}
      size={size}
      variant="brand"
    />
  );
}

/**
 * 3D glossy dark metallic squircle chip housing a contextual 3D icon
 * (or custom node content).
 */
export function SquircleChip({
  size = "md",
  icon = "brand",
  children,
  className,
  idPrefix = "chip",
}: {
  size?: "sm" | "md" | "lg";
  icon?: SquircleIconVariant;
  children?: ReactNode;
  className?: string;
  idPrefix?: string;
}) {
  const dims =
    size === "lg"
      ? "h-[84px] w-[84px] rounded-[22px]"
      : size === "sm"
        ? "h-[54px] w-[54px] rounded-[15px]"
        : "h-[72px] w-[72px] rounded-[19px]";

  const markSize = size === "lg" ? 42 : size === "sm" ? 26 : 35;

  return (
    <div className={cn("lumina-squircle select-none", dims, className)}>
      <div className="lumina-squircle__well">
        {/* Top specular highlight arc */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
        {children ?? (
          <SquircleIcon
            idPrefix={idPrefix}
            size={markSize}
            variant={icon}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Chamfered top-left section badge attached to architectural 1px grid cells:
 * e.g. ▪ WHAT I DO
 */
export function SectionTab({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("lumina-section-tab", className)}>
      <span aria-hidden="true" className="inline-block h-[5px] w-[5px] bg-white" />
      <span>{label}</span>
    </div>
  );
}

export interface CardProps {
  children?: ReactNode;
  rank?: string;
  suit?: Suit;
  back?: boolean;
  ratio?: boolean;
  indexSize?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  contentClassName?: string;
}

const INDEX_SIZE = {
  sm: "text-[11px]",
  md: "text-[13px]",
  lg: "text-[15px]",
} as const;

const INDEX_INSET = {
  sm: "left-3 top-3",
  md: "left-3.5 top-3.5",
  lg: "left-4 top-4",
} as const;

const INDEX_INSET_BR = {
  sm: "right-3 bottom-3",
  md: "right-3.5 bottom-3.5",
  lg: "right-4 bottom-4",
} as const;

export function Card({
  children,
  rank,
  suit = "spade",
  back = false,
  ratio = false,
  indexSize = "md",
  label,
  className,
  contentClassName,
}: CardProps) {
  const inkClass = isRedSuit(suit) ? "card-suit-red" : "card-suit-black";

  return (
    <article
      aria-label={label ?? (rank ? `${rank} ${suit}` : undefined)}
      className={cn(back ? "card-back" : "card-face", ratio && "card-ratio", className)}
    >
      {!back && rank ? (
        <>
          <span
            aria-hidden="true"
            className={cn("card-index", INDEX_INSET[indexSize], INDEX_SIZE[indexSize], inkClass)}
          >
            <span>{rank}</span>
            <span className="text-[0.82em]">{SUIT_GLYPH[suit]}</span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "card-index card-index--br",
              INDEX_INSET_BR[indexSize],
              INDEX_SIZE[indexSize],
              inkClass,
            )}
          >
            <span>{rank}</span>
            <span className="text-[0.82em]">{SUIT_GLYPH[suit]}</span>
          </span>
        </>
      ) : null}

      {children ? (
        <div
          className={cn("relative z-[2] h-full", contentClassName)}
          data-card-content=""
        >
          {children}
        </div>
      ) : null}
    </article>
  );
}

export interface SuitMarkProps {
  suit: Suit;
  className?: string;
  size?: number;
  color?: string;
}

export function SuitMark({ suit, className, size = 18, color }: SuitMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block font-mono leading-none", className)}
      style={{
        fontSize: size,
        color:
          color ??
          (isRedSuit(suit) ? "hsl(var(--deck-red-bright))" : "hsl(var(--deck-ink))"),
      }}
    >
      {SUIT_GLYPH[suit]}
    </span>
  );
}
