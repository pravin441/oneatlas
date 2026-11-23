import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// ---------------------------------------------------------------
// Connection (the seed uses the direct Neon connection)
// ---------------------------------------------------------------
const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DIRECT_URL (or DATABASE_URL) in .env");
}
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

// ---------------------------------------------------------------
// Helpers. The random generator uses a fixed seed, so running the
// script twice produces exactly the same data.
// ---------------------------------------------------------------
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261123);
const between = (min: number, max: number) => min + rand() * (max - min);
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const addDays = (d: Date, days: number) =>
  new Date(d.getTime() + days * 86_400_000);

function pickSome<T>(list: readonly T[], n: number): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// ---------------------------------------------------------------
// SAMPLE DATA DEFINITIONS (all fictional)
// ---------------------------------------------------------------
const LABS = [
  { name: "Northwind AI", country: "United States", foundedYear: 2018, focus: "general-purpose assistants", family: "Nova", gen: 3, bias: 4, ctx: 1, released: "2026-02-10" },
  { name: "Aurora Labs", country: "United Kingdom", foundedYear: 2019, focus: "reasoning and research tools", family: "Lyra", gen: 2, bias: 2, ctx: 1, released: "2026-01-20" },
  { name: "Kestrel Research", country: "Canada", foundedYear: 2020, focus: "fast, efficient models", family: "Swift", gen: 4, bias: 0, ctx: 0.5, released: "2025-11-15" },
  { name: "Lumen Intelligence", country: "France", foundedYear: 2021, focus: "multilingual models", family: "Prism", gen: 2, bias: 1, ctx: 0.25, released: "2026-03-25" },
  { name: "Helix Systems", country: "Germany", foundedYear: 2017, focus: "enterprise automation", family: "Helix", gen: 5, bias: -1, ctx: 0.5, released: "2025-09-05" },
  { name: "Orbit Minds", country: "India", foundedYear: 2022, focus: "low-cost multilingual assistants", family: "Orbit", gen: 2, bias: -2, ctx: 0.25, released: "2026-04-18" },
  { name: "Sakura AI", country: "Japan", foundedYear: 2019, focus: "coding and language models", family: "Kaze", gen: 3, bias: 1, ctx: 1, released: "2026-02-28" },
  { name: "Cobalt Labs", country: "United States", foundedYear: 2020, focus: "long-context models", family: "Cobalt", gen: 2, bias: 3, ctx: 2, released: "2026-05-12" },
  { name: "Meridian AI", country: "Singapore", foundedYear: 2021, focus: "agents and tool use", family: "Zenith", gen: 3, bias: -3, ctx: 0.5, released: "2025-12-08" },
  { name: "Tundra Research", country: "Sweden", foundedYear: 2023, focus: "open, lightweight models", family: "Frost", gen: 1, bias: -4, ctx: 0.25, released: "2026-06-02" },
] as const;

const PROVIDERS = [
  { name: "CloudLane", focus: "managed inference API" },
  { name: "EdgeInference", focus: "low-latency edge hosting" },
  { name: "Skyport", focus: "multi-model gateway" },
  { name: "Rivet Compute", focus: "GPU cloud hosting" },
  { name: "Basalt Cloud", focus: "enterprise hosting" },
  { name: "FlowGate", focus: "routing and fallback gateway" },
  { name: "Quanta Host", focus: "budget inference hosting" },
  { name: "Harbor AI", focus: "developer-focused API" },
] as const;

const TIERS = [
  { label: "Ultra", quality: 88, context: 1_000_000, maxOut: 64_000, input: 12, output: 48, offsetDays: 0,
    caps: ["reasoning", "tool-calling", "vision", "json-mode", "long-context", "code"], inMod: ["text", "image", "audio"] },
  { label: "Pro", quality: 80, context: 400_000, maxOut: 32_000, input: 3, output: 12, offsetDays: 21,
    caps: ["tool-calling", "vision", "json-mode", "code"], inMod: ["text", "image"] },
  { label: "Flash", quality: 70, context: 200_000, maxOut: 16_000, input: 0.5, output: 2, offsetDays: 45,
    caps: ["tool-calling", "json-mode", "code"], inMod: ["text", "image"] },
  { label: "Mini", quality: 60, context: 128_000, maxOut: 8_000, input: 0.1, output: 0.4, offsetDays: 70,
    caps: ["json-mode", "code"], inMod: ["text"] },
] as const;

const BENCHMARKS = [
  { slug: "general-knowledge", name: "General Knowledge", category: "General", offset: 0 },
  { slug: "reasoning", name: "Reasoning", category: "Reasoning", offset: -6 },
  { slug: "coding", name: "Coding", category: "Coding", offset: -2 },
  { slug: "math", name: "Math", category: "Math", offset: -8 },
  { slug: "instruction-following", name: "Instruction Following", category: "Instruction", offset: 2 },
  { slug: "long-context", name: "Long Context", category: "Long context", offset: 0 },
  { slug: "multilingual", name: "Multilingual", category: "Language", offset: -3 },
  { slug: "tool-use", name: "Tool Use", category: "Agents", offset: -1 },
] as const;

// ---------------------------------------------------------------
// Build the list of models in memory
// ---------------------------------------------------------------
type ModelSeed = {
  slug: string;
  name: string;
  labSlug: string;
  description: string;
  type: "CHAT" | "EMBEDDING" | "IMAGE";
  releaseDate: Date;
  contextWindow: number;
  maxOutputTokens: number | null;
  inputModalities: string[];
  outputModalities: string[];
  capabilities: string[];
  price: { input: number; output: number };
  quality: number | null; // only chat models get benchmark scores
  bias: number;
};

const modelSeeds: ModelSeed[] = [];

LABS.forEach((lab, i) => {
  const labSlug = slugify(lab.name);
  const base = new Date(lab.released);

  // Four chat models per lab (one per tier)
  for (const t of TIERS) {
    const name = `${lab.family} ${lab.gen} ${t.label}`;
    const priceMult = between(0.8, 1.25);
    modelSeeds.push({
      slug: slugify(name),
      name,
      labSlug,
      description: `${name} is a fictional ${t.label.toLowerCase()}-tier chat model from ${lab.name}, created as sample data.`,
      type: "CHAT",
      releaseDate: addDays(base, t.offsetDays),
      contextWindow: Math.round((t.context * lab.ctx) / 1000) * 1000,
      maxOutputTokens: t.maxOut,
      inputModalities: [...t.inMod],
      outputModalities: ["text"],
      capabilities: [...t.caps],
      price: { input: t.input * priceMult, output: t.output * priceMult },
      quality: t.quality,
      bias: lab.bias,
    });
  }

  // An embedding model for the first five labs
  if (i < 5) {
    const name = `${lab.family} Embed ${lab.gen}`;
    modelSeeds.push({
      slug: slugify(name),
      name,
      labSlug,
      description: `${name} is a fictional text embedding model from ${lab.name}, created as sample data.`,
      type: "EMBEDDING",
      releaseDate: addDays(base, -30),
      contextWindow: 8000,
      maxOutputTokens: null,
      inputModalities: ["text"],
      outputModalities: ["embedding"],
      capabilities: ["embeddings"],
      price: { input: between(0.02, 0.13), output: 0 },
      quality: null,
      bias: lab.bias,
    });
  }

  // An image model for three labs (price units are illustrative)
  if (i === 0 || i === 2 || i === 7) {
    const name = `${lab.family} Canvas ${lab.gen}`;
    modelSeeds.push({
      slug: slugify(name),
      name,
      labSlug,
      description: `${name} is a fictional image generation model from ${lab.name}, created as sample data.`,
      type: "IMAGE",
      releaseDate: addDays(base, 10),
      contextWindow: 4000,
      maxOutputTokens: null,
      inputModalities: ["text"],
      outputModalities: ["image"],
      capabilities: ["image-generation"],
      price: { input: between(1, 4), output: between(4, 12) },
      quality: null,
      bias: lab.bias,
    });
  }
});

function scoreFor(m: ModelSeed, bm: (typeof BENCHMARKS)[number]): number {
  let value = (m.quality ?? 0) + m.bias + bm.offset + between(-4, 4);
  if (bm.slug === "long-context") {
    value = 40 + 8 * Math.log2(m.contextWindow / 32_000) + m.bias + between(-4, 4);
  }
  if (bm.slug === "tool-use" && !m.capabilities.includes("tool-calling")) {
    value -= 15;
  }
  return Math.round(clamp(value, 20, 99.5) * 10) / 10;
}

// ---------------------------------------------------------------
// Write everything to the database
// ---------------------------------------------------------------
async function main() {
  console.log("Clearing old data...");
  await prisma.benchmarkScore.deleteMany();
  await prisma.modelProvider.deleteMany();
  await prisma.model.deleteMany();
  await prisma.benchmark.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.lab.deleteMany();

  console.log("Creating labs, providers and benchmarks...");
  await prisma.lab.createMany({
    data: LABS.map((l) => ({
      slug: slugify(l.name),
      name: l.name,
      description: `${l.name} is a fictional AI lab used for sample data. Focus: ${l.focus}.`,
      country: l.country,
      foundedYear: l.foundedYear,
      dataSource: "SAMPLE" as const,
    })),
  });
  await prisma.provider.createMany({
    data: PROVIDERS.map((p) => ({
      slug: slugify(p.name),
      name: p.name,
      description: `${p.name} is a fictional model provider used for sample data. Focus: ${p.focus}.`,
      dataSource: "SAMPLE" as const,
    })),
  });
  await prisma.benchmark.createMany({
    data: BENCHMARKS.map((b) => ({
      slug: b.slug,
      name: b.name,
      category: b.category,
      description: "Sample benchmark. Scores are generated for demo purposes, not measured.",
      maxScore: 100,
      dataSource: "SAMPLE" as const,
    })),
  });

  const labs = await prisma.lab.findMany({ select: { id: true, slug: true } });
  const providers = await prisma.provider.findMany({ select: { id: true, slug: true } });
  const benchmarks = await prisma.benchmark.findMany({ select: { id: true, slug: true } });
  const labId = new Map(labs.map((l) => [l.slug, l.id]));
  const benchmarkId = new Map(benchmarks.map((b) => [b.slug, b.id]));

  console.log("Creating models...");
  await prisma.model.createMany({
    data: modelSeeds.map((m) => ({
      slug: m.slug,
      name: m.name,
      description: m.description,
      type: m.type,
      releaseDate: m.releaseDate,
      contextWindow: m.contextWindow,
      maxOutputTokens: m.maxOutputTokens,
      inputModalities: m.inputModalities,
      outputModalities: m.outputModalities,
      capabilities: m.capabilities,
      dataSource: "SAMPLE" as const,
      labId: labId.get(m.labSlug)!,
    })),
  });
  const models = await prisma.model.findMany({ select: { id: true, slug: true } });
  const modelId = new Map(models.map((m) => [m.slug, m.id]));

  console.log("Creating pricing and benchmark scores...");
  const offerings: {
    modelId: string;
    providerId: string;
    inputPricePerMTok: string;
    outputPricePerMTok: string;
    dataSource: "SAMPLE";
  }[] = [];
  const scores: {
    modelId: string;
    benchmarkId: string;
    score: number;
    dataSource: "SAMPLE";
  }[] = [];

  for (const m of modelSeeds) {
    const mid = modelId.get(m.slug)!;

    // 2 to 4 providers per model, each with a slightly different price
    const count = 2 + Math.floor(rand() * 3);
    for (const p of pickSome(providers, count)) {
      const mult = between(0.9, 1.3);
      offerings.push({
        modelId: mid,
        providerId: p.id,
        inputPricePerMTok: (m.price.input * mult).toFixed(4),
        outputPricePerMTok: (m.price.output * mult).toFixed(4),
        dataSource: "SAMPLE",
      });
    }

    // Benchmark scores for chat models only
    if (m.quality !== null) {
      for (const b of BENCHMARKS) {
        scores.push({
          modelId: mid,
          benchmarkId: benchmarkId.get(b.slug)!,
          score: scoreFor(m, b),
          dataSource: "SAMPLE",
        });
      }
    }
  }

  await prisma.modelProvider.createMany({ data: offerings });
  await prisma.benchmarkScore.createMany({ data: scores });

  console.log("Done. All rows are marked SAMPLE.");
  console.log({
    labs: labs.length,
    providers: providers.length,
    benchmarks: benchmarks.length,
    models: models.length,
    offerings: offerings.length,
    scores: scores.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });