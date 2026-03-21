const AUTH_TOKEN_KEY = "authToken";
const USER_KEY = "user";
const ACTIVE_VIEW_KEY = "activeView";

interface JwtPayload {
  exp?: number;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = atob(padded);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenExpiryMs(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp || typeof payload.exp !== "number") {
    return null;
  }

  return payload.exp * 1000;
}

export function getMsUntilTokenExpiry(token: string): number {
  const expiryMs = getTokenExpiryMs(token);
  if (!expiryMs) return 0;
  return Math.max(0, expiryMs - Date.now());
}

export function isTokenExpired(token: string, skewMs = 0): boolean {
  const expiryMs = getTokenExpiryMs(token);
  if (!expiryMs) return true;
  return Date.now() + skewMs >= expiryMs;
}

export function clearAuthStorage() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACTIVE_VIEW_KEY);
}
