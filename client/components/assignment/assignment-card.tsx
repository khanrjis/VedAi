"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarRange, FileText, Loader2, Sparkles, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AssignmentSummary } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { formatDate, formatStatusLabel } from '@/lib/utils';

interface AssignmentCardProps {
  assignment: AssignmentSummary;
}

export const AssignmentCard = ({ assignment }: AssignmentCardProps) => {
  const router = useRouter();
  const generatedPaperId = typeof assignment.generatedPaperId === 'string' ? assignment.generatedPaperId : assignment.generatedPaperId?._id;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="group h-full overflow-hidden border border-slate-100 p-5 transition hover:shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900 underline-offset-4 group-hover:underline">{assignment.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone={assignment.status === 'completed' ? 'success' : assignment.status === 'failed' ? 'danger' : 'info'}>
                {formatStatusLabel(assignment.status)}
              </Badge>
              <Badge>{assignment.subject}</Badge>
              <Badge>{assignment.className}</Badge>
            </div>
          </div>
          <DropdownMenu
            items={[
              { label: 'View Assignment', onClick: () => router.push(`/assignments/${assignment._id}`) },
              ...(generatedPaperId ? [{ label: 'View Paper', onClick: () => router.push(`/papers/${generatedPaperId}`) }] : []),
              { label: 'Regenerate', onClick: () => router.push(`/assignments/${assignment._id}`) },
              { label: 'Delete', onClick: () => void 0, danger: true }
            ]}
          />
        </div>

        <div className="mt-8 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-slate-400" />
            <span>
              Assigned on <strong className="font-medium text-slate-700">{formatDate(assignment.createdAt)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-slate-400" />
            <span>
              Due <strong className="font-medium text-slate-700">{formatDate(assignment.dueDate)}</strong>
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText className="h-4 w-4" />
            <span>{assignment.totalQuestions} questions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles className="h-4 w-4" />
            <span>{assignment.totalMarks} marks</span>
          </div>
        </div>

        {assignment.status === 'queued' ? (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
            Generating paper in the background
          </div>
        ) : null}

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => router.push(`/assignments/${assignment._id}`)}>
            <Eye className="h-4 w-4" />
            View
          </Button>
          {generatedPaperId ? (
            <Button className="flex-1" onClick={() => router.push(`/papers/${generatedPaperId}`)}>
              Open Paper
            </Button>
          ) : (
            <Button className="flex-1" onClick={() => router.push(`/assignments/${assignment._id}`)}>
              Generate
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};