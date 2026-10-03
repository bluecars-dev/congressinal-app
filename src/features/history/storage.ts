import { ProductAssessment } from '../../types/product';

const STORAGE_KEY = 'verify_product_scans_history';

export class ScanStorage {
  public static getScans(): ProductAssessment[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public static saveScan(assessment: ProductAssessment): void {
    try {
      const current = this.getScans();
      const filtered = current.filter((item) => item.id !== assessment.id);
      const updated = [assessment, ...filtered].slice(0, 30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save scan to localStorage:', e);
    }
  }

  public static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
