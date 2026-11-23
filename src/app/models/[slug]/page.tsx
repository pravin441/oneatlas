import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import {
  ModelDetail,
  ModelDetailSkeleton,
} from "@/components/models/model-detail";

// The params promise is passed down, not awaited here, so the page can
// show its skeleton while the database query runs.
export default function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Container className="py-10">
      <Suspense fallback={<ModelDetailSkeleton />}>
        <ModelDetail params={params} />
      </Suspense>
    </Container>
  );
}