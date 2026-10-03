export type RiskTier = 'low' | 'medium' | 'high';

export interface RiskResult {
  low: number; // percentage integer 0-100
  medium: number; // percentage integer 0-100
  high: number; // percentage integer 0-100
  dominant: RiskTier;
  dominantPercentage: number;
  executionTimeMs: number;
  engine: string;
  rubricSummary: string;
}

export interface LayaStatePayload {
  product: {
    brand: string;
    name: string;
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

export interface LayaQuestionConfig {
  type: 'choice';
  instructions: string;
  criteria: {
    low: string;
    medium: string;
    high: string;
  };
}
