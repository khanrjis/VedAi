import { AppShell } from '@/components/layout/app-shell';
import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';

export default function GroupsPage() {
  return (
    <AppShell>
      <div className="space-y-5 p-4 lg:p-0">
        <Topbar title="My Groups" subtitle="Class groups and teacher cohorts" />
        <Card className="p-8 text-slate-500">Groups view coming from the API layer.</Card>
      </div>
    </AppShell>
  );
}