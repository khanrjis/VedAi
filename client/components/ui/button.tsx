import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:pointer-events-none disabled:opacity-50';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-slate-900 text-white shadow-soft hover:bg-slate-800',
    secondary: 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    destructive: 'bg-rose-600 text-white hover:bg-rose-500'
  };

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />;
});

Button.displayName = 'Button';