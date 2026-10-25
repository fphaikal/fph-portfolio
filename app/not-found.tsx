import Link from "next/link";

import { Card, SuitMark } from "@/components/deck/card";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 py-24">
      <div className="w-full max-w-[520px]">
        <Card
          className="mx-auto w-full"
          contentClassName="flex flex-col items-center px-8 py-14 text-center"
          indexSize="lg"
          rank="?"
          suit="spade"
        >
          <p className="deck-eyebrow text-deck-ink/[0.66]">Card not in this deck</p>

          <p className="mt-4 font-mono text-deck-5xl font-semibold text-deck-ink">404</p>

          <h1 className="mt-3 text-deck-xl font-semibold text-deck-ink">
            This card was never dealt
          </h1>

          <p className="mt-3 max-w-[38ch] text-deck-sm text-deck-ink/65">
            The page you asked for does not exist. It may have been renamed, or the link was
            mistyped.
          </p>

          <div aria-hidden="true" className="mt-6 flex items-center gap-2 opacity-50">
            {(["spade", "heart", "diamond", "club"] as const).map((suit) => (
              <SuitMark key={suit} size={15} suit={suit} />
            ))}
          </div>

          <Link className="deck-btn deck-btn--primary mt-8" href="/">
            Back to the table
          </Link>
        </Card>
      </div>
    </section>
  );
}
