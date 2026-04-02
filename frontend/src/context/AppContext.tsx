import React, { createContext, useContext, useState, useEffect } from 'react';
import { FuelPrice, Tier, BulkTier, Customer, Product, QuotationHistoryItem, ReconciliationLog } from '../types';
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

      // Auto-sync removed — daily 7AM cron on backend handles syncing.
      // Manual sync available via Admin > "Đồng bộ từ Web" button.

    } catch (err) {
      setError("Lỗi tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
