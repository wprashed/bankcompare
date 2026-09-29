"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto grid min-h-[60vh] w-full max-w-2xl place-items-center px-4 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h1 className="mt-6 text-[26px] font-extrabold tracking-tight text-ink-900">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
          We couldn&apos;t load the latest rates. This is usually temporary — try again in a moment.
        </p>
        {error.digest && <p className="mt-2 font-mono text-[12px] text-ink-400">Ref: {error.digest}</p>}
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <RotateCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
