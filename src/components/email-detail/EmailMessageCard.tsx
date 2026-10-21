import DOMPurify from 'dompurify';
import { formatFullDate } from '@/lib/utils';
import type { Email } from '@/types/email';

interface EmailMessageCardProps {
  msg: Email;
}

const recipientNames = (people: Email['to']) => people.map((p) => p.name || p.email).join(', ');

export function EmailMessageCard({ msg }: EmailMessageCardProps) {
  return (
    <article className="border-b border-neutral-200 py-4 last:border-b-0 dark:border-neutral-800">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {msg.from.name || msg.from.email}
            {msg.from.name && <span className="font-normal text-neutral-500"> &lt;{msg.from.email}&gt;</span>}
          </p>
          <p className="truncate text-xs text-neutral-500">
            to {recipientNames(msg.to)}
            {msg.cc && msg.cc.length > 0 && `, cc ${recipientNames(msg.cc)}`}
          </p>
        </div>
        <time className="shrink-0 text-xs tabular-nums text-neutral-500">{formatFullDate(msg.date)}</time>
      </div>

      {msg.bodyIsHtml ? (
        <div className="email-body" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.body) }} />
      ) : (
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.body}</div>
      )}
    </article>
  );
}
