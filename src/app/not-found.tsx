import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        We could not find what you were looking for. It may have moved, or the
        address may be wrong.
      </p>
      <Link
        href="/models"
        className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Browse models
      </Link>
    </Container>
  );
}