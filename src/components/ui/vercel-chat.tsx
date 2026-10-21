import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Send, Square, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { UIMessage } from 'ai';
import { cn } from '@/lib/utils';
import { useAIChat } from '@/hooks/useAIChat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const SUGGESTIONS = [
  'Show my unread emails',
  'Summarize the latest email',
  'Draft a reply to the open email',
  'Open the sent folder',
];

const getText = (msg: UIMessage): string =>
  msg.parts.map((part) => (part.type === 'text' ? part.text : '')).join('').trim();

export const VercelChat = memo(function VercelChat() {
  const { messages, sendMessage, setMessages, stop, status, error } = useAIChat();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const isBusy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, status]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    setInput('');
    sendMessage(trimmed);
  }, [isBusy, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const visibleMessages = messages.filter((msg) => getText(msg));

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-neutral-500">Ask me to find, open, draft or reply to email.</p>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => send(suggestion)}
                className="block w-full rounded-md border border-neutral-200 px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {visibleMessages.map((msg) => (
          <div key={msg.id} className={cn('flex', msg.role === 'user' && 'justify-end')}>
            <div
              className={cn(
                'max-w-[90%] break-words text-sm',
                msg.role === 'user'
                  ? 'whitespace-pre-wrap rounded-lg bg-accent-600 px-3 py-2 text-white'
                  : '[&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5'
              )}
            >
              {msg.role === 'user' ? getText(msg) : <ReactMarkdown>{getText(msg)}</ReactMarkdown>}
            </div>
          </div>
        ))}

        {status === 'submitted' && <p className="text-xs text-neutral-500">Thinking...</p>}
        {error && <p className="text-xs text-error">{error.message}</p>}
        <div ref={endRef} />
      </div>

      <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the assistant"
            rows={2}
            className="min-h-0 resize-none"
          />
          {isBusy ? (
            <Button size="icon" variant="outline" onClick={stop} aria-label="Stop">
              <Square />
            </Button>
          ) : (
            <Button size="icon" onClick={() => send(input)} disabled={!input.trim()} aria-label="Send">
              <Send />
            </Button>
          )}
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="mt-2 flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
          >
            <Trash2 className="h-3 w-3" />
            Clear chat
          </button>
        )}
      </div>
    </div>
  );
});
