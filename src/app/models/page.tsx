import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { ModelExplorer } from "@/components/models/model-explorer";
import { ModelGridSkeleton } from "@/components/models/model-card";

export const metadata: Metadata = {
  title: "Models",
  description: "Browse, search and filter AI models across labs and providers.",
};

export default function ModelsPage() {
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        AI models
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Search and filter models by lab, provider, type and capability. All data
        in this demo is generated sample data.
      </p>
      <div className="mt-8">
        <Suspense fallback={<ModelGridSkeleton count={6} />}>
          <ModelExplorer />
        </Suspense>
      </div>
    </Container>
  );
}