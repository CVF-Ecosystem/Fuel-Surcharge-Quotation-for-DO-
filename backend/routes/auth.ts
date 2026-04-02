import { Router } from "express";
import bcrypt from "bcryptjs";
import { findUserByUsername, getAllUsers, createUser, updateUser, deleteUser } from "../db.js";
import { generateToken } from "../config.js";
import { LoginSchema, validateBody } from "../schemas.js";

const router = Router();

// In-memory token store: token → { username, role, displayName }
const activeTokens = new Map<string, { username: string; role: string; displayName: string }>();

router.post("/login", async (req, res) => {
  const body = validateBody(LoginSchema, req.body, res);
  if (!body) return;
  const { username, password } = body;

  const user = await findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu." });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu." });
  }

  const token = generateToken(user.username, user.password_hash);
  activeTokens.set(token, { username: user.username, role: user.role, displayName: user.display_name });

  res.json({ success: true, token, role: user.role, displayName: user.display_name });
});

router.get("/verify", (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const session = activeTokens.get(token);
  if (session) {
    res.json({ success: true, username: session.username, role: session.role, displayName: session.displayName });
  } else {
    res.status(401).json({ success: false });
  }
});

// ─── User management (admin only) ────────────────────────────────────────────
router.get("/users", async (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const session = verifyToken(token);
  if (!session || session.role !== "admin") {
    return res.status(403).json({ success: false, message: "Chỉ admin mới được quản lý users." });
  }
  const users = await getAllUsers();
  res.json({ success: true, data: users });
});

router.post("/users", async (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const session = verifyToken(token);
  if (!session || session.role !== "admin") {
    return res.status(403).json({ success: false, message: "Chỉ admin mới được thêm user." });
  }
  const { username, password, displayName, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc." });
  }
  if (!["admin", "thuongvu", "guest"].includes(role)) {
    return res.status(400).json({ success: false, message: "Role không hợp lệ." });
  }
  const existing = await findUserByUsername(username);
  if (existing) {
    return res.status(409).json({ success: false, message: "Username đã tồn tại." });
  }
  const hash = await bcrypt.hash(password, 10);
  await createUser(username, hash, displayName || "", role);
  res.json({ success: true, message: "Tạo user thành công." });
});

router.put("/users/:id", async (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const session = verifyToken(token);
  if (!session || session.role !== "admin") {
    return res.status(403).json({ success: false, message: "Chỉ admin mới được sửa user." });
  }
  const id = Number(req.params.id);
  const { displayName, role, password } = req.body;
  if (!["admin", "thuongvu", "guest"].includes(role)) {
    return res.status(400).json({ success: false, message: "Role không hợp lệ." });
  }
  const hash = password ? await bcrypt.hash(password, 10) : undefined;
  await updateUser(id, displayName || "", role, hash);
  res.json({ success: true, message: "Cập nhật user thành công." });
});

router.delete("/users/:id", async (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const session = verifyToken(token);
  if (!session || session.role !== "admin") {
    return res.status(403).json({ success: false, message: "Chỉ admin mới được xóa user." });
  }
  const id = Number(req.params.id);
  await deleteUser(id);
  res.json({ success: true, message: "Đã xóa user." });
});

// Helper: middleware-style token check (exported for other routes)
export function verifyToken(token: string): { username: string; role: string } | null {
  return activeTokens.get(token) ?? null;
}

export default router;
