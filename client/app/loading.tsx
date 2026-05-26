import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <AppShell>
      <div className="space-y-5 p-4 lg:p-0">
        <Skeleton className="h-20 rounded-[24px]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-5">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="mt-4 h-24 w-full" />
              <Skeleton className="mt-4 h-10 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}