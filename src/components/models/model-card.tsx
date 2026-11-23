import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SampleDataBadge } from "@/components/shared/sample-data-badge";
import {
  formatContext,
  formatDate,
  formatPrice,
  titleCase,
} from "@/lib/format";
import type { ModelListItem } from "@/types/models";

export function ModelCard({ model }: { model: ModelListItem }) {
  return (
    <Link
      href={`/models/${model.slug}`}
      className="group flex flex-col rounded-xl border bg-card p-5 text-card-foreground transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold group-hover:text-primary">
            {model.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{model.lab.name}</p>
        </div>
        <Badge variant="primary">{titleCase(model.type)}</Badge>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {model.description}
      </p>

      <dl
        className="mt-4 grid grid-cols-3 gap-2 text-sm"
        title="Prices are per 1 million tokens, using the lowest provider price."
      >
        <div>
          <dt className="text-xs text-muted-foreground">Context</dt>
          <dd className="font-medium">{formatContext(model.contextWindow)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Input from</dt>
          <dd className="font-medium">{formatPrice(model.minInputPrice)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Output from</dt>
          <dd className="font-medium">{formatPrice(model.minOutputPrice)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {model.capabilities.slice(0, 3).map((c) => (
          <Badge key={c} variant="outline">
            {c}
          </Badge>
        ))}
        {model.capabilities.length > 3 ? (
          <Badge variant="outline">+{model.capabilities.length - 3}</Badge>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-muted-foreground">
        <span>{formatDate(model.releaseDate)}</span>
        <SampleDataBadge dataSource={model.dataSource} />
      </div>
    </Link>
  );
}

export function ModelCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <div className="mt-5 grid grid-cols-3 gap-2">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
      <div className="mt-5 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function ModelGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-label="Loading models"
    >
      {Array.from({ length: count }, (_, i) => (
        <ModelCardSkeleton key={i} />
      ))}
    </div>
  );
}