export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden />;
}

/** Generic public-page skeleton: hero band + a grid of cards. Shown by
 *  app/(site)/loading.tsx between the navbar and footer while a page loads. */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      {/* Hero */}
      <div className="bg-[#faf6ec] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1840px]">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-5 h-12 w-3/4 max-w-3xl sm:h-16" />
          <Skeleton className="mt-4 h-12 w-2/3 max-w-2xl sm:h-16" />
          <Skeleton className="mt-6 h-5 w-full max-w-xl" />
          <Skeleton className="mt-2 h-5 w-4/5 max-w-lg" />
        </div>
      </div>
      {/* Content grid */}
      <div className="mx-auto max-w-[1840px] px-4 py-16 sm:px-8">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto mt-3 h-4 w-96 max-w-full" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[rgba(43,36,22,0.08)] bg-white p-5">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="mt-4 h-5 w-2/3" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Admin dashboard skeleton. */
export function AdminSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
      <div className="mt-8 space-y-3 rounded-xl border border-slate-200 bg-white p-6">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    </div>
  );
}
