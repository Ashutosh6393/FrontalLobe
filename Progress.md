# Progress — Issue #1: Project scaffold & deploy skeleton

Spec: `docs/superpowers/specs/2026-06-24-project-scaffold-design.md`
Last updated: 2026-06-24

## Acceptance criteria (from issue #1)

- [x] Next.js + TypeScript project builds and runs locally — `pnpm build` passes (exit 0; `/` and `/_not-found` prerendered). Next 16.2.9, React 19, TS 5.9.
- [ ] Tailwind + shadcn/ui installed and rendering components — Tailwind v4 installed; **shadcn/ui not yet initialized**.
- [ ] Dark mode default; accent + state colors (wait/go/success/fail) as theme tokens — not started.
- [ ] Supabase client configured from env vars (no secrets committed) — not started.
- [ ] Placeholder landing page with responsive icon+label game grid — not started (still the create-next-app default page).
- [ ] App deployed to Vercel at a public URL — not started (needs owner's accounts).
- [ ] CLAUDE.md updated with real dev/build/lint/test commands — not started.

## Architecture tasks

- [x] **1. Bootstrap** — Next.js App Router + TS + Tailwind v4 + ESLint, `src/` dir, `@/*` alias, pnpm. Scaffolded via temp folder and merged into root (preserving `PRD.md`/`CLAUDE.md`/`docs/`/`.gitignore`). pnpm enabled via npm global install (corepack lacked admin rights). Native builds (`sharp`, `unrs-resolver`) approved in `pnpm-workspace.yaml` so `pnpm build` passes. Package renamed to `frontallobe`. Generated stub `CLAUDE.md` dropped; `AGENTS.md` (Next 16 agent rules) kept.
- [ ] **2. Theme tokens + shadcn/ui** — init shadcn (Button, Card), dark default on `<html>`, add `--state-wait/go/success/fail` + accent tokens to `globals.css` and `@theme inline`.
- [ ] **3. Vitest + games config** — Vitest + RTL harness, `pnpm test` script, `src/lib/games.ts` (5 games, `enabled:false`) with unit test.
- [ ] **4. GameCard + landing grid** — `src/components/game-card.tsx` + responsive grid in `page.tsx`.
- [ ] **5. Supabase client + env** — `src/lib/supabase/client.ts` (@supabase/ssr) + committed `.env.example`.
- [ ] **6. CLAUDE.md + deploy** — replace pre-scaffold note with real commands/layout; guided Supabase project + Vercel deploy (owner-interactive).

## Status

**1 of 7 tasks complete.** Bootstrap done and build-verified. Remaining: shadcn/theme, tests, games config, landing grid, Supabase wiring, CLAUDE.md, deploy.

## Notes / deviations

- `pnpm` was not installed; corepack couldn't write shims to `Program Files` (EPERM), so pnpm was installed via `npm install -g pnpm` (v11.9.0, user-space).
- Next.js **16.2.9** is newer than the assistant's training data; `AGENTS.md` warns of breaking changes (async `params`/`cookies`/`headers`, caching). None affect this static scaffold, but later slices should consult `node_modules/next/dist/docs/`.
- Baseline scaffold not yet committed at time of writing.
