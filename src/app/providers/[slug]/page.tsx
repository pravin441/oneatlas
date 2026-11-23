import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ModelCard, ModelGridSkeleton } from "@/components/models/model-card";
import { SampleDataBadge } from "@/components/shared/sample-data-badge";
import { getProviderBySlug } from "@/lib/services/providers";

async function ProviderDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  return (
    <div>
      <Link
        href="/providers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All providers
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <SampleDataBadge dataSource={provider.dataSource} />
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {provider.name}
      </h1>
      {provider.description ? (
        <p className="mt-5 max-w-3xl text-muted-foreground">
          {provider.description}
        </p>
      ) : null}

      <h2 className="mt-10 text-xl font-semibold tracking-tight">
        Models available
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {provider.models.length} model{provider.models.length === 1 ? "" : "s"},
        newest first. Card prices show the lowest price across all providers.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {provider.models.map((m) => (
          <ModelCard key={m.id} model={m} />
        ))}
      </div>
    </div>
  );
}

export default function ProviderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Container className="py-10">
      <Suspense fallback={<ModelGridSkeleton count={3} />}>
        <ProviderDetail params={params} />
      </Suspense>
    </Container>
  );
}