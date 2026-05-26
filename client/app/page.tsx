"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock3, Sparkles, ClipboardList, Users, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAssignmentStore } from '@/store/assignment-store';

export default function DashboardPage() {
  const router = useRouter();
  const loadAssignments = useAssignmentStore((state) => state.loadAssignments);
  const assignments = useAssignmentStore((state) => state.assignments);

  useEffect(() => {
    void loadAssignments({ page: 1, limit: 6 });
  }, [loadAssignments]);

  const completed = assignments.filter((assignment) => assignment.status === 'completed').length;

  return (
    <AppShell>
      <div className="space-y-5 p-4 lg:p-0">
        <Topbar title="Assignment" subtitle="Overview of recent assignment activity" />

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Assignments', value: assignments.length, icon: ClipboardList },
            { label: 'Generated Papers', value: completed, icon: Sparkles },
            { label: 'Active Groups', value: 12, icon: Users }
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.label} className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="overflow-hidden p-6 lg:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge tone="success">Realtime generation</Badge>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Create, generate, and ship assessments faster.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Build question papers from curated distribution rules, upload source material, and let AI generate printable assessments with answer keys.
              </p>
            </div>
            <Button className="shrink-0" onClick={() => router.push('/assignments/create')}>
              Create Assignment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <motion.div
            className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            {assignments.slice(0, 3).map((assignment) => (
              <motion.div
                key={assignment._id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.22 }}
                className="rounded-[24px] border border-slate-100 bg-slate-50 p-5"
              >
                <div className="text-lg font-semibold text-slate-900">{assignment.title}</div>
                <div className="mt-2 text-sm text-slate-500">{assignment.subject} • {assignment.className}</div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span>{assignment.totalQuestions} questions</span>
                  <span>{assignment.totalMarks} marks</span>
                </div>
                <Button variant="secondary" className="mt-5 w-full" onClick={() => router.push(`/assignments/${assignment._id}`)}>
                  <Clock3 className="h-4 w-4" />
                  View Timeline
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </div>
    </AppShell>
  );
}