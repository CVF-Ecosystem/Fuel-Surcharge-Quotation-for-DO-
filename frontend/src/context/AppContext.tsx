import React, { createContext, useContext, useState, useEffect } from 'react';
import { FuelPrice, Tier, BulkTier, Customer, Product, QuotationHistoryItem, ReconciliationLog } from '../types';
import { getSurchargeEffectiveAt, getVietnamTodayIsoDate, normalizeDateInput } from '../lib/fuelPrices';
import { logiStorage } from '../lib/storage';
import { API_BASE } from '../lib/apiBase';

interface AppContextType {
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  
  userRole: string | null;
  setUserRole: (val: string | null) => void;

  userDisplayName: string;
  setUserDisplayName: (val: string) => void;

  loading: boolean;
  setLoading: (val: boolean) => void;
  
  error: string | null;
  setError: (val: string | null) => void;

  prices: FuelPrice[];
  setPrices: (val: FuelPrice[]) => void;
  
  tiers: Tier[];
  setTiers: (val: Tier[]) => void;
  
  bulkTiers: BulkTier[];
  setBulkTiers: (val: BulkTier[]) => void;
  
  customers: Customer[];
  setCustomers: (val: Customer[]) => void;
  
  services: Product[];
  setServices: (val: Product[]) => void;
  
  quotations: QuotationHistoryItem[];
  setQuotations: (val: QuotationHistoryItem[]) => void;

  reconLogs: ReconciliationLog[];
  setReconLogs: (val: ReconciliationLog[]) => void;

  // New Shared State for Quotation (A-3)
  pendingSurcharge: { amount: number; quantity: number; cargoType: string } | null;
  setPendingSurcharge: (val: { amount: number; quantity: number; cargoType: string } | null) => void;
  pendingCustomer: Customer | null;
  setPendingCustomer: (val: Customer | null) => void;

  fetchData: () => Promise<void>;
}

const AUTO_SYNC_FLAG = 'logipro_auto_sync_day';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [bulkTiers, setBulkTiers] = useState<BulkTier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Product[]>([]);
  const [quotations, setQuotations] = useState<QuotationHistoryItem[]>([]);
  const [reconLogs, setReconLogs] = useState<ReconciliationLog[]>([]);
  const [pendingSurcharge, setPendingSurcharge] = useState<{ amount: number; quantity: number; cargoType: string } | null>(null);
  const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Tải dữ liệu công khai (không cần login)
      const [storedPrices, pTiers, pBulkTiers, pServices] = await Promise.all([
        logiStorage.getPrices(),
        logiStorage.getTiers(),
        logiStorage.getBulkTiers(),
        logiStorage.getServices()
      ]);

      setPrices(storedPrices);
      setTiers(pTiers);
      setBulkTiers(pBulkTiers);
      setServices(pServices);

      // 2. Kiểm tra Token & Tải dữ liệu nhạy cảm (nếu có)
      const sessionToken = sessionStorage.getItem("logipro_token");
      if (sessionToken) {
        try {
          const verifyRes = await fetch(`${API_BASE}/api/auth/verify`, {
            headers: { "Authorization": `Bearer ${sessionToken}` }
          });
          const verifyJson = await verifyRes.json();
          
          if (verifyJson.success) {
            setIsAdminMode(true);
            setUserRole(verifyJson.role || null);
            setUserDisplayName(verifyJson.displayName || verifyJson.username || '');
            // Fetch dữ liệu nhạy cảm song song khi đã login
            const [pCustomers, pQuotations, pReconLogs] = await Promise.all([
              logiStorage.getCustomers(),
              logiStorage.getQuotations(),
              logiStorage.getReconLogs()
            ]);
            setCustomers(pCustomers);
            setQuotations(pQuotations);
            setReconLogs(pReconLogs);
          } else {
            sessionStorage.removeItem("logipro_token");
            setIsAdminMode(false);
            setUserRole(null);
            setUserDisplayName('');
          }
        } catch {
          setIsAdminMode(false);
        }
      } else {
        setIsAdminMode(false);
        setUserRole(null);
        setUserDisplayName('');
      }

      // Đồng bộ giá hôm nay từ Petrolimex.
      // Server đã tự đồng bộ lúc 6h sáng và khi khởi động, nên đây chỉ là lưới an toàn:
      // chỉ chạy khi đã đăng nhập (endpoint ghi cần token), tối đa 1 lần/ngày/trình duyệt,
      // và để SERVER lưu từng bản ghi — không ghi đè cả bảng giá như trước
      // (cách cũ làm mất giá đang ghim và dễ đè dữ liệu của lần sửa khác).
      const hasSession = Boolean(sessionStorage.getItem("logipro_token"));
      const todayStr = getVietnamTodayIsoDate();
      const hasTodayPrice = storedPrices.some(p => {
        if (p.fuelType !== "Dầu DO 0,05S-II") return false;
        const surchargeDate = normalizeDateInput(getSurchargeEffectiveAt(p) || p.date);
        return surchargeDate === todayStr || p.date === todayStr;
      });

      if (hasSession && !hasTodayPrice && sessionStorage.getItem(AUTO_SYNC_FLAG) !== todayStr) {
        sessionStorage.setItem(AUTO_SYNC_FLAG, todayStr);
        try {
          // Xem trước (GET, dùng cache): chỉ lưu khi cào được giá thật, không tự lưu giá dự phòng.
          const preview = await (await fetch(`${API_BASE}/api/petrolimex-sync`)).json();
          if (preview.success && preview.data?.parsedFromWeb) {
            const res = await fetch(`${API_BASE}/api/petrolimex-sync`, {
              method: "POST",
              headers: { "Authorization": `Bearer ${sessionStorage.getItem("logipro_token")}` }
            });
            const json = await res.json();
            if (json.success && json.saved) {
              setPrices(await logiStorage.getPrices());
              console.log(`[Auto-Sync] ✅ ${json.message}`);
            }
          } else if (preview.success && preview.data) {
            console.warn(`[Auto-Sync] ⚠️ Scraper trả về fallback (${Number(preview.data.priceV1).toLocaleString()} đ) — không tự thêm.`);
          }
        } catch (e) {
          console.error("Auto Sync Failed", e);
        }
      }

    } catch (err) {
      setError("Lỗi tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh when switching back to this tab, but at most once every 5 minutes
    let lastFetchTime = Date.now();
    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFetchTime > 5 * 60 * 1000) {
        lastFetchTime = now;
        fetchData();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <AppContext.Provider value={{
      isAdminMode, setIsAdminMode,
      userRole, setUserRole,
      userDisplayName, setUserDisplayName,
      loading, setLoading,
      error, setError,
      prices, setPrices,
      tiers, setTiers,
      bulkTiers, setBulkTiers,
      customers, setCustomers,
      services, setServices,
      quotations, setQuotations,
      reconLogs, setReconLogs,
      pendingSurcharge, setPendingSurcharge,
      pendingCustomer, setPendingCustomer,
      fetchData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
