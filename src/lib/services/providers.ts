import { prisma } from "@/lib/db";
import { listModels } from "@/lib/services/models";

export async function listProviders() {
  const providers = await prisma.provider.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { offerings: true } } },
  });

  return providers.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    dataSource: p.dataSource,
    modelCount: p._count.offerings,
  }));
}

export async function getProviderBySlug(slug: string) {
  const provider = await prisma.provider.findUnique({ where: { slug } });
  if (!provider) return null;

  const { data: models } = await listModels({
    provider: slug,
    sort: "release",
    order: "desc",
    page: 1,
    limit: 50,
  });

  return {
    slug: provider.slug,
    name: provider.name,
    description: provider.description,
    dataSource: provider.dataSource,
    models,
  };
}