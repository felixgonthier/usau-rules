# USAU Rules Helper

AI-powered queryable helper for the 2026-2027 Official Rules of Ultimate (USA Ultimate).

Full rulebook indexed locally in 22 sections. Questions trigger a keyword search to find relevant sections, then sends only those chunks to Gemini for a cited answer.

**Free to run** — uses Google Gemini 2.5 Flash free tier (no credit card required, ~250 requests/day).

## Deploy to Vercel

### 1. Get a free Gemini API key

Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and create a key. No credit card needed.

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create usau-rules-helper --public --push
```

### 3. Deploy

```bash
npx vercel
```

Or connect the GitHub repo at [vercel.com/new](https://vercel.com/new).

### 4. Add your API key

In your Vercel project dashboard:
**Settings → Environment Variables → Add:**

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | your key from step 1 |

Redeploy after adding the key.

## Local Development

```bash
npm install
echo "GEMINI_API_KEY=your-key" > .env.local
npx vercel dev
```

## Free Tier Limits

Gemini 2.5 Flash free tier gives you:
- 10 requests per minute
- 250 requests per day
- 250,000 tokens per minute
- 1M token context window

More than enough for personal/team use.

## Stack

- Vite + React (frontend)
- Vercel Serverless Functions (API proxy to Gemini)
- Google Gemini 2.5 Flash (free tier)
- Local rules search (22 indexed sections from the official PDF)
