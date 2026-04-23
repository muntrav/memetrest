import type { AuthSession } from "@/lib/auth/types";

export type ViewerSummary = {
  displayName: string;
  username: string;
  avatarUrl: string | null;
  email: string;
};

export function toViewerSummary(authSession: AuthSession | null | undefined): ViewerSummary | null {
  if (!authSession) {
    return null;
  }

  return {
    displayName: authSession.profile.displayName,
    username: authSession.profile.username,
    avatarUrl: authSession.profile.avatarUrl,
    email: authSession.user.email
  };
}
