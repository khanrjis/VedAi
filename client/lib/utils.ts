import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const formatDate = (value: string | Date | undefined | null): string => {
  if (!value) {
    return '—';
  }

  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

export const formatStatusLabel = (status: string): string => {
  return status
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export const getDifficultyTone = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'moderate':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-rose-100 text-rose-700 border-rose-200';
  }
};