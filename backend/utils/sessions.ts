import crypto from "crypto";

// ─── Session store ────────────────────────────────────────────────────────────
// Token ngẫu nhiên (không suy ra được từ username/password), có hạn dùng trượt,
// thu hồi được (logout / đổi mật khẩu / đổi role / xóa user).
// Lưu trong RAM: restart server thì phải đăng nhập lại.

export interface Session {
  userId: number;
  username: string;
  role: string;
  displayName: string;
}

interface StoredSession extends Session {
  expiresAt: number;
}

export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 giờ kể từ lần dùng cuối

const sessions = new Map<string, StoredSession>();

export function createSession(session: Session, now = Date.now()): string {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { ...session, expiresAt: now + SESSION_TTL_MS });
  return token;
}

export function getSession(token: string, now = Date.now()): Session | null {
  if (!token) return null;
  const stored = sessions.get(token);
  if (!stored) return null;
  if (stored.expiresAt <= now) {
    sessions.delete(token);
    return null;
  }
  stored.expiresAt = now + SESSION_TTL_MS; // trượt hạn
  const { expiresAt: _expiresAt, ...session } = stored;
  return session;
}

export function revokeSession(token: string): void {
  sessions.delete(token);
}

export function revokeUserSessions(username: string): number {
  let count = 0;
  for (const [token, s] of sessions) {
    if (s.username === username) {
      sessions.delete(token);
      count++;
    }
  }
  return count;
}

export function purgeExpiredSessions(now = Date.now()): void {
  for (const [token, s] of sessions) {
    if (s.expiresAt <= now) sessions.delete(token);
  }
}

export function clearAllSessions(): void {
  sessions.clear();
}

export function extractBearerToken(authorization: string | undefined): string {
  return (authorization || "").replace(/^Bearer\s+/i, "").trim();
}

// ─── Login rate limit ─────────────────────────────────────────────────────────
// Chặn dò mật khẩu: tối đa MAX_FAILURES lần sai / WINDOW_MS cho mỗi (ip + username).

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; resetAt: number }>();

export function loginBlockedForMs(key: string, now = Date.now()): number {
  const entry = failures.get(key);
  if (!entry) return 0;
  if (entry.resetAt <= now) {
    failures.delete(key);
    return 0;
  }
  return entry.count >= MAX_FAILURES ? entry.resetAt - now : 0;
}

export function recordLoginFailure(key: string, now = Date.now()): void {
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= now) {
    failures.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count++;
  }
}

export function clearLoginFailures(key: string): void {
  failures.delete(key);
}

export function resetLoginRateLimit(): void {
  failures.clear();
}

// Dọn rác định kỳ (không giữ process sống).
const sweeper = setInterval(() => {
  purgeExpiredSessions();
  const now = Date.now();
  for (const [key, e] of failures) if (e.resetAt <= now) failures.delete(key);
}, 10 * 60 * 1000);
sweeper.unref();
