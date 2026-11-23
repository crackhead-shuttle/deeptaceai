# DEEPTRACE AI

A static GitHub Pages frontend with a secure Vercel serverless proxy for OpenAI.

## Deployment

1. Deploy this repository to Vercel.
2. In Vercel, add the environment variable `OPENAI_API_KEY` with your OpenAI API key.
3. Optionally set `OPENAI_MODEL` (default: `gpt-4o-mini`).
4. Copy the Vercel deployment URL.
5. Replace `https://YOUR-VERCEL-PROJECT.vercel.app` in `vercel.json` with that URL.
6. Enable GitHub Pages from repository Settings → Pages → Deploy from branch → `main` → `/ (root)`.

## Security

- Never place the OpenAI API key in `index.html` or GitHub Secrets used by Pages.
- Keep the key only in Vercel environment variables.
- Rotate the key if it has ever been shared or committed.
