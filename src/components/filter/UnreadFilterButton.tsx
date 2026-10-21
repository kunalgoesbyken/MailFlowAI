import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UnreadFilterButtonProps {
  isUnread: boolean | undefined;
  onToggle: () => void;
}

export function UnreadFilterButton({ isUnread, onToggle }: UnreadFilterButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onToggle}
      aria-pressed={!!isUnread}
      className={cn(isUnread && 'border-accent-600 bg-accent-50 text-accent-700 hover:bg-accent-50 dark:bg-accent-600/20 dark:text-accent-400')}
    >
      Unread
    </Button>
  );
}
