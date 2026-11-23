import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { DirectoryCard } from "@/components/shared/directory-card";
import { ModelGridSkeleton } from "@/components/models/model-card";
import { listLabs } from "@/lib/services/labs";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "AI Labs",
  description: "Browse AI labs and the models they have released.",
};

async function LabGrid() {
  const labs = await listLabs();
  if (labs.length === 0) {
    return <p className="text-muted-foreground">No labs found.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {labs.map((l) => (
        <DirectoryCard
          key={l.slug}
          href={`/labs/${l.slug}`}
          title={l.name}
          subtitle={[l.country, l.foundedYear ? `Founded ${l.foundedYear}` : null]
            .filter(Boolean)
            .join(" | ")}
          description={l.description}
          stats={[
            { label: "Models", value: String(l.modelCount) },
            { label: "Latest release", value: formatDate(l.latestRelease) },
          ]}
          dataSource={l.dataSource}
        />
      ))}
    </div>
  );
}

export default function LabsPage() {
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">AI labs</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        The companies and research labs behind the models. All labs in this demo
        are fictional sample data.
      </p>
      <div className="mt-8">
        <Suspense fallback={<ModelGridSkeleton count={6} />}>
          <LabGrid />
        </Suspense>
      </div>
    </Container>
  );
}