import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolUIPart, type UIDataTypes, type UIMessage } from 'ai';
import { useAppStore } from '@/store';
import { useMemo } from 'react';
import type { ChatUITools } from '@/lib/chat-tools';

type ChatUIMessage = UIMessage<unknown, UIDataTypes, ChatUITools>;

export function useAIChat() {
  const {
    currentView,
    selectedEmailId,
    emails,
    getCurrentFilters,
    user,
    compose,
    setSelectedEmailId,
    setCurrentView,
    setCompose,
  } = useAppStore();

  const context = useMemo(() => ({
    currentView,
    selectedEmailId,
    filters: getCurrentFilters(),
    userEmail: user?.emailAddress,
    emailCount: {
      inbox: emails.inbox.length,
      sent: emails.sent.length,
    },
    recentEmails: [...emails.inbox, ...emails.sent]
      .slice(0, 10)
      .map((e) => ({
        id: e.id,
        subject: e.subject,
        from: e.from,
        date: e.date instanceof Date ? e.date.toISOString() : e.date,
        isUnread: e.isUnread,
        snippet: e.snippet?.slice(0, 100),
      })),
    composeOpen: compose.isOpen,
  }), [
    currentView,
    selectedEmailId,
    getCurrentFilters,
    user?.emailAddress,
    emails.inbox,
    emails.sent,
    compose.isOpen,
  ]);

  const openDraft = (to: string, subject: string, body: string) =>
    setCompose({
      isOpen: true,
      to,
      subject,
      body,
      cc: '',
      bcc: '',
      isSending: false,
      isAIComposed: true,
    });

  const runToolCall = (part: ChatUIMessage['parts'][number]) => {
    if (!isToolUIPart(part) || part.state !== 'output-available') return;

    switch (part.type) {
      case 'tool-openEmail':
        setSelectedEmailId(part.input.emailId);
        break;
      case 'tool-navigateView':
        setCurrentView(part.input.view);
        break;
      case 'tool-composeEmail':
        openDraft(part.input.to, part.input.subject, part.input.body);
        break;
      case 'tool-replyToEmail':
        setSelectedEmailId(part.input.emailId);
        openDraft('', '', part.input.body);
        break;
    }
  };

  const chat = useChat<ChatUIMessage>({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish: ({ message }) => {
      message.parts.forEach(runToolCall);
    },
  });

  const sendMessageWithContext = (text: string) =>
    chat.sendMessage({ text }, { body: { context } });

  return {
    ...chat,
    sendMessage: sendMessageWithContext,
  };
}
