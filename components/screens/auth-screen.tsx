"use client";

import Link from "next/link";
import type { Route } from "next";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { buildAuthHref } from "@/lib/auth/navigation";
import { routes } from "@/lib/routes";

type AuthScreenMode = "login" | "signup" | "password-reset-request" | "password-reset-confirm";

type AuthScreenProps = {
  mode: AuthScreenMode;
  nextPath?: string;
  initialToken?: string;
  successMessage?: string | null;
};

type ApiErrorPayload = {
  error?: {
    message?: string;
  };
};

function getScreenCopy(mode: AuthScreenMode) {
  switch (mode) {
    case "signup":
      return {
        eyebrow: "Create account",
        title: "Start saving and posting for real",
        description:
          "Create your Memetrest account to upload memes, save boards, and manage your identity across the app."
      };
    case "password-reset-request":
      return {
        eyebrow: "Password reset",
        title: "Request a reset link",
        description:
          "Use the same email tied to your Memetrest account. The backend will register a reset token for completion."
      };
    case "password-reset-confirm":
      return {
        eyebrow: "Choose a new password",
        title: "Finish password reset",
        description:
          "Paste the reset token you received and choose a fresh password to restore account access."
      };
    case "login":
    default:
      return {
        eyebrow: "Welcome back",
        title: "Sign in to continue",
        description:
          "Use your email and password to unlock your boards, uploads, and account settings."
      };
  }
}

export function AuthScreen({
  mode,
  nextPath,
  initialToken = "",
  successMessage = null
}: AuthScreenProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(successMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = getScreenCopy(mode);
  const loginHref = buildAuthHref(routes.login, nextPath);
  const signupHref = buildAuthHref(routes.signup, nextPath);

  async function readApiError(response: Response) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
    return payload?.error?.message ?? "Unexpected request failure.";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(successMessage);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          throw new Error(await readApiError(response));
        }

        startTransition(() => {
          router.replace((nextPath ?? routes.profile) as Route);
          router.refresh();
        });
        return;
      }

      if (mode === "signup") {
        const response = await fetch("/api/v1/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password, username, displayName })
        });

        if (!response.ok) {
          throw new Error(await readApiError(response));
        }

        startTransition(() => {
          router.replace((nextPath ?? routes.profile) as Route);
          router.refresh();
        });
        return;
      }

      if (mode === "password-reset-request") {
        const response = await fetch("/api/v1/auth/password-reset/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        });

        if (!response.ok) {
          throw new Error(await readApiError(response));
        }

        setNotice(
          "Reset request accepted. Once you have a token, open the confirm screen to set the new password."
        );
        return;
      }

      const response = await fetch("/api/v1/auth/password-reset/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, newPassword })
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setNotice("Password updated. Redirecting you back to sign in.");
      startTransition(() => {
        router.replace(`${routes.login}?reset=success`);
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected request failure.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.1fr)_520px]">
        <section className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(129,39,207,0.18),_transparent_42%),linear-gradient(135deg,_rgba(255,255,255,0.95),_rgba(248,245,255,0.9))] px-10 py-12 lg:block">
          <Link href={routes.home}>
            <span className="text-3xl font-black tracking-tighter text-purple-600">Memetrest</span>
          </Link>
          <div className="mt-20 max-w-2xl">
            <p className="font-label-sm uppercase tracking-[0.24em] text-primary">{copy.eyebrow}</p>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-on-surface">{copy.title}</h1>
            <p className="mt-6 text-lg leading-8 text-on-surface-variant">{copy.description}</p>
          </div>
          <div className="mt-16 grid gap-4 xl:max-w-2xl xl:grid-cols-2">
            {[
              {
                title: "Real sessions",
                body: "Auth is backed by app-owned email/password sessions, not placeholder state."
              },
              {
                title: "Boards and saves",
                body: "Your collections, save actions, and profile permissions all resolve against your live account."
              },
              {
                title: "Responsive surfaces",
                body: "The same account follows you across the desktop and mobile views automatically."
              },
              {
                title: "Password recovery",
                body: "Reset request and confirm screens are now wired to the live backend reset endpoints."
              }
            ].map((item) => (
              <div
                className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl"
                key={item.title}
              >
                <p className="font-semibold text-on-surface">{item.title}</p>
                <p className="mt-2 text-sm text-on-surface-variant">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-xl rounded-[32px] border border-white/30 bg-white/80 p-6 shadow-[0_20px_60px_rgba(129,39,207,0.12)] backdrop-blur-xl sm:p-8">
            <div className="lg:hidden">
              <Link href={routes.home}>
                <span className="text-2xl font-black tracking-tighter text-purple-600">Memetrest</span>
              </Link>
            </div>

            <div className="mt-6">
              <p className="font-label-sm uppercase tracking-[0.24em] text-primary">{copy.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-on-surface">{copy.title}</h1>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">{copy.description}</p>
            </div>

            {mode === "login" || mode === "signup" ? (
              <div className="mt-6 flex gap-2 rounded-full bg-surface-container-low p-1">
                <Link
                  className={[
                    "flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold transition-colors",
                    mode === "login"
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                      : "text-on-surface-variant"
                  ].join(" ")}
                  href={loginHref}
                >
                  Sign in
                </Link>
                <Link
                  className={[
                    "flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold transition-colors",
                    mode === "signup"
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                      : "text-on-surface-variant"
                  ].join(" ")}
                  href={signupHref}
                >
                  Create account
                </Link>
              </div>
            ) : null}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-on-surface">Display name</span>
                    <input
                      className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                      maxLength={40}
                      onChange={(event) => setDisplayName(event.target.value)}
                      placeholder="Travor"
                      required
                      value={displayName}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-on-surface">Username</span>
                    <input
                      className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                      maxLength={30}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="travor_memes"
                      required
                      value={username}
                    />
                  </label>
                </>
              ) : null}

              {mode !== "password-reset-confirm" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-on-surface">Email</span>
                  <input
                    className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </label>
              ) : null}

              {mode === "login" || mode === "signup" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-on-surface">Password</span>
                  <input
                    className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    required
                    type="password"
                    value={password}
                  />
                </label>
              ) : null}

              {mode === "password-reset-confirm" ? (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-on-surface">Reset token</span>
                    <input
                      className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                      onChange={(event) => setToken(event.target.value)}
                      placeholder="Paste the token"
                      required
                      value={token}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-on-surface">New password</span>
                    <input
                      className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      required
                      type="password"
                      value={newPassword}
                    />
                  </label>
                </>
              ) : null}

              {notice ? (
                <p className="rounded-2xl bg-primary-container/60 px-4 py-3 text-sm text-on-primary-container">
                  {notice}
                </p>
              ) : null}

              {error ? (
                <p className="rounded-2xl bg-error/10 px-4 py-3 text-sm text-error">{error}</p>
              ) : null}

              <button
                className="w-full rounded-full bg-primary px-5 py-3 font-label-sm text-on-primary shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isPending || isSubmitting}
                type="submit"
              >
                {isPending || isSubmitting
                  ? "Working..."
                  : mode === "signup"
                    ? "Create account"
                    : mode === "password-reset-request"
                      ? "Request reset"
                      : mode === "password-reset-confirm"
                        ? "Update password"
                        : "Sign in"}
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-on-surface-variant">
              {mode === "login" ? (
                <Link className="font-semibold text-primary" href={routes.passwordReset}>
                  Forgot password?
                </Link>
              ) : mode === "password-reset-request" ? (
                <Link className="font-semibold text-primary" href={routes.passwordResetConfirm}>
                  Have a token already?
                </Link>
              ) : mode === "password-reset-confirm" ? (
                <Link className="font-semibold text-primary" href={routes.passwordReset}>
                  Need a fresh reset token?
                </Link>
              ) : (
                <span>Password resets are available from the sign-in flow.</span>
              )}

              {mode === "signup" ? (
                <Link className="font-semibold text-primary" href={loginHref}>
                  Already have an account?
                </Link>
              ) : mode === "login" ? (
                <Link className="font-semibold text-primary" href={signupHref}>
                  Need an account?
                </Link>
              ) : (
                <Link className="font-semibold text-primary" href={loginHref}>
                  Back to sign in
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
