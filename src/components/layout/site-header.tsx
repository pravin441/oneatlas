
import Link from "next/link";
import { Suspense } from "react";
import { Compass, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Compass className="h-4 w-4" />
            </span>
            OneAtlas
          </Link>

          <Suspense fallback={<div className="hidden h-9 w-80 md:block" />}>
            <NavLinks />
          </Suspense>
        </div>

        <div className="flex items-center gap-2">
          {/* Placeholder: becomes the Cmd+K global search palette later */}
          <Link
            href="/models"
            className="inline-flex h-9 items-center gap-2 rounded-md border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search models</span>
          </Link>
          <ThemeToggle />
          <Suspense fallback={<div className="h-9 w-9 md:hidden" />}>
            <MobileNav />
          </Suspense>
        </div>
      </Container>
    </header>
  );
}