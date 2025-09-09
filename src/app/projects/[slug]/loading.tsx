import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectLoading() {
  return (
    <div>
      <div className="p-2 border-b">
        <div className="container mx-auto">
          <Skeleton className="h-9 w-40" />
        </div>
      </div>
      <div className="py-8 bg-secondary border-b">
        <div className="container mx-auto px-4">
           <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-8 w-48" />
              </div>
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
