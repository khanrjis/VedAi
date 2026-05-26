import { cn } from '@/lib/utils';

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('rounded-3xl border border-white/60 bg-white/90 shadow-soft backdrop-blur-xl', className)} {...props} />;
};
