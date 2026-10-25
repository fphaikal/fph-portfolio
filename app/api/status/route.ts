import { NextResponse } from "next/server";

import {
  MONITORED_SERVICES,
  type MonitoredService,
  type ServiceStatus,
  type StatusResponse,
} from "@/config/services";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PROBE_TIMEOUT_MS = 4000;

/** Klasifikasi kode HTTP menjadi status sinyal. */
function classify(httpStatus: number): ServiceStatus["status"] {
  if (httpStatus >= 200 && httpStatus <= 399) return "ok";
  if (httpStatus >= 400 && httpStatus <= 499) return "warn";
  return "down";
}

/**
 * Probe satu layanan. Tidak pernah melempar — setiap kegagalan
 * dikembalikan sebagai status "down" tanpa kode HTTP maupun latensi.
 */
async function probe(service: MonitoredService): Promise<ServiceStatus> {
  const startedAt = performance.now();

  try {
    const response = await fetch(service.url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
      redirect: "follow",
    });

    const latencyMs = Math.round(performance.now() - startedAt);

    return {
      id: service.id,
      label: service.label,
      url: service.url,
      status: classify(response.status),
      httpStatus: response.status,
      latencyMs,
    };
  } catch {
    // Timeout / error jaringan / DNS — semuanya dianggap down.
    return {
      id: service.id,
      label: service.label,
      url: service.url,
      status: "down",
      httpStatus: null,
      latencyMs: null,
    };
  }
}

export async function GET() {
  const results = await Promise.allSettled(
    MONITORED_SERVICES.map((service) => probe(service)),
  );

  const services: ServiceStatus[] = results.map((result, index) => {
    if (result.status === "fulfilled") return result.value;

    // Jaring pengaman terakhir: probe sendiri seharusnya tidak pernah reject.
    const service = MONITORED_SERVICES[index];
    return {
      id: service.id,
      label: service.label,
      url: service.url,
      status: "down",
      httpStatus: null,
      latencyMs: null,
    };
  });

  const payload: StatusResponse = {
    checkedAt: new Date().toISOString(),
    services,
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
