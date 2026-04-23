import type { Metadata } from "next";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/screens/auth-screen";
import { getOptionalServerSession } from "@/lib/auth/server-session";
import { normalizeAuthNextPath } from "@/lib/auth/navigation";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Memetrest - Sign In"
};

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string | string[];
    reset?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const nextPath = normalizeAuthNextPath(resolvedSearchParams.next, routes.profile);
  const authSession = await getOptionalServerSession();

  if (authSession) {
    redirect(nextPath as Route);
  }

  const resetValue = Array.isArray(resolvedSearchParams.reset)
    ? resolvedSearchParams.reset[0]
    : resolvedSearchParams.reset;

  return (
    <AuthScreen
      mode="login"
      nextPath={nextPath}
      successMessage={
        resetValue === "success" ? "Password updated. Sign in with the new password." : null
      }
    />
  );
}
