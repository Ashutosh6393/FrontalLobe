# Design: Project scaffold & deploy skeleton

**Date:** 2026-06-24
**Issue:** [#1 — Project scaffold & deploy skeleton](https://github.com/Ashutosh6393/FrontalLobe/issues/1)
**Status:** Approved for planning

## Goal

Stand up the application shell that every later slice builds on: a Next.js +
TypeScript app styled with Tailwind v4 and shadcn/ui, dark mode by default, a
minimal monochrome theme exposed as tokens, the Supabase client wired from env,
a placeholder game-grid landing page (icon + label per game), and a proven
deploy pipeline to Vercel.

This is prefactoring — make later changes easy. **No game logic, auth, or
storage in this slice.**

## Decisions (confirmed with owner)

- **Package manager:** pnpm.
- **Tailwind:** v4 (current `create-next-app` default; shadcn supports it).
- **Router:** Next.js App Router, `src/` dir, `@/*` import alias.
- **Testing:** Vitest set up this slice with one smoke test so `pnpm test` is real.
- **Account-bound steps (Supabase project, Vercel deploy):** done step-by-step
  with the owner in-session (interactive logins can't be automated). Code +
  `.env.example` + deploy notes are prepared so the owner just runs the steps.

## Architecture

### 1. Project bootstrap
- `create-next-app`: TypeScript, Tailwind v4, App Router, ESLint, `src/` dir,
  `@/*` alias, pnpm.
- Extend the existing Next-ready `.gitignore` rather than replacing it.

### 2. Theme tokens (load-bearing)
- Dark mode is the default (`<html class="dark">`). No light/dark toggle this
  slice.
- shadcn/ui theme via CSS variables for neutral chrome. **In addition**, define
  semantic state tokens required by the PRD:
  `--state-wait`, `--state-go`, `--state-success`, `--state-fail`, plus a single
  `--accent`. Expose them to Tailwind so `bg-state-go`, `text-state-fail`, etc.
  work. Nothing hardcoded — a re-skin is a token change.
- Initialize shadcn/ui with a small base set (Button, Card) to prove components
  render.

### 3. Landing page — game grid
- Responsive grid: 1 col on mobile → 2/3 cols at larger breakpoints.
- One `GameCard` per game: lucide icon + label only (no per-game color), per
  CLAUDE.md convention.
- Game list lives in a single `src/lib/games.ts` config array — the seam where
  future per-game config (`lower_is_better`, unit, sanity bounds) will grow.
  Seed now with `id`, `label`, `icon`, `description`, `enabled: false`. Cards are
  non-interactive placeholders this slice.
- Five games: Reaction Time, Number Memory, Verbal Memory, Pattern Recognition,
  Reasoning.

### 4. Supabase client
- `src/lib/supabase/client.ts` browser client reading
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` from env.
- Commit `.env.example`; real `.env.local` stays git-ignored. No secrets
  committed. Client is wired but unused this slice.

### 5. Testing harness
- Vitest + React Testing Library config and one smoke test (e.g. games config
  has 5 entries / landing renders all cards). `pnpm test` runs it.

### 6. Deploy (step-by-step with owner)
- Prepare `.env.example` and a deploy section in CLAUDE.md.
- When code is ready, pause and walk the owner through: create the Supabase
  project (capture URL + anon key), then `vercel` deploy with env vars set —
  run via `! <command>` so output lands in-session.

### 7. CLAUDE.md update
- Replace the "pre-scaffold / no commands yet" note with real
  `pnpm dev | build | lint | test` commands, how to run a single test, and the
  actual source-tree layout.

## Acceptance criteria (from issue #1)

- [ ] Next.js + TypeScript project builds and runs locally
- [ ] Tailwind + shadcn/ui installed and rendering components
- [ ] Dark mode is the default; accent + state colors (wait/go/success/fail)
      defined as theme tokens, not hardcoded
- [ ] Supabase client configured from environment variables (no secrets committed)
- [ ] Placeholder landing page shows a responsive game grid with icon + label per game
- [ ] App is deployed to Vercel and reachable at a public URL
- [ ] CLAUDE.md updated with real dev/build/lint/test commands

## Out of scope (this slice)

Game logic; auth flow; localStorage/DB storage; aggregate tables; dashboard or
bell curve. These land in later slices on top of this shell.
