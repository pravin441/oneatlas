import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-semibold tracking-tight">
        Layout test
      </h1>
      <p className="mt-2 text-muted-foreground">
        Resize the browser window. Below 768px the nav links collapse into a
        menu button.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="rounded-xl border bg-card p-6">
            Card {n}
          </div>
        ))}
      </div>
    </Container>
  );
}