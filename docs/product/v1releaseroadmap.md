# V1 Release Roadmap

Last updated: 2026-04-22

## Purpose

This document defines the phased path from the current Next.js prototype to a production-ready v1 of Memetrest.

The roadmap prioritizes feature completeness and product maturity first. Comprehensive testing, QA hardening, and release certification are intentionally concentrated toward the end, while lightweight validation still happens during implementation to avoid building blind.

## Locked Product Decisions

- Primary v1 users: consumers and creators equally
- Content creation in v1: yes
- Initial content source: manually seeded by admin/operator
- Authentication in v1: custom email/password flow only
- Social login: out of scope for v1
- MFA: out of scope for v1
- User profile in v1: yes
- Editable profile fields: username, display name, bio, avatar
- Profile privacy in v1: yes
- Private profile behavior: only approved followers can view profile/posts
- Collections in v1: create, rename, delete, reorder, privacy, shareable public URLs
- Search in v1: meme caption/text, tags, creator names
- Search results UX: separate tabs
- Feed modes in v1: `For You`, `Following`, `Latest`, `Trending`
- Real interactions in v1: upload/post, save to board, follow creator
- Deferred interactions: share, download, comments, replies, notifications, activity feed
- Moderation/admin in v1: required
- Mandatory admin features: remove post, ban user, review reports, feature content, manage seeded content
- User reporting in v1: deferred, admin-only moderation workflow first
- Password reset in v1: yes
- Email verification in v1: optional/deferred
- Media in v1: image uploads only
- Media roadmap posture: build storage and content model so GIF/video can be added later

## Target V1 Outcome

At launch, a user should be able to:

- sign up and log in with email/password
- edit a personal public or private profile
- browse seeded content and user-generated content
- upload image memes immediately after signup
- view real meme detail pages
- search across memes, tags, and creators
- follow creators
- create and manage boards
- save memes into boards
- expose public boards through shareable URLs
- experience both desktop and mobile web flows cleanly

Admins should be able to:

- seed and manage content
- feature content
- remove content
- ban users
- manage moderation actions from an admin surface

## Recommended V1 Technical Direction

### Application

- Framework: Next.js App Router
- Hosting: Vercel
- Runtime preference: keep server-heavy business logic inside app routes/server components until scale requires service split

### Data

- Primary relational store: Supabase Postgres
- Principle: use Supabase as the managed Postgres provider, not as a hard architectural dependency
- Migrations: own schema migrations in the repo
- Data access: repository/service layer so DB provider can be swapped later

### Auth

- Custom email/password auth flow built by the app
- Password hashing, session issuance, logout, password reset, and auth guards handled in our backend
- Avoid tight coupling to Supabase Auth so migration remains simpler if needed

### Media

- V1 image storage: Vercel Blob
- Upload cap recommendation: 10 MB per image
- Abstract storage operations behind a media service so later migration to Cloudinary/S3-compatible storage stays manageable

### Search

- V1 search strategy: Postgres-driven search with indexed fields and tabbed result categories
- Later upgrade path: dedicated search engine only if product scale or relevance needs justify it

## Migration-Friendly Architecture Rules

These rules are mandatory because v1 will use Supabase Postgres but should remain portable:

- No feature code should depend directly on Supabase-specific queries outside a thin infrastructure layer.
- All persistence should sit behind repositories or service interfaces.
- Auth/session logic should be app-owned, not provider-owned.
- File storage should use a storage adapter interface.
- Route handlers should call domain services, not database clients directly.
- Core IDs and schema design should remain provider-neutral.
- Seed scripts and admin tools should use the same domain model as production flows.

## Phase Plan

## Phase 0: Product Foundation Lock

Goal: formalize the target product slice and clear the current prototype boundaries.

Deliverables:

- final v1 roadmap
- stack profile and architecture guardrails
- source-of-truth domain model for users, profiles, memes, follows, boards, board items, moderation actions
- route strategy for real entity pages such as meme detail, profile, board, and admin routes
- repo cleanup plan for leftover prototype artifacts and non-runtime folders

Why first:

- the current app still behaves like a polished prototype in most screens, so we need explicit contracts before implementation expands

## Phase 1: Core Platform Foundation

Goal: install the real production backbone without overbuilding.

Deliverables:

- Supabase Postgres wired as the primary relational database
- migration system committed to repo
- provider-neutral repository layer
- environment configuration for local, preview, and production
- custom auth/session foundation
- upload/storage abstraction
- canonical app entities and base CRUD services

Must be complete before:

- real feed
- real search
- real upload/posting
- real board membership

## Phase 2: Identity, Profiles, and Access Control

Goal: make user identity and privacy real.

Deliverables:

- signup
- login
- logout
- password reset
- session persistence
- profile creation on signup
- edit profile: username, display name, bio, avatar
- public/private profile behavior
- follower model and access rules for private profiles
- username uniqueness and edit policy
- protected routes and server-side authorization checks

Outcome:

- every content and board action can now be tied to a real user

## Phase 3: Content Creation and Seed Content Operations

Goal: turn the product into a real meme platform instead of a seeded gallery with hard-coded arrays.

Deliverables:

- meme/post creation flow for image uploads
- meme metadata model
- creator-owned posts
- admin/operator seed import path
- seeded content management flow
- publish state handling if needed internally
- storage lifecycle for uploaded assets
- real profile post lists

Constraints:

- creators can post immediately after signup
- v1 supports images only
- structure content/media pipeline so GIF/video can be added later

## Phase 4: Feed, Discovery, and Search

Goal: replace static discovery screens with real content retrieval.

Deliverables:

- home feed powered by real content
- feed mode switcher for `For You`, `Following`, `Latest`, `Trending`
- creator profile feed
- real meme detail route by ID
- related content logic
- search index/query implementation in Postgres
- separate search result tabs for `Memes`, `Creators`, and `Tags`
- real filters/sort behavior instead of decorative UI affordances

Success condition:

- a fresh user can browse real content across web and mobile layouts without encountering demo-only dead ends

## Phase 5: Boards, Saves, and Social Graph

Goal: complete the core retention loop.

Deliverables:

- save meme to board flow
- board create/rename/delete/reorder
- public/private board rules
- public board share URLs
- board detail pages
- follow creator flow
- following graph powering the `Following` feed tab

Out of scope for this phase:

- comments
- replies
- download
- external share integrations

## Phase 6: Admin and Moderation

Goal: make the product operable in production.

Deliverables:

- admin authentication/authorization
- admin panel
- remove post
- ban user
- feature content
- manage seeded content
- review moderation queue/workflow
- moderation audit trail

Important note:

- user reporting is deferred in v1, so moderation enters via admin operations first

## Phase 7: Production Hardening, QA, and Release

Goal: turn a feature-complete v1 into a release candidate.

Deliverables:

- end-to-end verification of signup, login, upload, feed, search, follow, save-to-board, board management, privacy, and admin flows
- automated test coverage for high-risk flows
- manual QA pass on desktop and mobile web
- performance pass
- accessibility pass
- security review
- observability setup
- deployment checklist
- rollback/runbook documentation
- production smoke checklist

This is the phase where comprehensive testing is prioritized heavily, per product direction.

## Work That Can Run In Parallel

- Phase 2 profile UX can start once Phase 1 auth/session contracts are defined
- Phase 3 upload UI and admin seed tooling can run in parallel after storage/domain contracts exist
- Phase 4 search UX and search query backend can run in parallel after content schema is stable
- Phase 6 admin UI can begin once moderation domain contracts are defined, even before all user-facing flows are finished

## Work That Must Stay Sequential

- database/auth foundation before real product features
- real content model before feed/search/detail implementation
- real board/save domain before final collections UX
- admin authorization before exposing moderation UI
- feature completeness before final hardening/release phase

## Explicit V1 Non-Goals

- social login
- MFA
- comments and conversation threads
- notifications
- activity feed
- GIF/video posting in v1
- external sharing integrations
- creator approval gate before posting

## Launch Readiness Criteria

V1 is ready for production when all of the following are true:

- users can sign up, log in, reset passwords, and maintain sessions
- creators can upload image memes successfully
- seeded and user-generated content appear in real feeds
- profiles, privacy rules, and follows work correctly
- boards and saves work with real persistence
- search returns real results across all v1 tabs
- admin moderation features are functional
- desktop and mobile web experiences are coherent and production-safe
- hardening and release checks in Phase 7 are passed

## Immediate Next Slice

Start with Phase 0 and Phase 1 together as the next execution block:

- lock the domain model
- formalize stack profile
- wire Supabase Postgres
- establish provider-neutral repositories
- define the custom auth/session architecture

That slice unlocks the rest of the roadmap without committing the app too tightly to any single backend provider.
