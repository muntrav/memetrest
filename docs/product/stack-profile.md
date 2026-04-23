# Stack Profile

Last updated: 2026-04-22

## Product Context

Memetrest v1 is a creator-and-consumer meme platform delivered as a responsive web app on desktop and mobile browsers.

## Core Stack Decisions

### Frontend

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Hosting: Vercel

### Backend Runtime

- Primary runtime location: Next.js server components and route handlers
- Architectural direction: modular monolith for v1
- Service split: deferred unless load, complexity, or organizational needs force separation

### Database

- Provider: Supabase
- Engine: Postgres
- Usage model: Supabase is the managed Postgres provider for v1, but the app should treat Postgres as the dependency, not Supabase-specific APIs
- Portability rule: all persistence must sit behind repository/service abstractions

### Authentication

- Auth style: custom app-owned email/password auth flow
- Social auth: deferred
- MFA: deferred
- Password reset: included in v1
- Email verification: optional/deferred for v1
- Session model: app-owned sessions with secure cookie handling
- Coupling rule: do not make Supabase Auth the critical dependency for the core auth model

### Media Storage

- V1 media type: images only
- V1 storage provider: Vercel Blob
- Upload recommendation: 10 MB max per image
- Forward-compatibility: storage service abstraction required so migration to another provider remains manageable

### Search

- V1 approach: Postgres-backed search
- Indexed fields: meme text/caption, tags, creator identity fields
- Result experience: separate tabs for Memes, Creators, and Tags
- Future evolution: dedicated search engine only if relevance/scale demands it

### Privacy and Access

- Boards: public or private
- Profiles: public or private
- Private profile rule: only approved followers can view private profile content

### Admin and Moderation

- Admin surface: required in v1
- Mandatory moderation capabilities:
  - remove post
  - ban user
  - review moderation queue/workflow
  - feature content
  - manage seeded content

## Architecture Guardrails

- Do not call provider-specific database APIs from UI components.
- Route handlers should call domain services, not embed business logic directly.
- Domain services should depend on interfaces/repositories, not infrastructure clients.
- Storage, auth/session, and persistence should each have replaceable adapters.
- Schema migrations must live in the repo and remain app-owned.
- Entity IDs, privacy rules, moderation states, and board relationships must remain provider-neutral.

## Expected V1 Entity Set

- user
- session
- profile
- post
- post_asset
- follow
- board
- board_item
- moderation_action
- featured_content
- seed_import_job

## Deployment Shape

- Local development: Next.js + local environment variables + provider-backed dev database/storage
- Preview: Vercel preview environment
- Production: Vercel production deployment
- Environment separation: local, preview, production must be distinct

## Known Deferred Decisions

- Exact ORM/query tool
- Exact migration tool
- Whether image transformation needs are handled by storage provider or app pipeline
- Whether admin lives inside the main app or under a dedicated route group
