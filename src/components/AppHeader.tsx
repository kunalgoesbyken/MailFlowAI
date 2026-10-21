import { Moon, Sun, RefreshCw, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import type { ViewType, FilterState, SortOrder } from '@/types/email';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/FilterBar';

interface AppHeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isCopilotOpen: boolean;
  isSyncing: boolean;
  onToggleCopilot: () => void;
  onSync: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

const MOBILE_VIEWS: ViewType[] = ['inbox', 'sent'];

export function AppHeader({
  currentView,
  onViewChange,
  isCopilotOpen,
  isSyncing,
  onToggleCopilot,
  onSync,
  filters,
  onFiltersChange,
  sortOrder,
  onSortChange,
}: AppHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <header className="flex items-center gap-2 border-b border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex gap-1 lg:hidden">
        {MOBILE_VIEWS.map((view) => (
          <Button
            key={view}
            variant={currentView === view ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange(view)}
            className="capitalize"
          >
            {view}
          </Button>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <FilterBar
          filters={filters}
          onFiltersChange={onFiltersChange}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
        />
      </div>

      <Button variant="ghost" size="icon" onClick={onSync} disabled={isSyncing} aria-label="Refresh">
        <RefreshCw className={cn(isSyncing && 'animate-spin')} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCopilot}
        aria-label="Toggle assistant"
        aria-pressed={isCopilotOpen}
        className={cn(isCopilotOpen && 'bg-neutral-100 dark:bg-neutral-800')}
      >
        <Sparkles />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun /> : <Moon />}
      </Button>
    </header>
  );
}
