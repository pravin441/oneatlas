import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { ModelQuery } from "@/lib/validators/models";

export type ModelListItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  type: string;
  releaseDate: string | null;
  contextWindow: number;
  maxOutputTokens: number | null;
  capabilities: string[];
  inputModalities: string[];
  outputModalities: string[];
  dataSource: string;
  lab: { slug: string; name: string };
  providerCount: number;
  minInputPrice: number | null;
  minOutputPrice: number | null;
};

function sortValue(item: ModelListItem, sort: ModelQuery["sort"]): number | null {
  if (sort === "release") return item.releaseDate ? new Date(item.releaseDate).getTime() : null;
  if (sort === "price") return item.minInputPrice;
  if (sort === "context") return item.contextWindow;
  return null;
}

export async function listModels(query: ModelQuery) {
  const { q, lab, provider, type, capability, sort, order, page, limit } = query;

  // 1. Build the database filter from whatever the user chose
  const where: Prisma.ModelWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
            { lab: { name: { contains: q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
    ...(lab ? { lab: { slug: lab } } : {}),
    ...(provider ? { offerings: { some: { provider: { slug: provider } } } } : {}),
    ...(type ? { type } : {}),
    ...(capability ? { capabilities: { has: capability } } : {}),
  };

  // 2. Fetch matching models with their lab and prices
  const rows = await prisma.model.findMany({
    where,
    include: {
      lab: { select: { slug: true, name: true } },
      offerings: { select: { inputPricePerMTok: true, outputPricePerMTok: true } },
    },
  });

  // 3. Turn database rows into clean JSON (Decimal -> number, Date -> text)
  const items: ModelListItem[] = rows.map((r) => {
    const inputs = r.offerings.map((o) => o.inputPricePerMTok.toNumber());
    const outputs = r.offerings.map((o) => o.outputPricePerMTok.toNumber());
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
      type: r.type,
      releaseDate: r.releaseDate ? r.releaseDate.toISOString() : null,
      contextWindow: r.contextWindow,
      maxOutputTokens: r.maxOutputTokens,
      capabilities: r.capabilities,
      inputModalities: r.inputModalities,
      outputModalities: r.outputModalities,
      dataSource: r.dataSource,
      lab: r.lab,
      providerCount: r.offerings.length,
      minInputPrice: inputs.length ? Math.min(...inputs) : null,
      minOutputPrice: outputs.length ? Math.min(...outputs) : null,
    };
  });

  // 4. Sort. Models with no value (for example no price) always go last.
  const dir = order === "asc" ? 1 : -1;
  items.sort((a, b) => {
    let result = 0;
    if (sort === "name") {
      result = a.name.localeCompare(b.name);
    } else {
      const av = sortValue(a, sort);
      const bv = sortValue(b, sort);
      if (av === null && bv === null) result = 0;
      else if (av === null) return 1;
      else if (bv === null) return -1;
      else result = av - bv;
    }
    return result * dir || a.name.localeCompare(b.name);
  });

  // 5. Paginate
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const data = items.slice((page - 1) * limit, page * limit);

  return { data, meta: { total, page, limit, totalPages } };
}

export async function getModelBySlug(slug: string) {
  const m = await prisma.model.findUnique({
    where: { slug },
    include: {
      lab: true,
      offerings: { include: { provider: true } },
      scores: { include: { benchmark: true } },
    },
  });
  if (!m) return null;

  return {
    id: m.id,
    slug: m.slug,
    name: m.name,
    description: m.description,
    type: m.type,
    releaseDate: m.releaseDate ? m.releaseDate.toISOString() : null,
    contextWindow: m.contextWindow,
    maxOutputTokens: m.maxOutputTokens,
    inputModalities: m.inputModalities,
    outputModalities: m.outputModalities,
    capabilities: m.capabilities,
    dataSource: m.dataSource,
    lab: { slug: m.lab.slug, name: m.lab.name, country: m.lab.country },
    offerings: m.offerings
      .map((o) => ({
        provider: { slug: o.provider.slug, name: o.provider.name },
        inputPricePerMTok: o.inputPricePerMTok.toNumber(),
        outputPricePerMTok: o.outputPricePerMTok.toNumber(),
        dataSource: o.dataSource,
      }))
      .sort((a, b) => a.inputPricePerMTok - b.inputPricePerMTok),
    benchmarks: m.scores
      .map((s) => ({
        slug: s.benchmark.slug,
        name: s.benchmark.name,
        category: s.benchmark.category,
        score: s.score,
        maxScore: s.benchmark.maxScore,
        dataSource: s.dataSource,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export async function getFilterOptions() {
  const [labs, providers, types, capRows] = await Promise.all([
    prisma.lab.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } }),
    prisma.provider.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } }),
    prisma.model.findMany({ distinct: ["type"], select: { type: true } }),
    prisma.model.findMany({ select: { capabilities: true } }),
  ]);

  const capabilities = Array.from(new Set(capRows.flatMap((r) => r.capabilities))).sort();

  return {
    labs,
    providers,
    types: types.map((t) => t.type).sort(),
    capabilities,
  };
}