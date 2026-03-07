export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-background dark:via-background dark:to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="text-center space-y-6">
            <div className="mx-auto h-8 w-48 rounded-full bg-emerald-200/50 dark:bg-emerald-800/20" />
            <div className="mx-auto h-12 w-3/4 max-w-2xl rounded-lg bg-muted/60" />
            <div className="mx-auto h-6 w-2/3 max-w-xl rounded-lg bg-muted/40" />
            <div className="flex justify-center gap-4 mt-8">
              <div className="h-12 w-40 rounded-lg bg-emerald-200/50 dark:bg-emerald-800/20" />
              <div className="h-12 w-40 rounded-lg bg-muted/40" />
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/80 dark:bg-card/80 p-6 space-y-3">
                <div className="mx-auto h-6 w-6 rounded-full bg-muted/50" />
                <div className="mx-auto h-8 w-20 rounded bg-muted/60" />
                <div className="mx-auto h-4 w-24 rounded bg-muted/40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-8 w-64 rounded bg-muted/60 mb-8" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-muted/50" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-20 rounded bg-muted/40" />
                  <div className="h-4 w-32 rounded bg-muted/60" />
                </div>
              </div>
              <div className="h-8 w-24 rounded bg-emerald-200/30 dark:bg-emerald-800/20" />
              <div className="h-4 w-full rounded bg-muted/30" />
              <div className="h-4 w-3/4 rounded bg-muted/30" />
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-muted/40" />
                <div className="h-6 w-20 rounded-full bg-muted/40" />
              </div>
              <div className="h-10 w-full rounded-lg bg-muted/40" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
