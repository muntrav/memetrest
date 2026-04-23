import { validationError } from "@/lib/shared/api-error";
import type {
  LoginInput,
  ProfileVisibility,
  SignupInput,
  UpdatePrivacyInput,
  UpdateProfileInput
} from "@/lib/auth/types";

const usernamePattern = /^[a-z0-9_]{3,30}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw validationError("Request body must be a JSON object.");
  }

  return value as Record<string, unknown>;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() : undefined;
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const value = optionalString(record[key]);

  if (!value) {
    throw validationError(`${key} is required.`, { field: key });
  }

  return value;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function assertUsername(username: string): string {
  const normalized = username.trim().toLowerCase();

  if (!usernamePattern.test(normalized)) {
    throw validationError("Username must be 3-30 characters using lowercase letters, numbers, or underscores.", {
      field: "username"
    });
  }

  return normalized;
}

export function parseSignupInput(body: unknown): SignupInput {
  const record = asRecord(body);
  const email = normalizeEmail(requiredString(record, "email"));
  const password = requiredString(record, "password");
  const username = assertUsername(requiredString(record, "username"));
  const displayName = optionalString(record.displayName);

  if (!emailPattern.test(email)) {
    throw validationError("Email must be valid.", { field: "email" });
  }

  if (password.length < 8 || password.length > 128) {
    throw validationError("Password must be between 8 and 128 characters.", { field: "password" });
  }

  if (displayName && displayName.length > 40) {
    throw validationError("Display name must be 40 characters or fewer.", { field: "displayName" });
  }

  return { email, password, username, displayName };
}

export function parseLoginInput(body: unknown): LoginInput {
  const record = asRecord(body);
  const email = normalizeEmail(requiredString(record, "email"));
  const password = requiredString(record, "password");

  if (!emailPattern.test(email)) {
    throw validationError("Email must be valid.", { field: "email" });
  }

  return { email, password };
}

export function parseUpdateProfileInput(body: unknown): UpdateProfileInput {
  const record = asRecord(body);
  const input: UpdateProfileInput = {};
  const username = optionalString(record.username);
  const displayName = optionalString(record.displayName);
  const bio = optionalString(record.bio);
  const avatarUrl = optionalString(record.avatarUrl);

  if (username !== undefined) {
    input.username = assertUsername(username);
  }

  if (displayName !== undefined) {
    if (displayName.length < 1 || displayName.length > 40) {
      throw validationError("Display name must be between 1 and 40 characters.", {
        field: "displayName"
      });
    }

    input.displayName = displayName;
  }

  if (bio !== undefined) {
    if (bio.length > 160) {
      throw validationError("Bio must be 160 characters or fewer.", { field: "bio" });
    }

    input.bio = bio;
  }

  if (avatarUrl !== undefined) {
    try {
      new URL(avatarUrl);
    } catch {
      throw validationError("Avatar URL must be valid.", { field: "avatarUrl" });
    }

    input.avatarUrl = avatarUrl;
  }

  if (Object.keys(input).length === 0) {
    throw validationError("At least one profile field must be supplied.");
  }

  return input;
}

export function parseUpdatePrivacyInput(body: unknown): UpdatePrivacyInput {
  const record = asRecord(body);
  const visibility = requiredString(record, "visibility");

  if (visibility !== "public" && visibility !== "private") {
    throw validationError("Visibility must be public or private.", { field: "visibility" });
  }

  return { visibility: visibility as ProfileVisibility };
}

export function parsePasswordResetRequest(body: unknown): { email: string } {
  const record = asRecord(body);
  const email = normalizeEmail(requiredString(record, "email"));

  if (!emailPattern.test(email)) {
    throw validationError("Email must be valid.", { field: "email" });
  }

  return { email };
}

export function parsePasswordResetConfirm(body: unknown): {
  token: string;
  newPassword: string;
} {
  const record = asRecord(body);
  const token = requiredString(record, "token");
  const newPassword = requiredString(record, "newPassword");

  if (newPassword.length < 8 || newPassword.length > 128) {
    throw validationError("Password must be between 8 and 128 characters.", {
      field: "newPassword"
    });
  }

  return { token, newPassword };
}
