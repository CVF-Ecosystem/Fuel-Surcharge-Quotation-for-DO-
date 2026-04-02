import { FuelPrice, Tier, BulkTier, Customer, Product, QuotationHistoryItem, ReconciliationLog, RegistrationServiceItem, RegistrationHistoryItem } from '../types';
import { API_BASE } from './apiBase';

export interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

/**
 * StorageService — Server Edition
 * Giao tiếp với Express API backend (JSON file storage)
 */
class StorageService {
  private get token() {
    return sessionStorage.getItem('logipro_token');
  }

  private async request<T>(path: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}/api/${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Có thể xử lý logout ở đây nếu token hết hạn
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data as T;
  }

  // --- GETTERS (Async) ---
  async getPrices(): Promise<FuelPrice[]> { return this.request('prices'); }
  async getTiers(): Promise<Tier[]> { return this.request('tiers'); }
  async getBulkTiers(): Promise<BulkTier[]> { return this.request('bulk-tiers'); }
  async getCustomers(): Promise<Customer[]> { return this.request('customers'); }
  async getServices(): Promise<Product[]> { return this.request('services'); }
  async getQuotations(): Promise<QuotationHistoryItem[]> { return this.request('quotations'); }
  async getAuditLogs(): Promise<AuditLog[]> { return this.request('audit'); }
  async getReconLogs(): Promise<ReconciliationLog[]> { return this.request('reconciliation-logs'); }

  // Registration specifics
  async getRegistrationServices(): Promise<RegistrationServiceItem[]> { return this.request('registration-services'); }
  async getRegistrations(): Promise<RegistrationHistoryItem[]> { return this.request('registrations'); }

  // --- SETTERS (Async) ---
  async setPrices(v: FuelPrice[]) { await this.request('prices', 'POST', v); }
  async setTiers(v: Tier[]) { await this.request('tiers', 'POST', v); }
  async setBulkTiers(v: BulkTier[]) { await this.request('bulk-tiers', 'POST', v); }
  async setCustomers(v: Customer[]) { await this.request('customers', 'POST', v); }
  async setServices(v: Product[]) { await this.request('services', 'POST', v); }
  async setQuotations(v: QuotationHistoryItem[]) { await this.request('quotations', 'POST', v); }
  async setReconLogs(v: ReconciliationLog[]) { await this.request('reconciliation-logs', 'POST', v); }
  
  // Registration specifics
  async setRegistrationServices(v: RegistrationServiceItem[]) { await this.request('registration-services', 'POST', v); }
  async setRegistrations(v: RegistrationHistoryItem[]) { await this.request('registrations', 'POST', v); }

  // --- HELPERS (Async) ---
  async saveReconLog(log: ReconciliationLog) {
    const list = await this.getReconLogs();
    const i = list.findIndex(x => x.id === log.id);
    if (i >= 0) list[i] = log; else list.push(log);
    await this.setReconLogs(list);
  }

  async saveQuotation(q: QuotationHistoryItem) {
    const list = await this.getQuotations();
    const i = list.findIndex(x => x.id === q.id);
    if (i >= 0) list[i] = q; else list.push(q);
    await this.setQuotations(list);
  }
  async deleteQuotation(id: string) {
    const list = await this.getQuotations();
    await this.setQuotations(list.filter(q => q.id !== id));
  }

  async saveCustomer(c: Customer) {
    const list = await this.getCustomers();
    const i = list.findIndex(x => x.id === c.id);
    if (i >= 0) list[i] = c; else list.push(c);
    await this.setCustomers(list);
  }
  async deleteCustomer(id: string) {
    const list = await this.getCustomers();
    await this.setCustomers(list.filter(c => c.id !== id));
  }

  async saveService(s: Product) {
    const list = await this.getServices();
    const i = list.findIndex(x => x.id === s.id);
    if (i >= 0) list[i] = s; else list.push(s);
    await this.setServices(list);
  }
  async deleteService(id: string) {
    const list = await this.getServices();
    await this.setServices(list.filter(item => item.id !== id));
  }

  // Registration Registration helpers
  async saveRegistrationService(s: RegistrationServiceItem) {
    const list = await this.getRegistrationServices();
    const i = list.findIndex(x => x.id === s.id);
    if (i >= 0) list[i] = s; else list.push(s);
    await this.setRegistrationServices(list);
  }
  async deleteRegistrationService(id: string) {
    const list = await this.getRegistrationServices();
    await this.setRegistrationServices(list.filter(item => item.id !== id));
  }

  async saveRegistration(r: RegistrationHistoryItem) {
    const list = await this.getRegistrations();
    const i = list.findIndex(x => x.id === r.id);
    if (i >= 0) list[i] = r; else list.push(r);
    await this.setRegistrations(list);
  }
  async deleteRegistration(id: string) {
    const list = await this.getRegistrations();
    await this.setRegistrations(list.filter(r => r.id !== id));
  }
}

export const logiStorage = new StorageService();
