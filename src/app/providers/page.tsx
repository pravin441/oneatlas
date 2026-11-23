import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { DirectoryCard } from "@/components/shared/directory-card";
import { ModelGridSkeleton } from "@/components/models/model-card";
import { listProviders } from "@/lib/services/providers";

export const metadata: Metadata = {
  title: "Providers",
  description: "Browse model providers and the models they host.",
};

async function ProviderGrid() {
  const providers = await listProviders();
  if (providers.length === 0) {
    return <p className="text-muted-foreground">No providers found.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {providers.map((p) => (
        <DirectoryCard
          key={p.slug}
          href={`/providers/${p.slug}`}
          title={p.name}
          description={p.description}
          stats={[{ label: "Models hosted", value: String(p.modelCount) }]}
          dataSource={p.dataSource}
        />
      ))}
    </div>
  );
}

export default function ProvidersPage() {
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Providers
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Where models can be used. All providers in this demo are fictional
        sample data.
      </p>
      <div className="mt-8">
        <Suspense fallback={<ModelGridSkeleton count={6} />}>
          <ProviderGrid />
        </Suspense>
      </div>
    </Container>
  );
}