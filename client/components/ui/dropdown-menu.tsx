"use client";

import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export const DropdownMenu = ({ items }: { items: DropdownItem[] }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0" onClick={() => setOpen((value) => !value)}>
        <MoreVertical className="h-4 w-4" />
      </Button>
      {open ? (
        <div className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lift">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={cn('block w-full px-4 py-3 text-left text-sm transition hover:bg-slate-50', item.danger && 'text-rose-600')}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};