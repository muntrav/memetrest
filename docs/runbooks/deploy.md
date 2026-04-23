# Deploy Runbook

Last updated: 2026-04-23

## Scope

This runbook documents the production secret and scheduler setup needed for the Memetrest keepalive heartbeat.

## Live Deployment

- production app: [https://memetrest.vercel.app](https://memetrest.vercel.app)
- GitHub repository: [https://github.com/muntrav/memetrest](https://github.com/muntrav/memetrest)
- heartbeat workflow runbook target: `POST /api/internal/heartbeat`

## Why This Exists

Supabase Free projects may be paused after low activity periods. The heartbeat setup avoids touching user-facing tables and gives the production app a dedicated external keepalive path.

## Components

- database table: `public.heartbeat`
- protected route: `/api/internal/heartbeat`
- external scheduler: GitHub Actions workflow at [.github/workflows/heartbeat.yml](/D:/Projects/memetrest/.github/workflows/heartbeat.yml)

## Required App Secrets

Set these in the deployed app environment:

- `DATABASE_URL`
- `HEARTBEAT_TOKEN`
- `HEARTBEAT_ROW_NAME`

Recommended values:

- `HEARTBEAT_ROW_NAME=project-keepalive`
- `HEARTBEAT_TOKEN` should be a long random secret, rotated if leaked

## Required GitHub Repository Secrets

Set these in the GitHub repository hosting this project:

- `HEARTBEAT_URL`
- `HEARTBEAT_TOKEN`

Recommended `HEARTBEAT_URL`:

- `https://<your-production-domain>/api/internal/heartbeat`

Current configured value:

- `https://memetrest.vercel.app/api/internal/heartbeat`

`HEARTBEAT_TOKEN` must match the deployed app's `HEARTBEAT_TOKEN`.

## Scheduler Behavior

- schedule: every 12 hours
- trigger: `workflow_dispatch` is also enabled for manual checks
- request method: `POST`
- auth method: `Authorization: Bearer <HEARTBEAT_TOKEN>`

## Verification Steps

1. Deploy the app with `HEARTBEAT_TOKEN` and `HEARTBEAT_ROW_NAME`.
2. Push the GitHub Actions workflow to the repository.
3. Add `HEARTBEAT_URL` and `HEARTBEAT_TOKEN` to repository secrets.
4. Run the workflow manually once.
5. Confirm the row updated:

```sql
select *
from public.heartbeat
where name = 'project-keepalive';
```

Current verified behavior:

- workflow dispatch succeeded from GitHub Actions
- the deployed endpoint accepted the bearer token
- `public.heartbeat` was updated with `source = 'github-actions'`

## Rotation Procedure

1. Generate a new random `HEARTBEAT_TOKEN`.
2. Update the deployed app environment variable.
3. Update the GitHub repository secret.
4. Re-run the heartbeat workflow manually.

## Failure Modes

- `401` means the scheduler sent no token
- `403` means the token does not match
- `500` usually means the deployed app is missing `HEARTBEAT_TOKEN` or cannot reach the database
- repeated workflow failures mean the keepalive path is not protecting the project

## Notes

- The repository is now pushed to GitHub under `muntrav/memetrest`.
- The Vercel project is linked to the GitHub repository for future deployments.
- External scheduling is preferred over an internal-only cron for inactivity protection because it creates real outside traffic against the deployed project.
