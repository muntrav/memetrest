# ADR-003: Use Supabase Postgres And Vercel Blob Behind Provider-Neutral Adapters

Date: 2026-04-22

## Status

Accepted

## Context

The product needs:

- affordable Vercel-compatible hosting
- relational persistence
- image upload storage
- flexibility to migrate infrastructure later if needed

Supabase is selected as the managed Postgres provider for v1.
Vercel Blob is selected for v1 image storage.

## Decision

Use:

- Supabase as the managed Postgres host
- Vercel Blob as the image storage provider

Expose both only through infrastructure adapters and repository boundaries.

## Consequences

### Positive

- practical and cost-aware v1 hosting model
- simpler deployment with Vercel
- lower migration friction later
- clear separation between app logic and infrastructure providers

### Negative

- some adapter/repository work up front
- cannot take shortcuts with provider-specific convenience APIs in feature logic

### Mitigations

- enforce repository/service boundaries
- keep migrations app-owned
- model media assets and sessions independently of vendor-specific schemas
