export type RiskTier = 'low' | 'medium' | 'high';

export interface RiskResult {
  low: number; // probability percentage 0-100
  medium: number; // probability percentage 0-100
  high: number; // probability percentage 0-100
  dominant: RiskTier;
  dominantPercentage: number;
  reasoning?: string;
}

export interface LayaEvidencePayload {
  product: {
    brand: string;
    product: string;
    model?: string;
    category?: string;
  };
  evidenceSummary: {
    totalItems: number;
    matchCount: number;
    differenceCount: number;
    unverifiedCount: number;
    highSeverityDifferences: number;
    mediumSeverityDifferences: number;
  };
  detailedEvidence: Array<{
    feature: string;
    status: 'match' | 'difference' | 'unverified';
    severity: 'low' | 'medium' | 'high';
    finding: string;
  }>;
}
