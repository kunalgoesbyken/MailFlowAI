import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center text-neutral-500">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading MailFlowAI
    </div>
  );
}
