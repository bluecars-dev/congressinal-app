export interface HealthInformation {
  relevant: boolean;
  category?: 'medication' | 'supplement' | 'food' | 'cosmetic' | 'skincare' | 'medical_device' | 'children_product' | 'hazardous' | 'general';
  warnings: string[];
  authenticityConcern?: string;
  ingredients?: string[];
  allergens?: string[];
  safetyNotes?: string[];
  usageInstructions?: string;
  disclaimer: string;
}
