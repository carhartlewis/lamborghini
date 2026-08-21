"use client";

import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";
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
      <Progress
        value={pct}
        aria-label={`${formatUsd(claimed)} of ${formatUsd(POOL_CAP)} claimed`}
        className="[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-[linear-gradient(90deg,var(--primary),oklch(0.94_0.14_95),var(--primary))] [&_[data-slot=progress-indicator]]:bg-[length:200%_100%] [&_[data-slot=progress-indicator]]:[animation:shimmer_3s_linear_infinite]"
      />
      <p className="text-sm text-balance text-muted-foreground">
        Hits {formatUsd(POOL_CAP)} — the board closes forever. Doesn&apos;t
        fill — everyone&apos;s refunded in full.
      </p>
    </div>
  );
}
