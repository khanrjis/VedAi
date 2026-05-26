"use client";

import { AppShell } from '@/components/layout/app-shell';
import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { AssignmentForm } from '@/components/assignment/assignment-form';

export default function CreateAssignmentPage() {
  return (
    <AppShell>
      <div className="space-y-5 p-4 lg:p-0">
        <Topbar title="Assignment" subtitle="Set up a new assignment for your students" showBack />
        <div className="rounded-[24px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-4 text-white shadow-lift">
          <div className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            Create Assignment
          </div>
          <p className="mt-1 text-sm text-slate-300">Structure the paper, attach content, and generate a high-quality assessment in one flow.</p>
        </div>
        <AssignmentForm />
      </div>
    </AppShell>
  );
}