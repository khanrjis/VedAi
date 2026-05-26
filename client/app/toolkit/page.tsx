import { AppShell } from '@/components/layout/app-shell';
import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';

export default function ToolkitPage() {
  return (
    <AppShell>
      <div className="space-y-5 p-4 lg:p-0">
        <Topbar title="AI Teacher's Toolkit" subtitle="Generate papers, rubrics, and teaching aids" />
        <Card className="p-8 text-slate-500">Toolkit workspace is ready for AI-powered classroom utilities.</Card>
      </div>
    </AppShell>
  );
}