import { AppShell } from '@/components/layout/app-shell';
import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';

export default function LibraryPage() {
  return (
    <AppShell>
      <div className="space-y-5 p-4 lg:p-0">
        <Topbar title="My Library" subtitle="Saved materials and reusable resources" />
        <Card className="p-8 text-slate-500">Library view coming from the API layer.</Card>
      </div>
    </AppShell>
  );
}