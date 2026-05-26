"use client";

import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Minus, Upload, ArrowRight, Loader2, FileText, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createAssignmentSchema } from '@/lib/validators';
import { DEFAULT_QUESTION_TYPES, QUESTION_TYPE_OPTIONS } from '@/lib/constants';
import { useAssignmentStore } from '@/store/assignment-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { CreateAssignmentFormValues } from '@/types';

const defaultValues: CreateAssignmentFormValues = {
  title: '',
  subject: '',
  className: '',
  dueDate: '',
  instructions: '',
  sourceText: '',
  questionTypes: DEFAULT_QUESTION_TYPES,
  totalQuestions: DEFAULT_QUESTION_TYPES.reduce((sum, item) => sum + item.count, 0),
  totalMarks: DEFAULT_QUESTION_TYPES.reduce((sum, item) => sum + item.count * item.marks, 0),
  file: null
};

export const AssignmentForm = () => {
  const router = useRouter();
  const creating = useAssignmentStore((state) => state.creating);
  const createAssignment = useAssignmentStore((state) => state.createAssignment);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateAssignmentFormValues>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'questionTypes' });

  const questionTypes = watch('questionTypes');
  const file = watch('file');

  const calculatedTotals = useMemo(() => {
    return questionTypes.reduce(
      (totals, questionType) => ({
        questions: totals.questions + Number(questionType.count || 0),
        marks: totals.marks + Number(questionType.count || 0) * Number(questionType.marks || 0)
      }),
      { questions: 0, marks: 0 }
    );
  }, [questionTypes]);

  useEffect(() => {
    setValue('totalQuestions', calculatedTotals.questions, { shouldValidate: true });
    setValue('totalMarks', calculatedTotals.marks, { shouldValidate: true });
  }, [calculatedTotals, setValue]);

  const onSubmit = async (values: CreateAssignmentFormValues) => {
    try {
      const assignment = await createAssignment(values);
      toast.success('Assignment created successfully');
      router.push(`/assignments/${assignment._id}`);
    } catch {
      toast.error('Could not create assignment');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Assignment Details</h2>
          <p className="mt-1 text-sm text-slate-500">Basic information about your assignment</p>
        </div>

        <label className="mb-6 block">
          <div className="rounded-[28px] border-2 border-dashed border-slate-200 bg-slate-50/80 p-8 text-center transition hover:border-slate-300">
            <Upload className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <div className="text-sm font-medium text-slate-800">Choose a file or drag & drop it here</div>
            <div className="mt-1 text-xs text-slate-500">JPEG, PNG, PDF up to 10MB</div>
            <div className="mt-4 inline-flex">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">Browse Files</span>
            </div>
          </div>
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={(event) => setValue('file', event.target.files)}
          />
          {file?.[0] ? <div className="mt-3 text-sm text-slate-500">Selected file: {file[0].name}</div> : null}
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
            <Input placeholder="Assessment title" {...register('title')} />
            {errors.title ? <p className="mt-2 text-xs text-rose-600">{errors.title.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Subject</label>
            <Input placeholder="e.g. Science" {...register('subject')} />
            {errors.subject ? <p className="mt-2 text-xs text-rose-600">{errors.subject.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Class</label>
            <Input placeholder="e.g. 5th" {...register('className')} />
            {errors.className ? <p className="mt-2 text-xs text-rose-600">{errors.className.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Due Date</label>
            <Input type="date" {...register('dueDate')} />
            {errors.dueDate ? <p className="mt-2 text-xs text-rose-600">{errors.dueDate.message}</p> : null}
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">Instructions</label>
          <Textarea placeholder="Additional assignment instructions..." {...register('instructions')} />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">Question Type</label>
          <div className="space-y-3">
            {fields.map((field, index) => {
              const rowLabel = QUESTION_TYPE_OPTIONS.find((option) => option.type === questionTypes[index]?.type)?.label ?? 'Question Type';

              return (
                <div key={field.id} className="grid gap-3 rounded-3xl bg-slate-50/80 p-3 md:grid-cols-[1.25fr_0.45fr_0.45fr_0.45fr_auto] md:items-center">
                  <Select {...register(`questionTypes.${index}.type` as const)}>
                    {QUESTION_TYPE_OPTIONS.map((option) => (
                      <option key={option.type} value={option.type}>
                        {option.label}
                      </option>
                    ))}
                  </Select>

                  <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white px-3 py-2">
                    <button type="button" className="rounded-full p-1 text-slate-500 hover:bg-slate-100" onClick={() => setValue(`questionTypes.${index}.count`, Math.max(1, Number(questionTypes[index]?.count || 1) - 1), { shouldValidate: true })}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-slate-800">{questionTypes[index]?.count}</span>
                    <button type="button" className="rounded-full p-1 text-slate-500 hover:bg-slate-100" onClick={() => setValue(`questionTypes.${index}.count`, Number(questionTypes[index]?.count || 0) + 1, { shouldValidate: true })}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white px-3 py-2">
                    <button type="button" className="rounded-full p-1 text-slate-500 hover:bg-slate-100" onClick={() => setValue(`questionTypes.${index}.marks`, Math.max(1, Number(questionTypes[index]?.marks || 1) - 1), { shouldValidate: true })}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-slate-800">{questionTypes[index]?.marks}</span>
                    <button type="button" className="rounded-full p-1 text-slate-500 hover:bg-slate-100" onClick={() => setValue(`questionTypes.${index}.marks`, Number(questionTypes[index]?.marks || 0) + 1, { shouldValidate: true })}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <Select {...register(`questionTypes.${index}.difficulty` as const)}>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </Select>

                  <button type="button" className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-slate-700" onClick={() => remove(index)}>
                    ×
                  </button>

                  <input type="hidden" {...register(`questionTypes.${index}.label` as const)} value={rowLabel} />
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            variant="ghost"
            className="mt-3 rounded-full px-0 text-slate-700"
            onClick={() =>
              append({
                type: 'multipleChoice',
                label: 'New Question Type',
                count: 1,
                marks: 1,
                difficulty: 'easy'
              })
            }
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
              <Plus className="h-4 w-4" />
            </div>
            Add Question Type
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-slate-50 px-5 py-4">
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <Badge tone="info">Total Questions: {calculatedTotals.questions}</Badge>
            <Badge tone="success">Total Marks: {calculatedTotals.marks}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText className="h-4 w-4" />
            Auto-calculated from the distribution above
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">Additional Information</label>
          <div className="relative">
            <Textarea placeholder="e.g. Generate a question paper for 3 hour exam duration..." {...register('sourceText')} className="min-h-36 pr-12" />
            <Mic className="absolute bottom-4 right-4 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Previous
          </Button>
          <Button type="submit" className="min-w-40" disabled={creating}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </form>
  );
};