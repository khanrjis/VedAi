import { FileX2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreate: () => void;
}

export const AssignmentEmptyState = ({ onCreate }: EmptyStateProps) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-[32px] border border-white/70 bg-white/80 px-6 py-12 text-center shadow-soft backdrop-blur-xl">
      <div className="relative mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-white via-slate-100 to-slate-200 shadow-inner">
        <div className="absolute inset-0 rounded-full border border-white/60" />
        <div className="absolute right-8 top-8 h-10 w-10 rounded-full bg-white shadow-sm" />
        <div className="absolute left-8 bottom-8 h-3 w-3 rounded-full bg-sky-400" />
        <FileX2 className="relative h-20 w-20 text-slate-300" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">No assignments yet</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        Create your first assignment to start collecting and grading student submissions. You can define rubrics, question distributions, and let AI assist with grading.
      </p>
      <Button className="mt-8 h-12 rounded-full px-6" onClick={onCreate}>
        <Sparkles className="h-4 w-4" />
        Create Your First Assignment
      </Button>
    </div>
  );
};