# System Design

Last updated: 2026-04-22

## Scope

This document defines the architecture for Memetrest v1 as a production web application for creators and consumers, built on the existing Next.js codebase.

It covers:

- application structure
- runtime boundaries
- auth/session design
- database and storage boundaries
- route map
- domain modules
- admin/moderation architecture
- feed and search strategy
- implementation sequencing risks

## Architectural Summary

Memetrest v1 will be implemented as a modular monolith inside the Next.js App Router application.

This is the simplest architecture that satisfies the current product goals:

- one deployable unit on Vercel
- one relational source of truth in Postgres
- one image storage provider for uploaded media
- app-owned authentication and authorization
- provider-neutral service and repository boundaries so migration remains manageable

## High-Level Components

### User-Facing Web App

- Next.js App Router pages and layouts
- responsive screens for desktop and mobile web
- server components for read-heavy rendering
- client components for local interaction, upload UX, inline state, and optimistic actions where appropriate

### Route Handlers

- request entry points for mutations and selected read APIs
- thin adapters over domain services
- no persistence logic directly in handlers

### Domain Services

Primary application logic layer.

Expected service areas:

- auth
- profiles
- posts
- feeds
- search
- boards
- follows
- moderation
- admin seeding/import
- media

### Repositories

Persistence abstractions over Postgres-backed storage.

Expected repository areas:

- users
- sessions
- profiles
- posts
- post assets
- follows
- follow requests
- boards
- board items
- moderation actions
- featured content
- seed import jobs

### Media Storage Adapter

- upload coordination
- blob path/key generation
- asset metadata persistence handoff
- delete/replace support

### Admin Surface

- isolated route area under `/admin`
- server-side role enforcement
- admin workflows for moderation and seed content operations

## Runtime Boundary Decisions

### Why Modular Monolith

Chosen because:

- the current codebase is already a single Next.js app
- v1 scope is broad but not yet operationally large enough to justify microservices
- faster implementation and lower ops burden
- easier deployment on Vercel
- simpler debugging during the first production release

Deferred:

- separate feed/search worker services
- dedicated media processing service
- separate admin backend

## Proposed Code Boundaries

### App Layer

- `app/*`
- routes, layouts, route handlers, loading states

### UI Layer

- `components/*`
- view composition only
- no provider-specific access logic

### Domain Layer

Recommended target structure:

- `lib/auth/*`
- `lib/profiles/*`
- `lib/posts/*`
- `lib/feeds/*`
- `lib/search/*`
- `lib/boards/*`
- `lib/follows/*`
- `lib/moderation/*`
- `lib/media/*`
- `lib/shared/*`

### Infrastructure Layer

Recommended target structure:

- `lib/infrastructure/db/*`
- `lib/infrastructure/storage/*`
- `lib/infrastructure/session/*`
- `lib/infrastructure/config/*`

### Principle

- UI calls app actions/handlers
- handlers call domain services
- domain services call repositories/adapters
- repositories/adapters call infrastructure clients

## Domain Model Overview

This section defines the architectural entity set. Detailed table design should be completed in the data modeling phase.

### Core Entities

- `user`
  - system identity record
- `session`
  - app-owned authenticated session
- `profile`
  - public identity and privacy settings
- `post`
  - meme/content record
- `post_asset`
  - uploaded image metadata and storage references
- `follow`
  - accepted creator-consumer or user-user follow relationship
- `follow_request`
  - pending follow for private profiles
- `board`
  - user-owned collection container
- `board_item`
  - mapping from board to saved post
- `moderation_action`
  - admin audit of bans, removals, feature operations, and similar actions
- `featured_content`
  - records used to curate feed/discovery
- `seed_import_job`
  - import and seed content tracking

### Important Rules

- `profile` privacy and `board` privacy are independent
- `post` visibility in v1 is inherited from profile visibility at access time, not because posts themselves are private/public entities yet
- board shares are allowed only for public boards
- follows to private profiles require request/approval
- creator posting is immediate after signup

## Authentication and Session Design

### Requirements

- email/password signup
- email/password login
- logout
- password reset
- secure session persistence
- no MFA in v1
- social login deferred
- minimal provider lock-in

### Chosen Design

- store user credentials in Postgres
- hash passwords using a strong password hashing algorithm
- issue app-owned session records in Postgres
- store session identifier in a secure HTTP-only cookie
- rotate or revoke sessions server-side as needed

### Why This Design

- aligns with the requirement for custom auth
- avoids coupling core identity to Supabase Auth
- allows later database/provider migration with lower friction
- keeps authorization logic consistent across app and admin surfaces

### Password Reset

- password reset token table or token fields should be app-owned
- reset flow handled by the app backend
- email delivery integration can be selected later in implementation

### Authorization Model

Roles for v1:

- `user`
- `admin`

Primary authz checks:

- only owners can edit their profile
- only owners can manage their boards
- only owners can upload under their account
- only admins can access `/admin`
- only approved followers can see private profiles

## Database Strategy

### Provider

- Supabase as managed Postgres host

### Boundary Rule

- treat Postgres as the application dependency
- treat Supabase as hosting/infrastructure

### Query Strategy

- repositories hide SQL/ORM details
- services consume typed repository interfaces
- avoid Supabase-specific client usage in business logic

### Migration Strategy

- keep migrations in the repo
- make schema changes explicit and reversible
- avoid provider-specific auth/storage assumptions in schema

## Media Storage Design

### V1 Media Scope

- image uploads only
- 10 MB max recommended upload size

### Chosen Storage Flow

1. user starts upload from client UI
2. app route issues upload permission or coordinates upload target
3. image is uploaded to Vercel Blob
4. app stores the resulting asset metadata in `post_asset`
5. post creation completes only after asset metadata is persisted

### Why This Design

- simple for Vercel-hosted v1
- keeps uploaded binaries out of Postgres
- allows future replacement with another object store through adapter boundaries

### Forward Compatibility

- `post_asset` should support asset `type`, `mime_type`, `width`, `height`, `duration`, `size_bytes`
- v1 only uses images
- schema should not block GIF/video in later releases

## Feed Architecture

### Feed Modes

- `For You`
- `Following`
- `Latest`
- `Trending`

### V1 Strategy

#### Latest

- most recent accessible posts by creation time

#### Following

- recent accessible posts from followed profiles

#### Trending

- curated + engagement-informed feed
- start with a simple weighted score using saves/follows/featured flags once those signals exist

#### For You

- in v1, keep this simple and deterministic
- blend featured content, recency, accessible content, and light tag/profile relevance if available
- do not overbuild ML or recommendation systems in v1

### Access Filtering

Every feed query must filter by:

- profile privacy
- follower approval state
- moderation removal status

## Search Architecture

### Scope

- search memes
- search creators
- search tags

### Result UX

- separate tabs in the UI:
  - `Memes`
  - `Creators`
  - `Tags`

### V1 Implementation

- Postgres-based search with indexed text fields
- exact and prefix matching first
- optional lightweight ranking by recency/featured/popularity

### Why Not Dedicated Search Yet

- lower complexity
- lower cost
- adequate for initial v1 scale

## Collections and Saves Architecture

### Board Model

- board belongs to one owner
- board has privacy setting
- board has many board items
- board items reference posts

### Required Operations

- create board
- rename board
- delete board
- reorder board list
- save post to board
- remove post from board
- publish/share public board URL

### Public Board URLs

Recommended route:

- `/boards/[boardIdOrSlug]`

Access rule:

- public board: anyone can view
- private board: only owner can view

## Profile Privacy and Follow Requests

### Public Profile

- anyone can view profile and posts
- follow can be accepted immediately

### Private Profile

- non-approved users cannot view profile/posts
- follow creates `follow_request`
- owner approves or rejects request

### Required V1 Product Implication

- profile access checks must be centralized in service logic
- do not duplicate privacy rules in UI-only code

## Admin and Moderation Architecture

### Admin Route Area

Recommended route group:

- `/admin`

Recommended sections:

- `/admin/dashboard`
- `/admin/posts`
- `/admin/users`
- `/admin/featured`
- `/admin/seed-content`
- `/admin/moderation`

### Admin Role Enforcement

- enforced server-side on every admin route and action
- no client-only hiding as the security boundary

### V1 Moderation Operations

- remove post
- ban user
- feature content
- manage seeded content
- record moderation audit trail

### User Reporting

- deferred from v1 user flows
- moderation begins as admin-operated workflow only

## Proposed Route Map

### Public App

- `/`
  - home feed with feed mode switcher
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password/[token]`
- `/search`
  - tabs for memes, creators, tags
- `/m/[postId]`
  - real meme detail page
- `/u/[username]`
  - creator/user profile
- `/boards/[boardIdOrSlug]`
  - public/private board detail

### Authenticated User Area

- `/settings/profile`
- `/settings/privacy`
- `/settings/account`
- `/me/boards`
- `/me/follow-requests`
- `/upload`

### Admin Area

- `/admin`
- `/admin/posts`
- `/admin/users`
- `/admin/featured`
- `/admin/seed-content`
- `/admin/moderation`

## API and Mutation Boundary Recommendations

Mutations should enter through route handlers or server actions only after contracts are formalized.

Likely mutation families:

- auth
- profile updates
- avatar upload
- post creation
- board management
- board save/remove
- follow request / approve / reject
- admin moderation actions
- feature content actions
- seed import actions

## Security Considerations

### Required For V1

- strong password hashing
- secure session cookies
- server-side authorization
- ownership checks for profile/board/post operations
- admin role checks
- upload validation by MIME type and size
- moderation status filtering on reads

### Deferred But Not Forgotten

- MFA
- advanced abuse tooling
- user-generated reporting workflows

## Operational Considerations

### Deployment

- Vercel for app hosting
- Supabase-managed Postgres
- Vercel Blob for image storage

### Environments

- local
- preview
- production

### Required Environment Categories

- database connection
- session secret
- password reset secret/token config
- storage configuration
- app base URL

## Key Risks

- private profile and follow approval logic becoming inconsistent across feed/search/profile endpoints
- accidental provider lock-in if business logic starts calling Supabase-specific APIs directly
- upload flow complexity causing partial post creation unless media and post services are coordinated carefully
- overcomplicating feed ranking before basic retrieval and access control are stable
- admin access being hidden in UI but insufficiently protected server-side

## Deferred Decisions

- exact ORM/query library
- exact migration tool
- exact password reset email provider
- whether board URLs use slug only, ID only, or ID-plus-slug
- whether `For You` uses tag affinity in v1 or remains curated/heuristic only

## Recommended Next Phase

Hand off to:

- `sdlc-data-modeling`
- `sdlc-api-contracts`

The architecture is now stable enough to define the concrete schema and the mutation/read contracts without re-guessing the system boundaries.
