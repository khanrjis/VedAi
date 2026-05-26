"use client";

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getDifficultyTone } from '@/lib/utils';
import type { GeneratedPaperSummary } from '@/types';
import { Download, RefreshCw, Printer } from 'lucide-react';

interface PaperViewerProps {
  paper: GeneratedPaperSummary;
  onRegenerate?: () => void;
}

export const PaperViewer = ({ paper, onRegenerate }: PaperViewerProps) => {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-slate-900 p-5 text-white shadow-lift">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-slate-300">Certainly, here is the generated question paper.</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{paper.title}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onRegenerate} className="bg-white text-slate-900 hover:bg-slate-100">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button
              variant="secondary"
              className="bg-white text-slate-900 hover:bg-slate-100"
              onClick={() => {
                if (paper.pdfUrl) {
                  window.open(paper.pdfUrl, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-[32px] bg-white p-6 lg:p-10">
        <div className="border-b border-slate-200 pb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Delhi Public School, Sector-4, Bokaro</h1>
          <p className="mt-2 text-base text-slate-600">Subject: {paper.subject}</p>
          <p className="text-base text-slate-600">Class: {paper.className}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge tone="info">Duration: {paper.duration}</Badge>
            <Badge tone="success">Maximum Marks: {paper.totalMarks}</Badge>
          </div>
        </div>

        <div className="mt-8 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
          <div>Name: ____________________</div>
          <div>Roll Number: ____________________</div>
          <div>Class: ____________________</div>
          <div>Section: ____________________</div>
        </div>

        <div className="mt-10 space-y-10">
          {paper.sections.map((section, sectionIndex) => (
            <section key={section.title} className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
                <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                <Badge tone="neutral">Section {String.fromCharCode(65 + sectionIndex)}</Badge>
              </div>
              <p className="text-sm text-slate-500">{section.instruction}</p>

              <div className="space-y-4">
                {section.questions.map((question, questionIndex) => (
                  <div key={`${section.title}-${questionIndex}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge className={getDifficultyTone(question.difficulty)}>{question.difficulty}</Badge>
                      <Badge tone="neutral">{question.marks} marks</Badge>
                    </div>
                    <div className="text-[15px] leading-7 text-slate-800">
                      {questionIndex + 1}. {question.question}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <h3 className="text-xl font-semibold text-slate-900">Answer Key</h3>
          <div className="mt-5 space-y-4">
            {paper.answerKey.map((entry, index) => (
              <div key={`${entry.question}-${index}`} className="rounded-3xl bg-slate-50 p-4">
                <div className="font-medium text-slate-900">{index + 1}. {entry.question}</div>
                <p className="mt-2 text-sm text-slate-600">{entry.answer}</p>
                {entry.explanation ? <p className="mt-2 text-sm text-slate-500">{entry.explanation}</p> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <Button variant="secondary">
            <Printer className="h-4 w-4" />
            Print Preview
          </Button>
        </div>
      </Card>
    </div>
  );
};