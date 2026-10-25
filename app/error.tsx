"use client";

import { useEffect } from "react";

import { Card, SuitMark } from "@/components/deck/card";

/**
 * Batas galat.
 *
 * Sengaja tidak menampilkan pesan teknis ke pengunjung — hanya kode
 * rujukan, supaya tetap terasa seperti bagian dari situs.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  const reference = error.digest?.slice(0, 8) ?? "unknown";

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 py-24">
      <div className="w-full max-w-[520px]">
        <Card
          className="mx-auto w-full"
          contentClassName="flex flex-col items-center px-8 py-14 text-center"
          indexSize="lg"
          rank="!"
          suit="club"
        >
          <p className="deck-eyebrow text-deck-ink/[0.66]">Hand interrupted</p>

          <h1 className="mt-4 text-deck-2xl font-semibold text-deck-ink">
            Something went wrong on this page
          </h1>

          <p className="mt-3 max-w-[40ch] text-deck-sm text-deck-ink/65">
            The page failed to render. Try again — if it keeps happening, the reference below
            helps track it down.
          </p>

          <p className="deck-readout mt-5 text-deck-xs text-deck-ink/[0.64]">REF {reference}</p>

          <div aria-hidden="true" className="mt-6 flex items-center gap-2 opacity-50">
            {(["spade", "heart", "diamond", "club"] as const).map((suit) => (
              <SuitMark key={suit} size={15} suit={suit} />
            ))}
          </div>

          <button className="deck-btn deck-btn--primary mt-8" onClick={reset} type="button">
            Try again
          </button>
        </Card>
      </div>
    </section>
  );
}
