import { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VercelChat } from '@/components/ui/vercel-chat';
import { useAppStore } from '@/store';
import { isAuthenticated as checkAuthStatus } from '@/services/auth';

interface CopilotSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  width: number;
  onWidthChange: (width: number) => void;
}

const MIN_WIDTH = 280;
const MAX_WIDTH = 500;

export function CopilotSidebar({ isOpen, onClose, width, onWidthChange }: CopilotSidebarProps) {
  const storeAuthState = useAppStore((state) => state.isAuthenticated);
  const isAuthenticated = storeAuthState || checkAuthStatus();
  const [isResizing, setIsResizing] = useState(false);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const next = window.innerWidth - e.clientX;
      onWidthChange(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next)));
    };
    const stopResize = () => setIsResizing(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResize);
      document.body.style.userSelect = '';
    };
  }, [isResizing, onWidthChange]);

  if (!isOpen) return null;

  return (
    <aside
      className="fixed right-0 top-0 z-40 flex h-full max-w-full flex-col border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
      style={{ width }}
      aria-label="Assistant"
    >
      <div
        onMouseDown={startResize}
        className="absolute inset-y-0 left-0 w-1 cursor-ew-resize hover:bg-accent-500"
        aria-hidden="true"
      />

      <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <h2 className="text-sm font-medium">Assistant</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close assistant">
          <X />
        </Button>
      </div>

      <div className="min-h-0 flex-1">
        {isAuthenticated ? (
          <VercelChat />
        ) : (
          <p className="p-6 text-center text-sm text-neutral-500">Sign in with Google to use the assistant.</p>
        )}
      </div>
    </aside>
  );
}
