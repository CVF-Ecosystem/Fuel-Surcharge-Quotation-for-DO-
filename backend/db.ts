// ═══════════════════════════════════════════════════════════════════════════════
// 🔀 CHỌN CHẾ ĐỘ DATABASE BẰNG BIẾN MÔI TRƯỜNG (không còn sửa tay file này)
//
//   DATABASE_URL được đặt        → PostgreSQL        (production / staging)
//   DATABASE_URL trống           → In-Memory         (dev nhanh, dữ liệu mất khi restart)
//   USE_MEMORY_DB=true           → ép In-Memory dù đã có DATABASE_URL
//
// Hai backend có chung hợp đồng hàm (xem db-postgres.ts / db-memory.ts).
// ═══════════════════════════════════════════════════════════════════════════════

export const isPostgres = Boolean(process.env.DATABASE_URL) && process.env.USE_MEMORY_DB !== "true";

const impl = (isPostgres
  ? await import("./db-postgres.js")
  : await import("./db-memory.js")) as typeof import("./db-postgres.js");

console.log(`[DB] Chế độ lưu trữ: ${isPostgres ? "PostgreSQL" : "IN-MEMORY (dữ liệu sẽ mất khi restart)"}`);

export const {
  query,
  queryOne,
  execute,
  withTransaction,
  getAllPrices,
  replacePrices,
  upsertPrice,
  setPriceValue,
  publishPriceById,
  publishPriceByDate,
  clearPublishedPrice,
  hasPriceForDate,
  getAllTiers,
  replaceTiers,
  getAllBulkTiers,
  replaceBulkTiers,
  getAllCustomers,
  replaceCustomers,
  getAllServices,
  replaceServices,
  getAllQuotations,
  replaceQuotations,
  getAllReconLogs,
  replaceReconLogs,
  getAllRegistrationServices,
  replaceRegistrationServices,
  getAllRegistrations,
  replaceRegistrations,
  getAllAuditLogs,
  insertAuditLog,
  getConfig,
  setConfig,
  findUserByUsername,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  initDB,
  TABLE_GETTERS,
  TABLE_SETTERS,
  pool,
} = impl;
