export type UserRole = "user" | "admin";
export type UserStatus = "active" | "banned";
export type ProfileVisibility = "public" | "private";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type Profile = {
  userId: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  visibility: ProfileVisibility;
  followerCount: number;
  followingCount: number;
  postCount: number;
};

export type Session = {
  id: string;
  expiresAt: string;
};

export type AuthSession = {
  user: User;
  profile: Profile;
  session: Session;
};

export type UserWithPassword = User & {
  passwordHash: string;
};

export type SessionRecord = {
  id: string;
  userId: string;
  expiresAt: string;
  revokedAt: string | null;
};

export type SignupInput = {
  email: string;
  password: string;
  username: string;
  displayName?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type UpdateProfileInput = {
  username?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
};

export type UpdatePrivacyInput = {
  visibility: ProfileVisibility;
};
