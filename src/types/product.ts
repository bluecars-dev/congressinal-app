import { Evidence } from './evidence';
import { HealthInformation } from './health';
import { RiskResult } from './risk';

export type SourceType = 'official' | 'regulatory' | 'retailer' | 'reference';

export interface SourceItem {
  id: string;
  title: string;
  url: string;
  sourceType: SourceType;
  domain: string;
  verifiedAuthority: boolean;
  retrievedAt?: string;
  summary?: string;
}

export interface ProductIdentification {
  brand: string;
  product: string;
  model?: string;
  variant?: string;
  packageInfo?: string;
  category: string;
  confidence: number; // 0 to 100
  upcOrSerial?: string;
}

export interface ProductAssessment {
  id: string;
  timestamp: number;
  imageUrl: string;
  productIdentification: ProductIdentification;
  evidence: Evidence[];
  health: HealthInformation;
  sources: SourceItem[];
  evidenceQuality: number; // 0 to 100
  risk: RiskResult;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string;
  productName: string;
  brand: string;
  riskTier: 'low' | 'medium' | 'high';
  riskPercentage: number;
  summaryFinding: string;
}
