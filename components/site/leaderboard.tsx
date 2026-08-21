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
  shareOfPool,
  type Sponsor,
} from "@/lib/bids";

export function Leaderboard({
  sponsors,
  claimed,
  isDemo,
}: {
  sponsors: Sponsor[];
  claimed: number;
  isDemo: boolean;
}) {
  const remaining = POOL_CAP - claimed;
  return (
    <div className="flex flex-col gap-4">
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
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">{s.name}</span>
                    {s.tagline && (
                      <span className="text-xs text-muted-foreground">
                        {s.tagline}
                      </span>
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
      {isDemo && (
        <p className="text-xs text-balance text-muted-foreground">
          * Demo board. It goes live with the first real bid.
        </p>
      )}
    </div>
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
