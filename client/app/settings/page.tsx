import { AppShell } from '@/components/layout/app-shell';
import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-5 p-4 lg:p-0">
        <Topbar title="Settings" subtitle="Workspace preferences and account settings" />
        <Card className="p-8 text-slate-500">Settings panel placeholder.</Card>
      </div>
    </AppShell>
  );
}