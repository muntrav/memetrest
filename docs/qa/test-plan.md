# Test Plan

## Scope

This migration replaces the HTML injection compatibility layer with typed React screen components, App Router routes, local Tailwind configuration, explicit Next.js navigation, and a real persisted collections slice.

## Main risks

- Visual drift while converting static HTML into JSX components.
- Broken route wiring between the six prototype screens.
- Reintroduction of the App Router runtime issues seen in the earlier compatibility build.
- Data corruption or invalid writes in the new collections persistence path.
- UI drift between the collections API contract and the server-rendered collections page.

## Automated coverage

- `components/screens/screens-routing.test.tsx`
- Verifies primary navigation targets on the desktop and mobile home screens.
- Verifies collections cards still route into the detail view.
- Verifies the detail screen links back into profile and collections flows.
- `lib/collections/repository.test.ts`
- Verifies filtered collection reads, summary generation, and persisted board creation.

## Verification commands

- `npm run build`
- `npm run test`
- `npm run lint`

## Manual checks

- Open `/`, `/search_discovery`, `/collections`, `/profile_page`, and `/meme_detail_view`.
- Confirm bottom navigation and sidebar navigation move between screens without full-page errors.
- Confirm feed and board cards open the meme detail view.
- Confirm the detail screen back button, profile link, and save-to-board link behave correctly.
- Open `/collections`, create a new board, and confirm it appears after the page refreshes.
- Open `/collections?filter=private` and confirm private boards are filtered correctly.

## Known gaps

- There is no pixel-diff or screenshot regression suite yet.
- Most non-routing decorative buttons outside collections still do not have backed application behavior.
