import { useEffect, useRef, useMemo, memo, useState } from 'react';
import { Forward, Loader2, Reply } from 'lucide-react';
import type { Email } from '@/types/email';
import { useEmails } from '@/hooks/useEmails';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { EmailDetailHeader } from '@/components/email-detail/EmailDetailHeader';
import { EmailMessageCard } from '@/components/email-detail/EmailMessageCard';

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
  onReply: (emailId: string) => void;
  onForward: (emailId: string) => void;
}

const COLLAPSE_THRESHOLD = 3;

export const EmailDetail = memo(function EmailDetail({ email, onBack, onReply, onForward }: EmailDetailProps) {
  const { fetchThread, starEmail, archiveEmail, deleteEmail, markAsRead } = useEmails();
  const activeThread = useAppStore((state) => state.activeThread);
  const isLoading = useAppStore((state) => state.isLoading);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchThread(email.threadId);
  }, [email.threadId, fetchThread]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeThread]);

  const displayEmails = useMemo(() => {
    if (!activeThread?.length || activeThread[0].threadId !== email.threadId) return [email];
    return [...activeThread].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [activeThread, email]);

  const isCollapsed = displayEmails.length > COLLAPSE_THRESHOLD && !isExpanded;
  const visibleEmails = isCollapsed
    ? [displayEmails[0], ...displayEmails.slice(-(COLLAPSE_THRESHOLD - 1))]
    : displayEmails;
  const hiddenCount = displayEmails.length - visibleEmails.length;
  const lastEmail = displayEmails[displayEmails.length - 1];

  const handleArchive = (id: string) => {
    archiveEmail(id);
    onBack();
  };

  const handleDelete = (id: string) => {
    deleteEmail(id);
    onBack();
  };

  const handleMarkUnread = (id: string) => {
    markAsRead(id, false);
    onBack();
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-950">
      <EmailDetailHeader
        email={email}
        displayEmails={displayEmails}
        onBack={onBack}
        onReply={onReply}
        onForward={onForward}
        onStar={starEmail}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onMarkUnread={handleMarkUnread}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto max-w-3xl">
          {visibleEmails.map((msg, index) => (
            <div key={msg.id}>
              {isCollapsed && index === 1 && (
                <Button variant="ghost" size="sm" className="my-2 w-full" onClick={() => setIsExpanded(true)}>
                  Show {hiddenCount} earlier {hiddenCount === 1 ? 'message' : 'messages'}
                </Button>
              )}
              <EmailMessageCard msg={msg} />
            </div>
          ))}
          {isLoading && (
            <p className="flex items-center gap-2 py-3 text-xs text-neutral-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading conversation
            </p>
          )}
        </div>
      </div>

      <footer className="flex shrink-0 gap-2 border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <Button variant="outline" onClick={() => onReply(lastEmail.id)}>
          <Reply />
          Reply
        </Button>
        <Button variant="outline" onClick={() => onForward(lastEmail.id)}>
          <Forward />
          Forward
        </Button>
      </footer>
    </div>
  );
});
