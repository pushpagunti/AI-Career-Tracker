# Architecture

## Backend: Layered Architecture

Routes handle URL mapping only. Controllers handle HTTP concerns (parse request, call a service, shape the response). Services hold business logic and are the only layer that should require real unit testing. Models define data shape.

This separation means changing *how* something is calculated (e.g. the streak algorithm) never requires touching routing or HTTP-handling code, and vice versa.

## AI Integration: Provider-Agnostic Service Layer

Three AI-powered features (Career Recommendation, Roadmap Generator, Mock Interview) all route through a single `aiService.js`, which:

1. Selects an active provider (`mock` or `claude`) based on `AI_PROVIDER` env var — the Strategy pattern.
2. Builds a prompt from a dedicated prompt file per feature, always instructing the model to return only structured JSON.
3. Cleans common response artifacts (markdown code fences).
4. Parses and **validates the shape** of the response — not just that it's valid JSON, but that it matches the exact contract the feature expects.
5. Returns both the parsed result and the raw response (kept for debugging).

This means the mock provider and the real Claude provider are interchangeable with zero code changes elsewhere in the app — verified by the fact this project was built and fully tested end-to-end on the mock provider alone.

## Data Modeling: Embed vs. Reference Decisions

MongoDB schema design in this project consistently follows one rule: **embed data that is always accessed together with its parent and bounded in size; reference data that is queried independently, updated at a different frequency than its parent, or referenced by other parts of the system.**

Examples of this reasoning applied differently across the project:
- `Profile.education` is embedded (always shown with the profile, never queried alone).
- `Skill` is a separate collection, referenced by `userId` (queried independently by the AI recommendation engine, job matching, and the roadmap generator; updated far more frequently than the rest of a user's profile).
- `Resume.education`/`experience`/`projects` are embedded and **independent from** the user's live `Skill`/`Profile` data — a resume is a deliberate snapshot the user tailors per application, not a live mirror.
- `Roadmap.progressLinks` references `LearningItem` by ID rather than duplicating completion status — completion is always derived live from the linked item's actual status, never stored redundantly, to avoid two sources of truth drifting apart.

## Authentication

JWT stored in an httpOnly cookie (not localStorage), chosen specifically to prevent XSS-based token theft. Passwords are hashed with bcrypt via a Mongoose `pre('save')` hook, guarded by `isModified('password')` to prevent re-hashing on unrelated profile updates. Ownership checks on all user-scoped resources are baked directly into database queries (`{ _id, user: req.user.id }`) rather than performed as a separate check after fetching, so it's structurally impossible to forget.

## Notable Engineering Decisions

- **Streak calculation is computed on read, not stored as a counter** — a stored counter can't correctly handle backdated entries or multiple same-day entries; deriving it fresh from actual dates each time guarantees correctness.
- **Dashboard/analytics data is aggregated on read via MongoDB aggregation pipelines**, not pre-computed and cached — appropriate at this project's per-user data scale, and avoids the complexity and staleness risk of denormalized counters.
- **Rate limiting is tiered by endpoint risk/cost**: strict limits on auth (brute-force prevention) and AI endpoints (real per-call cost), generous limits on general browsing.