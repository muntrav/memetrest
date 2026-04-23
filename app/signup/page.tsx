import type { Metadata } from "next";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/screens/auth-screen";
import { normalizeAuthNextPath } from "@/lib/auth/navigation";
import { getOptionalServerSession } from "@/lib/auth/server-session";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Memetrest - Create Account"
};

export const dynamic = "force-dynamic";

type SignupPageProps = {
  searchParams?: Promise<{
    next?: string | string[];
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const nextPath = normalizeAuthNextPath(resolvedSearchParams.next, routes.profile);
  const authSession = await getOptionalServerSession();

  if (authSession) {
    redirect(nextPath as Route);
  }

  return <AuthScreen mode="signup" nextPath={nextPath} />;
}
