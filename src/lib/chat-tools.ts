import { tool, type InferUITools } from 'ai';
import { z } from 'zod';

const acknowledge = async () => ({ ok: true });

export const chatTools = {
  openEmail: tool({
    description: 'Open an email from the provided context.',
    inputSchema: z.object({ emailId: z.string() }),
    execute: acknowledge,
  }),
  navigateView: tool({
    description: 'Switch the mailbox view.',
    inputSchema: z.object({ view: z.enum(['inbox', 'sent', 'drafts']) }),
    execute: acknowledge,
  }),
  composeEmail: tool({
    description: 'Open the composer with a prefilled draft. The user reviews and sends it.',
    inputSchema: z.object({
      to: z.string(),
      subject: z.string(),
      body: z.string(),
    }),
    execute: acknowledge,
  }),
  replyToEmail: tool({
    description: 'Open the composer with a prefilled reply to an email from the provided context.',
    inputSchema: z.object({ emailId: z.string(), body: z.string() }),
    execute: acknowledge,
  }),
};

export type ChatUITools = InferUITools<typeof chatTools>;
