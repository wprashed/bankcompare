import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <>
      <div className="border-b border-ink-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-9 sm:py-12">
          <div className="h-3 w-40 animate-pulse rounded bg-ink-200/70" />
          <div className="mt-5 h-9 w-80 max-w-full animate-pulse rounded-lg bg-ink-200/70" />
          <div className="mt-4 h-4 w-[34rem] max-w-full animate-pulse rounded bg-ink-100" />
        </Container>
      </div>
      <Container className="py-9">
        <div className="space-y-6">
          <div className="h-32 animate-pulse rounded-2xl bg-ink-100" />
          <div className="h-16 animate-pulse rounded-2xl bg-ink-100" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-ink-100" />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
