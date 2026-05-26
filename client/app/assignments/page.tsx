"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AssignmentCard } from '@/components/assignment/assignment-card';
import { AssignmentEmptyState } from '@/components/assignment/assignment-empty-state';
import { useAssignmentStore } from '@/store/assignment-store';

export default function AssignmentsPage() {
  const router = useRouter();
  const loadAssignments = useAssignmentStore((state) => state.loadAssignments);
  const assignments = useAssignmentStore((state) => state.assignments);
  const loading = useAssignmentStore((state) => state.loading);
  const totalPages = useAssignmentStore((state) => state.totalPages);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    void loadAssignments({ search, status, page, limit: 6 });
  }, [loadAssignments, search, status, page]);

  const visibleAssignments = useMemo(() => assignments, [assignments]);

  return (
    <AppShell>
      <div className="space-y-5 p-4 lg:p-0">
        <Topbar title="Assignment" subtitle="Manage and create assignments for your classes" />

        <Card className="flex flex-col gap-3 rounded-[24px] p-4 md:flex-row md:items-center">
          <div className="flex-1">
            <Input placeholder="Search Assignment" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Select value={status} onChange={(event) => setStatus(event.target.value)} className="md:w-52">
            <option value="">Filter By</option>
            <option value="queued">Queued</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </Select>
          <Button onClick={() => router.push('/assignments/create')}>Create Assignment</Button>
        </Card>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-5">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="mt-4 h-20 w-full" />
                <Skeleton className="mt-4 h-12 w-full" />
              </Card>
            ))}
          </div>
        ) : visibleAssignments.length === 0 ? (
          <AssignmentEmptyState onCreate={() => router.push('/assignments/create')} />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleAssignments.map((assignment) => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button variant="secondary" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                  Previous
                </Button>
                <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
                  Next
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </AppShell>
  );
}