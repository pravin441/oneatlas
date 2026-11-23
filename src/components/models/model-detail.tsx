import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SampleDataBadge } from "@/components/shared/sample-data-badge";
import { getModelBySlug } from "@/lib/services/models";
import {
  formatContext,
  formatDate,
  formatPrice,
  titleCase,
} from "@/lib/format";

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-base font-semibold">{value}</dd>
    </div>
  );
}

export async function ModelDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  if (!model) notFound();

  return (
    <div>
      <Link
        href="/models"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All models
      </Link>

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">{titleCase(model.type)}</Badge>
          <SampleDataBadge dataSource={model.dataSource} />
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {model.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          by <Link href={`/labs/${model.lab.slug}`} className="hover:text-foreground hover:underline">{model.lab.name}</Link>
          {model.lab.country ? `, ${model.lab.country}` : ""}
        </p>
        {model.description ? (
          <p className="mt-5 max-w-3xl text-muted-foreground">
            {model.description}
          </p>
        ) : null}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        <Spec label="Context window" value={`${formatContext(model.contextWindow)} tokens`} />
        <Spec
          label="Max output"
          value={model.maxOutputTokens ? `${formatContext(model.maxOutputTokens)} tokens` : "N/A"}
        />
        <Spec label="Release date" value={formatDate(model.releaseDate)} />
        <Spec label="Input modalities" value={model.inputModalities.join(", ") || "N/A"} />
        <Spec label="Output modalities" value={model.outputModalities.join(", ") || "N/A"} />
        <Spec label="Providers" value={String(model.offerings.length)} />
      </dl>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Capabilities</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {model.capabilities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No capabilities listed.</p>
          ) : (
            model.capabilities.map((c) => (
              <Badge key={c} variant="outline" className="px-3 py-1 text-sm">
                {c}
              </Badge>
            ))
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Providers and pricing
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Prices are per 1 million tokens (illustrative units for non-chat
          models) and are generated sample data.
        </p>
        {model.offerings.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No providers listed for this model.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium">Input</th>
                  <th className="px-4 py-3 font-medium">Output</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {model.offerings.map((o, i) => (
                  <tr key={o.provider.slug}>
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/providers/${o.provider.slug}`} className="hover:text-primary hover:underline">{o.provider.name}</Link>
                      {i === 0 ? (
                        <Badge variant="primary" className="ml-2">
                          Lowest input
                        </Badge>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatPrice(o.inputPricePerMTok)}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatPrice(o.outputPricePerMTok)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Benchmarks</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Scores are generated for this demo. They are not measured results.
        </p>
        {model.benchmarks.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No benchmark scores for {model.type.toLowerCase()} models.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {model.benchmarks.map((b) => {
              const pct = Math.round(
                Math.min(100, Math.max(0, (b.score / b.maxScore) * 100))
              );
              return (
                <li key={b.slug} className="rounded-lg border bg-card p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.category}</p>
                    </div>
                    <p className="text-lg font-semibold tabular-nums">
                      {b.score.toFixed(1)}
                    </p>
                  </div>
                  <div
                    className="mt-3 h-2 rounded-full bg-muted"
                    role="img"
                    aria-label={`${b.name}: ${b.score.toFixed(1)} out of ${b.maxScore}`}
                  >
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export function ModelDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading model">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-8 h-6 w-28 rounded-full" />
      <Skeleton className="mt-4 h-10 w-72" />
      <Skeleton className="mt-3 h-4 w-48" />
      <Skeleton className="mt-6 h-4 w-full max-w-3xl" />
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="mt-10 h-48 w-full" />
    </div>
  );
}