import { Skeleton } from "@/components/ui/skeleton"

export default function AIChatLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar Skeleton */}
      <div className="w-80 border-r bg-muted/30 p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-3 border rounded-lg">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Area Skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-16 w-2/3 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t">
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  )
}
