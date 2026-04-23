import type { Metadata } from "next";
import { AuthScreen } from "@/components/screens/auth-screen";

export const metadata: Metadata = {
  title: "Memetrest - Confirm Password Reset"
};

type PasswordResetConfirmPageProps = {
  searchParams?: Promise<{
    token?: string | string[];
  }>;
};

export default async function PasswordResetConfirmPage({
  searchParams
}: PasswordResetConfirmPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const token = Array.isArray(resolvedSearchParams.token)
    ? resolvedSearchParams.token[0]
    : resolvedSearchParams.token;

  return <AuthScreen initialToken={token ?? ""} mode="password-reset-confirm" />;
}
