import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface EmailConfirmData {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
}

interface SendConfirmDialogProps {
  isOpen: boolean;
  emailData: EmailConfirmData;
  onConfirm: () => void;
  onCancel: () => void;
  isSending?: boolean;
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-14 shrink-0 text-neutral-500">{label}</span>
      <span className="min-w-0 break-all">{value}</span>
    </div>
  );
}

export function SendConfirmDialog({ isOpen, emailData, onConfirm, onCancel, isSending = false }: SendConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSending && onCancel()}>
      <DialogContent className="flex max-h-[80vh] max-w-xl flex-col">
        <DialogHeader>
          <DialogTitle>Send this email?</DialogTitle>
          <DialogDescription>Review the message before it goes out.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Field label="To" value={emailData.to} />
          <Field label="Cc" value={emailData.cc} />
          <Field label="Bcc" value={emailData.bcc} />
          <Field label="Subject" value={emailData.subject || '(no subject)'} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap break-words border-t border-neutral-200 pt-3 text-sm dark:border-neutral-800">
          {emailData.body || '(empty message)'}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSending}>
            {isSending && <Loader2 className="animate-spin" />}
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
