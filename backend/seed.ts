import bcrypt from "bcryptjs";
import { execute, query, replacePrices, replaceTiers, replaceBulkTiers, replaceServices, replaceCustomers, withTransaction } from "./db.js";

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin@@@@";

async function ensureDefaultAdmin(): Promise<void> {
  const [{ count: userCount }] = await query<{ count: string }>(
    "SELECT COUNT(*)::int AS count FROM users WHERE username = $1",
    [DEFAULT_ADMIN_USERNAME]
  );

  if (Number(userCount) > 0) return;

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  await execute(
    `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, 'admin')`,
    [DEFAULT_ADMIN_USERNAME, passwordHash]
  );
}

export async function seedData(): Promise<void> {
  await ensureDefaultAdmin();

  // Only seed if tables are empty
  const [{ count: priceCount }] = await query<{ count: string }>("SELECT COUNT(*)::int AS count FROM fuel_prices");
  if (Number(priceCount) === 0) {
    await replacePrices([
      { date: '2026-03-26', effectiveAt: '2026-03-26T08:00:00+07:00', fuelType: 'Dầu DO 0,05S-II', priceV1: 35440 },
      { date: '2026-04-01', effectiveAt: '2026-04-01T08:00:00+07:00', fuelType: 'Dầu DO 0,05S-II', priceV1: 35440 },
      { date: '2026-04-02', effectiveAt: '2026-04-02T08:00:00+07:00', fuelType: 'Dầu DO 0,05S-II', priceV1: 35440 },
      { date: '2026-04-03', effectiveAt: '2026-04-03T08:00:00+07:00', fuelType: 'Dầu DO 0,05S-II', priceV1: 40820 },
      { date: '2026-04-04', effectiveAt: '2026-04-04T08:00:00+07:00', fuelType: 'Dầu DO 0,05S-II', priceV1: 44780 },
    ]);
  }

  const [{ count: tierCount }] = await query<{ count: string }>("SELECT COUNT(*)::int AS count FROM tiers");
  if (Number(tierCount) === 0) {
    await withTransaction(async (c) => {
      await replaceTiers([
        { minPrice: 0,     maxPrice: 23000, surcharge20F: 0,      surcharge40F: 0,      surcharge20E: 0,      surcharge40E: 0      },
        { minPrice: 23001, maxPrice: 26000, surcharge20F: 50000,  surcharge40F: 60000,  surcharge20E: 35000,  surcharge40E: 50000  },
        { minPrice: 26001, maxPrice: 29000, surcharge20F: 100000, surcharge40F: 120000, surcharge20E: 70000,  surcharge40E: 100000 },
        { minPrice: 29001, maxPrice: 32000, surcharge20F: 150000, surcharge40F: 180000, surcharge20E: 105000, surcharge40E: 150000 },
        { minPrice: 32001, maxPrice: 35000, surcharge20F: 200000, surcharge40F: 240000, surcharge20E: 140000, surcharge40E: 200000 },
        { minPrice: 35001, maxPrice: 38000, surcharge20F: 250000, surcharge40F: 300000, surcharge20E: 175000, surcharge40E: 250000 },
        { minPrice: 38001, maxPrice: 41000, surcharge20F: 300000, surcharge40F: 360000, surcharge20E: 210000, surcharge40E: 300000 },
        { minPrice: 41001, maxPrice: 44000, surcharge20F: 350000, surcharge40F: 420000, surcharge20E: 245000, surcharge40E: 350000 },
        { minPrice: 44001, maxPrice: 47000, surcharge20F: 400000, surcharge40F: 480000, surcharge20E: 280000, surcharge40E: 400000 },
        { minPrice: 47001, maxPrice: 99999, surcharge20F: 450000, surcharge40F: 540000, surcharge20E: 315000, surcharge40E: 450000 },
      ], c);
    });
  }

  const [{ count: bulkCount }] = await query<{ count: string }>("SELECT COUNT(*)::int AS count FROM bulk_tiers");
  if (Number(bulkCount) === 0) {
    await withTransaction(async (c) => {
      await replaceBulkTiers([
        { minPrice: 0,     maxPrice: 23000, percentSurcharge: 0  },
        { minPrice: 23001, maxPrice: 26000, percentSurcharge: 3  },
        { minPrice: 26001, maxPrice: 29000, percentSurcharge: 6  },
        { minPrice: 29001, maxPrice: 32000, percentSurcharge: 9  },
        { minPrice: 32001, maxPrice: 35000, percentSurcharge: 12 },
        { minPrice: 35001, maxPrice: 38000, percentSurcharge: 15 },
        { minPrice: 38001, maxPrice: 41000, percentSurcharge: 15 },
        { minPrice: 41001, maxPrice: 44000, percentSurcharge: 18 },
        { minPrice: 44001, maxPrice: 47000, percentSurcharge: 18 },
        { minPrice: 47001, maxPrice: 99999, percentSurcharge: 21 },
      ], c);
    });
  }

  const [{ count: svcCount }] = await query<{ count: string }>("SELECT COUNT(*)::int AS count FROM services");
  if (Number(svcCount) === 0) {
    await replaceServices([
      { name: 'Bốc xếp Container 20 Full',  unit: 'Cont', price: 500000,  category: 'Container' },
      { name: 'Bốc xếp Container 40 Full',  unit: 'Cont', price: 800000,  category: 'Container' },
      { name: 'Bốc xếp Container 20 Empty', unit: 'Cont', price: 300000,  category: 'Container' },
      { name: 'Bốc xếp Container 40 Empty', unit: 'Cont', price: 500000,  category: 'Container' },
      { name: 'Cước vận chuyển',             unit: 'Cont', price: 2000000, category: 'Vận tải'   },
    ]);
  }

  const [{ count: custCount }] = await query<{ count: string }>("SELECT COUNT(*)::int AS count FROM customers");
  if (Number(custCount) === 0) {
    await replaceCustomers([
      { name: 'Công ty TNHH Vận tải Minh Phương', email: 'logistics@minhphuong.com', phone: '028 3821 7333', address: '93 Nguyễn Du, Quận 1, TP. HCM', taxCode: '0300601156', status: 'active' },
    ]);
  }

  console.log("[DB] ✅ Kiểm tra và nạp bù dữ liệu mặc định hoàn tất.");
}

let seeded = false;
export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  await seedData();
  seeded = true;
}
