import { Router } from "express";
import type { Request } from "express";
import bcrypt from "bcryptjs";
import { findUserByUsername, getAllUsers, createUser, updateUser, deleteUser } from "../db.js";
import { LoginSchema, CreateUserSchema, UpdateUserSchema, validateBody } from "../schemas.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createSession,
  getSession,
  revokeSession,
  revokeUserSessions,
  extractBearerToken,
  loginBlockedForMs,
  recordLoginFailure,
  clearLoginFailures,
  type Session,
} from "../utils/sessions.js";

const router = Router();

const getToken = (req: Request) => extractBearerToken(req.headers.authorization);

// Helper: kiểm tra token (export cho các route khác)
export function verifyToken(token: string): Session | null {
  return getSession(token);
}

router.post("/login", asyncHandler(async (req, res) => {
  const body = validateBody(LoginSchema, req.body, res);
  if (!body) return;
  const { username, password } = body;

  const limiterKey = `${req.ip}|${username.toLowerCase()}`;
  const blockedMs = loginBlockedForMs(limiterKey);
  if (blockedMs > 0) {
    res.setHeader("Retry-After", String(Math.ceil(blockedMs / 1000)));
    return res.status(429).json({
      success: false,
      message: `Đăng nhập sai quá nhiều lần. Thử lại sau ${Math.ceil(blockedMs / 60000)} phút.`,
    });
  }

  const user = await findUserByUsername(username);
  const valid = user ? await bcrypt.compare(password, user.password_hash) : false;
  if (!user || !valid) {
    recordLoginFailure(limiterKey);
    return res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu." });
  }

  clearLoginFailures(limiterKey);
  const token = createSession({
    userId: user.id,
    username: user.username,
    role: user.role,
    displayName: user.display_name,
  });

  res.json({ success: true, token, role: user.role, displayName: user.display_name });
}));

router.get("/verify", (req, res) => {
  const session = getSession(getToken(req));
  if (session) {
    res.json({ success: true, username: session.username, role: session.role, displayName: session.displayName });
  } else {
    res.status(401).json({ success: false });
  }
});

router.post("/logout", (req, res) => {
  revokeSession(getToken(req));
  res.json({ success: true });
});

// ─── User management (admin only) ────────────────────────────────────────────
function requireAdmin(req: Request): Session | null {
  const session = getSession(getToken(req));
  return session && session.role === "admin" ? session : null;
}

router.get("/users", asyncHandler(async (req, res) => {
  if (!requireAdmin(req)) {
    return res.status(403).json({ success: false, message: "Chỉ admin mới được quản lý users." });
  }
  const users = await getAllUsers();
  res.json({ success: true, data: users });
}));

router.post("/users", asyncHandler(async (req, res) => {
  if (!requireAdmin(req)) {
    return res.status(403).json({ success: false, message: "Chỉ admin mới được thêm user." });
  }
  const body = validateBody(CreateUserSchema, req.body, res);
  if (!body) return;

  const existing = await findUserByUsername(body.username);
  if (existing) {
    return res.status(409).json({ success: false, message: "Username đã tồn tại." });
  }
  const hash = await bcrypt.hash(body.password, 10);
  await createUser(body.username, hash, body.displayName, body.role);
  res.json({ success: true, message: "Tạo user thành công." });
}));

router.put("/users/:id", asyncHandler(async (req, res) => {
  if (!requireAdmin(req)) {
    return res.status(403).json({ success: false, message: "Chỉ admin mới được sửa user." });
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ success: false, message: "ID không hợp lệ." });
  }
  const body = validateBody(UpdateUserSchema, req.body, res);
  if (!body) return;

  const users = await getAllUsers();
  const target = users.find(u => u.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: "Không tìm thấy user." });
  }
  // Không để hệ thống không còn admin nào.
  if (target.role === "admin" && body.role !== "admin" && users.filter(u => u.role === "admin").length <= 1) {
    return res.status(400).json({ success: false, message: "Không thể hạ quyền admin cuối cùng." });
  }

  const hash = body.password ? await bcrypt.hash(body.password, 10) : undefined;
  await updateUser(id, body.displayName, body.role, hash);

  // Đổi mật khẩu / đổi role → các phiên đang mở của user đó phải đăng nhập lại.
  if (hash || body.role !== target.role) revokeUserSessions(target.username);
  res.json({ success: true, message: "Cập nhật user thành công." });
}));

router.delete("/users/:id", asyncHandler(async (req, res) => {
  const admin = requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ success: false, message: "Chỉ admin mới được xóa user." });
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ success: false, message: "ID không hợp lệ." });
  }
  if (id === admin.userId) {
    return res.status(400).json({ success: false, message: "Không thể tự xóa tài khoản đang đăng nhập." });
  }

  const users = await getAllUsers();
  const target = users.find(u => u.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: "Không tìm thấy user." });
  }
  if (target.role === "admin" && users.filter(u => u.role === "admin").length <= 1) {
    return res.status(400).json({ success: false, message: "Không thể xóa admin cuối cùng." });
  }

  await deleteUser(id);
  revokeUserSessions(target.username);
  res.json({ success: true, message: "Đã xóa user." });
}));

export default router;
