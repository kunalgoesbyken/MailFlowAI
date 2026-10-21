import { memo } from 'react';
import { Archive, Mail, MailOpen, Star, Trash2 } from 'lucide-react';
import { cn, formatDate, truncate } from '@/lib/utils';
import type { Email, FolderPaginationState } from '@/types/email';
import { Button } from '@/components/ui/button';

interface EmailActions {
  onStar: (emailId: string) => void;
  onArchive: (emailId: string) => void;
  onDelete: (emailId: string) => void;
  onToggleRead: (emailId: string, isRead: boolean) => void;
}

interface EmailListProps extends EmailActions {
  emails: Email[];
  selectedId: string | null;
  onSelectEmail: (email: Email) => void;
  pagination?: FolderPaginationState;
  onLoadMore?: () => void;
}

interface EmailRowProps extends EmailActions {
  email: Email;
  isSelected: boolean;
  onSelect: (email: Email) => void;
}

const SKELETON_ROWS = 10;

const EmailRow = memo(function EmailRow({
  email,
  isSelected,
  onSelect,
  onStar,
  onArchive,
  onDelete,
  onToggleRead,
}: EmailRowProps) {
  const isStarred = email.labels.includes('STARRED');
  const stopAnd = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onClick={() => onSelect(email)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(email)}
      className={cn(
        'group flex items-center gap-3 border-b border-neutral-100 px-4 py-2 text-sm dark:border-neutral-900',
        isSelected
          ? 'bg-accent-50 dark:bg-accent-600/20'
          : email.isUnread
            ? 'bg-white hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900'
            : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/40 dark:hover:bg-neutral-900'
      )}
    >
      <button
        onClick={stopAnd(() => onStar(email.id))}
        aria-label={isStarred ? 'Unstar' : 'Star'}
        className={cn('shrink-0', isStarred ? 'text-amber-500' : 'text-neutral-300 hover:text-neutral-500 dark:text-neutral-700')}
      >
        <Star className={cn('h-4 w-4', isStarred && 'fill-current')} />
      </button>

      <span className={cn('w-40 shrink-0 truncate sm:w-52', email.isUnread && 'font-semibold')}>
        {email.from.name || email.from.email}
      </span>

      <span className="min-w-0 flex-1 truncate">
        <span className={cn(email.isUnread && 'font-semibold')}>{email.subject || '(no subject)'}</span>
        <span className="text-neutral-500"> - {truncate(email.snippet || email.body, 90)}</span>
      </span>

      <span className="shrink-0 text-xs tabular-nums text-neutral-500 group-hover:hidden group-focus-within:hidden">
        {formatDate(email.date)}
      </span>

      <div className="hidden shrink-0 gap-0.5 group-hover:flex group-focus-within:flex">
        <Button variant="ghost" size="icon" aria-label="Archive" onClick={stopAnd(() => onArchive(email.id))}>
          <Archive />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Delete" onClick={stopAnd(() => onDelete(email.id))}>
          <Trash2 />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={email.isUnread ? 'Mark as read' : 'Mark as unread'}
          onClick={stopAnd(() => onToggleRead(email.id, email.isUnread))}
        >
          {email.isUnread ? <MailOpen /> : <Mail />}
        </Button>
      </div>
    </div>
  );
});

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-sm text-neutral-500">
      <p className="font-medium text-neutral-900 dark:text-neutral-100">No messages</p>
      <p>Nothing here, or nothing matches your filters.</p>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div aria-busy="true">
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3 dark:border-neutral-900">
          <div className="h-4 w-4 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 flex-1 rounded bg-neutral-100 dark:bg-neutral-900" />
        </div>
      ))}
    </div>
  );
}

export const EmailList = memo(function EmailList({
  emails,
  selectedId,
  onSelectEmail,
  pagination,
  onLoadMore,
  ...actions
}: EmailListProps) {
  const isLoading = pagination?.status === 'loading';

  if (isLoading && emails.length === 0) return <ListSkeleton />;
  if (emails.length === 0) return <EmptyState />;

  return (
    <div className="h-full overflow-y-auto">
      {emails.map((email) => (
        <EmailRow
          key={email.id}
          email={email}
          isSelected={selectedId === email.id}
          onSelect={onSelectEmail}
          {...actions}
        />
      ))}

      {pagination?.hasMore && (
        <div className="p-3 text-center">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? 'Loading...' : `Load more (${emails.length} loaded)`}
          </Button>
        </div>
      )}
    </div>
  );
});
