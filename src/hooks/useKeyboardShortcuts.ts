import { useEffect, useRef } from 'react';
import type { Email } from '@/types/email';

interface KeyboardShortcutHandlers {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (email: Email) => void;
  onBack: () => void;
  onCompose: () => void;
  onReply: (emailId: string) => void;
  onForward: (emailId: string) => void;
  onStar: (emailId: string) => void;
  onArchive: (emailId: string) => void;
  onDelete: (emailId: string) => void;
  onMarkUnread: (emailId: string) => void;
}

const isTypingTarget = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  return !!el && (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.isContentEditable);
};

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;

      const { emails, selectedEmailId, onSelectEmail, onBack, onCompose, onReply, onForward, onStar, onArchive, onDelete, onMarkUnread } =
        handlersRef.current;

      const moveSelection = (step: 1 | -1) => {
        const current = emails.findIndex((email) => email.id === selectedEmailId);
        const next = emails[Math.min(Math.max(current + step, 0), emails.length - 1)];
        if (next) onSelectEmail(next);
      };

      const withSelected = (action: (id: string) => void, closeAfter = false) => {
        if (!selectedEmailId) return;
        action(selectedEmailId);
        if (closeAfter) onBack();
      };

      const actions: Record<string, () => void> = {
        j: () => moveSelection(1),
        k: () => moveSelection(-1),
        c: onCompose,
        '/': () => document.getElementById('search-input')?.focus(),
        Escape: onBack,
        r: () => withSelected(onReply),
        f: () => withSelected(onForward),
        s: () => withSelected(onStar),
        e: () => withSelected(onArchive, true),
        '#': () => withSelected(onDelete, true),
        u: () => withSelected(onMarkUnread, true),
      };

      const action = actions[e.key];
      if (!action) return;
      e.preventDefault();
      action();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
