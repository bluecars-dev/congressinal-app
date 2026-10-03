import { Evidence } from '../../types/evidence';
import { ProductIdentification } from '../../types/product';
import { RiskResult, RiskTier } from '../../types/risk';

/**
 * Laya Decision Layer Status & Integration Interface
 *
 * Requirements for local Laya WASM inference:
 * 1. Base encoder context binary: 'laya_modernbert.gguf'
 * 2. Decision head weights: 'laya_typed_head.safetensors'
 * 3. Browser WASM bridge runtime
 *
 * When the binary assets are not packaged locally in the workspace,
 * the engine directly evaluates the structured evidence findings from Gemini
 * without fabricating WASM metrics or simulation latencies.
 */

export class RiskEngine {
  /**
   * Evaluates structured evidence to calculate counterfeit risk probabilities
   */
  public static evaluateRisk(
    product: ProductIdentification,
    evidenceList: Evidence[],
    geminiProbabilities?: { low: number; medium: number; high: number }
  ): RiskResult {
    // If Gemini provided direct grounded probabilities from search and visual comparison, use and normalize them
    if (geminiProbabilities) {
      let { low, medium, high } = geminiProbabilities;
      // Ensure positive values
      low = Math.max(0, Math.round(low));
      medium = Math.max(0, Math.round(medium));
      high = Math.max(0, Math.round(high));

      const total = low + medium + high;
      if (total > 0) {
        low = Math.round((low / total) * 100);
        medium = Math.round((medium / total) * 100);
        high = Math.max(0, 100 - low - medium);
      } else {
        low = 33;
        medium = 34;
        high = 33;
      }

      let dominant: RiskTier = 'low';
      let dominantPercentage = low;

      if (high >= medium && high >= low) {
        dominant = 'high';
        dominantPercentage = high;
      } else if (medium >= high && medium >= low) {
        dominant = 'medium';
        dominantPercentage = medium;
      }

      return {
        low,
        medium,
        high,
        dominant,
        dominantPercentage,
      };
    }

    // Deterministic evidence evaluation based on grounded observations
    const matchCount = evidenceList.filter((e) => e.status === 'match').length;
    const diffList = evidenceList.filter((e) => e.status === 'difference');
    const unverifiedCount = evidenceList.filter((e) => e.status === 'unverified').length;

    const highSeverityDifferences = diffList.filter((e) => e.severity === 'high').length;
    const mediumSeverityDifferences = diffList.filter((e) => e.severity === 'medium').length;

    let highLogit = highSeverityDifferences * 3.0 + mediumSeverityDifferences * 1.5;
    let mediumLogit = unverifiedCount * 1.0 + mediumSeverityDifferences * 1.0;
    let lowLogit = matchCount * 1.8;

    if (evidenceList.length === 0) {
      lowLogit = 1.0;
      mediumLogit = 1.0;
      highLogit = 1.0;
    } else if (highSeverityDifferences > 0) {
      lowLogit = Math.max(0, lowLogit - highSeverityDifferences * 2.5);
    }

    // Softmax normalization
    const maxL = Math.max(lowLogit, mediumLogit, highLogit);
    const expLow = Math.exp(lowLogit - maxL);
    const expMed = Math.exp(mediumLogit - maxL);
    const expHigh = Math.exp(highLogit - maxL);
    const sumExp = expLow + expMed + expHigh;

    let pLow = Math.round((expLow / sumExp) * 100);
    let pMed = Math.round((expMed / sumExp) * 100);
    let pHigh = Math.max(0, 100 - pLow - pMed);

    let dominant: RiskTier = 'low';
    let dominantPercentage = pLow;

    if (pHigh >= pMed && pHigh >= pLow) {
      dominant = 'high';
      dominantPercentage = pHigh;
    } else if (pMed >= pHigh && pMed >= pLow) {
      dominant = 'medium';
      dominantPercentage = pMed;
    }

    return {
      low: pLow,
      medium: pMed,
      high: pHigh,
      dominant,
      dominantPercentage,
    };
  }
}
