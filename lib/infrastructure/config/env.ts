function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function getRequiredEnv(name: string): string {
  const value = readEnv(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getDatabaseUrl(): string {
  return getRequiredEnv("DATABASE_URL");
}

export function getAppBaseUrl(): string {
  return readEnv("APP_BASE_URL") ?? "http://localhost:3000";
}

export function getSessionCookieName(): string {
  return readEnv("MEMETREST_SESSION_COOKIE_NAME") ?? "memetrest_session";
}
