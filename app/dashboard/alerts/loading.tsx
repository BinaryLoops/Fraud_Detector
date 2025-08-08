import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AlertsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex space-x-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="glass-effect border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-3 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts List Skeleton */}
        <Card className="glass-effect border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-72" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4" />
                      <div>
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-80" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
