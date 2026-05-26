import { Sidebar } from './sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex min-h-screen gap-4 p-4">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
};