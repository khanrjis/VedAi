"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Topbar } from '@/components/layout/topbar';
import { PaperViewer } from '@/components/paper/paper-viewer';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAssessmentSocket } from '@/hooks/use-assessment-socket';
import { useAssignmentStore } from '@/store/assignment-store';

export default function PaperPage() {
  const params = useParams<{ id: string }>();
  const loadPaper = useAssignmentStore((state) => state.loadPaper);
  const currentPaper = useAssignmentStore((state) => state.currentPaper);
  const regeneratePaper = useAssignmentStore((state) => state.regeneratePaper);
  const loadingPaper = useAssignmentStore((state) => state.loadingPaper);

  useAssessmentSocket(undefined, params.id);

  useEffect(() => {
    void loadPaper(params.id);
  }, [loadPaper, params.id]);

  return (
    <AppShell>
      <div className="space-y-5 p-4 lg:p-0">
        <Topbar title="Generated Paper" subtitle="Printable layout and answer key" showBack />
        {loadingPaper || !currentPaper ? (
          <Card className="p-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="mt-4 h-96 w-full" />
          </Card>
        ) : (
          <PaperViewer paper={currentPaper} onRegenerate={() => regeneratePaper(currentPaper._id)} />
        )}
      </div>
    </AppShell>
  );
}