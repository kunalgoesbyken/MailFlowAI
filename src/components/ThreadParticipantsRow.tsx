import type { EmailAddress } from '@/types/email';

interface ThreadParticipantsRowProps {
  messages: Array<{ from: EmailAddress; to?: EmailAddress[] }>;
}

export function ThreadParticipantsRow({ messages }: ThreadParticipantsRowProps) {
  const participants = new Map<string, string>();
  messages.forEach((msg) => {
    [msg.from, ...(msg.to ?? [])].forEach((person) => {
      const key = person.email.toLowerCase();
      if (!participants.has(key)) participants.set(key, person.name || person.email);
    });
  });

  return (
    <p className="truncate text-xs text-neutral-500">
      {participants.size} participants: {[...participants.values()].join(', ')}
    </p>
  );
}
