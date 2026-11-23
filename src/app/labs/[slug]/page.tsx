import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ModelCard, ModelGridSkeleton } from "@/components/models/model-card";
import { SampleDataBadge } from "@/components/shared/sample-data-badge";
import { getLabBySlug } from "@/lib/services/labs";

async function LabDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = await getLabBySlug(slug);
  if (!lab) notFound();

  return (
    <div>
      <Link
        href="/labs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All labs
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <SampleDataBadge dataSource={lab.dataSource} />
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {lab.name}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {[lab.country, lab.foundedYear ? `Founded ${lab.foundedYear}` : null]
          .filter(Boolean)
          .join(" | ")}
      </p>
      {lab.description ? (
        <p className="mt-5 max-w-3xl text-muted-foreground">{lab.description}</p>
      ) : null}

      <h2 className="mt-10 text-xl font-semibold tracking-tight">
        Models and releases
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {lab.models.length} model{lab.models.length === 1 ? "" : "s"}, newest first.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lab.models.map((m) => (
          <ModelCard key={m.id} model={m} />
        ))}
      </div>
    </div>
  );
}

export default function LabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Container className="py-10">
      <Suspense fallback={<ModelGridSkeleton count={3} />}>
        <LabDetail params={params} />
      </Suspense>
    </Container>
  );
}