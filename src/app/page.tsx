import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Boxes, FlaskConical, Server, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { ModelGridSkeleton } from "@/components/models/model-card";
import {
  HomeStats,
  HomeStatsSkeleton,
  LatestModels,
} from "@/components/home/home-sections";

const SECTIONS = [
  { href: "/models", title: "Models", text: "Search and filter by lab, provider, type and capability.", icon: Boxes },
  { href: "/rankings", title: "Rankings", text: "Leaderboards by benchmark category.", icon: Trophy },
  { href: "/labs", title: "AI labs", text: "Browse labs and their model releases.", icon: FlaskConical },
  { href: "/providers", title: "Providers", text: "See which providers host which models.", icon: Server },
];

export default function Home() {
  return (
    <>
      <section className="border-b bg-gradient-to-b from-accent/60 to-background">
        <Container className="py-16 sm:py-24">
          <Badge variant="primary">Demo project with sample data</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Discover, compare and evaluate AI models
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            OneAtlas brings model specifications, provider pricing and benchmark
            scores into one place, for developers, AI engineers and researchers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/models"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Browse models
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/rankings"
              className="inline-flex h-11 items-center rounded-md border bg-card px-5 text-sm font-medium hover:bg-muted"
            >
              View rankings
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <Suspense fallback={<HomeStatsSkeleton />}>
          <HomeStats />
        </Suspense>
      </Container>

      <Container className="pb-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
            >
              <s.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-base font-semibold group-hover:text-primary">
                {s.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="py-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Latest releases</h2>
          <Link
            href="/models"
            className="text-sm font-medium text-primary hover:underline"
          >
            See all models
          </Link>
        </div>
        <Suspense fallback={<ModelGridSkeleton count={3} />}>
          <LatestModels />
        </Suspense>
      </Container>
    </>
  );
}