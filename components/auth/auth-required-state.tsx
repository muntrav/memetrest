import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import { buildAuthHref } from "@/lib/auth/navigation";
import { routes } from "@/lib/routes";

type AuthRequiredStateProps = {
  title: string;
  description: string;
  nextPath?: string;
};

export function AuthRequiredState({
  title,
  description,
  nextPath
}: AuthRequiredStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-outline-variant/40 bg-background/60 px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary">
        <MaterialIcon className="text-3xl">lock</MaterialIcon>
      </div>
      <p className="mt-5 text-lg font-bold text-on-surface">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-label-sm text-on-primary shadow-lg shadow-primary/20"
          href={buildAuthHref(routes.login, nextPath)}
        >
          <MaterialIcon>login</MaterialIcon>
          Sign in
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-white px-5 py-3 font-label-sm text-on-surface"
          href={buildAuthHref(routes.signup, nextPath)}
        >
          <MaterialIcon>person_add</MaterialIcon>
          Create account
        </Link>
      </div>
    </div>
  );
}
