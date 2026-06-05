export function HallCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 bg-card">
      <div className="aspect-[4/3] animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded-lg animate-shimmer" />
        <div className="h-4 w-1/2 rounded-lg animate-shimmer" />
        <div className="h-4 w-2/3 rounded-lg animate-shimmer" />
        <div className="h-10 w-full rounded-xl mt-2 animate-shimmer" />
      </div>
    </div>
  );
}

export function HallCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <HallCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden">
      <div className="bg-muted/40 px-4 py-3 border-b border-border/60">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 rounded-lg animate-shimmer flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3.5 border-b border-border/40 last:border-0">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <div
                key={j}
                className="h-4 rounded-lg animate-shimmer flex-1"
                style={{ opacity: 1 - i * 0.12 }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/60 p-6 bg-card space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 rounded-lg animate-shimmer" />
              <div className="h-8 w-16 rounded-lg animate-shimmer" />
              <div className="h-3 w-32 rounded-lg animate-shimmer" />
            </div>
            <div className="w-12 h-12 rounded-2xl animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HallDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="aspect-video rounded-xl animate-shimmer" />
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-20 h-14 rounded-lg animate-shimmer" />
        ))}
      </div>
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-lg animate-shimmer" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-5 rounded-lg animate-shimmer" />
          ))}
        </div>
      </div>
      <div className="rounded-xl border p-4 animate-shimmer h-64" />
    </div>
  );
}

export function BookingRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border/40">
      <div className="h-12 w-12 rounded-xl animate-shimmer flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded-lg animate-shimmer" />
        <div className="h-3 w-1/4 rounded-lg animate-shimmer" />
      </div>
      <div className="h-6 w-20 rounded-full animate-shimmer" />
    </div>
  );
}
