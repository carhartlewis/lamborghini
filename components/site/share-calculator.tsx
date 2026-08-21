"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  BID_TIERS,
  DRIVE_HOURS_PER_DAY,
  MIN_BID,
  POOL_CAP,
  checkoutUrl,
  formatShare,
  formatUsd,
  minutesPerHour,
} from "@/lib/bids";

export function ShareCalculator() {
  const [amount, setAmount] = useState(25_000);

  const minutes = minutesPerHour(amount);
  const dailyMinutes = minutes * DRIVE_HOURS_PER_DAY;
  // Closest purchasable tier — checkout runs on fixed Polar products for now.
  const tier = BID_TIERS.reduce((best, t) =>
    Math.abs(t.amount - amount) < Math.abs(best.amount - amount) ? t : best,
  );

  return (
    <Card className="border-primary/20 bg-card/60">
      <CardHeader>
        <CardTitle className="display text-2xl text-balance">
          What does your money buy?
        </CardTitle>
        <CardDescription className="text-balance">
          Your bid over {formatUsd(POOL_CAP)} = your share of the screen.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="display text-5xl text-primary sm:text-6xl">
            <span className="tabular">{formatUsd(amount)}</span>
          </p>
          <Slider
            value={amount}
            min={MIN_BID}
            max={POOL_CAP}
            step={MIN_BID}
            aria-label="Bid amount in dollars"
            onValueChange={(value) =>
              setAmount(Array.isArray(value) ? value[0] : value)
            }
          />
          <div className="flex justify-between text-xs text-muted-foreground tabular">
            <span>{formatUsd(MIN_BID)} min</span>
            <span>{formatUsd(POOL_CAP)} — the whole car</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat
            value={formatShare(amount)}
            label="of the billboard, forever"
          />
          <Stat
            value={`${Math.round(minutes * 10) / 10} min`}
            label="every hour on the road"
          />
          <Stat
            value={`~${Math.round(dailyMinutes)} min`}
            label={`per day (~${DRIVE_HOURS_PER_DAY}h of driving)`}
          />
        </div>

        <Button size="lg" nativeButton={false} render={<a href={checkoutUrl(tier.productId)} />}>
          Bid {formatUsd(tier.amount)} — {tier.label}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-background/50 p-4">
      <p className="display text-3xl text-foreground tabular">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
