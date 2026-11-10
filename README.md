# MailFlowAI

[![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://mail-flow-ai.vercel.app)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

**MailFlowAI** is a premium, AI-powered email assistant designed for high-performance productivity. Built with Next.js 15, React 19 and Tailwind CSS v4, it offers a seamless, agentic experience for managing your Gmail inbox through natural language.

![App Preview](screenshots/app-preview.png)

---

## ✨ Key Features

- **🤖 AI-Agentic Workflow**: A chat sidebar built on the Vercel AI SDK, streaming from Groq's `openai/gpt-oss-120b`. It receives your current view and recent emails as context and uses tool calls to open an email, switch between inbox, sent and drafts, or prefill a new message or reply. It never sends on its own: you review every draft.
- **⚡ Supercharged Interface**: Ultra-responsive layout with glassmorphic aesthetics, smooth transitions, and a premium dark-mode-first design.
- **🛡️ Google OAuth 2.0**: Authorization-code sign-in with Google using the `gmail.modify` scope, with tokens kept in `sessionStorage`.
- **🔄 Real-time Intelligence**: Periodic background sync with visual feedback, ensuring your inbox is always up to date.
- **🔍 Smart Filtering**: Instant subject, sender, and content filtering with persistent pagination.
- **⌨️ Keyboard Shortcuts**: `j`/`k` to move, `c` compose, `r` reply, `f` forward, `s` star, `e` archive, `u` mark unread, `#` delete and `/` to search.

---

## 🏗️ Visual Architecture

```mermaid
graph TD
    User((User)) -->|Natural Language| AI[MailFlowAI Assistant]
    User -->|Interacts| UI[Next.js 15 / React 19 Frontend]
    AI -->|Chat Sidebar| UI

    subgraph "Core Engine"
        UI -->|State| Store[Zustand Persistent Store]
        UI -->|Aesthetics| TW[Tailwind CSS v4]
    end

    subgraph "AI Layer"
        UI -->|Chat + App Context| Route["/api/chat route handler"]
        Route -->|streamText| Groq[Groq gpt-oss-120b]
        Groq -->|Streamed Tool Calls| UI
    end

    subgraph "Integration Layer"
        Store -->|Gmail API| API[Google Workspace Service]
        Store -->|Identity| Auth[Google OAuth 2.0]
    end

    API <-->|Secured REST| Gmail[Google Servers]
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+**
- **Google Cloud Project** with Gmail API enabled
- **OAuth 2.0 Client ID** (Web Application type) with `http://localhost:3000/auth/callback` as an authorized redirect URI
- **Groq API key** from [console.groq.com](https://console.groq.com)

### 1. Setup Environment

Clone the repository and install dependencies:

```bash
npm install
cp .env.example .env
```

Configure your `.env` with the following variables:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GMAIL_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_GMAIL_REDIRECT_URI=http://localhost:3000/auth/callback

# Groq AI API Key (server-side only)
GROQ_API_KEY=your-groq-api-key
```

`NEXT_PUBLIC_*` variables are inlined into the browser bundle, so the OAuth client secret is visible to the client. `NEXT_PUBLIC_GMAIL_REDIRECT_URI` falls back to `<origin>/auth/callback` when unset. `GROQ_API_KEY` is only read by the `/api/chat` route handler.

### 2. Run Locally

```bash
npm run dev
```

This starts the Next.js dev server. Visit `http://localhost:3000` to start your session.

---

## 🛠️ Technical Decisions

| Category | Decision | Rationale |
| :--- | :--- | :--- |
| **State** | **Zustand** | Minimal boilerplate, high performance, and built-in persistence for offline recovery. |
| **Framework** | **Next.js 15 (App Router)** | Route handler for the server-side chat endpoint and the OAuth callback page in one app. |
| **AI** | **Vercel AI SDK + Groq** | `useChat` streams from a `streamText` route handler, and typed tool calls drive UI actions while the API key stays on the server. |
| **Styling** | **Tailwind v4** | CSS-first configuration and lightning-fast build times. |
| **Auth** | **OAuth 2.0** | Industry-standard security with scoped access to Gmail data. |

---

## 🔮 Roadmap

- [ ] **Multi-account Routing**: Seamless switching between multiple Google accounts.
- [ ] **Threaded Conversations**: Advanced grouping of email chains.
- [ ] **Native Attachments**: Drag-and-drop file management through the AI assistant.
- [ ] **Draft Persistence**: Cloud-synced draft management.
- [ ] **E2E Stability**: Comprehensive Playwright test suite for critical flows.

---

*Built with ❤️ by the MailFlowAI Team.*
