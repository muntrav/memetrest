import type { PoolClient } from "pg";
import { query, transaction } from "@/lib/infrastructure/db/postgres";
import type {
  AuthSession,
  Profile,
  Session,
  SessionRecord,
  User,
  UserWithPassword
} from "@/lib/auth/types";

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  status: "active" | "banned";
  created_at: Date;
};

type ProfileRow = {
  user_id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  visibility: "public" | "private";
  follower_count: string | number;
  following_count: string | number;
  post_count: string | number;
};

type SessionRow = {
  id: string;
  user_id: string;
  expires_at: Date;
  revoked_at: Date | null;
};

type AuthSessionRow = UserRow &
  ProfileRow & {
    session_id: string;
    session_expires_at: Date;
  };

type PasswordResetTokenRow = {
  id: string;
  user_id: string;
  expires_at: Date;
  used_at: Date | null;
};

export function isUniqueViolation(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
  );
}

function numberFromPg(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at.toISOString()
  };
}

function mapUserWithPassword(row: UserRow): UserWithPassword {
  return {
    ...mapUser(row),
    passwordHash: row.password_hash
  };
}

function mapProfile(row: ProfileRow): Profile {
  return {
    userId: row.user_id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio || null,
    avatarUrl: row.avatar_url,
    visibility: row.visibility,
    followerCount: numberFromPg(row.follower_count),
    followingCount: numberFromPg(row.following_count),
    postCount: numberFromPg(row.post_count)
  };
}

function mapSession(row: SessionRow): SessionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    expiresAt: row.expires_at.toISOString(),
    revokedAt: row.revoked_at?.toISOString() ?? null
  };
}

function mapAuthSession(row: AuthSessionRow): AuthSession {
  return {
    user: mapUser(row),
    profile: mapProfile(row),
    session: {
      id: row.session_id,
      expiresAt: row.session_expires_at.toISOString()
    }
  };
}

const profileSelect = `
  p.user_id,
  p.username::text as username,
  p.display_name,
  p.bio,
  p.avatar_url,
  p.visibility,
  (select count(*) from follows f where f.followed_profile_id = p.id) as follower_count,
  (select count(*) from follows f where f.follower_profile_id = p.id) as following_count,
  (
    select count(*)
    from posts po
    where po.author_profile_id = p.id
      and po.status = 'published'
      and po.moderation_status = 'visible'
  ) as post_count
`;

export const authRepository = {
  async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    const result = await query<UserRow>(
      `
        select id, email::text as email, password_hash, role, status, created_at
        from users
        where email = $1
        limit 1
      `,
      [email]
    );

    return result.rows[0] ? mapUserWithPassword(result.rows[0]) : null;
  },

  async findUserById(userId: string): Promise<User | null> {
    const result = await query<UserRow>(
      `
        select id, email::text as email, password_hash, role, status, created_at
        from users
        where id = $1
        limit 1
      `,
      [userId]
    );

    return result.rows[0] ? mapUser(result.rows[0]) : null;
  },

  async findProfileByUserId(userId: string): Promise<Profile | null> {
    const result = await query<ProfileRow>(
      `
        select ${profileSelect}
        from profiles p
        where p.user_id = $1
        limit 1
      `,
      [userId]
    );

    return result.rows[0] ? mapProfile(result.rows[0]) : null;
  },

  async findProfileByUsername(username: string): Promise<Profile | null> {
    const result = await query<ProfileRow>(
      `
        select ${profileSelect}
        from profiles p
        where p.username = $1
        limit 1
      `,
      [username]
    );

    return result.rows[0] ? mapProfile(result.rows[0]) : null;
  },

  async createUserWithProfile(input: {
    email: string;
    passwordHash: string;
    username: string;
    displayName: string;
  }): Promise<{ user: User; profile: Profile }> {
    return transaction(async (client) => {
      const userResult = await client.query<UserRow>(
        `
          insert into users (email, password_hash)
          values ($1, $2)
          returning id, email::text as email, password_hash, role, status, created_at
        `,
        [input.email, input.passwordHash]
      );
      const userRow = userResult.rows[0];

      if (!userRow) {
        throw new Error("Failed to create user.");
      }

      const profileResult = await client.query<ProfileRow>(
        `
          insert into profiles (user_id, username, display_name)
          values ($1, $2, $3)
          returning
            user_id,
            username::text as username,
            display_name,
            bio,
            avatar_url,
            visibility,
            0 as follower_count,
            0 as following_count,
            0 as post_count
        `,
        [userRow.id, input.username, input.displayName]
      );
      const profileRow = profileResult.rows[0];

      if (!profileRow) {
        throw new Error("Failed to create profile.");
      }

      return {
        user: mapUser(userRow),
        profile: mapProfile(profileRow)
      };
    });
  },

  async createSession(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<Session> {
    const result = await query<SessionRow>(
      `
        insert into sessions (user_id, session_token_hash, expires_at, ip_address, user_agent)
        values ($1, $2, $3, $4, $5)
        returning id, user_id, expires_at, revoked_at
      `,
      [input.userId, input.tokenHash, input.expiresAt, input.ipAddress ?? null, input.userAgent ?? null]
    );
    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create session.");
    }

    const session = mapSession(row);
    return {
      id: session.id,
      expiresAt: session.expiresAt
    };
  },

  async findAuthSessionByTokenHash(tokenHash: string): Promise<AuthSession | null> {
    const result = await query<AuthSessionRow>(
      `
        select
          u.id,
          u.email::text as email,
          u.password_hash,
          u.role,
          u.status,
          u.created_at,
          ${profileSelect},
          s.id as session_id,
          s.expires_at as session_expires_at
        from sessions s
        join users u on u.id = s.user_id
        join profiles p on p.user_id = u.id
        where s.session_token_hash = $1
          and s.revoked_at is null
          and s.expires_at > now()
        limit 1
      `,
      [tokenHash]
    );

    return result.rows[0] ? mapAuthSession(result.rows[0]) : null;
  },

  async revokeSession(tokenHash: string): Promise<void> {
    await query(
      `
        update sessions
        set revoked_at = now(), updated_at = now()
        where session_token_hash = $1 and revoked_at is null
      `,
      [tokenHash]
    );
  },

  async updateProfile(
    userId: string,
    input: {
      username?: string;
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
    }
  ): Promise<Profile> {
    const result = await query<ProfileRow>(
      `
        update profiles
        set
          username = coalesce($2, username),
          display_name = coalesce($3, display_name),
          bio = coalesce($4, bio),
          avatar_url = coalesce($5, avatar_url),
          updated_at = now()
        where user_id = $1
        returning
          user_id,
          username::text as username,
          display_name,
          bio,
          avatar_url,
          visibility,
          (select count(*) from follows f where f.followed_profile_id = profiles.id) as follower_count,
          (select count(*) from follows f where f.follower_profile_id = profiles.id) as following_count,
          (
            select count(*)
            from posts po
            where po.author_profile_id = profiles.id
              and po.status = 'published'
              and po.moderation_status = 'visible'
          ) as post_count
      `,
      [userId, input.username ?? null, input.displayName ?? null, input.bio ?? null, input.avatarUrl ?? null]
    );
    const row = result.rows[0];

    if (!row) {
      throw new Error("Profile not found.");
    }

    return mapProfile(row);
  },

  async updatePrivacy(userId: string, visibility: "public" | "private"): Promise<Profile> {
    const result = await query<ProfileRow>(
      `
        update profiles
        set
          visibility = $2,
          follow_approval_required = ($2 = 'private'),
          updated_at = now()
        where user_id = $1
        returning
          user_id,
          username::text as username,
          display_name,
          bio,
          avatar_url,
          visibility,
          (select count(*) from follows f where f.followed_profile_id = profiles.id) as follower_count,
          (select count(*) from follows f where f.follower_profile_id = profiles.id) as following_count,
          (
            select count(*)
            from posts po
            where po.author_profile_id = profiles.id
              and po.status = 'published'
              and po.moderation_status = 'visible'
          ) as post_count
      `,
      [userId, visibility]
    );
    const row = result.rows[0];

    if (!row) {
      throw new Error("Profile not found.");
    }

    return mapProfile(row);
  },

  async createPasswordResetToken(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await query(
      `
        insert into password_reset_tokens (user_id, token_hash, expires_at)
        values ($1, $2, $3)
      `,
      [input.userId, input.tokenHash, input.expiresAt]
    );
  },

  async findPasswordResetToken(tokenHash: string): Promise<PasswordResetTokenRow | null> {
    const result = await query<PasswordResetTokenRow>(
      `
        select id, user_id, expires_at, used_at
        from password_reset_tokens
        where token_hash = $1
        limit 1
      `,
      [tokenHash]
    );

    return result.rows[0] ?? null;
  },

  async consumePasswordResetToken(input: {
    tokenId: string;
    userId: string;
    passwordHash: string;
  }): Promise<void> {
    await transaction(async (client: PoolClient) => {
      await client.query(
        `
          update users
          set password_hash = $2, updated_at = now()
          where id = $1
        `,
        [input.userId, input.passwordHash]
      );
      await client.query(
        `
          update password_reset_tokens
          set used_at = now()
          where id = $1 and used_at is null
        `,
        [input.tokenId]
      );
      await client.query(
        `
          update sessions
          set revoked_at = now(), updated_at = now()
          where user_id = $1 and revoked_at is null
        `,
        [input.userId]
      );
    });
  }
};
