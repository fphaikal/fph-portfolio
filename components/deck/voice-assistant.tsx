"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SquircleChip } from "@/components/deck/card";
import { cn } from "@/lib/utils";

interface SpeechAlternativeLike {
  transcript: string;
}

interface SpeechResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechAlternativeLike;
}

interface SpeechResultListLike {
  length: number;
  [index: number]: SpeechResultLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechResultListLike;
}

interface SpeechRecognitionErrorLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type VoiceError =
  | "unsupported"
  | "denied"
  | "no-speech"
  | "no-device"
  | "network"
  | "generic";

type IntentId = "greeting" | "identity" | "work" | "skills" | "contact";

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;

  const scope = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };

  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

const ANSWERS: Record<IntentId | "fallback", string> = {
  greeting:
    "Hello. I am the AI assistant for Fahreza Pasha Haikal's portfolio. Ask me about his work, his skills, or how to reach him.",
  identity:
    "Fahreza Pasha Haikal, online as FPHaikal or FPH. He is an IT Support Specialist at PT Astra Graphia, a mechatronics engineering student, and a full-stack developer based in Indonesia.",
  work: "He has been an IT Support Specialist at PT Astra Graphia Tbk since February 2025, in Central Jakarta. There he built the iScore KPI monitoring app, real-time Power BI dashboards, and n8n automations.",
  skills:
    "He works with Next.js, React, Vue, and TypeScript on the front end; Node.js, Prisma, and MongoDB on the back end; plus Docker, n8n, Power BI, and hardware like Arduino, ESP32, and Raspberry Pi.",
  contact:
    "You can reach him at fph dot my dot i d, on GitHub at github dot com slash fphaikal, on Instagram at fp underscore haikal, or by email at abufahreza at gmail dot com.",
  fallback:
    "I am not sure about that one. Try asking about his work, his skills, or how to get in touch.",
};

const INTENT_KEYWORDS: Record<IntentId, string[]> = {
  contact: [
    "contact",
    "email",
    "reach",
    "hire",
    "connect",
    "github",
    "instagram",
    "linkedin",
    "link",
    "social",
  ],
  skills: [
    "skill",
    "skills",
    "tech",
    "stack",
    "technology",
    "tool",
    "tools",
    "language",
    "framework",
    "code",
    "coding",
    "programming",
    "develop",
  ],
  work: [
    "work",
    "job",
    "experience",
    "company",
    "astra",
    "graphia",
    "career",
    "role",
    "position",
    "intern",
    "project",
    "projects",
  ],
  identity: [
    "who",
    "about",
    "yourself",
    "name",
    "fahreza",
    "haikal",
    "fph",
    "identity",
    "background",
    "study",
    "student",
  ],
  greeting: ["hello", "hi", "hai", "hey", "greetings", "morning", "afternoon", "evening"],
};

const INTENT_ORDER: IntentId[] = ["contact", "skills", "work", "identity", "greeting"];

function pickAnswer(query: string): string {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const matched = INTENT_ORDER.find((intent) =>
    INTENT_KEYWORDS[intent].some((keyword) => tokens.includes(keyword)),
  );

  return matched ? ANSWERS[matched] : ANSWERS.fallback;
}

const ERROR_TEXT: Record<VoiceError, string> = {
  unsupported:
    "Voice input needs Chrome or Edge. You can still reach Fahreza through the links on this page.",
  denied:
    "Microphone access was blocked. Allow the microphone in your browser settings, then try again.",
  "no-speech": "I did not catch that. Press Ask again and speak once the glow appears.",
  "no-device": "No microphone was found on this device.",
  network: "The speech service could not be reached. Check your connection and try again.",
  generic: "Something went wrong with the microphone. Please try again.",
};

function mapError(code: string): VoiceError {
  if (code === "not-allowed" || code === "service-not-allowed") return "denied";
  if (code === "no-speech") return "no-speech";
  if (code === "audio-capture") return "no-device";
  if (code === "network") return "network";
  return "generic";
}

function speak(text: string) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.98;
  utterance.pitch = 1;
  synth.speak(utterance);
}

function MicGlyph() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      width="18"
    >
      <rect height="11" rx="3" width="6" x="9" y="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}

export function VoiceAssistant() {
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<VoiceError | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mountedRef = useRef(true);
  const sessionRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    setMounted(true);
    setSupported(getRecognitionCtor() !== null);

    return () => {
      mountedRef.current = false;
      const recognition = recognitionRef.current;

      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.onstart = null;
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
        recognitionRef.current = null;
      }

      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    sessionRef.current += 1;
    const recognition = recognitionRef.current;

    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
    }

    recognitionRef.current = null;
    setListening(false);
    setInterimText("");
  }, []);

  const startListening = useCallback(async () => {
    const Ctor = getRecognitionCtor();

    if (!Ctor) {
      setSupported(false);
      setError("unsupported");
      return;
    }

    stopListening();
    const session = sessionRef.current;

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setError(null);
    setAnswer("");
    setFinalText("");
    setInterimText("");

    const media = navigator.mediaDevices;
    if (media?.getUserMedia) {
      try {
        const stream = await media.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        if (!mountedRef.current || sessionRef.current !== session) return;
        setError("denied");
        return;
      }
    }

    if (!mountedRef.current || sessionRef.current !== session) return;

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (mountedRef.current) setListening(true);
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result) continue;
        const chunk = result[0]?.transcript ?? "";
        if (result.isFinal) {
          final += chunk;
        } else {
          interim += chunk;
        }
      }

      if (!mountedRef.current) return;
      if (interim) setInterimText(interim);

      const cleaned = final.trim();
      if (cleaned) {
        setFinalText(cleaned);
        setInterimText("");
        const response = pickAnswer(cleaned);
        setAnswer(response);
        speak(response);
      }
    };

    recognition.onerror = (event) => {
      if (!mountedRef.current) return;
      setListening(false);
      setError(mapError(event.error));
    };

    recognition.onend = () => {
      if (mountedRef.current) setListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setListening(true);
    } catch {
      setError("generic");
      setListening(false);
    }
  }, [stopListening]);

  const handleOpen = useCallback(() => {
    if (!supported) return;
    setOpen(true);
    void startListening();
  }, [supported, startListening]);

  const close = useCallback(() => {
    stopListening();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setOpen(false);
    setFinalText("");
    setInterimText("");
    setAnswer("");
    setError(null);
  }, [stopListening]);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      setRevealed(window.scrollY > window.innerHeight * 0.55);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  if (!mounted) return null;

  const displayedTranscript = finalText || interimText;

  const statusLabel = !supported
    ? "UNSUPPORTED"
    : error === "denied"
      ? "MIC BLOCKED"
      : error
        ? "ERROR"
        : listening
          ? "LISTENING"
          : answer
            ? "ANSWERED"
            : "IDLE";

  const visible = open || revealed;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-6 right-6 z-[60] transition-all duration-500 ease-deck",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
      inert={!visible}
    >
      <div className="relative flex flex-col items-end gap-3">
        {open && supported ? (
          <div className="w-[min(360px,calc(100vw-3rem))] rounded-2xl border border-white/15 bg-[#0a0e19]/95 p-6 shadow-2xl backdrop-blur-2xl">
            <header className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">
                  ▪ VOICE AGENT
                </p>
                <h2 className="mt-1 font-sans text-lg font-medium text-white">Ask FPHaikal AI</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    listening ? "bg-sky-400 animate-pulse" : error ? "bg-amber-400" : "bg-emerald-400",
                  )}
                />
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-white/80">
                  {statusLabel}
                </span>
              </span>
            </header>

            <div className="my-4 h-[1px] bg-white/10" />

            <div aria-live="polite" className="flex flex-col gap-3">
              {error ? <p className="text-sm text-white/80">{ERROR_TEXT[error]}</p> : null}

              {displayedTranscript ? (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
                    YOU SAID
                  </p>
                  <p className="mt-1 text-sm text-white">{displayedTranscript}</p>
                </div>
              ) : !error && !answer ? (
                <p className="text-sm text-[#8d96aa]">
                  {listening
                    ? "Listening... Ask about his work, skills, or contact."
                    : "Press Ask again to speak."}
                </p>
              ) : null}

              {answer ? (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-sky-300">
                    RESPONSE
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/90">{answer}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {listening ? (
                <button
                  className="lumina-btn-primary !py-2 !px-3.5"
                  onClick={stopListening}
                  type="button"
                >
                  STOP
                </button>
              ) : (
                <button
                  className="lumina-btn-primary !py-2 !px-3.5"
                  onClick={() => void startListening()}
                  type="button"
                >
                  ASK AGAIN
                </button>
              )}
              <button
                className="lumina-btn-secondary !py-2 !px-3.5"
                onClick={close}
                type="button"
              >
                CLOSE
              </button>
            </div>
          </div>
        ) : (
          <button
            aria-expanded={open}
            aria-label="Open voice assistant"
            className={cn(
              "group relative rounded-[18px] transition-transform duration-300",
              supported ? "hover:-translate-y-1" : "opacity-50",
            )}
            disabled={!supported}
            onClick={handleOpen}
            type="button"
          >
            <SquircleChip idPrefix="voice-chip" size="sm">
              <span className="text-white/90 transition-colors group-hover:text-sky-300">
                <MicGlyph />
              </span>
            </SquircleChip>
          </button>
        )}
      </div>
    </div>
  );
}
