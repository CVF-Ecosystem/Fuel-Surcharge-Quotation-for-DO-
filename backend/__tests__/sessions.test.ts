import { describe, it, expect, beforeEach } from "vitest";
import {
  createSession,
  getSession,
  revokeSession,
  revokeUserSessions,
  clearAllSessions,
  extractBearerToken,
  loginBlockedForMs,
  recordLoginFailure,
  clearLoginFailures,
  resetLoginRateLimit,
  SESSION_TTL_MS,
} from "../utils/sessions.js";

const admin = { userId: 1, username: "admin", role: "admin", displayName: "Admin" };

describe("sessions", () => {
  beforeEach(() => {
    clearAllSessions();
    resetLoginRateLimit();
  });

  it("tạo token ngẫu nhiên, không lặp giữa các lần đăng nhập", () => {
    const a = createSession(admin);
    const b = createSession(admin);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
    expect(a).not.toBe(b);
  });

  it("getSession trả đúng thông tin và null với token lạ/rỗng", () => {
    const t = createSession(admin);
    expect(getSession(t)).toEqual(admin);
    expect(getSession("nonexistent")).toBeNull();
    expect(getSession("")).toBeNull();
  });

  it("token hết hạn sau SESSION_TTL_MS không dùng", () => {
    const now = 1_000_000;
    const t = createSession(admin, now);
    expect(getSession(t, now + SESSION_TTL_MS - 1)).not.toBeNull();
    // hạn trượt: lần dùng ở trên đã gia hạn
    expect(getSession(t, now + SESSION_TTL_MS - 1 + SESSION_TTL_MS + 1)).toBeNull();
    expect(getSession(t, now + 1)).toBeNull(); // đã bị xóa khỏi store
  });

  it("revokeSession và revokeUserSessions thu hồi token", () => {
    const t1 = createSession(admin);
    const t2 = createSession(admin);
    const other = createSession({ ...admin, userId: 2, username: "bob", role: "guest" });
    revokeSession(t1);
    expect(getSession(t1)).toBeNull();
    expect(revokeUserSessions("admin")).toBe(1);
    expect(getSession(t2)).toBeNull();
    expect(getSession(other)).not.toBeNull();
  });

  it("extractBearerToken", () => {
    expect(extractBearerToken("Bearer abc")).toBe("abc");
    expect(extractBearerToken("bearer   abc ")).toBe("abc");
    expect(extractBearerToken(undefined)).toBe("");
  });

  it("khóa đăng nhập sau 5 lần sai, mở lại sau cửa sổ 15 phút và khi thành công", () => {
    const key = "1.2.3.4|admin";
    const t0 = 5_000_000;
    for (let i = 0; i < 4; i++) recordLoginFailure(key, t0);
    expect(loginBlockedForMs(key, t0)).toBe(0);
    recordLoginFailure(key, t0);
    expect(loginBlockedForMs(key, t0)).toBeGreaterThan(0);
    expect(loginBlockedForMs(key, t0 + 15 * 60 * 1000 + 1)).toBe(0);

    for (let i = 0; i < 5; i++) recordLoginFailure(key, t0);
    clearLoginFailures(key);
    expect(loginBlockedForMs(key, t0)).toBe(0);
  });
});
