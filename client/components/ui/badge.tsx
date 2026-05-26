import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = ({ className, tone = 'neutral', ...props }: BadgeProps) => {
  const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-rose-100 text-rose-700 border-rose-200',
    info: 'bg-sky-100 text-sky-700 border-sky-200'
  };

  return <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium', tones[tone], className)} {...props} />;
};