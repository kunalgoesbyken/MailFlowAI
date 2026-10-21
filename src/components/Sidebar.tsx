import { Inbox, Send, LogOut, PenSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useAppStore } from '@/store';
import type { ViewType } from '@/types/email';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onCompose: () => void;
  unreadCount: number;
  isAuthenticated: boolean;
}

const navItems = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'sent', label: 'Sent', icon: Send },
] as const;

export function Sidebar({ currentView, onViewChange, onCompose, unreadCount, isAuthenticated }: SidebarProps) {
  const { login, logout } = useGoogleAuth();
  const userEmail = useAppStore((s) => s.user?.emailAddress);

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950 lg:flex">
      <h1 className="px-2 pb-3 pt-1 text-sm font-semibold">MailFlowAI</h1>

      <Button onClick={onCompose} className="mb-3 justify-start">
        <PenSquare />
        Compose
        <kbd className="ml-auto text-xs opacity-70">c</kbd>
      </Button>

      <nav className="flex flex-1 flex-col gap-0.5">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            aria-current={currentView === id ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm',
              currentView === id
                ? 'bg-neutral-100 font-medium dark:bg-neutral-800'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-left">{label}</span>
            {id === 'inbox' && unreadCount > 0 && (
              <span className="text-xs tabular-nums text-neutral-500">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
        {isAuthenticated ? (
          <>
            {userEmail && <p className="truncate px-2 pb-2 text-xs text-neutral-500">{userEmail}</p>}
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => login()}>
            Sign in with Google
          </Button>
        )}
      </div>
    </aside>
  );
}
