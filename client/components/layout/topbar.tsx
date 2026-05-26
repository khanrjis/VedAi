"use client";

import { Bell, ChevronDown, ChevronLeft, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export const Topbar = ({ title = 'Assignment', subtitle, showBack = false }: TopbarProps) => {
  const router = useRouter();

  return (
    <header className="mb-5 flex items-center justify-between rounded-[24px] border border-white/70 bg-white/90 px-4 py-3 shadow-soft backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <LayoutGrid className="h-4 w-4" />
          </div>
        )}
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full p-0">
          <Bell className="h-5 w-5 text-slate-700" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
        </Button>
        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1 pr-3 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-amber-100 text-xs font-semibold text-slate-700 shadow-sm">
            JD
          </div>
          <span className="text-sm font-medium text-slate-700">John Doe</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
};