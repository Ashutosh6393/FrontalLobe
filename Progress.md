# Progress — Issue #1: Project scaffold & deploy skeleton

Spec: `docs/superpowers/specs/2026-06-24-project-scaffold-design.md`
Last updated: 2026-06-24

## Acceptance criteria (from issue #1)

- [x] Next.js + TypeScript project builds and runs locally — `pnpm build` passes (Next 16.2.9, React 19, TS 5.9).
- [x] Tailwind + shadcn/ui installed and rendering components — Tailwind v4 + shadcn/ui (Base UI, lucide); Button + Card; GameCard uses Card.
- [x] Dark mode default; accent + state colors (wait/go/success/fail) as theme tokens — `<html class="dark">`; `--state-*` tokens in `globals.css` mapped via `@theme inline` (`bg-state-go`, etc.). No hardcoded colors.
- [x] Supabase client configured from env vars (no secrets committed) — `src/lib/supabase/client.ts` (@supabase/ssr); `.env.example` committed; `.env.local` git-ignored.
- [x] Placeholder landing page with responsive icon+label game grid — `page.tsx` renders 5 `GameCard`s in a 1→2→3 col grid.
- [ ] App deployed to Vercel at a public URL — **pending (owner-interactive: needs your Vercel + Supabase accounts).**
- [x] CLAUDE.md updated with real dev/build/lint/test commands — done (Commands + Stack & layout sections).

## Architecture tasks

- [x] **1. Bootstrap** — Next.js App Router + TS + Tailwind v4 + ESLint, `src/`, `@/*`, pnpm. Native builds (`sharp`, `unrs-resolver`) approved in `pnpm-workspace.yaml`.
- [x] **2. Theme tokens + shadcn/ui** — shadcn init (Button, Card), dark default, `--state-wait/go/success/fail` + `--state-foreground` tokens.
- [x] **3. Vitest + games config** — Vitest + RTL (jsdom, native tsconfig paths), `test`/`test:watch` scripts, `src/lib/games.ts` (5 games, `enabled:false`) + unit test.
- [x] **4. GameCard + landing grid** — `src/components/game-card.tsx` + responsive grid in `page.tsx`.
- [x] **5. Supabase client + env** — `src/lib/supabase/client.ts` + `.env.example`.
- [~] **6. CLAUDE.md + deploy** — CLAUDE.md done; **Vercel deploy + Supabase project pending (owner-interactive).**

## Verification (last run 2026-06-24)

- `pnpm build` → exit 0 (`/` and `/_not-found` prerendered static)
- `pnpm test` → 6 passed (2 files: games config, GameCard)
- `pnpm lint` → exit 0

## Status

**5.5 of 6 tasks complete.** All code-side acceptance criteria met and verified. Only the Vercel deploy (+ creating the Supabase project for real env values) remains — these need your accounts and will be done step-by-step.

## Next step (needs you)

1. Create a free Supabase project → copy Project URL + anon key (Settings → API).
2. `cp .env.example .env.local`, paste the two values, then `pnpm dev` to confirm the dark game grid renders at http://localhost:3000.
3. Deploy: `pnpm dlx vercel` (login/link), add the two env vars, `pnpm dlx vercel --prod`.

## Notes / deviations

- `pnpm` installed via `npm i -g pnpm` (v11.9.0) — corepack lacked admin rights to write shims to `Program Files`.
- Next.js **16.2.9** is newer than the assistant's training data (`AGENTS.md` notes async `params`/`cookies`/`headers`, caching changes). None affect this static scaffold; later slices should consult `node_modules/next/dist/docs/`.
- Dropped `vite-tsconfig-paths` in favour of Vitest 4's native `resolve.tsconfigPaths`.
