import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminPageSkeletonProps {
  statCount?: number;
  listCount?: number;
  showFilters?: boolean;
  variant?: "dashboard" | "list";
}

export function AdminPageSkeleton({
  statCount = 5,
  listCount = 3,
  showFilters = false,
  variant = "dashboard",
}: AdminPageSkeletonProps) {
  if (variant === "dashboard") {
    return (
      <div className="surface-page min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-80 max-w-[90vw]" />
            </div>
            <Skeleton className="h-9 w-28 shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: statCount }).map((_, idx) => (
              <Card
                key={idx}
                className="surface-card shadow-sm overflow-hidden"
              >
                <div className="h-1 w-full bg-muted" />
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-7 w-16" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Card key={idx} className="surface-card shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <Skeleton className="h-5 w-36" />
                  {Array.from({ length: 2 }).map((__, rowIdx) => (
                    <div
                      key={rowIdx}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-page min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80 max-w-[85vw]" />
          </div>
          <Skeleton className="h-9 w-28" />
        </section>

        {showFilters ? (
          <Card className="surface-card shadow-sm">
            <CardContent className="pt-5 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : null}

        {statCount > 0 ? (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: statCount }).map((_, idx) => (
              <Card key={idx} className="surface-card shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-16" />
                </CardContent>
              </Card>
            ))}
          </section>
        ) : null}

        <section className="space-y-3">
          {Array.from({ length: listCount }).map((_, idx) => (
            <Card key={idx} className="surface-card shadow-sm">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-7/12" />
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}

export function AdminDialogSkeleton() {
  return (
    <div className="space-y-4 py-2">
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-10/12" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
