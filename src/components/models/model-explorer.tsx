"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ModelCard, ModelGridSkeleton } from "@/components/models/model-card";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FilterOptions, ListResponse } from "@/types/models";

const SORT_OPTIONS = [
  { value: "release", label: "Release date" },
  { value: "price", label: "Price (input)" },
  { value: "context", label: "Context window" },
  { value: "name", label: "Name" },
];

type Option = { value: string; label: string };

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  allLabel?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border bg-card px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        {allLabel ? <option value="">{allLabel}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ModelExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  // Everything the user picked lives in the URL
  const q = searchParams.get("q") ?? "";
  const lab = searchParams.get("lab") ?? "";
  const provider = searchParams.get("provider") ?? "";
  const type = searchParams.get("type") ?? "";
  const capability = searchParams.get("capability") ?? "";
  const sort = searchParams.get("sort") ?? "release";
  const order = searchParams.get("order") ?? "desc";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  const [search, setSearch] = useState(q);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data?: ListResponse;
    error?: string;
  } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Change one or more URL parameters. Changing a filter resets to page 1.
  const updateParams = useCallback(
    (changes: Record<string, string | null>, keepPage = false) => {
      const next = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      if (!keepPage) next.delete("page");
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  // Search box: wait 350ms after the last keystroke before updating the URL
  function onSearchChange(value: string) {
    setSearch(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => updateParams({ q: value.trim() }), 350);
  }

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Load the options for the filter dropdowns once
  useEffect(() => {
    let cancelled = false;
    fetch("/api/filters")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setFilters(json.data as FilterOptions);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Load the models whenever the URL changes
  const key = `${qs}#${reloadKey}`;
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/models?${qs}`, { signal: controller.signal })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? "Request failed");
        setResult({ key, data: json as ListResponse });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResult({
          key,
          error: err instanceof Error ? err.message : "Something went wrong",
        });
      });
    return () => controller.abort();
  }, [qs, key]);

  const loading = result?.key !== key;
  const data = result?.data;
  const hasActiveFilters = Boolean(q || lab || provider || type || capability);

  function clearFilters() {
    if (timer.current) clearTimeout(timer.current);
    setSearch("");
    router.replace(pathname, { scroll: false });
  }

  function goToPage(n: number) {
    updateParams({ page: String(n) }, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  let content;
  if (!result || (loading && !data)) {
    content = <ModelGridSkeleton count={6} />;
  } else if (!loading && result.error) {
    content = (
      <ErrorState
        message={result.error}
        onRetry={() => setReloadKey((k) => k + 1)}
      />
    );
  } else if (data && data.data.length === 0 && !loading) {
    content = (
      <EmptyState
        title="No models match your filters"
        description="Try a different search term or remove some filters."
        actionLabel="Clear filters"
        onAction={clearFilters}
      />
    );
  } else if (data) {
    content = (
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
          loading && "opacity-60 transition-opacity"
        )}
      >
        {data.data.map((m) => (
          <ModelCard key={m.id} model={m} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl border bg-card p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search models, labs or descriptions..."
            aria-label="Search models"
            className="h-11 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <FilterSelect
            label="Lab"
            value={lab}
            allLabel="All labs"
            onChange={(v) => updateParams({ lab: v })}
            options={(filters?.labs ?? []).map((l) => ({ value: l.slug, label: l.name }))}
          />
          <FilterSelect
            label="Provider"
            value={provider}
            allLabel="All providers"
            onChange={(v) => updateParams({ provider: v })}
            options={(filters?.providers ?? []).map((p) => ({ value: p.slug, label: p.name }))}
          />
          <FilterSelect
            label="Type"
            value={type}
            allLabel="All types"
            onChange={(v) => updateParams({ type: v })}
            options={(filters?.types ?? []).map((t) => ({ value: t, label: titleCase(t) }))}
          />
          <FilterSelect
            label="Capability"
            value={capability}
            allLabel="All capabilities"
            onChange={(v) => updateParams({ capability: v })}
            options={(filters?.capabilities ?? []).map((c) => ({ value: c, label: c }))}
          />
          <FilterSelect
            label="Sort by"
            value={sort}
            onChange={(v) => updateParams({ sort: v }, true)}
            options={SORT_OPTIONS}
          />
          <div className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            Order
            <button
              type="button"
              onClick={() =>
                updateParams({ order: order === "asc" ? "desc" : "asc" }, true)
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-card px-3 text-sm text-foreground hover:bg-muted"
            >
              <ArrowUpDown className="h-4 w-4" />
              {order === "asc" ? "Low to high" : "High to low"}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {data ? `${data.meta.total} model${data.meta.total === 1 ? "" : "s"}` : "Loading..."}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {content}

      {data && data.meta.totalPages > 1 ? (
        <nav
          aria-label="Pagination"
          className="mt-8 flex items-center justify-center gap-3"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="inline-flex h-10 items-center gap-1 rounded-md border bg-card px-3 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= data.meta.totalPages}
            onClick={() => goToPage(page + 1)}
            className="inline-flex h-10 items-center gap-1 rounded-md border bg-card px-3 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      ) : null}
    </div>
  );
}