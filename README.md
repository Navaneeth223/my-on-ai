# OpenMind AI

Project banner placeholder

OpenMind AI is a production-ready, privacy-first AI chatbot built with Next.js 14, TypeScript, Tailwind CSS, Prisma, NextAuth, and local Ollama models. It supports streaming responses, web search, page browsing, file analysis, personas, chat history, and responsive UI polish without relying on paid model APIs.

## Features

- Local-first AI with Ollama-powered models like `llama3`, `mistral`, `gemma`, `codellama`, and `phi3`
- Real-time web search via DuckDuckGo with scraped source context and source cards
- URL browsing and readable content extraction with Cheerio and Axios
- File upload and analysis for PDF, TXT, MD, CSV, and JSON files
- Streaming chat responses with markdown, syntax highlighting, copy buttons, and playground links
- Conversation history with pin, rename, delete, and title generation
- Persona management for reusable system prompts
- Authentication with Google, GitHub, and email/password credentials
- Dark mode, responsive layout, animations, typing indicator, and keyboard shortcuts

## Screenshots

- Landing page screenshot placeholder
- Chat dashboard screenshot placeholder
- Settings screenshot placeholder

## Tech Stack

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, React Markdown
- Backend: Next.js Route Handlers, Prisma, NextAuth.js, Vercel AI SDK
- AI Runtime: Ollama running locally
- Search and Browse: DuckDuckGo, Axios, Cheerio
- Database: SQLite for local development, Supabase PostgreSQL for production
- State: Zustand

## Prerequisites

- Node.js 18+
- npm
- Ollama installed locally: `https://ollama.ai`

Recommended runtime: Node 20 LTS. This project has been validated more reliably there than on newer Node 24 builds for Prisma workflows on Windows.

## Install Ollama And Models

1. Install Ollama from `https://ollama.ai`
2. Start Ollama on your machine
3. Pull at least one model:

```bash
ollama pull llama3
```

You can also install additional models:

```bash
ollama pull mistral
ollama pull gemma
ollama pull codellama
ollama pull phi3
```

## Setup

1. Clone the repository and enter the project directory.
2. Copy the environment example:

```bash
cp .env.local.example .env.local
```

3. Fill in any OAuth credentials you want to use. Email/password auth works with only `NEXTAUTH_SECRET`.
4. Install dependencies:

```bash
npm install
```

Optional: if you use `nvm`, switch to the recommended runtime first:

```bash
nvm use
```

5. Generate the Prisma client and push the SQLite schema:

```bash
npx prisma generate
npx prisma db push
```

If `npx prisma db push` fails on newer Node versions on Windows, use the fallback bootstrap:

```bash
npm run db:init
```

6. Start the development server:

```bash
npm run dev
```

7. Open `http://localhost:3000`

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXTAUTH_SECRET` | Yes | Secret used to sign NextAuth sessions and JWTs |
| `NEXTAUTH_URL` | Yes | Base URL for NextAuth callbacks, usually `http://localhost:3000` locally |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | Optional | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | Optional | GitHub OAuth client secret |
| `DATABASE_URL` | Yes | Prisma database connection string, defaults to local SQLite |
| `OLLAMA_BASE_URL` | Yes | Local Ollama base URL, usually `http://localhost:11434` |

## Running Locally

```bash
npm install
npx prisma db push
npm run dev
```

Open `http://localhost:3000` and start chatting. If Ollama is not running, the UI will warn you and the models API will return `isRunning: false`.

## Local Troubleshooting

- If sign-in or conversation history fails, initialize the database first with `npx prisma db push` or `npm run db:init`.
- If chat requests fail, make sure Ollama is installed and available in your terminal:

```bash
ollama --version
ollama pull llama3
ollama serve
```

- If `/api/models` returns `isRunning: false`, the app is working but no local model backend is available yet.

## Deployment

### Vercel

1. Push the project to GitHub.
2. Import it into Vercel.
3. Add the environment variables from `.env.local.example`.
4. For production data, update `DATABASE_URL` to a Supabase PostgreSQL connection string.
5. Set `OLLAMA_BASE_URL` to a publicly reachable Ollama server. `http://localhost:11434` will not work on Vercel.
6. Deploy.

Note: Vercel can host the Next.js frontend and API routes, but the model runtime must live somewhere else. For production, point `OLLAMA_BASE_URL` to:

- a VPS running Ollama behind HTTPS
- a home server exposed securely with a reverse proxy
- a cloud VM with Ollama installed

The application backend does work on Vercel, but Ollama itself cannot run inside Vercel serverless functions.

### Supabase

1. Create a free Supabase project.
2. Copy the pooled PostgreSQL connection string.
3. Replace `DATABASE_URL`.
4. Update the Prisma datasource provider from `sqlite` to `postgresql` before deploying.

## Adding More Models

Install more models with:

```bash
ollama pull <model-name>
```

Then refresh the app or revisit the Settings page to see the updated model list.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run local checks
5. Open a pull request

## License

MIT
