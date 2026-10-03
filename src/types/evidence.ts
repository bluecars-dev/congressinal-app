export type Severity = 'low' | 'medium' | 'high';
export type EvidenceStatus = 'match' | 'difference' | 'unverified';

export interface CropRegion {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface Evidence {
  id: string;
  feature: string;
  finding: string;
  severity: Severity;
  status: EvidenceStatus;
  source?: string;
  referenceInfo?: string;
  cropRegion?: CropRegion;
  confidence?: number; // 0 to 1
  referenceImageUrl?: string;
}
