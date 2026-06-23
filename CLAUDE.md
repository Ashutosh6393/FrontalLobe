# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repo is **pre-scaffold**. The only committed files are `PRD.md` (the full product spec) and `.gitignore`. There is no `package.json`, no source tree, and therefore **no build/lint/test commands yet** — do not invent them. When scaffolding, the agreed stack is Next.js + TypeScript + Tailwind CSS + shadcn/ui (frontend) and Supabase (Postgres + Auth). Read `PRD.md` before making architectural decisions; it is the source of truth for scope and the deferred-vs-MVP line.

Once the project is scaffolded, update this file with the real `dev` / `build` / `lint` / `test` commands and how to run a single test.

## What this app is

FrontalLobe is a Human Benchmark clone: five cognitive tests (Reaction Time, Number Memory, Verbal Memory, Pattern Recognition, Reasoning) that anyone can play as a guest, with an optional Google sign-in to persist results. A single dashboard shows, per game, the user's recent-window average plotted on a bell curve against the global average of all registered players.

## Architecture (the load-bearing decisions)

These are the cross-cutting invariants that span multiple files — get them right and the rest follows from the PRD.

- **One stored record = one full game session result.** Per-trial mechanics (e.g. Reaction Time averaging 5 clicks) live entirely in the browser; only the final numeric result per session is persisted. Every game collapses to a single number, which keeps storage, averaging, and the curve uniform across all five games.

- **Per-game config lives in code**, not the DB: a `lower_is_better` flag (true only for Reaction Time), a display unit, and min/max sanity bounds. "Better" means opposite directions per game, so anything ranking or positioning a score must consult this flag.

- **Two storage backends, one dashboard.** Guests store their **last 10 records per game in `localStorage`** (hard cap). Logged-in users store **full history** in Supabase (no cap). The dashboard UI is the same for both; only the data source differs. Averages for both are computed over a **recent window (~last 10 sessions)** — full history is retained for logged-in users purely to enable v2 progress charts without a schema change.

- **Global stats are a precomputed aggregate, never a table scan.** A single row per game holds `count`, `sum`, and `sum_of_squares`, updated incrementally on insert (DB trigger/RPC). Mean and standard deviation derive from those three counters in O(1). The bell curve is a **normal-distribution approximation from mean + stddev** — do not scan the scores table to draw it. This aggregate row is **publicly readable** so guests can render the curve from their local average.

- **The user's marker on the curve is their recent-window average** (matching the dashboard headline number), and the curve is centered on the global average. Keep these two numbers the same metric — never plot "best" while the headline shows "average".

- **Cold-start gate:** always show the user's own score/average; show the bell curve only once that game has **≥ ~30 global sessions**, otherwise a "comparison unlocks soon" message. The 30-session threshold and the 10-session averaging window are tunable starting values.

- **Guest → account migration:** on first Google sign-in, if local records exist, **prompt to import** (never silent). After import or decline, clear `localStorage` so it can't re-import. Imported scores count toward global stats.

- **Integrity is minimal by design:** server-side range/sanity checks reject physiologically impossible values (via RPC validation or check constraints). No replay verification, server-authoritative timing, or signed payloads — do not add these without revisiting the PRD.

## Auth

Google OAuth **only**, via Supabase Auth. No email/password, no magic links, no other providers in MVP. Guests who never sign in stay fully local and never contribute to global stats.

## Testing approach (per PRD)

Test **external behavior, not implementation details.** The highest-value seam is the **pure scoring/statistics functions** (record transformation; deriving mean/stddev from the three counters; computing curve position respecting `lower_is_better`) — carry most coverage there with table-driven cases including edge cases (n=0, n=1, all-equal scores). Other seams: sanity-bounds validation, the guest localStorage store (cap + per-game isolation), and the migration decision flow. Keep business logic out of the Supabase layer so these pure seams stay testable.

## Conventions

- **Theme:** minimal monochrome, **dark mode default**. App chrome is neutral; games are identified by icon + label, not per-game colors. **State colors** (wait/go/success/fail) are permitted only where a game's usability needs them (notably Reaction Time's red→go cue). Define accent and state colors as theme tokens so a re-skin is a token change.
- **Games ship one at a time.** Build the shared session-record + dashboard + aggregate pattern once; each new game is an incremental addition, not a new subsystem.

## Out of scope (don't build without revisiting the PRD)

Native mobile apps; non-Google auth; percentile/ranking numbers; progress-over-time charts (v2); histogram-shaped distributions; non-minimal anti-cheat; seeding fake scores; cross-device history for guests.
