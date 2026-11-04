import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a normalized API base URL without trailing slash or duplicate protocol (e.g. https://https//).
 */
export function getApiBaseUrl(): string {
  let raw = (process.env.NEXT_PUBLIC_API_URL || "https://api.fph.my.id").trim();
  raw = raw.replace(/^(https?:\/\/?)+/gi, "").replace(/^(https?\/+)+/gi, "");
  const protocol = raw.includes("localhost") ? "http" : "https";
  return `${protocol}://${raw.replace(/\/+$/, "")}`;
}
