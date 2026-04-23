# Product Backlog

Last updated: 2026-04-22

## Ordering Principle

The backlog is ordered by feature maturity and product readiness first. Full release-grade testing is concentrated near the end, after the major user and admin workflows are real.

## P0: Foundation

- Define the production domain model for users, profiles, posts, follows, boards, board items, moderation actions, and featured content.
- Decide the real route model for entity pages and admin surfaces.
- Establish the stack profile and architecture guardrails.
- Clean up remaining prototype-only repo artifacts and separate them from production app code.

Dependencies:

- none

## P1: Platform Core

- Wire Supabase Postgres as the managed Postgres provider.
- Introduce repo-owned schema migrations.
- Add provider-neutral repository interfaces.
- Add storage abstraction for media.
- Add custom auth/session foundation.
- Define environment configuration for local, preview, and production.

Dependencies:

- P0

## P2: Identity and Profile System

- Implement signup, login, logout, and password reset.
- Create user profile records automatically.
- Implement profile editing for username, display name, bio, and avatar.
- Implement public/private profiles and follow-gated access for private profiles.
- Enforce authorization rules server-side.

Dependencies:

- P1

## P3: Content Creation and Seed Management

- Implement creator post flow for image uploads.
- Persist meme/post metadata and asset references.
- Implement seeded content import path.
- Add seeded content management capability for admins/operators.
- Render real post lists on creator profiles.

Dependencies:

- P1
- P2

## P4: Feed and Discovery

- Replace static home feed with real content retrieval.
- Implement feed modes: For You, Following, Latest, Trending.
- Implement real meme detail pages with unique content identity.
- Implement related content retrieval.
- Replace static discovery with real query-backed content views.

Dependencies:

- P3

## P5: Search

- Implement Postgres-backed search over memes, tags, and creators.
- Add separate result tabs for Memes, Creators, and Tags.
- Connect search page and search affordances to real results.

Dependencies:

- P3

## P6: Boards and Saves

- Implement save-to-board flow using real post and board records.
- Implement board create, rename, delete, and reorder.
- Implement public/private board behavior.
- Implement public board URLs.
- Add board detail pages.

Dependencies:

- P2
- P3

## P7: Social Graph

- Implement follow/unfollow creator flow.
- Feed Following tab from real follow relationships.
- Apply private profile follower access rules in browse flows.

Dependencies:

- P2
- P4

## P8: Admin and Moderation

- Implement admin authz boundary.
- Build admin panel shell.
- Add remove post, ban user, feature content, and seed content management.
- Add moderation queue/workflow and audit trail.

Dependencies:

- P2
- P3

## P9: Production Hardening and Release

- End-to-end validation of all critical flows.
- Security review.
- Performance review.
- Accessibility review.
- Observability and alerting setup.
- Deployment checklist and rollback plan.
- Final QA and release signoff.

Dependencies:

- P4
- P5
- P6
- P7
- P8

## Parallel Work Notes

- Profile UX can move in parallel with auth backend once the contracts are stable.
- Admin UI shell can start before all moderation actions are finished.
- Feed UI and feed retrieval can progress in parallel once the post model is fixed.
- Search UI can progress in parallel with the query implementation once the search contract is fixed.

## Explicitly Deferred

- Social login
- MFA
- Comments
- Replies
- Notifications
- Activity feed
- GIF uploads
- Video uploads
- Download flow
- External sharing integrations
- Creator approval gates before posting
