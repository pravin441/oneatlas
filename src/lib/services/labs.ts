import { prisma } from "@/lib/db";
import { listModels } from "@/lib/services/models";

export async function listLabs() {
  const labs = await prisma.lab.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { models: true } },
      models: {
        select: { releaseDate: true },
        orderBy: { releaseDate: { sort: "desc", nulls: "last" } },
        take: 1,
      },
    },
  });

  return labs.map((l) => ({
    slug: l.slug,
    name: l.name,
    description: l.description,
    country: l.country,
    foundedYear: l.foundedYear,
    dataSource: l.dataSource,
    modelCount: l._count.models,
    latestRelease: l.models[0]?.releaseDate
      ? l.models[0].releaseDate.toISOString()
      : null,
  }));
}

export async function getLabBySlug(slug: string) {
  const lab = await prisma.lab.findUnique({ where: { slug } });
  if (!lab) return null;

  const { data: models } = await listModels({
    lab: slug,
    sort: "release",
    order: "desc",
    page: 1,
    limit: 50,
  });

  return {
    slug: lab.slug,
    name: lab.name,
    description: lab.description,
    country: lab.country,
    foundedYear: lab.foundedYear,
    dataSource: lab.dataSource,
    models,
  };
}