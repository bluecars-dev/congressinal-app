// src/features/analysis/GeminiAnalyzer.ts

import {
  ProductAssessment,
  ProductIdentification,
  SourceItem,
} from '../../types/product';

import { Evidence } from '../../types/evidence';
import { HealthInformation } from '../../types/health';
import { RiskEngine } from '../risk/RiskEngine';

import {
  SearchProvider,
  WebResearchResult,
} from '../../search/SearchProvider';

import { SupabaseSearchProvider } from '../../search/SupabaseSearchProvider';

export type AnalysisStage =
  | 'idle'
  | 'identifying'
  | 'researching_manufacturer'
  | 'comparing_features'
  | 'evaluating_evidence'
  | 'complete'
  | 'error';

export interface AnalysisProgress {
  stage: AnalysisStage;
  message: string;
  stepNumber: number;
  totalSteps: number;
}

export class GeminiAnalyzer {
  private static searchProvider: SearchProvider =
    new SupabaseSearchProvider();

  /**
   * Supabase Edge Function used to securely call Gemini.
   *
   * The Gemini API key remains inside the Edge Function.
   */
  private static readonly GEMINI_FUNCTION_URL =
    import.meta.env.VITE_SUPABASE_URL + "e";

  /**
   * Main analysis pipeline.
   */
  public static async analyzeProduct(
    imageBase64: string,
    mimeType: string,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<ProductAssessment> {
    const notify = (
      stage: AnalysisStage,
      message: string,
      step: number
    ) => {
      onProgress?.({
        stage,
        message,
        stepNumber: step,
        totalSteps: 4,
      });
    };

    // 1. Identify product
    notify(
      'identifying',
      'Inspecting product markings and packaging...',
      1
    );

    const {
      identification,
      visualObservations,
      researchQuery,
    } = await this.queryGeminiForIdentification(
      imageBase64,
      mimeType
    );

    // 2. Retrieve authoritative web information
    notify(
      'researching_manufacturer',
      'Fetching authoritative product specifications...',
      2
    );

    let webResult: WebResearchResult | null = null;

    try {
      webResult = await this.searchProvider.search(researchQuery);
    } catch (error) {
      console.error('Search provider error:', error);
    }

    // 3. Generate evidence
    notify(
      'comparing_features',
      'Comparing physical features against reference data...',
      3
    );

    const {
      evidence,
      health,
      sources,
      evidenceQuality,
    } = await this.queryGeminiForEvidence(
      imageBase64,
      mimeType,
      identification,
      visualObservations,
      webResult
    );

    // 4. Calculate risk
    notify(
      'evaluating_evidence',
      'Calculating counterfeit-risk assessment...',
      4
    );

    const riskResult = RiskEngine.evaluateRisk(
      identification,
      evidence,
      undefined
    );

    const assessment: ProductAssessment = {
      id:
        'scan-' +
        Date.now() +
        '-' +
        Math.random().toString(36).substring(2, 7),

      timestamp: Date.now(),

      imageUrl: imageBase64,

      productIdentification: identification,

      evidence,

      health,

      sources,

      evidenceQuality,

      risk: riskResult,
    };

    notify(
      'complete',
      'Investigation complete',
      4
    );

    return assessment;
  }

  /**
   * Calls the Supabase Edge Function.
   *
   * The browser does NOT receive the Gemini API key.
   */
  private static async callGemini(
    prompt: string,
    imageBase64?: string
  ): Promise<string> {
    const supabaseAnonKey =
      import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseAnonKey) {
      throw new Error(
        'Supabase configuration is missing. Please check your environment variables.'
      );
    }

    const response = await fetch(
      this.GEMINI_FUNCTION_URL,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',

          // Supabase public project key.
          // This is NOT the Gemini API key.
          apikey: supabaseAnonKey,

          // Satisfies Supabase's authorization requirement.
          Authorization: `Bearer ${supabaseAnonKey}`,
        },

        body: JSON.stringify({
          prompt,
          imageData: imageBase64,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Gemini service failed (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();

    if (!data.content) {
      throw new Error(
        'Gemini service returned an empty response.'
      );
    }

    return data.content;
  }

  /**
   * Identify product and produce ONE research query.
   */
  private static async queryGeminiForIdentification(
    imageBase64: string,
    mimeType: string
  ): Promise<{
    identification: ProductIdentification;
    visualObservations: string[];
    researchQuery: string;
  }> {
    const prompt = `You are an expert product verification analyst specializing in detecting counterfeit and falsified products.

Examine the provided product photograph carefully. Your goal is to identify the product and find visible signs that may indicate it is counterfeit. Do not declare the product counterfeit based on appearance alone. Identify evidence that should be verified against authoritative sources.

Identify:
- Brand
- Product name
- Model/SKU if visible
- Category
- Confidence from 0-100

Look specifically for common counterfeit indicators, including:
- Incorrect, distorted, or poorly placed logos
- Spelling or grammar errors
- Incorrect fonts, colors, or typography
- Inconsistent labels, tags, or packaging
- Missing or incorrect model/SKU/serial numbers
- Unusual product proportions, shapes, or construction
- Incorrect stitching, seams, molding, hardware, or finishing
- Materials, textures, or colors that appear inconsistent with the genuine product
- Missing safety, regulatory, or required labeling
- Packaging or markings that appear inconsistent with the identified product
- Visible discrepancies between different product markings
- Suspicious or inconsistent manufacturing details

Only report signs that are actually visible in the photograph. Do not invent or assume counterfeit indicators.

IMPORTANT: Do not fill the observation list just to reach the maximum. Return only the strongest relevant observations. Maximum 5 observations; fewer is better than irrelevant or repetitive observations.

Do not report generic observations such as "the product is black," "it looks expensive," or "the quality looks bad" unless that specific feature is relevant to verifying authenticity.

Do not determine authenticity. The observations will be compared against authoritative product information during a later verification stage.

Create ONE highly targeted research query that will find the most authoritative information about the genuine product, preferably the manufacturer's official specification/product page.

If the exact model is known:
"[brand] [product] [model/SKU] official specifications"

If the model is unknown:
"[brand] [product] official specifications"

Return ONLY a JSON object matching this exact structure:

{
  "productIdentification": {
    "brand": "string",
    "product": "string",
    "model": "string",
    "category": "string",
    "confidence": 0
  },
  "visualObservations": ["string"],
  "researchQuery": "string"
}`;

    const text = await this.callGemini(
      prompt,
      imageBase64
    );

    const parsed = this.parseJsonResponse(text);

    const id = parsed.productIdentification;

    if (!id) {
      throw new Error(
        'Gemini did not return product identification.'
      );
    }

    const identification: ProductIdentification = {
      brand: id.brand,
      product: id.product,
      model: id.model,
      category: id.category,
      confidence: id.confidence,
    };

    return {
      identification,
      visualObservations:
        parsed.visualObservations || [],
      researchQuery:
        parsed.researchQuery || '',
    };
  }

  /**
   * Generate structured evidence using:
   * - Product image
   * - Product identification
   * - Visual observations
   * - Retrieved web content
   */
  private static async queryGeminiForEvidence(
    imageBase64: string,
    mimeType: string,
    identification: ProductIdentification,
    visualObservations: string[],
    webResult: WebResearchResult | null
  ): Promise<{
    evidence: Evidence[];
    health: HealthInformation;
    sources: SourceItem[];
    evidenceQuality: number;
  }> {
    const webContent = webResult
      ? `
Title:
${webResult.title}

Content:
${webResult.content}

Source:
${webResult.url}
`
      : 'No authoritative web content was available.';

    const prompt = `
You are an expert evidence-based product verification investigator.

Using the product image, identified product information, visual observations,
and the authoritative web content below, produce structured evidence.

Product Identification:
${JSON.stringify(identification, null, 2)}

Visual Observations:
${visualObservations
  .map((observation) => `- ${observation}`)
  .join('\n')}

Authoritative Web Content:
${webContent}


Possible Health Concerns:
- Hazardous ingredients like nicotine, lead, mercury, or other toxic substances
- Allergens like peanuts, gluten, or shellfish
- Safety warnings like choking hazards, flammability, or electrical risks
- Usage instructions like dosage, frequency, or age restrictions


Return ONLY a JSON object matching this structure:
{
  "evidence": [
    {
      "id": "e1",
      "feature": "string",
      "finding": "string",
      "severity": "low",
      "status": "match",
      "source": "string",
      "referenceInfo": "string"
    }
  ],
  "health": {
    "relevant": false,
    "category": "",
    "authenticityConcern": "",
    "warnings": [],
    "allergens": [],
    "disclaimer": "This is a preliminary screening, not a substitute for professional advice."
  },
  "sources": [
    {
      "id": "s1",
      "title": "string",
      "url": "string",
      "sourceType": "official",
      "domain": "string",
      "verifiedAuthority": true,
      "summary": "string"
    }
  ],
  "evidenceQuality": 0
}

Allowed evidence severity values:
"low" | "medium" | "high"

Allowed evidence status values:
"match" | "difference" | "unverified"

Allowed source types:
"official" | "regulatory" | "retailer" | "reference"
`;

    const text = await this.callGemini(
      prompt,
      imageBase64
    );

    const parsed = this.parseJsonResponse(text);

    const evidence: Evidence[] = (
      parsed.evidence || []
    ).map((e: any) => ({
      id: e.id,
      feature: e.feature,
      finding: e.finding,
      severity: e.severity,
      status: e.status,
      source: e.source,
      referenceInfo: e.referenceInfo,
    }));

    const rawHealth = parsed.health ?? {};

const health: HealthInformation = {
  relevant: rawHealth.relevant === true,
  category:
    typeof rawHealth.category === 'string'
      ? rawHealth.category
      : '',
  authenticityConcern:
    typeof rawHealth.authenticityConcern === 'string'
      ? rawHealth.authenticityConcern
      : '',
  warnings: Array.isArray(rawHealth.warnings)
    ? rawHealth.warnings.filter(
        (item: unknown): item is string =>
          typeof item === 'string'
      )
    : [],
  allergens: Array.isArray(rawHealth.allergens)
    ? rawHealth.allergens.filter(
        (item: unknown): item is string =>
          typeof item === 'string'
      )
    : [],
  disclaimer:
    typeof rawHealth.disclaimer === 'string'
      ? rawHealth.disclaimer
      : 'This is a preliminary screening, not a substitute for professional advice.',
};
    const sources: SourceItem[] = (
      parsed.sources || []
    ).map((s: any) => ({
      id: s.id,
      title: s.title,
      url: s.url,
      sourceType: s.sourceType,
      domain: s.domain,
      verifiedAuthority: s.verifiedAuthority,
      summary: s.summary,
    }));

    return {
      evidence,
      health,
      sources,
      evidenceQuality:
        parsed.evidenceQuality ?? 85,
    };
  }

  /**
   * Safely extract JSON from Gemini's response.
   */
  private static parseJsonResponse(
    text: string
  ): any {
    try {
      return JSON.parse(text);
    } catch {
      const jsonMatch = text.match(
        /\{[\s\S]*\}/
      );

      if (!jsonMatch) {
        throw new Error(
          'Gemini returned a response that could not be parsed as JSON.'
        );
      }

      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        throw new Error(
          'Gemini returned malformed JSON.'
        );
      }
    }
  }
}