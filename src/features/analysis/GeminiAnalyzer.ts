// GeminiAnalyzer.ts
// Updated to use SupabaseSearchProvider (Diffbot) instead of Gemini Google Search grounding.

import { ProductAssessment, ProductIdentification, SourceItem } from '../../types/product';
import { Evidence } from '../../types/evidence';
import { HealthInformation } from '../../types/health';
import { RiskEngine } from '../risk/RiskEngine';
import { SearchProvider, WebResearchResult } from '../../search/SearchProvider';
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
  private static searchProvider: SearchProvider = new SupabaseSearchProvider();

  /**
   * Main analysis pipeline.
   * 1️⃣ Gemini image analysis → identification + researchQuery.
   * 2️⃣ SupabaseSearchProvider (Diffbot) → single authoritative page.
   * 3️⃣ Gemini evidence extraction using image, identification, observations, and page content.
   */
  public static async analyzeProduct(
    imageBase64: string,
    mimeType: string,
    accessToken?: string,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<ProductAssessment> {
    if (!accessToken) {
      throw new Error('Google authorization token is missing. Please sign in with Google to analyze products.');
    }

    const notify = (stage: AnalysisStage, message: string, step: number) => {
      if (onProgress) {
        onProgress({ stage, message, stepNumber: step, totalSteps: 4 });
      }
    };

    // Step 1: Identify product and generate a single research query.
    notify('identifying', 'Inspecting product markings and packaging...', 1);
    const { identification, visualObservations, researchQuery } = await this.queryGeminiForIdentification(
      imageBase64,
      mimeType,
      accessToken!
    );

    // Step 2: Retrieve authoritative web page via Diffbot.
    notify('researching_manufacturer', 'Fetching authoritative product specifications...', 2);
    let webResult: WebResearchResult | null = null;
    try {
      webResult = await this.searchProvider.search(researchQuery);
    } catch (e: any) {
      // Diffbot failure – handle gracefully.
      console.error('Search provider error:', e);
      // Continue with empty result so Gemini can mark evidence as unverified.
    }

    // Step 3: Generate evidence using Gemini, passing retrieved content.
    notify('comparing_features', 'Comparing physical features against reference data...', 3);
    const { evidence, health, sources, evidenceQuality } = await this.queryGeminiForEvidence(
      imageBase64,
      mimeType,
      accessToken!,
      identification,
      visualObservations,
      webResult
    );

    // Step 4: Risk evaluation.
    notify('evaluating_evidence', 'Calculating counterfeit-risk assessment...', 4);
    const riskResult = RiskEngine.evaluateRisk(identification, evidence, undefined);

    const assessment: ProductAssessment = {
      id: 'scan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      imageUrl: imageBase64,
      productIdentification: identification,
      evidence,
      health,
      sources,
      evidenceQuality,
      risk: riskResult,
    };

    notify('complete', 'Investigation complete', 4);
    return assessment;
  }

  /**
   * Calls Gemini to extract product identification and ONE research query.
   */
  private static async queryGeminiForIdentification(
    imageBase64: string,
    mimeType: string,
    accessToken: string
  ): Promise<{
    identification: ProductIdentification;
    visualObservations: string[];
    researchQuery: string;
  }> {
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    const prompt = `
You are an expert product verification analyst. Examine the provided product photograph and extract:
- Brand, product name, model/SKU (if visible), category, and confidence (0-100).
- A concise list of visual observations (max 5 items).
- ONE highly targeted research query that would retrieve the most authoritative specification page for this product.
Return ONLY a JSON object matching the following TypeScript type:

type ProductResearchRequest = {
  productIdentification: {
    brand: string;
    product: string;
    model?: string;
    category: string;
    confidence: number;
  };
  visualObservations: string[];
  researchQuery: string;
};
`;
    const requestBody = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: mimeType || 'image/jpeg',
                data: cleanBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
    };
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini identification failed (${response.status}): ${errText}`);
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gemini did not return a parsable JSON payload for identification.');
    }
    const parsed = JSON.parse(jsonMatch[0]);
    const id = parsed.productIdentification;
    const identification: ProductIdentification = {
      brand: id.brand,
      product: id.product,
      model: id.model,
      category: id.category,
      confidence: id.confidence,
    };
    return {
      identification,
      visualObservations: parsed.visualObservations || [],
      researchQuery: parsed.researchQuery,
    };
  }

  /**
   * Calls Gemini to generate structured evidence using the image, identification, observations, and web content.
   */
  private static async queryGeminiForEvidence(
    imageBase64: string,
    mimeType: string,
    accessToken: string,
    identification: ProductIdentification,
    visualObservations: string[],
    webResult: WebResearchResult | null
  ): Promise<{
    evidence: Evidence[];
    health: HealthInformation;
    sources: SourceItem[];
    evidenceQuality: number;
  }> {
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    const webContent = webResult ? `${webResult.title}\n${webResult.content}\nSource: ${webResult.url}` : '';
    const prompt = `
You are an expert evidence-based product verification investigator.
Using the product image (provided as binary), the identified product information, visual observations, and the following authoritative web content, produce structured evidence.

Product Identification:\n${JSON.stringify(identification, null, 2)}

Visual Observations:\n${visualObservations.map((o) => '- ' + o).join('\n')}

Web Content (if available):\n${webContent}\n
Return ONLY a JSON object matching the existing schema used by the frontend:

{
  "evidence": [
    {
      "id": "e1",
      "feature": "string",
      "finding": "string",
      "severity": "low" | "medium" | "high",
      "status": "match" | "difference" | "unverified",
      "source": "string",
      "referenceInfo": "string"
    }
  ],
  "health": { /* same health schema as before */ },
  "sources": [
    {
      "id": "s1",
      "title": "string",
      "url": "string",
      "sourceType": "official" | "regulatory" | "retailer" | "reference",
      "domain": "string",
      "verifiedAuthority": true,
      "summary": "string"
    }
  ],
  "evidenceQuality": number
}
`;
    const requestBody = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: mimeType || 'image/jpeg',
                data: cleanBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
    };
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini evidence generation failed (${response.status}): ${errText}`);
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gemini evidence response could not be parsed as JSON.');
    }
    const parsed = JSON.parse(jsonMatch[0]);
    const evidence: Evidence[] = (parsed.evidence || []).map((e: any) => ({
      id: e.id,
      feature: e.feature,
      finding: e.finding,
      severity: e.severity,
      status: e.status,
      source: e.source,
      referenceInfo: e.referenceInfo,
    }));
    const health: HealthInformation = parsed.health;
    const sources: SourceItem[] = (parsed.sources || []).map((s: any) => ({
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
      evidenceQuality: parsed.evidenceQuality || 85,
    };
  }
}
