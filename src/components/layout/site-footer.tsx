import Link from "next/link";
import { Container } from "@/components/ui/container";
import { NAV_ITEMS } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="text-base font-semibold">OneAtlas</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Discover, compare and evaluate AI models across labs and providers.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Demo project. Benchmark scores and some pricing are sample data and
            are labelled as such.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}