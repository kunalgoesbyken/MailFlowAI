import { Button } from '@/components/ui/button';

interface ErrorScreenProps {
  error?: string;
  onRetry: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-lg font-semibold">Could not start MailFlowAI</h1>
      <p className="max-w-md text-sm text-neutral-500">{error || 'Something went wrong. Please try again.'}</p>
      <Button
        onClick={() => {
          onRetry();
          window.location.reload();
        }}
      >
        Retry
      </Button>
    </div>
  );
}
