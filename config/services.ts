export interface MonitoredService {
  id: string;
  label: string;
  url: string;
}

/**
 * Daftar layanan yang dipantau langsung oleh panel Control Room.
 * Tambahkan entri baru di sini bila ada service lain yang sudah online.
 * `meytrics` bisa dimasukkan setelah URL publiknya diketahui.
 */
export const MONITORED_SERVICES: MonitoredService[] = [
  { id: "portfolio", label: "fph.my.id", url: "https://www.fph.my.id" },
  { id: "api", label: "fph-api", url: "https://fph-api.vercel.app" },
];

/**
 * Status satu layanan hasil probe `/api/status`.
 *
 * `"idle"` tidak pernah dikembalikan oleh route — ia hanya dipakai di sisi
 * klien untuk menandai layanan yang belum selesai diperiksa.
 */
export interface ServiceStatus {
  id: string;
  label: string;
  url: string;
  status: "ok" | "warn" | "down" | "idle";
  httpStatus: number | null;
  latencyMs: number | null;
}

/** Bentuk respons `/api/status`. */
export interface StatusResponse {
  checkedAt: string; // ISO timestamp
  services: ServiceStatus[];
}
