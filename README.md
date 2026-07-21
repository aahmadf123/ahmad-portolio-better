# ahmadfx.xyz — cinematic portfolio

Ahmad Firas's portfolio: a scroll-driven, cinematic personal journey built on
Next.js 16 (App Router), TypeScript, Tailwind v4, framer-motion, GSAP, and
vanilla three.js. Deployed on Vercel.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (Turbopack)
npm run lint
```

## Editing content

All site content lives in typed data modules — no component surgery needed:

| What | Where |
| --- | --- |
| Identity, tagline, availability, Now Playing status | `src/lib/data/site.ts` |
| Jobs / experience | `src/lib/data/jobs.ts` |
| Projects (incl. flagship Football IQ) | `src/lib/data/projects.ts` |
| Skills + constellation | `src/lib/data/skills.ts` |
| Certifications (earned + in progress) | `src/lib/data/certs.ts` |
| Awards / affiliations / research / press | `src/lib/data/*.ts` |
| Story chapters | `src/lib/data/story.ts` |
| About lenses + sign-off | `src/lib/data/about.ts` |
| "Now" section | `src/lib/data/now.ts` |
| Testimonials (add real quotes here) | `src/lib/data/testimonials.ts` |
| Technical insight cards | `src/lib/data/insights.ts` |
| Field notes registry + MDX | `src/lib/field-notes.ts`, `src/content/field-notes/` |

The sitemap derives from these registries automatically.

## Ask Ahmad (AI assistant)

The floating chat is wired through the **Vercel AI Gateway** by default.

### Local development

Use the Vercel CLI to pull the project's OIDC token and environment variables:

```bash
npm install -D vercel
npx vercel link
npx vercel env pull .env.local
```

This creates `.env.local` with `VERCEL_OIDC_TOKEN`, which the `ai` SDK uses to authenticate AI Gateway requests. No separate AI Gateway API key is needed.

For deployed previews/production, enable **Secure Backend Access with OIDC Federation** in Vercel → Project → Settings → Security so `VERCEL_OIDC_TOKEN` is injected into Vercel Functions. Without it, the chat falls back to the "warming up" state unless you set `AI_GATEWAY_API_KEY`.

### Vercel deployment

Set env vars in Vercel → Project → Settings → Environment Variables:

| Variable | Required | Notes |
| --- | --- | --- |
| `VERCEL_OIDC_TOKEN` | auto | Pulled automatically by `vc env pull`; available in Vercel deployments |
| `AI_GATEWAY_API_KEY` | fallback | Vercel AI Gateway API key (used if `VERCEL_OIDC_TOKEN` is not set) |
| `ANTHROPIC_API_KEY` | fallback | Direct Claude key (used only if no gateway key / token) |
| `OPENAI_API_KEY` | fallback | Direct OpenAI key (used only if no Claude direct key) |
| `ASK_AHMAD_MODEL` | optional | Gateway model id, e.g. `openai/gpt-4o-mini` |
| `RATE_LIMIT_SECRET` | recommended | Random string; signs the rate-limit cookie |

Without a gateway token or direct provider key, the panel shows a "warming up" state with canned FAQ + email.

Abuse controls (no database): signed-cookie sliding window (10 messages /
10 min, 30 / day), a per-instance IP backstop, message count/length caps, and
a 600-token output cap. These bound cost but are best-effort on serverless —
**set a spend limit in the provider console** as the final backstop.

## Fonts

Display: Instrument Serif · Body: Figtree (stand-in for Satoshi) · Code:
JetBrains Mono · Handwritten: Caveat — all via `next/font`. To switch the body
font to Satoshi: download the variable WOFF2 from
[fontshare.com/fonts/satoshi](https://www.fontshare.com/fonts/satoshi), drop it
in `src/app/fonts/`, and swap the `Figtree` loader in `src/app/layout.tsx` for
`next/font/local`. Every component reads `var(--font-body)`.

## Asset pipeline

`node scripts/optimize-images.mjs` regenerates the optimized headshot,
favicons, and the OG card into `public/Images/optimized/` (commit the output).
