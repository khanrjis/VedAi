"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, ClipboardList, LayoutGrid, Sparkles, Users, Settings, ChevronRight, Plus, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';

const iconMap = {
  'layout-grid': LayoutGrid,
  users: Users,
  'clipboard-list': ClipboardList,
  sparkles: Sparkles,
  'book-open': BookOpen
} as const;

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden h-[calc(100vh-1.5rem)] w-[265px] shrink-0 rounded-[28px] border border-white/70 bg-white/90 px-4 py-5 shadow-lift backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 text-lg font-black text-white shadow-lg shadow-orange-500/25">
          V
        </div>
        <div>
          <div className="text-[20px] font-bold tracking-tight text-slate-900">VedaAI</div>
        </div>
      </Link>

      <Button className="mb-8 h-12 rounded-full border border-orange-200 bg-slate-900 text-white shadow-[0_14px_30px_rgba(17,24,39,0.16)] hover:bg-slate-800" onClick={() => router.push('/assignments/create')}>
        <Plus className="h-4 w-4" />
        Create Assignment
      </Button>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900',
                active && 'bg-slate-100 text-slate-900'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.label === 'Assignments' ? (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-semibold text-white">10</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <Link href="/settings" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
          <Settings className="h-4 w-4" />
          <span className="flex-1">Settings</span>
        </Link>

        <Card className="flex items-center gap-3 rounded-3xl bg-slate-50 p-3 shadow-none">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
            <span className="text-lg">🏫</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900">Delhi Public School</div>
            <div className="truncate text-xs text-slate-500">Bokaro Steel City</div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Card>
      </div>
    </aside>
  );
};