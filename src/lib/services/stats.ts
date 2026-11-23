import { prisma } from "@/lib/db";

export async function getSiteStats() {
  const [models, labs, providers, benchmarks] = await Promise.all([
    prisma.model.count(),
    prisma.lab.count(),
    prisma.provider.count(),
    prisma.benchmark.count(),
  ]);
  return { models, labs, providers, benchmarks };
}