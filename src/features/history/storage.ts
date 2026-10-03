import { ProductAssessment } from '../../types/product';
import { GeminiAnalyzer } from '../analysis/GeminiAnalyzer';
import { layaService } from '../risk/LayaModel';

const STORAGE_KEY = 'verify_product_scans_history';

export class ScanStorage {
  public static async getInitialSeedData(): Promise<ProductAssessment[]> {
    // Generate initial sample assessments for immediate interactive history
    const shoeData = GeminiAnalyzer.getFootwearHighRiskArchetype();
    const shoeRisk = await layaService.evaluateRisk(shoeData.identification, shoeData.evidence);
    const shoeAssessment: ProductAssessment = {
      id: 'seed-scan-nike',
      timestamp: Date.now() - 3600 * 1000 * 3, // 3 hours ago
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      productIdentification: shoeData.identification,
      evidence: shoeData.evidence,
      health: shoeData.health,
      sources: shoeData.sources,
      evidenceQuality: shoeData.evidenceQuality,
      risk: shoeRisk,
    };

    const pharmaData = GeminiAnalyzer.getPharmaLowRiskArchetype();
    const pharmaRisk = await layaService.evaluateRisk(pharmaData.identification, pharmaData.evidence);
    const pharmaAssessment: ProductAssessment = {
      id: 'seed-scan-tylenol',
      timestamp: Date.now() - 3600 * 1000 * 18, // 18 hours ago
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      productIdentification: pharmaData.identification,
      evidence: pharmaData.evidence,
      health: pharmaData.health,
      sources: pharmaData.sources,
      evidenceQuality: pharmaData.evidenceQuality,
      risk: pharmaRisk,
    };

    const techData = GeminiAnalyzer.getTechMediumRiskArchetype();
    const techRisk = await layaService.evaluateRisk(techData.identification, techData.evidence);
    const techAssessment: ProductAssessment = {
      id: 'seed-scan-airpods',
      timestamp: Date.now() - 3600 * 1000 * 36, // yesterday
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      productIdentification: techData.identification,
      evidence: techData.evidence,
      health: techData.health,
      sources: techData.sources,
      evidenceQuality: techData.evidenceQuality,
      risk: techRisk,
    };

    return [shoeAssessment, pharmaAssessment, techAssessment];
  }

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
