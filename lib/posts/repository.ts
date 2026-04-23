import { query } from "@/lib/infrastructure/db/postgres";
import {
  decodeCreatorsCursor,
  decodeLatestCursor,
  decodeTagsCursor,
  decodeTrendingCursor,
  encodeCreatorsCursor,
  encodeLatestCursor,
  encodeTagsCursor,
  encodeTrendingCursor
} from "@/lib/posts/cursor";
import type {
  FeedMode,
  PageInfo,
  PostDetail,
  PostSummary,
  PublicCreator,
  SearchCreatorsResponse,
  SearchMemesResponse,
  SearchTab,
  SearchTagsResponse
} from "@/lib/posts/types";

type PostRow = {
  id: string;
  caption: string;
  overlay_text_top: string | null;
  overlay_text_bottom: string | null;
  visibility: "public" | "private";
  created_at: Date;
  creator_user_id: string;
  creator_username: string;
  creator_display_name: string;
  creator_avatar_url: string | null;
  asset_url: string;
  asset_width: number | null;
  asset_height: number | null;
  asset_mime_type: string;
  tags: string[] | null;
  save_count: string | number;
};

type PostDetailRow = PostRow & {
  moderation_status: "visible" | "removed";
  saved_board_ids: string[] | null;
};

type CreatorRow = {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
};

type TagRow = {
  tag: string;
  post_count: string | number;
};

type PostAccessRow = {
  id: string;
  visibility: "public" | "private";
  status: "draft" | "published" | "archived";
  moderation_status: "visible" | "removed";
  creator_user_id: string;
  creator_profile_visibility: "public" | "private";
  has_asset: boolean;
  viewer_follows_creator: boolean;
};

function numberFromPg(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

function mapCreator(row: {
  creator_user_id: string;
  creator_username: string;
  creator_display_name: string;
  creator_avatar_url: string | null;
}): PublicCreator {
  return {
    userId: row.creator_user_id,
    username: row.creator_username,
    displayName: row.creator_display_name,
    avatarUrl: row.creator_avatar_url
  };
}

function mapPostSummary(row: PostRow): PostSummary {
  return {
    id: row.id,
    caption: row.caption,
    overlayTextTop: row.overlay_text_top,
    overlayTextBottom: row.overlay_text_bottom,
    visibility: row.visibility,
    createdAt: row.created_at.toISOString(),
    creator: mapCreator(row),
    asset: {
      url: row.asset_url,
      width: row.asset_width ?? 1,
      height: row.asset_height ?? 1,
      mimeType: row.asset_mime_type,
      blurDataUrl: null
    },
    tags: row.tags ?? [],
    metrics: {
      saveCount: numberFromPg(row.save_count)
    }
  };
}

function mapPostDetail(row: PostDetailRow): PostDetail {
  return {
    ...mapPostSummary(row),
    boardSaveState: {
      savedBoardIds: row.saved_board_ids ?? []
    },
    moderation: {
      status: row.moderation_status === "removed" ? "removed" : "active",
      reason: null
    }
  };
}

const baseVisibilityClause = `
  po.status = 'published'
  and po.moderation_status = 'visible'
  and pa.id is not null
  and (
    viewer.viewer_user_id is not null and author.user_id = viewer.viewer_user_id
    or (
      po.visibility = 'public'
      and (
        author.visibility = 'public'
        or exists (
          select 1
          from follows f
          join profiles viewer_profile on viewer_profile.id = f.follower_profile_id
          where viewer_profile.user_id = viewer.viewer_user_id
            and f.followed_profile_id = author.id
        )
      )
    )
  )
`;

const postSelect = `
  po.id,
  po.caption,
  po.overlay_text_top,
  po.overlay_text_bottom,
  po.visibility,
  po.created_at,
  author.user_id as creator_user_id,
  author.username::text as creator_username,
  author.display_name as creator_display_name,
  author.avatar_url as creator_avatar_url,
  pa.public_url as asset_url,
  pa.width as asset_width,
  pa.height as asset_height,
  pa.mime_type as asset_mime_type,
  coalesce(tags.tags, '{}'::text[]) as tags,
  coalesce(save_counts.save_count, 0) as save_count
`;

const postFrom = `
  from posts po
  join profiles author on author.id = po.author_profile_id
  left join post_assets pa on pa.id = po.primary_asset_id
  left join lateral (
    select array_agg(pt.tag::text order by pt.tag::text asc) as tags
    from post_tags pt
    where pt.post_id = po.id
  ) tags on true
  left join lateral (
    select count(*) as save_count
    from board_items bi
    where bi.post_id = po.id
  ) save_counts on true
  cross join (
    select $1::uuid as viewer_user_id
  ) viewer
`;

function pageInfo<T>(
  rows: T[],
  limit: number,
  nextCursorFactory: (row: T) => string
): PageInfo {
  if (rows.length <= limit) {
    return {
      nextCursor: null,
      hasNextPage: false
    };
  }

  const lastVisibleRow = rows[limit - 1];

  return {
    nextCursor: nextCursorFactory(lastVisibleRow),
    hasNextPage: true
  };
}

export const postsRepository = {
  async listFeed(input: {
    viewerUserId?: string;
    mode: FeedMode;
    limit: number;
    cursor?: string;
  }): Promise<SearchMemesResponse> {
    const params: unknown[] = [input.viewerUserId ?? null];
    const filters = [baseVisibilityClause];

    if (input.mode === "following") {
      filters.push(`
        exists (
          select 1
          from follows f
          join profiles viewer_profile on viewer_profile.id = f.follower_profile_id
          where viewer_profile.user_id = viewer.viewer_user_id
            and f.followed_profile_id = author.id
        )
      `);
    }

    let orderBy = "po.created_at desc, po.id desc";
    let cursorDecoder: ((cursor: string) => { createdAt: string; id: string; saveCount?: number }) | null =
      null;
    let nextCursorFactory: (row: PostRow) => string = (row) =>
      encodeLatestCursor(row.created_at.toISOString(), row.id);

    if (input.mode === "trending") {
      orderBy = "save_counts.save_count desc, po.created_at desc, po.id desc";
      cursorDecoder = decodeTrendingCursor;
      nextCursorFactory = (row) =>
        encodeTrendingCursor(numberFromPg(row.save_count), row.created_at.toISOString(), row.id);
    } else {
      cursorDecoder = decodeLatestCursor;
    }

    if (input.cursor) {
      const decoded = cursorDecoder(input.cursor);

      if (input.mode === "trending") {
        params.push(decoded.saveCount ?? 0, decoded.createdAt, decoded.id);
        filters.push(`
          (
            save_counts.save_count < $2
            or (save_counts.save_count = $2 and po.created_at < $3)
            or (save_counts.save_count = $2 and po.created_at = $3 and po.id::text < $4)
          )
        `);
      } else {
        params.push(decoded.createdAt, decoded.id);
        filters.push(`
          (
            po.created_at < $2
            or (po.created_at = $2 and po.id::text < $3)
          )
        `);
      }
    }

    params.push(input.limit + 1);
    const result = await query<PostRow>(
      `
        select ${postSelect}
        ${postFrom}
        where ${filters.join("\n          and ")}
        order by ${orderBy}
        limit $${params.length}
      `,
      params
    );
    const visibleRows = result.rows.slice(0, input.limit);

    return {
      tab: "memes",
      items: visibleRows.map(mapPostSummary),
      pageInfo: pageInfo(result.rows, input.limit, nextCursorFactory)
    };
  },

  async search(input: {
    viewerUserId?: string;
    tab: SearchTab;
    queryText: string;
    limit: number;
    cursor?: string;
  }): Promise<SearchMemesResponse | SearchCreatorsResponse | SearchTagsResponse> {
    if (input.tab === "creators") {
      const params: unknown[] = [input.queryText.toLowerCase()];
      const filters = [
        `
          (
            lower(p.username::text) like '%' || $1 || '%'
            or lower(p.display_name) like '%' || $1 || '%'
          )
        `,
        `
          (
            p.visibility = 'public'
            or p.user_id = $2
          )
        `
      ];
      params.push(input.viewerUserId ?? null);

      if (input.cursor) {
        const decoded = decodeCreatorsCursor(input.cursor);
        params.push(decoded.username, decoded.userId);
        filters.push(`
          (
            p.username::text > $3
            or (p.username::text = $3 and p.user_id::text > $4)
          )
        `);
      }

      params.push(input.limit + 1);
      const result = await query<CreatorRow>(
        `
          select
            p.user_id,
            p.username::text as username,
            p.display_name,
            p.avatar_url
          from profiles p
          where ${filters.join("\n            and ")}
          order by p.username::text asc, p.user_id::text asc
          limit $${params.length}
        `,
        params
      );
      const visibleRows = result.rows.slice(0, input.limit);

      return {
        tab: "creators",
        items: visibleRows.map((row) => ({
          userId: row.user_id,
          username: row.username,
          displayName: row.display_name,
          avatarUrl: row.avatar_url
        })),
        pageInfo: pageInfo(result.rows, input.limit, (row) =>
          encodeCreatorsCursor(row.username, row.user_id)
        )
      };
    }

    if (input.tab === "tags") {
      const params: unknown[] = [input.viewerUserId ?? null, input.queryText.toLowerCase()];
      const filters = [
        baseVisibilityClause,
        `lower(pt.tag::text) like '%' || $2 || '%'`
      ];

      if (input.cursor) {
        const decoded = decodeTagsCursor(input.cursor);
        params.push(decoded.postCount, decoded.tag);
        filters.push(`
          (
            tag_counts.post_count < $3
            or (tag_counts.post_count = $3 and pt.tag::text > $4)
          )
        `);
      }

      params.push(input.limit + 1);
      const result = await query<TagRow>(
        `
          select
            pt.tag::text as tag,
            count(distinct po.id) as post_count
          from post_tags pt
          join posts po on po.id = pt.post_id
          join profiles author on author.id = po.author_profile_id
          left join post_assets pa on pa.id = po.primary_asset_id
          left join lateral (
            select count(*) as save_count
            from board_items bi
            where bi.post_id = po.id
          ) save_counts on true
          cross join (
            select $1::uuid as viewer_user_id
          ) viewer
          left join lateral (
            select count(distinct po_inner.id) as post_count
            from post_tags pt_inner
            join posts po_inner on po_inner.id = pt_inner.post_id
            join profiles author_inner on author_inner.id = po_inner.author_profile_id
            left join post_assets pa_inner on pa_inner.id = po_inner.primary_asset_id
            cross join (
              select $1::uuid as viewer_user_id
            ) viewer_inner
            where pt_inner.tag = pt.tag
              and po_inner.status = 'published'
              and po_inner.moderation_status = 'visible'
              and pa_inner.id is not null
              and (
                viewer_inner.viewer_user_id is not null and author_inner.user_id = viewer_inner.viewer_user_id
                or (
                  po_inner.visibility = 'public'
                  and (
                    author_inner.visibility = 'public'
                    or exists (
                      select 1
                      from follows f
                      join profiles viewer_profile on viewer_profile.id = f.follower_profile_id
                      where viewer_profile.user_id = viewer_inner.viewer_user_id
                        and f.followed_profile_id = author_inner.id
                    )
                  )
                )
              )
          ) tag_counts on true
          where ${filters.join("\n            and ")}
          group by pt.tag, tag_counts.post_count
          order by tag_counts.post_count desc, pt.tag::text asc
          limit $${params.length}
        `,
        params
      );
      const visibleRows = result.rows.slice(0, input.limit);

      return {
        tab: "tags",
        items: visibleRows.map((row) => ({
          tag: row.tag,
          postCount: numberFromPg(row.post_count)
        })),
        pageInfo: pageInfo(result.rows, input.limit, (row) =>
          encodeTagsCursor(numberFromPg(row.post_count), row.tag)
        )
      };
    }

    const params: unknown[] = [input.viewerUserId ?? null, input.queryText.toLowerCase()];
    const filters = [
      baseVisibilityClause,
      `
        (
          lower(po.caption) like '%' || $2 || '%'
          or coalesce(lower(po.overlay_text_top), '') like '%' || $2 || '%'
          or coalesce(lower(po.overlay_text_bottom), '') like '%' || $2 || '%'
          or lower(author.username::text) like '%' || $2 || '%'
          or lower(author.display_name) like '%' || $2 || '%'
          or exists (
            select 1
            from post_tags match_tags
            where match_tags.post_id = po.id
              and lower(match_tags.tag::text) like '%' || $2 || '%'
          )
        )
      `
    ];

    if (input.cursor) {
      const decoded = decodeLatestCursor(input.cursor);
      params.push(decoded.createdAt, decoded.id);
      filters.push(`
        (
          po.created_at < $3
          or (po.created_at = $3 and po.id::text < $4)
        )
      `);
    }

    params.push(input.limit + 1);
    const result = await query<PostRow>(
      `
        select ${postSelect}
        ${postFrom}
        where ${filters.join("\n          and ")}
        order by po.created_at desc, po.id desc
        limit $${params.length}
      `,
      params
    );
    const visibleRows = result.rows.slice(0, input.limit);

    return {
      tab: "memes",
      items: visibleRows.map(mapPostSummary),
      pageInfo: pageInfo(result.rows, input.limit, (row) =>
        encodeLatestCursor(row.created_at.toISOString(), row.id)
      )
    };
  },

  async findPostDetail(postId: string, viewerUserId?: string): Promise<PostDetail | null> {
    const result = await query<PostDetailRow>(
      `
        select
          ${postSelect},
          po.moderation_status,
          coalesce(saved_boards.saved_board_ids, '{}'::text[]) as saved_board_ids
        ${postFrom}
        left join lateral (
          select array_agg(distinct b.id::text order by b.id::text asc) as saved_board_ids
          from board_items bi
          join boards b on b.id = bi.board_id
          join profiles board_owner on board_owner.id = b.owner_profile_id
          where bi.post_id = po.id
            and board_owner.user_id = viewer.viewer_user_id
        ) saved_boards on true
        where po.id = $2
          and ${baseVisibilityClause}
        limit 1
      `,
      [viewerUserId ?? null, postId]
    );

    return result.rows[0] ? mapPostDetail(result.rows[0]) : null;
  },

  async probePostAccess(
    postId: string,
    viewerUserId?: string
  ): Promise<"accessible" | "forbidden" | "not_found"> {
    const result = await query<PostAccessRow>(
      `
        select
          po.id,
          po.visibility,
          po.status,
          po.moderation_status,
          author.user_id as creator_user_id,
          author.visibility as creator_profile_visibility,
          (pa.id is not null) as has_asset,
          exists (
            select 1
            from follows f
            join profiles viewer_profile on viewer_profile.id = f.follower_profile_id
            where viewer_profile.user_id = $2
              and f.followed_profile_id = author.id
          ) as viewer_follows_creator
        from posts po
        join profiles author on author.id = po.author_profile_id
        left join post_assets pa on pa.id = po.primary_asset_id
        where po.id = $1
        limit 1
      `,
      [postId, viewerUserId ?? null]
    );
    const row = result.rows[0];

    if (!row) {
      return "not_found";
    }

    if (
      row.status !== "published" ||
      row.moderation_status !== "visible" ||
      !row.has_asset
    ) {
      return "not_found";
    }

    if (viewerUserId && row.creator_user_id === viewerUserId) {
      return "accessible";
    }

    if (row.visibility === "private") {
      return "forbidden";
    }

    if (row.creator_profile_visibility === "public" || row.viewer_follows_creator) {
      return "accessible";
    }

    return "forbidden";
  }
};
