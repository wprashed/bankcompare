import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <>
      <div className="border-b border-ink-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-9 sm:py-12">
          <div className="h-3 w-32 animate-pulse rounded bg-ink-200/70" />
          <div className="mt-5 h-9 w-72 max-w-full animate-pulse rounded-lg bg-ink-200/70" />
          <div className="mt-4 h-4 w-[30rem] max-w-full animate-pulse rounded bg-ink-100" />
        </Container>
      </div>
      <Container className="py-9">
        <div className="h-36 animate-pulse rounded-2xl bg-ink-100" />
        <div className="mt-6 h-28 animate-pulse rounded-2xl bg-brand-100/60" />
        <div className="mt-6 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-ink-100" />
          ))}
        </div>
      </Container>
    </>
  );
}
