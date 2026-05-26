"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAssessmentSocket } from '@/hooks/use-assessment-socket';
import { useAssignmentStore } from '@/store/assignment-store';
import { formatDate, formatStatusLabel } from '@/lib/utils';
import { Loader2, Sparkles, FileDown } from 'lucide-react';

export default function AssignmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const loadAssignment = useAssignmentStore((state) => state.loadAssignment);
  const loadPaper = useAssignmentStore((state) => state.loadPaper);
  const generateAssignment = useAssignmentStore((state) => state.generateAssignment);
  const currentAssignment = useAssignmentStore((state) => state.currentAssignment);
  const currentPaper = useAssignmentStore((state) => state.currentPaper);
  const loadingAssignment = useAssignmentStore((state) => state.loadingAssignment);
  const generationProgress = useAssignmentStore((state) => state.generationProgress);

  useAssessmentSocket(params.id, typeof currentAssignment?.generatedPaperId === 'string' ? currentAssignment.generatedPaperId : currentAssignment?.generatedPaperId?._id);

  useEffect(() => {
    void loadAssignment(params.id);
  }, [loadAssignment, params.id]);

  useEffect(() => {
    const paperId = typeof currentAssignment?.generatedPaperId === 'string' ? currentAssignment.generatedPaperId : currentAssignment?.generatedPaperId?._id;
    if (paperId) {
      void loadPaper(paperId);
    }
  }, [currentAssignment?.generatedPaperId, loadPaper]);

  const paperId = typeof currentAssignment?.generatedPaperId === 'string' ? currentAssignment.generatedPaperId : currentAssignment?.generatedPaperId?._id;

  return (
    <AppShell>
      <div className="space-y-5 p-4 lg:p-0">
        <Topbar title="Assignment" subtitle="Assignment details and generation progress" showBack />

        {loadingAssignment || !currentAssignment ? (
          <Card className="p-6">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="mt-4 h-40 w-full" />
          </Card>
        ) : (
          <>
            <Card className="p-6 lg:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <Badge tone={currentAssignment.status === 'completed' ? 'success' : currentAssignment.status === 'failed' ? 'danger' : 'info'}>
                    {formatStatusLabel(currentAssignment.status)}
                  </Badge>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{currentAssignment.title}</h1>
                  <p className="mt-2 text-sm text-slate-500">{currentAssignment.subject} • Class {currentAssignment.className}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => generateAssignment(currentAssignment._id)}>
                    <Sparkles className="h-4 w-4" />
                    Generate / Regenerate
                  </Button>
                  {paperId ? (
                    <Button onClick={() => router.push(`/papers/${paperId}`)}>
                      <FileDown className="h-4 w-4" />
                      Open Paper
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Assigned on</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{formatDate(currentAssignment.createdAt)}</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Due date</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{formatDate(currentAssignment.dueDate)}</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Progress</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{generationProgress}%</div>
                </div>
              </div>

              {currentAssignment.instructions ? (
                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                  {currentAssignment.instructions}
                </div>
              ) : null}
            </Card>

            {currentPaper ? (
              <Card className="p-6 lg:p-8">
                <div className="mb-4 text-sm font-medium text-slate-500">Generated Question Paper</div>
                <Button onClick={() => router.push(`/papers/${currentPaper._id}`)}>Open Generated Paper</Button>
              </Card>
            ) : (
              <Card className="p-6 lg:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Generation Status</h2>
                    <p className="mt-1 text-sm text-slate-500">AI generation runs in the background and updates this screen in realtime.</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {generationProgress}%
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}