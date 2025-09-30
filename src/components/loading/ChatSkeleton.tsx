import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Chat header skeleton */}
      <div className="border-b border-border-light p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {/* Received message */}
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-16 w-3/4 rounded-xl" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Sent message */}
        <div className="flex gap-2 justify-end">
          <div className="space-y-2 flex-1 flex flex-col items-end">
            <Skeleton className="h-16 w-3/4 rounded-xl" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Received message */}
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-20 w-2/3 rounded-xl" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Sent message */}
        <div className="flex gap-2 justify-end">
          <div className="space-y-2 flex-1 flex flex-col items-end">
            <Skeleton className="h-12 w-1/2 rounded-xl" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      {/* Input skeleton */}
      <div className="border-t border-border-light p-4">
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-12 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ChatListSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

