import { prisma } from "@/lib/db";

// With no benchmark chosen, the score is the average across all benchmarks.
export async function getRankings(benchmarkSlug?: string, limit = 20) {
  const benchmarks = await prisma.benchmark.findMany({
    select: { id: true, slug: true, name: true, category: true },
    orderBy: { name: "asc" },
  });
  const active = benchmarkSlug
    ? (benchmarks.find((b) => b.slug === benchmarkSlug) ?? null)
    : null;

  const scores = await prisma.benchmarkScore.findMany({
    where: active ? { benchmarkId: active.id } : undefined,
    select: {
      score: true,
      benchmark: { select: { maxScore: true } },
      model: {
        select: {
          id: true,
          slug: true,
          name: true,
          contextWindow: true,
          lab: { select: { slug: true, name: true } },
        },
      },
    },
  });

  const byModel = new Map<
    string,
    { model: (typeof scores)[number]["model"]; sum: number; count: number }
  >();
  for (const s of scores) {
    const pct = (s.score / s.benchmark.maxScore) * 100;
    const entry = byModel.get(s.model.id);
    if (entry) {
      entry.sum += pct;
      entry.count += 1;
    } else {
      byModel.set(s.model.id, { model: s.model, sum: pct, count: 1 });
    }
  }

  const ranked = Array.from(byModel.values())
    .map((e) => ({
      model: e.model,
      score: Math.round((e.sum / e.count) * 10) / 10,
    }))
    .sort((a, b) => b.score - a.score || a.model.name.localeCompare(b.model.name));

  return {
    benchmarks: benchmarks.map(({ slug, name, category }) => ({ slug, name, category })),
    active: active
      ? { slug: active.slug, name: active.name, category: active.category }
      : null,
    total: ranked.length,
    entries: ranked.slice(0, limit).map((r, i) => ({
      rank: i + 1,
      score: r.score,
      model: {
        slug: r.model.slug,
        name: r.model.name,
        contextWindow: r.model.contextWindow,
      },
      lab: r.model.lab,
    })),
  };
}