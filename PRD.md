# PRD: Human Benchmark Clone

**Status:** Ready for build
**Date:** 2026-06-23
**Owner:** vashutosh625@gmail.com

---

## Problem Statement

People want a quick, low-friction way to measure and track their cognitive abilities — reaction speed, memory, mental math, pattern recognition, and reasoning — and to understand how their performance compares to others. Existing options either require an account before you can play, don't persist your results, or show you a raw number with no context for whether it's good or bad. A user wants to (a) jump straight into a test without signing up, (b) keep a short history of how they're doing, (c) optionally sign in to keep results permanently across devices, and (d) see at a glance how their score stacks up against everyone else's.

## Solution

A responsive web app where any visitor can immediately play any of five cognitive tests as a guest, with their recent results saved locally. A single dashboard shows, per game, the user's average score and a bell curve positioning that average against the global average of all registered players. Users can sign in with Google to persist their full history across devices and contribute their scores to the global statistics. Guests who have been playing are prompted to import their local results when they first sign in.

The five tests: **Reaction Time, Number Memory, Verbal Memory, Pattern Recognition, Reasoning** — built and released one at a time, sharing a common scoring, storage, and dashboard pattern.

## User Stories

1. As a visitor, I want to start playing any game without creating an account, so that I can try the app with zero friction.
2. As a guest, I want my last 10 results per game saved on my device, so that I can see my recent performance without signing up.
3. As a guest, I want to see the score I just achieved immediately when a round ends, so that I get instant feedback.
4. As a guest, I want a minimal dashboard showing my average per game, so that I understand my typical performance.
5. As a guest, I want my average plotted on a bell curve against the global average, so that I can see how I compare to everyone else even before signing in.
6. As a guest who has played several rounds, I want to be prompted to import my local results when I first sign in, so that I don't lose the scores that motivated me to register.
7. As a guest, I want to decline importing my local results, so that scores from a shared/public computer don't pollute my account.
8. As a user, I want to sign in with my Google account, so that I can save my results without managing a password.
9. As a logged-in user, I want my complete play history stored, so that my results persist across devices and over time.
10. As a logged-in user, I want my dashboard average computed over my recent attempts, so that it reflects my current ability rather than old scores.
11. As a logged-in user, I want my scores to contribute to the global average, so that the comparison everyone sees is based on real players.
12. As a user, I want each game to show the attempt count alongside my average, so that I know how much data the average is based on.
13. As a user, I want the dashboard to always show my personal score even when there isn't enough global data, so that the dashboard is never empty.
14. As a user, I want the bell curve to appear only once a game has enough global plays, so that I'm not shown a statistically meaningless comparison.
15. As a user, I want a "comparison unlocks soon" message before the curve is available, so that I understand why it's not shown yet.
16. As a user playing Reaction Time, I want clear color cues (wait vs go), so that I can react correctly.
17. As a user, I want the app in dark mode by default with a clean minimal look, so that the experience is distraction-free.
18. As a user, I want each game identified by an icon and label, so that I can navigate the game grid easily.
19. As a user, I want the app to work on my phone's browser, so that I can play anywhere.
20. As a returning logged-in user, I want to see my up-to-date average and curve when I open the dashboard, so that my standing reflects my latest plays.
21. As a user, I want impossible scores rejected, so that the global statistics stay trustworthy.
22. As the product owner, I want games to share a common scoring and storage pattern, so that adding the remaining games is incremental and low-risk.

## Implementation Decisions

### Stack
- **Frontend:** Next.js + TypeScript, Tailwind CSS, shadcn/ui component library.
- **Backend:** Supabase (Postgres + Auth).
- **Hosting:** Vercel (app) + Supabase cloud, both on free tiers.
- **Theme:** Minimal monochrome; dark mode default. App chrome stays neutral. Games are identified by icon + label, not per-game colors. Semantic **state colors** (wait / go / success / fail) are permitted where a game's usability depends on them (notably Reaction Time's red→green cue). State colors and the single accent are defined as theme tokens so a re-skin is a token change.

### Games & Scoring
- Five games, released one at a time: Reaction Time, Number Memory, Verbal Memory, Pattern Recognition, Reasoning.
- **One stored record = one full game session result.** Per-trial mechanics (e.g., Reaction Time averaging 5 clicks) live entirely in the browser; only the final session number is persisted.
- Each game declares config in code: a `lower_is_better` flag (true for Reaction Time, false for memory/reasoning games), a display unit, and min/max sanity bounds.
- Exact per-game trial counts and precise scoring formulas are deliberately decided at build time for each game (the cross-game *pattern* is fixed; the specifics are not).

### Users, Auth & Data
- **Guest play:** results stored in `localStorage`, capped at the **last 10 records per game**.
- **Auth:** **Google OAuth only**, via Supabase Auth. No email/password, no magic links, no other providers in MVP.
- **Logged-in storage:** **full history retained** (no cap), one row per session: which game, the numeric score, timestamp, user.
- **Dashboard average:** computed over a **recent window (~last 10 sessions)** for both guests and logged-in users; logged-in users simply retain older rows too. Average is shown with its attempt count.
- **Guest → account migration:** on first sign-in, if local records exist, **prompt the user to import** them. After import or decline, clear `localStorage` to prevent re-import. Imported scores count toward global stats (they are real plays).

### Global Statistics & Bell Curve
- A **precomputed aggregate table, one row per game**, stores `count`, `sum`, and `sum_of_squares`. Mean and standard deviation are derived in O(1); the scores table is never scanned for the dashboard.
- The aggregate row is updated **incrementally on score insert** (DB trigger or RPC).
- The aggregate table is **publicly readable** (anonymous aggregate stats), so guests can render the bell curve from their local average against the global mean/stddev.
- The bell curve is approximated as a **normal distribution from mean + stddev** for the MVP (acknowledged that real distributions, e.g. reaction times, are right-skewed; histogram-shaped curves are a later option).
- The user's marker on the curve is their **recent-window average** (matching the dashboard headline), and the curve is centered on the **global average**.

### Cold-Start Gating
- The dashboard **always shows the user's own score/average** regardless of global data volume.
- The **bell curve is gated behind a minimum global sample size** (start at **≥ 30 sessions** for that game). Below the threshold, show a "Global comparison unlocks once more people have played" message instead of the curve.

### Integrity
- **Minimal anti-cheat:** server-side range/sanity checks reject physiologically impossible values (e.g., reaction time below a floor, absurd digit spans) via RPC validation or check constraints. No replay verification, server-authoritative timing, or signed payloads.

## Testing Decisions

A good test here asserts **external behavior, not implementation details** — given inputs, the observable result — so internals can be refactored freely. Since this is a greenfield repo with no prior art, the following seams are proposed, favoring the fewest, highest seams:

1. **Scoring/statistics seam (preferred, highest-value, pure functions):** The score-to-record transformation and the aggregate math (deriving mean and standard deviation from `count`/`sum`/`sum_of_squares`, and computing a normal-curve position for a given average) are pure functions with no I/O. Test them directly with table-driven cases: known inputs → known mean/stddev/curve position, including edge cases (n=0, n=1, all-equal scores, `lower_is_better` direction). This is the densest seam and should carry most coverage.
2. **Sanity-bounds validation seam:** The server-side validation that accepts/rejects a submitted score for a given game's bounds is a single decision function. Test boundary values (just inside/outside min and max) and impossible inputs.
3. **Guest storage seam:** The localStorage record store (append a result, enforce last-10 cap per game, read back for the dashboard, clear on import). Test the cap behavior and per-game isolation against a mocked storage interface.
4. **Migration seam:** The guest-import decision flow (detect local data present → import vs decline → clear local store). Test that decline preserves account state and clears local data, and import merges then clears.

Integration with Supabase Auth/DB (Google OAuth round-trip, trigger-based aggregate updates) is verified at a thin boundary; prefer keeping business logic out of the DB layer so the pure seams above carry the load.

## Out of Scope

- Native mobile apps (web/responsive only).
- Email/password auth, magic links, and any OAuth provider other than Google.
- Percentile/ranking numbers (replaced by the bell-curve comparison).
- Progress-over-time / historical charts (v2 — full history is stored so the data will be ready).
- Real histogram-shaped global distributions (MVP uses normal-curve approximation).
- Server-authoritative timing, replay verification, signed score payloads, or any non-minimal anti-cheat.
- Seeding synthetic/fake scores to make percentiles or curves look populated.
- Cross-device history for guests.

## Further Notes

- Games ship one at a time; the shared session-record + dashboard + aggregate pattern is built once and reused, so each new game is an incremental addition.
- Early on, global comparisons will be sparse by design — the cold-start gate keeps the app honest rather than showing meaningless curves.
- The ~30-session curve threshold and the ~10-session averaging window are starting values and can be tuned after observing real usage.
- Storing full history (despite averaging only a recent window) is a deliberate investment so v2 progress charts require no schema change.
