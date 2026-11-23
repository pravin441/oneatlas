import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getRankings } from "@/lib/services/rankings";
import { formatContext } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rankings",
  description: "Model leaderboards by benchmark.",
};

type SearchParams = Promise<{ benchmark?: string | string[] }>;

async function Leaderboard({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const benchmark = typeof sp.benchmark === "string" ? sp.benchmark : undefined;
  const { benchmarks, active, entries, total } = await getRankings(benchmark);

  const tabs = [
    { href: "/rankings", label: "Overall", current: !active },
    ...benchmarks.map((b) => ({
      href: `/rankings?benchmark=${b.slug}`,
      label: b.name,
      current: active?.slug === b.slug,
    })),
  ];

  return (
    <div>
      <nav
        aria-label="Benchmarks"
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            aria-current={t.current ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              t.current
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {active ? `${active.name} leaderboard` : "Overall leaderboard"}
        </h2>
        {active ? <Badge variant="primary">{active.category}</Badge> : null}
        <Badge variant="warning">Sample data</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {active
          ? "Scores are generated for this demo and are not measured results."
          : "Overall is the average of all benchmark scores. Scores are generated for this demo and are not measured results."}{" "}
        Showing the top {entries.length} of {total} chat models.
      </p>

      {entries.length === 0 ? (
        <p className="mt-6 text-muted-foreground">No scores available.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Lab</th>
                <th className="px-4 py-3 font-medium">Context</th>
                <th className="px-4 py-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((e) => (
                <tr key={e.model.slug}>
                  <td className="px-4 py-3 font-semibold tabular-nums">
                    {e.rank}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/models/${e.model.slug}`}
                      className="hover:text-primary hover:underline"
                    >
                      {e.model.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <Link
                      href={`/labs/${e.lab.slug}`}
                      className="hover:text-foreground hover:underline"
                    >
                      {e.lab.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatContext(e.model.contextWindow)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-12 font-semibold tabular-nums">
                        {e.score.toFixed(1)}
                      </span>
                      <div
                        className="hidden h-2 w-32 rounded-full bg-muted sm:block"
                        role="img"
                        aria-label={`Score ${e.score.toFixed(1)} out of 100`}
                      >
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.min(100, e.score)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading rankings">
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>
      <Skeleton className="mt-6 h-6 w-64" />
      <Skeleton className="mt-4 h-96 w-full" />
    </div>
  );
}

export default function RankingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Rankings
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Leaderboards by benchmark category. Pick a benchmark to see how models
        compare.
      </p>
      <div className="mt-8">
        <Suspense fallback={<LeaderboardSkeleton />}>
          <Leaderboard searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
}