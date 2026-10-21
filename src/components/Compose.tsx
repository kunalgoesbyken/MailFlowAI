import { useRef, useEffect, useState, memo } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { showSendSuccess, showSendError } from '@/lib/toast';

const MAX_BODY_LENGTH = 50000;
const COUNTER_THRESHOLD = 0.9;

const emailSchema = z.object({
  to: z.string().min(1, 'Recipient is required').email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().max(MAX_BODY_LENGTH, 'Message is too long'),
  cc: z.string().email('Invalid email address').optional().or(z.literal('')),
  bcc: z.string().email('Invalid email address').optional().or(z.literal('')),
});

type EmailForm = z.infer<typeof emailSchema>;

interface ComposeProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { to: string; subject: string; body: string; cc?: string; bcc?: string }) => Promise<void>;
  initialData?: Partial<EmailForm> & {
    isSending?: boolean;
    isAIComposed?: boolean;
  };
}

const toFormValues = (data?: ComposeProps['initialData']): EmailForm => ({
  to: data?.to || '',
  subject: data?.subject || '',
  body: data?.body || '',
  cc: data?.cc || '',
  bcc: data?.bcc || '',
});

export const Compose = memo(function Compose({ isOpen, onClose, onSend, initialData }: ComposeProps) {
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: toFormValues(initialData),
  });

  const { to, subject, body, cc, bcc } = initialData ?? {};

  useEffect(() => {
    reset(toFormValues({ to, subject, body, cc, bcc }));
    setShowCc(!!cc);
    setShowBcc(!!bcc);
  }, [to, subject, body, cc, bcc, reset]);

  useEffect(() => {
    if (isOpen) bodyRef.current?.focus();
  }, [isOpen]);

  const submit = handleSubmit(async (data) => {
    try {
      await onSend({
        to: data.to,
        subject: data.subject,
        body: data.body,
        cc: data.cc || undefined,
        bcc: data.bcc || undefined,
      });
      showSendSuccess(data.to);
      reset(toFormValues());
      onClose();
    } catch (error) {
      showSendError(error, submit);
    }
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isBusy = isSubmitting || !!initialData?.isSending;
  const bodyLength = watch('body')?.length ?? 0;
  const showCounter = bodyLength > MAX_BODY_LENGTH * COUNTER_THRESHOLD;
  const showAIBadge = initialData?.isAIComposed && !isDirty;
  const fieldClass = 'h-10 rounded-none border-0 border-b border-neutral-200 px-4 dark:border-neutral-800';

  return (
    <div
      role="dialog"
      aria-label="Compose email"
      onKeyDown={handleKeyDown}
      className="fixed inset-x-0 bottom-0 z-50 flex h-[75vh] flex-col border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 sm:inset-x-auto sm:right-4 sm:h-[480px] sm:w-[560px] sm:rounded-t-lg"
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <span className="text-sm font-medium">
          New message
          {showAIBadge && <span className="ml-2 text-xs font-normal text-accent-600">drafted by assistant</span>}
        </span>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X />
        </Button>
      </div>

      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <Input {...register('to')} type="email" placeholder="To" className={fieldClass} />
        {errors.to && <p className="px-4 py-1 text-xs text-error">{errors.to.message}</p>}

        {showCc && <Input {...register('cc')} type="email" placeholder="Cc" className={fieldClass} />}
        {errors.cc && <p className="px-4 py-1 text-xs text-error">{errors.cc.message}</p>}

        {showBcc && <Input {...register('bcc')} type="email" placeholder="Bcc" className={fieldClass} />}
        {errors.bcc && <p className="px-4 py-1 text-xs text-error">{errors.bcc.message}</p>}

        <Input {...register('subject')} placeholder="Subject" className={cn(fieldClass, 'font-medium')} />
        {errors.subject && <p className="px-4 py-1 text-xs text-error">{errors.subject.message}</p>}

        <Textarea
          {...register('body')}
          ref={(el) => {
            register('body').ref(el);
            bodyRef.current = el;
          }}
          placeholder="Write your message"
          className="min-h-0 flex-1 resize-none rounded-none border-0 px-4 py-3"
        />

        <div className="flex items-center gap-1 border-t border-neutral-200 px-3 py-2 dark:border-neutral-800">
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowCc((v) => !v)}>
            Cc
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowBcc((v) => !v)}>
            Bcc
          </Button>
          {showCounter && (
            <span className={cn('ml-2 text-xs tabular-nums', bodyLength > MAX_BODY_LENGTH ? 'text-error' : 'text-neutral-500')}>
              {bodyLength.toLocaleString()} / {MAX_BODY_LENGTH.toLocaleString()}
            </span>
          )}
          <Button type="submit" disabled={isBusy} className="ml-auto" title="Ctrl+Enter">
            {isBusy ? <Loader2 className="animate-spin" /> : <Send />}
            Send
          </Button>
        </div>
      </form>
    </div>
  );
});
