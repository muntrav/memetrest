import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/shared/api-error";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  authRepository,
  isUniqueViolation
} from "@/lib/auth/repository";
import {
  createOpaqueToken,
  createPasswordResetExpiry,
  createSessionExpiry,
  hashOpaqueToken,
  sessionCookieName
} from "@/lib/auth/session";
import type {
  AuthSession,
  LoginInput,
  SignupInput,
  UpdatePrivacyInput,
  UpdateProfileInput
} from "@/lib/auth/types";

function defaultDisplayName(username: string): string {
  return username
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function requestIp(request: NextRequest): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

function requestUserAgent(request: NextRequest): string | null {
  return request.headers.get("user-agent");
}

async function createSessionForUser(userId: string, request: NextRequest) {
  const rawToken = createOpaqueToken();
  const expiresAt = createSessionExpiry();
  const session = await authRepository.createSession({
    userId,
    tokenHash: hashOpaqueToken(rawToken),
    expiresAt,
    ipAddress: requestIp(request),
    userAgent: requestUserAgent(request)
  });

  return {
    rawToken,
    expiresAt,
    session
  };
}

export const authService = {
  async signup(input: SignupInput, request: NextRequest): Promise<{
    authSession: AuthSession;
    rawToken: string;
    expiresAt: Date;
  }> {
    try {
      const passwordHash = await hashPassword(input.password);
      const { user, profile } = await authRepository.createUserWithProfile({
        email: input.email,
        passwordHash,
        username: input.username,
        displayName: input.displayName ?? defaultDisplayName(input.username)
      });
      const sessionResult = await createSessionForUser(user.id, request);

      return {
        authSession: {
          user,
          profile,
          session: sessionResult.session
        },
        rawToken: sessionResult.rawToken,
        expiresAt: sessionResult.expiresAt
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ApiError(409, "USERNAME_TAKEN", "Email or username already exists.");
      }

      throw error;
    }
  },

  async login(input: LoginInput, request: NextRequest): Promise<{
    authSession: AuthSession;
    rawToken: string;
    expiresAt: Date;
  }> {
    const user = await authRepository.findUserByEmail(input.email);

    if (!user) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }

    if (user.status === "banned") {
      throw new ApiError(403, "ACCOUNT_BANNED", "This account is banned.");
    }

    const isValidPassword = await verifyPassword(input.password, user.passwordHash);

    if (!isValidPassword) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }

    const profile = await authRepository.findProfileByUserId(user.id);

    if (!profile) {
      throw new ApiError(404, "NOT_FOUND", "Profile not found.");
    }

    const sessionResult = await createSessionForUser(user.id, request);

    return {
      authSession: {
        user,
        profile,
        session: sessionResult.session
      },
      rawToken: sessionResult.rawToken,
      expiresAt: sessionResult.expiresAt
    };
  },

  async getCurrentSession(request: NextRequest): Promise<AuthSession> {
    const rawToken = request.cookies.get(sessionCookieName())?.value;

    if (!rawToken) {
      throw new ApiError(401, "AUTH_REQUIRED", "Authentication is required.");
    }

    const authSession = await authRepository.findAuthSessionByTokenHash(hashOpaqueToken(rawToken));

    if (!authSession) {
      throw new ApiError(401, "AUTH_REQUIRED", "Authentication is required.");
    }

    if (authSession.user.status === "banned") {
      throw new ApiError(403, "ACCOUNT_BANNED", "This account is banned.");
    }

    return authSession;
  },

  async logout(request: NextRequest): Promise<void> {
    const rawToken = request.cookies.get(sessionCookieName())?.value;

    if (!rawToken) {
      return;
    }

    await authRepository.revokeSession(hashOpaqueToken(rawToken));
  },

  async updateProfile(request: NextRequest, input: UpdateProfileInput): Promise<AuthSession> {
    const authSession = await this.getCurrentSession(request);

    try {
      const profile = await authRepository.updateProfile(authSession.user.id, input);
      return {
        ...authSession,
        profile
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ApiError(409, "USERNAME_TAKEN", "Username already exists.");
      }

      throw error;
    }
  },

  async updatePrivacy(request: NextRequest, input: UpdatePrivacyInput): Promise<AuthSession> {
    const authSession = await this.getCurrentSession(request);
    const profile = await authRepository.updatePrivacy(authSession.user.id, input.visibility);

    return {
      ...authSession,
      profile
    };
  },

  async requestPasswordReset(email: string): Promise<void> {
    const user = await authRepository.findUserByEmail(email);

    if (!user || user.status === "banned") {
      return;
    }

    const token = createOpaqueToken();
    await authRepository.createPasswordResetToken({
      userId: user.id,
      tokenHash: hashOpaqueToken(token),
      expiresAt: createPasswordResetExpiry()
    });

    // Email delivery is intentionally adapterized later; do not expose account existence.
    console.info(`Password reset token created for ${email}. Wire email delivery before production.`);
  },

  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    const tokenRecord = await authRepository.findPasswordResetToken(hashOpaqueToken(token));

    if (
      !tokenRecord ||
      tokenRecord.used_at ||
      tokenRecord.expires_at.getTime() <= Date.now()
    ) {
      throw new ApiError(400, "INVALID_TOKEN", "Password reset token is invalid or expired.");
    }

    await authRepository.consumePasswordResetToken({
      tokenId: tokenRecord.id,
      userId: tokenRecord.user_id,
      passwordHash: await hashPassword(newPassword)
    });
  }
};
