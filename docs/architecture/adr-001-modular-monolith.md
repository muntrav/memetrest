# ADR-001: Modular Monolith On Next.js

Date: 2026-04-22

## Status

Accepted

## Context

Memetrest v1 must ship quickly, stay affordable, run on Vercel, and support a broad but still early-stage feature set:

- auth
- creator uploads
- feeds
- search
- boards
- follows
- admin moderation

The current repository is already a single Next.js application.

## Decision

Build v1 as a modular monolith inside the Next.js App Router codebase.

Use internal domain and infrastructure boundaries rather than separate deployable services.

## Consequences

### Positive

- fastest path to feature-complete v1
- lowest operational complexity
- simplest deployment on Vercel
- easier debugging and developer velocity
- no premature service orchestration burden

### Negative

- tighter runtime coupling than a service-oriented design
- some future scaling work may require module extraction

### Mitigations

- keep explicit domain/service/repository boundaries
- avoid direct provider usage in UI/business logic
- isolate high-change domains behind interfaces
