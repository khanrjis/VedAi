import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body' });
const headingFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'VedaAI | Assessment Creator',
  description: 'AI-powered question paper creation platform for teachers.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${headingFont.variable} font-sans text-slate-900`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}