# API Contract Notes

Last updated: 2026-04-22

## Scope

This contract set covers the v1 consumer-visible REST surface for:

- auth and session lifecycle
- profile and privacy management
- image upload intent creation
- meme post creation and detail retrieval
- feed and search retrieval
- follow and follow-request flows
- board CRUD and save flows
- admin moderation and seed-import entry points

## Contract Conventions

- All routes are versioned under `/api/v1`.
- Authenticated routes use the app-owned session cookie `memetrest_session`.
- Collection endpoints use cursor pagination with `cursor`, `limit`, and `pageInfo`.
- Validation failures return a shared `ErrorResponse` envelope with machine-readable `error.code`.
- Public/private access rules are contract-visible through `403` responses rather than silent empty payloads.

## Upload Flow

Post creation is intentionally split into two steps:

1. `POST /api/v1/uploads/images` creates a short-lived upload intent for a single image.
2. `POST /api/v1/posts` promotes the uploaded temp asset into a real post.

This keeps blob-provider specifics outside the post contract and preserves a clean migration boundary if storage changes later.

## Deliberate V1 Exclusions

The following are intentionally out of scope for these v1 contracts:

- comments and replies
- public share/download endpoints
- social login and MFA
- user-submitted abuse reports
- GIF/video publishing contracts
- notifications and activity feed APIs

## Backend Implementation Expectations

- Route handlers should stay thin and map these contracts onto domain services.
- Auth, privacy, and moderation decisions should resolve to the documented error taxonomy.
- Search and feed services should return stable cursor behavior even if the ranking logic evolves internally.
- Supabase should remain behind repository boundaries so migration stays tractable.
