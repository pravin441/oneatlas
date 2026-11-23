import { ModelCard } from "@/components/models/model-card";
import { Skeleton } from "@/components/ui/skeleton";
import { listModels } from "@/lib/services/models";
import { getSiteStats } from "@/lib/services/stats";

export async function HomeStats() {
  const s = await getSiteStats();
  const items = [
    { label: "Models", value: s.models },
    { label: "AI labs", value: s.labs },
    { label: "Providers", value: s.providers },
    { label: "Benchmarks", value: s.benchmarks },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="rounded-xl border bg-card p-5">
          <dt className="text-sm text-muted-foreground">{i.label}</dt>
          <dd className="mt-1 text-3xl font-semibold tabular-nums">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HomeStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  );
}

export async function LatestModels() {
  const { data } = await listModels({
    type: "CHAT",
    sort: "release",
    order: "desc",
    page: 1,
    limit: 6,
  });
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((m) => (
        <ModelCard key={m.id} model={m} />
      ))}
    </div>
  );
}