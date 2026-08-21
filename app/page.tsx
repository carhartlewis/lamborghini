import { ArrowDown, ArrowRight, Flame } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lambo } from "@/components/site/lambo";
import { Leaderboard } from "@/components/site/leaderboard";
import { PoolProgress } from "@/components/site/pool-progress";
import { ShareCalculator } from "@/components/site/share-calculator";
import {
  BID_TIERS,
  MIN_BID,
  POOL_CAP,
  checkoutUrl,
  formatShare,
  formatUsd,
} from "@/lib/bids";
import { getBoard } from "@/lib/board";

export const revalidate = 120;

const FAQ = [
  {
    q: "Is this real?",
    a: "Yes. Real car, real billboard, real payment. That's the joke.",
  },
  {
    q: "What am I buying?",
    a: `A permanent share of the screen: your total over ${formatUsd(POOL_CAP)}. ${formatUsd(50_000)} = a quarter of the car. Plus your spot on this leaderboard, forever.`,
  },
  {
    q: "For how long?",
    a: "The lifetime of the car. One payment, no renewals.",
  },
  {
    q: "Can I be outbid?",
    a: "No one can take your share — they can only buy what's left.",
  },
  {
    q: "Can I grow my share?",
    a: "Yes. Bids stack. Pay again, own more car.",
  },
  {
    q: `What if the ${formatUsd(POOL_CAP)} doesn't fill?`,
    a: "Everyone gets a full refund, 6–8 weeks after the round closes. Zero risk, all upside.",
  },
  {
    q: "Do I get anything besides the car?",
    a: "Social media clout. Provided.",
  },
  {
    q: "What if the car crashes?",
    a: "It's insured, and the driver likes being alive. We'll manage.",
  },
];

export default async function Home() {
  const board = await getBoard();
  const remaining = POOL_CAP - board.claimed;

  return (
    <main className="flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <a href="#" className="display text-lg tracking-tight">
            lamborghini<span className="text-primary">.lol</span>
          </a>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#board" />}>
              The board
            </Button>
            <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#faq" />}>
              FAQ
            </Button>
            <Button
              size="sm"
              nativeButton={false} render={<a href={checkoutUrl(BID_TIERS[0].amount)} />}
            >
              Bid {formatUsd(MIN_BID)}
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 pt-16 pb-14 text-center">
          <Badge variant="outline" className="border-primary/40 text-primary">
            <Flame data-icon="inline-start" />
            {formatUsd(remaining)} of car still for sale
          </Badge>
          <h1 className="display max-w-4xl text-6xl text-balance sm:text-8xl">
            Your logo. On a{" "}
            <span className="text-primary">Lamborghini</span>. Forever.
          </h1>
          <p className="max-w-xl text-lg text-balance text-muted-foreground">
            A digital billboard on a real Lambo. From {formatUsd(MIN_BID)}.
            For the lifetime of the car.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              nativeButton={false} render={<a href={checkoutUrl(BID_TIERS[0].amount)} />}
            >
              Claim your slice
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button variant="outline" size="lg" nativeButton={false} render={<a href="#board" />}>
              Who&apos;s on the car
              <ArrowDown data-icon="inline-end" />
            </Button>
          </div>
          <Lambo className="w-full max-w-3xl" />
          <div className="w-full max-w-2xl">
            <PoolProgress claimed={board.claimed} />
          </div>
        </div>
      </section>

      {/* Leaderboard — the product */}
      <section id="board" className="border-y border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="display text-4xl text-balance sm:text-5xl">
                Who owns the car
              </h2>
              <p className="text-sm text-balance text-muted-foreground">
                This board lives here forever — while the car does its thing
                IRL.
              </p>
            </div>
            <p className="text-sm tabular text-muted-foreground">
              {formatUsd(board.claimed)} claimed · {formatUsd(remaining)} left
            </p>
          </div>
          <Leaderboard sponsors={board.sponsors} claimed={board.claimed} />
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto w-full max-w-3xl px-4 py-16">
        <ShareCalculator />
      </section>

      {/* Tiers */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16">
          <h2 className="display text-4xl text-balance sm:text-5xl">
            Pick a number
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {BID_TIERS.map((tier, i) => {
              const flagship = i === BID_TIERS.length - 1;
              return (
                <Card
                  key={tier.amount}
                  className={
                    flagship ? "border-primary/50 bg-primary/5" : "bg-card/60"
                  }
                >
                  <CardHeader>
                    <CardTitle className="display text-3xl tabular">
                      {formatUsd(tier.amount)}
                    </CardTitle>
                    <CardDescription className="text-balance">
                      {formatShare(tier.amount)} of the screen. Forever.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button
                      variant={flagship ? "default" : "outline"}
                      className="w-full"
                      nativeButton={false} render={<a href={checkoutUrl(tier.amount)} />}
                    >
                      Bid {formatUsd(tier.amount)}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="text-xs text-balance text-muted-foreground">
            Bids stack — pay again any time to grow your share.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-16">
        <div className="flex flex-col gap-8">
          <h2 className="display text-4xl text-balance sm:text-5xl">FAQ</h2>
          <Accordion>
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-balance text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center">
          <h2 className="display max-w-3xl text-5xl text-balance sm:text-7xl">
            {formatUsd(remaining)} of Lamborghini left
          </h2>
          <Button
            size="lg"
            nativeButton={false} render={<a href={checkoutUrl(BID_TIERS[0].amount)} />}
          >
            Start at {formatUsd(MIN_BID)}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>

      <Separator />
      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground">
        <p className="text-balance">
          lamborghini<span className="text-primary">.lol</span> — a tribute to{" "}
          <a
            href="https://outbid.lol"
            className="underline underline-offset-4 hover:text-foreground"
          >
            outbid.lol
          </a>
          , with a car.
        </p>
        <p className="text-balance">
          Payments by Polar. Depreciation by physics.
        </p>
      </footer>
    </main>
  );
}
