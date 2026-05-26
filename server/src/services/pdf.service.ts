import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';
import type { GeneratedPaperDocument } from '../models/GeneratedPaper.js';

type PdfQuestion = {
  difficulty: string;
  marks: number;
  question: string;
};

type PdfSection = {
  title: string;
  instruction: string;
  questions: PdfQuestion[];
};

type PdfAnswerEntry = {
  question: string;
  answer: string;
  explanation?: string;
};

type PdfPaper = {
  _id: string | { toString(): string };
  title: string;
  subject: string;
  className: string;
  duration: string;
  totalMarks: number;
  sections: PdfSection[];
  answerKey: PdfAnswerEntry[];
};

const buildHtml = (paper: PdfPaper): string => {
  const sections = paper.sections
    .map((section: PdfSection) => {
      const questions = section.questions
        .map(
          (question: PdfQuestion, index: number) => `
            <div class="question">
              <div class="question-meta">${index + 1}. ${question.difficulty} • ${question.marks} marks</div>
              <div class="question-text">${question.question}</div>
            </div>`
        )
        .join('');

      return `
        <section class="section">
          <h2>${section.title}</h2>
          <p>${section.instruction}</p>
          ${questions}
        </section>`;
    })
    .join('');

  const answerKey = paper.answerKey
    .map(
      (entry: PdfAnswerEntry, index: number) => `
        <div class="answer-entry">
          <strong>${index + 1}.</strong> ${entry.question}<br />
          <span>${entry.answer}</span>
          ${entry.explanation ? `<p>${entry.explanation}</p>` : ''}
        </div>`
    )
    .join('');

  return `
    <html>
      <head>
        <style>
          @page { margin: 32px; }
          body { font-family: Arial, sans-serif; color: #111827; }
          .header { text-align: center; margin-bottom: 24px; }
          .meta { display: flex; justify-content: space-between; margin: 20px 0; font-size: 13px; }
          .student-lines { margin: 18px 0 28px; }
          .student-lines div { margin-bottom: 8px; }
          .section { page-break-inside: avoid; margin-bottom: 24px; }
          .section h2 { border-bottom: 1px solid #d1d5db; padding-bottom: 8px; }
          .question { margin: 14px 0; }
          .question-meta { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
          .question-text { font-size: 14px; line-height: 1.5; }
          .answer-key { margin-top: 36px; page-break-before: always; }
          .answer-entry { margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Delhi Public School, Sector-4, Bokaro</h1>
          <p><strong>Subject:</strong> ${paper.subject} &nbsp; | &nbsp; <strong>Class:</strong> ${paper.className}</p>
          <p><strong>Duration:</strong> ${paper.duration} &nbsp; | &nbsp; <strong>Maximum Marks:</strong> ${paper.totalMarks}</p>
        </div>
        <div class="meta"><span>Name: ____________________</span><span>Roll No.: ____________________</span></div>
        <div class="student-lines">
          <div>Class: ____________________</div>
          <div>Section: ____________________</div>
        </div>
        ${sections}
        <div class="answer-key">
          <h2>Answer Key</h2>
          ${answerKey}
        </div>
      </body>
    </html>`;
};

export const generatePaperPdf = async (paper: GeneratedPaperDocument | PdfPaper): Promise<string> => {
  const uploadDir = path.resolve(process.cwd(), 'uploads', 'pdf');
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, `${String(paper._id)}.pdf`);
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(buildHtml(paper as PdfPaper), { waitUntil: 'networkidle0' });
  await page.pdf({ path: filePath, format: 'A4', printBackground: true });
  await browser.close();
  return filePath;
};