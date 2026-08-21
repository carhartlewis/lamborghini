import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  POOL_CAP,
  formatShare,
  formatUsd,
  logoUrl,
  shareOfPool,
  type Sponsor,
} from "@/lib/bids";

export function Leaderboard({
  sponsors,
  claimed,
}: {
  sponsors: Sponsor[];
  claimed: number;
}) {
  const remaining = POOL_CAP - claimed;
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card/60">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">#</TableHead>
            <TableHead>Sponsor</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="w-[30%]">Share of the car</TableHead>
            <TableHead className="text-right">Claimed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sponsors.map((s) => (
            <TableRow key={s.rank}>
              <TableCell className="display text-xl text-muted-foreground">
                {s.rank}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <SponsorLogo name={s.name} domain={s.domain} />
                  {s.domain ? (
                    <a
                      href={`https://${s.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline-offset-4 hover:underline"
                    >
                      {s.name}
                    </a>
                  ) : (
                    <span className="font-semibold">{s.name}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold tabular text-primary">
                {formatUsd(s.amount)}
              </TableCell>
              <TableCell>
                <ShareBar amount={s.amount} />
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {s.claimedAgo}
              </TableCell>
            </TableRow>
          ))}
          {remaining > 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell className="display text-xl text-muted-foreground">
                —
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-muted-foreground">
                    Your logo here
                  </span>
                  <Badge variant="outline">open</Badge>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold tabular text-muted-foreground">
                {formatUsd(remaining)} left
              </TableCell>
              <TableCell>
                <ShareBar amount={remaining} dim />
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                now?
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Plain <img> so the favicon is in the server-rendered HTML — no client-side
// swap-in, and no next/image remotePatterns config for a 64px icon.
function SponsorLogo({
  name,
  domain,
}: {
  name: string;
  domain: string | null;
}) {
  if (!domain) {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-[0.65rem] font-semibold text-muted-foreground">
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={logoUrl(domain)}
      alt=""
      width={32}
      height={32}
      loading="lazy"
      className="size-8 shrink-0 rounded-md border border-border bg-background p-1"
    />
  );
}

function ShareBar({ amount, dim }: { amount: number; dim?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${dim ? "bg-foreground/20" : "bg-primary"}`}
          style={{ width: `${Math.min(shareOfPool(amount) * 100, 100)}%` }}
        />
      </div>
      <span className="w-14 text-right text-xs tabular text-muted-foreground">
        {formatShare(amount)}
      </span>
    </div>
  );
}
