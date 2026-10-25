"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSWR from "swr";

import { SectionTab, SquircleChip } from "@/components/deck/card";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const GITHUB_USER = "https://api.github.com/users/fphaikal";
const GITHUB_REPOS = "https://api.github.com/users/fphaikal/repos?per_page=100&sort=updated";
const STATUS_ENDPOINT = "/api/status";

const SWR_OPTIONS = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  keepPreviousData: true,
};

interface GithubUser {
  public_repos: number;
  followers: number;
}

interface GithubRepo {
  stargazers_count: number;
}

type ServiceState = "ok" | "warn" | "down" | "idle";

interface MonitoredServiceStatus {
  id: string;
  label: string;
  url: string;
  status: ServiceState;
  httpStatus: number | null;
  latencyMs: number | null;
}

interface StatusPayload {
  checkedAt: string;
  services: MonitoredServiceStatus[];
}

class HttpError extends Error {
  status: number;

  constructor(status: number) {
    super(`Request failed with status ${status}`);
    this.name = "HttpError";
    this.status = status;
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new HttpError(response.status);
  return (await response.json()) as T;
}

const githubUserFetcher = (url: string) => fetchJson<GithubUser>(url);
const githubReposFetcher = (url: string) => fetchJson<GithubRepo[]>(url);
const statusFetcher = (url: string) => fetchJson<StatusPayload>(url);

const SERVICE_STATE: Record<
  ServiceState,
  { label: string; dot: string; bar: string; text: string }
> = {
  ok: {
    label: "ONLINE",
    dot: "#38bdf8",
    bar: "#38bdf8",
    text: "text-sky-300",
  },
  warn: {
    label: "DEGRADED",
    dot: "#f59e0b",
    bar: "#f59e0b",
    text: "text-amber-300",
  },
  down: {
    label: "OFFLINE",
    dot: "#ef4444",
    bar: "#ef4444",
    text: "text-red-400",
  },
  idle: {
    label: "CHECKING",
    dot: "#64748b",
    bar: "#64748b",
    text: "text-white/50",
  },
};

const LATENCY_BUDGET_MS = 700;

function errorReason(error: HttpError | undefined): string {
  if (!error) return "Request failed";
  if (error.status === 403 || error.status === 429) return "GitHub rate limit reached";
  if (error.status === 404) return "Not found";
  return `Request failed (${error.status})`;
}

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

function formatClock(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function LiveDashboard() {
  const [mounted, setMounted] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Left telemetry console slides in
      gsap.fromTo(
        "[data-live-copy]",
        { x: -48, opacity: 0.08 },
        {
          x: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 38%",
            scrub: 0.5,
          },
        },
      );

      // 2. HUD Metric Gauges flip up in 3D sequence (REPOS -> FOLLOWERS -> STARS)
      gsap.fromTo(
        "[data-live-metric]",
        {
          rotateX: 42,
          y: 36,
          opacity: 0.06,
          transformPerspective: 800,
          transformOrigin: "bottom center",
        },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          stagger: 0.14,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: "[data-live-metrics]",
            start: "top 86%",
            end: "top 40%",
            scrub: 0.5,
          },
        },
      );

      // 3. Bottom endpoint latency strip sweeps open
      gsap.fromTo(
        "[data-live-endpoints]",
        { y: 40, opacity: 0.08 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-live-endpoints]",
            start: "top 88%",
            end: "top 48%",
            scrub: 0.5,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const {
    data: user,
    error: userError,
    isValidating: userValidating,
    mutate: mutateUser,
  } = useSWR<GithubUser, HttpError>(GITHUB_USER, githubUserFetcher, SWR_OPTIONS);

  const {
    data: repos,
    error: reposError,
    isValidating: reposValidating,
    mutate: mutateRepos,
  } = useSWR<GithubRepo[], HttpError>(GITHUB_REPOS, githubReposFetcher, SWR_OPTIONS);

  const {
    data: status,
    error: statusError,
    isValidating: statusValidating,
    mutate: mutateStatus,
  } = useSWR<StatusPayload, HttpError>(STATUS_ENDPOINT, statusFetcher, SWR_OPTIONS);

  useEffect(() => {
    if (user || repos || status) setUpdatedAt(Date.now());
  }, [user, repos, status]);

  const refresh = useCallback(() => {
    void Promise.all([mutateUser(), mutateRepos(), mutateStatus()]);
  }, [mutateUser, mutateRepos, mutateStatus]);

  const refreshing = userValidating || reposValidating || statusValidating;
  const hasData = Boolean(user || repos || status);
  const totalStars = repos
    ? repos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0)
    : null;

  const liveLabel = refreshing ? "SYNCING" : hasData ? "LIVE TELEMETRY" : "OFFLINE";
  const services = status?.services ?? [];
  const onlineCount = services.filter((service) => service.status === "ok").length;

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#06080f]"
      id="live"
    >
      <div className="mx-auto max-w-[1160px] border-x border-white/10">
        {/* Top Row: Section Tab + Headline + Refresh */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-white/10">
          <div className="flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pr-6">
              <SectionTab label="LIVE TELEMETRY" />
              <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d111c] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/80">
                <span className="relative flex h-2 w-2">
                  {hasData ? (
                    <span className="signal-ping absolute inline-flex h-full w-full rounded-full bg-sky-400" />
                  ) : null}
                  <span
                    className={cn(
                      "relative inline-flex h-2 w-2 rounded-full",
                      hasData ? "bg-sky-400" : "bg-white/40",
                    )}
                  />
                </span>
                {liveLabel}
              </span>
            </div>

            <div
              data-live-copy
              className="px-7 pb-10 pt-10 will-change-transform sm:px-10 sm:pb-12"
            >
              <p className="font-sans text-[24px] font-normal leading-[1.26] tracking-[-0.028em] sm:text-[31px]">
                <span className="font-medium text-white">Real-time system status. </span>
                <span className="text-[#7d8597]">
                  Live GitHub repository metrics and endpoint latency probes from /api/status.
                </span>
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  className="lumina-btn-secondary !py-2.5 !px-4"
                  onClick={refresh}
                  type="button"
                >
                  <span>{refreshing ? "REFRESHING..." : "REFRESH TELEMETRY"}</span>
                  <span aria-hidden="true">↻</span>
                </button>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/45">
                  {mounted && updatedAt ? `UPDATED ${formatClock(updatedAt)}` : "READY"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: GitHub Metrics */}
          <div
            data-live-metrics
            className="lumina-dot-grid flex flex-col justify-between border-t border-white/10 p-7 sm:p-10 lg:border-t-0"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
                ▪ GITHUB · @FPHAIKAL
              </span>
              <SquircleChip icon="github" idPrefix="gh-chip" size="sm" />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div
                data-live-metric
                className="rounded-xl border border-white/10 bg-[#0b0f1a]/90 p-4 backdrop-blur-md will-change-transform"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">
                  REPOS
                </span>
                <span className="mt-2 block font-mono text-2xl font-semibold text-white sm:text-3xl">
                  {user ? formatCount(user.public_repos) : userError ? "—" : "…"}
                </span>
                {userError ? (
                  <span className="mt-1 block font-mono text-[10px] text-amber-300/80">
                    {errorReason(userError)}
                  </span>
                ) : null}
              </div>

              <div
                data-live-metric
                className="rounded-xl border border-white/10 bg-[#0b0f1a]/90 p-4 backdrop-blur-md will-change-transform"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">
                  FOLLOWERS
                </span>
                <span className="mt-2 block font-mono text-2xl font-semibold text-white sm:text-3xl">
                  {user ? formatCount(user.followers) : userError ? "—" : "…"}
                </span>
              </div>

              <div
                data-live-metric
                className="rounded-xl border border-white/10 bg-[#0b0f1a]/90 p-4 backdrop-blur-md will-change-transform"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">
                  STARS
                </span>
                <span className="mt-2 block font-mono text-2xl font-semibold text-sky-300 sm:text-3xl">
                  {totalStars !== null ? formatCount(totalStars) : reposError ? "—" : "…"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Monitored Services Latency Strip */}
        <div
          data-live-endpoints
          className="border-t border-white/10 p-7 will-change-transform sm:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/60">
              ▪ MONITORED ENDPOINTS · /API/STATUS
            </span>
            {services.length > 0 ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-sky-300">
                {onlineCount} / {services.length} NODES ONLINE
              </span>
            ) : null}
          </div>

          {status ? (
            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {status.services.map((service) => {
                const state = SERVICE_STATE[service.status];
                const pct =
                  service.latencyMs === null
                    ? 0
                    : Math.min(service.latencyMs / LATENCY_BUDGET_MS, 1) * 100;

                return (
                  <li
                    key={service.id}
                    className="rounded-xl border border-white/10 bg-[#0a0e18] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: state.dot }}
                        />
                        <span className="font-sans text-base font-medium text-white">
                          {service.label}
                        </span>
                      </span>

                      <span className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-white/55">
                          {service.latencyMs !== null ? `${service.latencyMs} ms` : "—"}
                        </span>
                        <span className={cn("font-semibold", state.text)}>{state.label}</span>
                      </span>
                    </div>

                    <div className="mt-3.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: state.bar }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : statusError ? (
            <p className="mt-5 font-mono text-xs text-white/55">
              Endpoint status unavailable — {errorReason(statusError)}.
            </p>
          ) : (
            <p className="mt-5 font-mono text-xs text-white/55">Probing endpoints…</p>
          )}
        </div>
      </div>
    </section>
  );
}
