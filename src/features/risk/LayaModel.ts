import {
  getDecisionCapabilities,
  loadDecisionHead,
  runDecision,
  LayaModelHead,
  DecisionQuestion,
} from './llama-web-bridge';
import { Evidence } from '../../types/evidence';
import { ProductIdentification } from '../../types/product';
import { RiskResult, RiskTier } from '../../types/risk';

class LayaEngineService {
  private modelHead: LayaModelHead | null = null;
  private isInitializing: boolean = false;

  public async getModelHead(): Promise<LayaModelHead> {
    if (this.modelHead) return this.modelHead;
    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise((r) => setTimeout(r, 50));
      }
      if (this.modelHead) return this.modelHead;
    }

    this.isInitializing = true;
    try {
      await getDecisionCapabilities();
      this.modelHead = await loadDecisionHead({
        modelUrl: 'laya_modernbert.gguf',
        headUrl: 'laya_typed_head.safetensors',
        runtime: 'wasm32',
      });
      return this.modelHead;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Evaluates structured evidence through local Laya WASM inference
   */
  public async evaluateRisk(
    product: ProductIdentification,
    evidenceList: Evidence[]
  ): Promise<RiskResult> {
    const startTime = performance.now();
    const head = await this.getModelHead();

    // Summarize evidence features
    const matchCount = evidenceList.filter((e) => e.status === 'match').length;
    const diffList = evidenceList.filter((e) => e.status === 'difference');
    const differenceCount = diffList.length;
    const unverifiedCount = evidenceList.filter((e) => e.status === 'unverified').length;

    const highSeverityDifferences = diffList.filter((e) => e.severity === 'high').length;
    const mediumSeverityDifferences = diffList.filter((e) => e.severity === 'medium').length;

    // Structured State Payload for Laya System 1 decision head
    const statePayload = {
      product: {
        brand: product.brand,
        name: product.product,
        model: product.model,
        category: product.category,
        identificationConfidence: product.confidence,
      },
      evidenceSummary: {
        totalItems: evidenceList.length,
        matchCount,
        differenceCount,
        unverifiedCount,
        highSeverityDifferences,
        mediumSeverityDifferences,
      },
      detailedEvidence: evidenceList.map((e) => ({
        feature: e.feature,
        status: e.status,
        severity: e.severity,
        finding: e.finding,
      })),
    };

    // Decision Rubric Questions
    const questions: Record<string, DecisionQuestion> = {
      risk: {
        type: 'choice',
        instructions:
          'Evaluate counterfeit risk probabilities based strictly on physical comparison evidence and authoritative manufacturer documentation.',
        criteria: {
          low: 'Matches verified manufacturer specifications, authentic typography, correct materials and consistent construction.',
          medium: 'Unverified serial number, minor cosmetic variances, or incomplete authoritative documentation.',
          high: 'Substantial discrepancies in logo placement, altered typography, invalid packaging, or documented counterfeit signs.',
        },
      },
    };

    // Run native WASM inference locally
    const output = await runDecision(head, {
      state: JSON.stringify(statePayload),
      questions,
    });

    const elapsed = Math.round(performance.now() - startTime);

    const riskOutput = output.risk || { low: 0.33, medium: 0.34, high: 0.33 };

    // Convert to percentage points (0 to 100)
    let pLow = Math.round(riskOutput.low * 100);
    let pMedium = Math.round(riskOutput.medium * 100);
    let pHigh = Math.round(riskOutput.high * 100);

    // Normalize so total strictly equals 100%
    const sum = pLow + pMedium + pHigh;
    if (sum !== 100) {
      const diff = 100 - sum;
      if (pHigh >= pMedium && pHigh >= pLow) {
        pHigh += diff;
      } else if (pMedium >= pLow) {
        pMedium += diff;
      } else {
        pLow += diff;
      }
    }

    // Determine dominant risk category
    let dominant: RiskTier = 'low';
    let dominantPercentage = pLow;

    if (pHigh >= pMedium && pHigh >= pLow) {
      dominant = 'high';
      dominantPercentage = pHigh;
    } else if (pMedium >= pHigh && pMedium >= pLow) {
      dominant = 'medium';
      dominantPercentage = pMedium;
    } else {
      dominant = 'low';
      dominantPercentage = pLow;
    }

    return {
      low: pLow,
      medium: pMedium,
      high: pHigh,
      dominant,
      dominantPercentage,
      executionTimeMs: elapsed,
      engine: 'Laya WASM (Convai ModernBERT Single-Pass)',
      rubricSummary: `Evaluated ${evidenceList.length} evidence features locally via WASM`,
    };
  }
}

export const layaService = new LayaEngineService();
