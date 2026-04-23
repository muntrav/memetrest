import type { PoolClient } from "pg";
import { query, transaction } from "@/lib/infrastructure/db/postgres";
import { isUniqueViolation } from "@/lib/auth/repository";
import { createBoardSlugCandidate } from "@/lib/boards/slug";
import type {
  Board,
  BoardDetail,
  BoardVisibility,
  CreateBoardInput,
  PageInfo,
  PublicCreator,
  UpdateBoardInput
} from "@/lib/boards/types";

type BoardRow = {
  id: string;
  title: string;
  slug: string | null;
  description: string;
  visibility: BoardVisibility;
  item_count: string | number;
  updated_at: Date;
  owner_user_id: string;
  owner_username: string;
  owner_display_name: string;
  owner_avatar_url: string | null;
};

type BoardOwnerRow = {
  board_id: string;
  owner_user_id: string;
};

type BoardPreviewRow = {
  board_id: string;
  preview_url: string;
};

type BoardItemRow = {
  post_id: string;
  position: number;
  saved_at: Date;
};

function numberFromPg(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

function mapOwner(row: BoardRow): PublicCreator {
  return {
    userId: row.owner_user_id,
    username: row.owner_username,
    displayName: row.owner_display_name,
    avatarUrl: row.owner_avatar_url
  };
}

function mapBoard(row: BoardRow): Board {
  return {
    id: row.id,
    name: row.title,
    slug: row.slug,
    description: row.description || null,
    visibility: row.visibility,
    itemCount: numberFromPg(row.item_count),
    updatedAt: row.updated_at.toISOString(),
    owner: mapOwner(row)
  };
}

function emptyPageInfo(): PageInfo {
  return {
    nextCursor: null,
    hasNextPage: false
  };
}

const boardSelect = `
  b.id,
  b.title,
  b.slug::text as slug,
  b.description,
  b.visibility,
  b.updated_at,
  (
    select count(*)
    from board_items bi
    where bi.board_id = b.id
  ) as item_count,
  owner.user_id as owner_user_id,
  owner.username::text as owner_username,
  owner.display_name as owner_display_name,
  owner.avatar_url as owner_avatar_url
`;

async function getOwnerProfileId(client: PoolClient, userId: string): Promise<string> {
  const result = await client.query<{ id: string }>(
    `
      select id
      from profiles
      where user_id = $1
      limit 1
    `,
    [userId]
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error("Profile not found.");
  }

  return row.id;
}

async function generateUniqueSlug(
  client: PoolClient,
  name: string,
  boardIdToExclude?: string
): Promise<string> {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = createBoardSlugCandidate(name, attempt);
    const params = boardIdToExclude ? [candidate, boardIdToExclude] : [candidate];
    const exclusionClause = boardIdToExclude ? "and id <> $2" : "";
    const result = await client.query<{ exists: boolean }>(
      `
        select exists(
          select 1
          from boards
          where slug = $1
            ${exclusionClause}
        ) as exists
      `,
      params
    );

    if (!result.rows[0]?.exists) {
      return candidate;
    }
  }

  throw new Error("Unable to generate a unique board slug.");
}

async function findBoardOwner(boardId: string): Promise<BoardOwnerRow | null> {
  const result = await query<BoardOwnerRow>(
    `
      select b.id as board_id, owner.user_id as owner_user_id
      from boards b
      join profiles owner on owner.id = b.owner_profile_id
      where b.id = $1
      limit 1
    `,
    [boardId]
  );

  return result.rows[0] ?? null;
}

async function findBoardRowById(
  client: PoolClient,
  boardId: string
): Promise<BoardRow | null> {
  const result = await client.query<BoardRow>(
    `
      select ${boardSelect}
      from boards b
      join profiles owner on owner.id = b.owner_profile_id
      where b.id = $1
      limit 1
    `,
    [boardId]
  );

  return result.rows[0] ?? null;
}

function uniqueSlugError() {
  const error = new Error("Slug already exists.");
  (error as Error & { code?: string }).code = "BOARD_SLUG_TAKEN";
  return error;
}

export const boardsRepository = {
  async listOwnBoards(userId: string): Promise<Board[]> {
    const result = await query<BoardRow>(
      `
        select ${boardSelect}
        from boards b
        join profiles owner on owner.id = b.owner_profile_id
        where owner.user_id = $1
        order by b.sort_order asc, b.updated_at desc, b.id asc
      `,
      [userId]
    );

    return result.rows.map(mapBoard);
  },

  async listOwnBoardPreviewImages(userId: string): Promise<Map<string, string[]>> {
    const result = await query<BoardPreviewRow>(
      `
        select preview.board_id, preview.preview_url
        from (
          select
            b.id as board_id,
            pa.public_url as preview_url,
            row_number() over (
              partition by b.id
              order by bi.sort_order asc, bi.saved_at desc, bi.id asc
            ) as row_num
          from boards b
          join profiles owner on owner.id = b.owner_profile_id
          join board_items bi on bi.board_id = b.id
          join posts po on po.id = bi.post_id
          join post_assets pa on pa.id = po.primary_asset_id
          where owner.user_id = $1
            and po.status = 'published'
            and po.moderation_status = 'visible'
        ) preview
        where preview.row_num <= 3
        order by preview.board_id asc, preview.row_num asc
      `,
      [userId]
    );

    const previews = new Map<string, string[]>();

    for (const row of result.rows) {
      const existing = previews.get(row.board_id) ?? [];
      existing.push(row.preview_url);
      previews.set(row.board_id, existing);
    }

    return previews;
  },

  async createBoard(userId: string, input: CreateBoardInput): Promise<BoardDetail> {
    return transaction(async (client) => {
      const ownerProfileId = await getOwnerProfileId(client, userId);
      const slug = await generateUniqueSlug(client, input.name);
      const insertResult = await client.query<{ id: string }>(
        `
          insert into boards (
            owner_profile_id,
            slug,
            title,
            description,
            visibility,
            sort_order
          )
          values (
            $1,
            $2,
            $3,
            $4,
            $5,
            coalesce(
              (
                select max(sort_order) + 1
                from boards
                where owner_profile_id = $1
              ),
              0
            )
          )
          returning id
        `,
        [
          ownerProfileId,
          slug,
          input.name,
          input.description ?? "",
          input.visibility ?? "private"
        ]
      );
      const insertedBoard = insertResult.rows[0];

      if (!insertedBoard) {
        throw new Error("Failed to create board.");
      }

      const row = await findBoardRowById(client, insertedBoard.id);

      if (!row) {
        throw new Error("Failed to create board.");
      }

      return {
        ...mapBoard(row),
        items: [],
        pageInfo: emptyPageInfo(),
        canEdit: true
      };
    });
  },

  async updateBoard(
    userId: string,
    boardId: string,
    input: UpdateBoardInput
  ): Promise<BoardDetail | "forbidden" | null> {
    const boardOwner = await findBoardOwner(boardId);

    if (!boardOwner) {
      return null;
    }

    if (boardOwner.owner_user_id !== userId) {
      return "forbidden";
    }

    return transaction(async (client) => {
      const nextSlug =
        input.slug !== undefined
          ? input.slug
          : input.name !== undefined
            ? await generateUniqueSlug(client, input.name, boardId)
            : null;

      try {
        const result = await client.query<BoardRow>(
          `
            update boards b
            set
              title = coalesce($2, b.title),
              description = coalesce($3, b.description),
              visibility = coalesce($4, b.visibility),
              slug = coalesce($5, b.slug),
              updated_at = now()
            from profiles owner
            where b.id = $1
              and owner.id = b.owner_profile_id
            returning ${boardSelect}
          `,
          [
            boardId,
            input.name ?? null,
            input.description ?? null,
            input.visibility ?? null,
            nextSlug
          ]
        );
        const updatedBoard = result.rows[0];

        if (!updatedBoard) {
          return null;
        }

        const row = await findBoardRowById(client, updatedBoard.id);

        if (!row) {
          return null;
        }

        return {
          ...mapBoard(row),
          items: [],
          pageInfo: emptyPageInfo(),
          canEdit: true
        };
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw uniqueSlugError();
        }

        throw error;
      }
    });
  },

  async reorderBoards(userId: string, boardIds: string[]): Promise<"ok" | "forbidden"> {
    return transaction(async (client) => {
      const ownerProfileId = await getOwnerProfileId(client, userId);
      const ownedBoardsResult = await client.query<{ id: string }>(
        `
          select id
          from boards
          where owner_profile_id = $1
          order by sort_order asc, id asc
        `,
        [ownerProfileId]
      );
      const ownedBoardIds = ownedBoardsResult.rows.map((row) => row.id);

      if (
        ownedBoardIds.length !== boardIds.length ||
        ownedBoardIds.some((boardId) => !boardIds.includes(boardId))
      ) {
        return "forbidden";
      }

      for (const [index, boardId] of boardIds.entries()) {
        await client.query(
          `
            update boards
            set sort_order = $2, updated_at = now()
            where id = $1 and owner_profile_id = $3
          `,
          [boardId, index, ownerProfileId]
        );
      }

      return "ok";
    });
  },

  async deleteBoard(
    userId: string,
    boardId: string
  ): Promise<"deleted" | "forbidden" | "not_found"> {
    const boardOwner = await findBoardOwner(boardId);

    if (!boardOwner) {
      return "not_found";
    }

    if (boardOwner.owner_user_id !== userId) {
      return "forbidden";
    }

    await query(
      `
        delete from boards
        where id = $1
      `,
      [boardId]
    );

    return "deleted";
  },

  async saveBoardItem(
    userId: string,
    boardId: string,
    postId: string
  ): Promise<BoardItemRow | "forbidden" | "not_found" | "exists"> {
    const boardOwner = await findBoardOwner(boardId);

    if (!boardOwner) {
      return "not_found";
    }

    if (boardOwner.owner_user_id !== userId) {
      return "forbidden";
    }

    try {
      const result = await query<BoardItemRow>(
        `
          insert into board_items (board_id, post_id, sort_order)
          values (
            $1,
            $2,
            coalesce(
              (
                select max(sort_order) + 1
                from board_items
                where board_id = $1
              ),
              0
            )
          )
          returning
            post_id,
            sort_order as position,
            saved_at
        `,
        [boardId, postId]
      );

      return result.rows[0] ?? "not_found";
    } catch (error) {
      if (isUniqueViolation(error)) {
        return "exists";
      }

      throw error;
    }
  },

  async removeBoardItem(
    userId: string,
    boardId: string,
    postId: string
  ): Promise<"deleted" | "forbidden" | "not_found"> {
    const boardOwner = await findBoardOwner(boardId);

    if (!boardOwner) {
      return "not_found";
    }

    if (boardOwner.owner_user_id !== userId) {
      return "forbidden";
    }

    const result = await query<{ post_id: string }>(
      `
        delete from board_items
        where board_id = $1
          and post_id = $2
        returning post_id
      `,
      [boardId, postId]
    );

    if (!result.rows[0]) {
      return "not_found";
    }

    return "deleted";
  },

  async findBoardDetail(
    boardIdOrSlug: string,
    viewerUserId?: string
  ): Promise<BoardDetail | "forbidden" | null> {
    const result = await query<BoardRow>(
      `
        select ${boardSelect}
        from boards b
        join profiles owner on owner.id = b.owner_profile_id
        where b.id::text = $1 or b.slug = $1
        limit 1
      `,
      [boardIdOrSlug]
    );
    const row = result.rows[0];

    if (!row) {
      return null;
    }

    const canEdit = viewerUserId === row.owner_user_id;

    if (row.visibility === "private" && !canEdit) {
      return "forbidden";
    }

    return {
      ...mapBoard(row),
      items: [],
      pageInfo: emptyPageInfo(),
      canEdit
    };
  }
};
