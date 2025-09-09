import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <header className="text-center mb-12">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
      </header>

      <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 p-6 border rounded-lg">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex-grow space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="pt-4">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
