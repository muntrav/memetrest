# Data Model

## Collections slice

The current real slice is collections.

### Entity: `CollectionBoard`

- `id`: stable board identifier
- `title`: user-visible board name
- `itemCount`: number of saved memes in the board
- `previewImages`: image URLs used to render board previews
- `visibility`: `public` or `private`
- `tags`: lightweight organization metadata
- `updatedAt`: ISO timestamp used for recent sorting

### Persistence strategy

- Storage is file-backed JSON at `data/collections.json`.
- The repository layer in `lib/collections/repository.ts` is the only code allowed to read or write that file directly.
- The file-backed store is intentional for this stage because the app does not yet have a database dependency, but the repository boundary keeps the migration path to SQLite/Postgres straightforward.

### Derived data

- `boardCount`: number of boards in the store
- `totalItemCount`: sum of `itemCount`
- `privateBoardCount`: number of boards where `visibility === "private"`
- `taggedBoardPercentage`: percentage of boards with at least one tag

### Integrity rules

- Board titles must be trimmed and 2-60 characters long.
- Visibility must be `public` or `private`.
- Store payloads are validated on read before being returned to the app.
- New boards are prepended to the store and stamped with a generated UUID and `updatedAt`.

### Current API surface

- `GET /api/collections`
  Returns the collection snapshot and supports `filter=all|recent|private|organized`.

- `POST /api/collections`
  Creates a board with `{ title, visibility }`.

### Migration path

- Replace the JSON file store with a database-backed repository implementation.
- Keep the current `CollectionBoard` shape and API contract stable where possible.
- Move `itemCount` from a stored field to a derived aggregate once saved-meme entities exist.
