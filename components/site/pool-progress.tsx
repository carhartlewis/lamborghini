"use client";

import { useEffect, useState } from "react";

import { POOL_CAP, formatUsd } from "@/lib/bids";

export function PoolProgress({ claimed }: { claimed: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(claimed);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(claimed * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [claimed]);

  const pct = (claimed / POOL_CAP) * 100;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <p className="display text-4xl text-primary sm:text-5xl">
          <span className="tabular">{formatUsd(displayed)}</span>
        </p>
        <p className="kicker text-xs text-muted-foreground">
          of {formatUsd(POOL_CAP)} claimed
        </p>
      </div>
      {/* Plain markup, like the leaderboard's share bars: the shimmer gradient
          and custom height fought Base UI's internal Progress structure. */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={POOL_CAP}
        aria-valuenow={claimed}
        aria-label={`${formatUsd(claimed)} of ${formatUsd(POOL_CAP)} claimed`}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),oklch(0.94_0.14_95),var(--primary))] bg-[length:200%_100%] [animation:shimmer_3s_linear_infinite]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-balance text-muted-foreground">
        Hits {formatUsd(POOL_CAP)} — the board closes forever. Doesn&apos;t
        fill — everyone&apos;s refunded in full.
      </p>
    </div>
  );
}
