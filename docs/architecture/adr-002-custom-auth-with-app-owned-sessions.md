# ADR-002: Custom Email/Password Auth With App-Owned Sessions

Date: 2026-04-22

## Status

Accepted

## Context

Product direction for v1 requires:

- custom email/password auth
- no MFA
- no social login
- low provider lock-in
- migration-friendly architecture even while using Supabase Postgres

Using a provider-owned auth system would accelerate some parts, but it would also increase coupling to that provider and complicate migration.

## Decision

Implement email/password auth in the application layer and store session records in Postgres.

Use secure password hashing and secure HTTP-only cookie sessions.

Do not make Supabase Auth the critical identity dependency for v1.

## Consequences

### Positive

- stronger portability
- clearer ownership of auth logic
- consistent authz model across app and admin
- easier migration away from Supabase if needed

### Negative

- more implementation effort than managed auth
- password reset and session management must be built by the app

### Mitigations

- keep auth logic isolated behind `auth` services
- keep session and password reset contracts explicit
- avoid scattering cookie/session logic across the app
