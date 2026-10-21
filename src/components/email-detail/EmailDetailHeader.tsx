import { ArrowLeft, Archive, Forward, Mail, Reply, Star, Trash2 } from 'lucide-react';
import type { Email } from '@/types/email';
import { Button } from '@/components/ui/button';
import { ThreadParticipantsRow } from '@/components/ThreadParticipantsRow';
import { cn } from '@/lib/utils';

interface EmailDetailHeaderProps {
  email: Email;
  displayEmails: Email[];
  onBack: () => void;
  onReply: (emailId: string) => void;
  onForward: (emailId: string) => void;
  onStar: (emailId: string) => void;
  onArchive: (emailId: string) => void;
  onDelete: (emailId: string) => void;
  onMarkUnread: (emailId: string) => void;
}

export function EmailDetailHeader({
  email,
  displayEmails,
  onBack,
  onReply,
  onForward,
  onStar,
  onArchive,
  onDelete,
  onMarkUnread,
}: EmailDetailHeaderProps) {
  const isStarred = email.labels.includes('STARRED');

  return (
    <header className="shrink-0 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
      <div className="mb-2 flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft />
          Back
        </Button>
        <div className="ml-auto flex gap-0.5">
          <Button variant="ghost" size="icon" title="Reply (r)" aria-label="Reply" onClick={() => onReply(email.id)}>
            <Reply />
          </Button>
          <Button variant="ghost" size="icon" title="Forward (f)" aria-label="Forward" onClick={() => onForward(email.id)}>
            <Forward />
          </Button>
          <Button variant="ghost" size="icon" title="Star (s)" aria-label="Star" onClick={() => onStar(email.id)}>
            <Star className={cn(isStarred && 'fill-amber-500 text-amber-500')} />
          </Button>
          <Button variant="ghost" size="icon" title="Archive (e)" aria-label="Archive" onClick={() => onArchive(email.id)}>
            <Archive />
          </Button>
          <Button variant="ghost" size="icon" title="Mark unread (u)" aria-label="Mark unread" onClick={() => onMarkUnread(email.id)}>
            <Mail />
          </Button>
          <Button variant="ghost" size="icon" title="Delete (#)" aria-label="Delete" onClick={() => onDelete(email.id)}>
            <Trash2 />
          </Button>
        </div>
      </div>

      <h1 className="text-lg font-semibold">{email.subject || '(no subject)'}</h1>
      {displayEmails.length > 1 && <ThreadParticipantsRow messages={displayEmails} />}
    </header>
  );
}
