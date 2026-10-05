// src/features/analysis/GeminiAnalyzer.ts
// Updated to use user‑provided Gemini API key (stored locally) and SupabaseSearchProvider (Diffbot) for research.

import { ProductAssessment, ProductIdentification, SourceItem } from '../../types/product';
import { Evidence } from '../../types/evidence';
import { HealthInformation } from '../../types/health';
import { RiskEngine } from '../risk/RiskEngine';
import { SearchProvider, WebResearchResult } from '../../search/SearchProvider';
import { SupabaseSearchProvider } from '../../search/SupabaseSearchProvider';
import { getGeminiKey } from '../../settings/apiKeyStorage';

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

  /** Main pipeline */
  public static async analyzeProduct(
    imageBase64: string,
    mimeType: string,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<ProductAssessment> {
    const apiKey = getGeminiKey();
    if (!apiKey) {
      throw new Error('Gemini API key missing. Please configure it in Settings.');
    }

    const notify = (stage: AnalysisStage, message: string, step: number) => {
      if (onProgress) {
        onProgress({ stage, message, stepNumber: step, totalSteps: 4 });
      }
    };

    // 1️⃣ Identify product & generate a single research query
    notify('identifying', 'Inspecting product markings and packaging...', 1);
    const { identification, visualObservations, researchQuery } = await this.queryGeminiForIdentification(
      imageBase64,
      mimeType,
      apiKey
    );

    // 2️⃣ Retrieve authoritative web page via Diffbot (SupabaseSearchProvider)
    notify('researching_manufacturer', 'Fetching authoritative product specifications...', 2);
    let webResult: WebResearchResult | null = null;
    try {
      webResult = await this.searchProvider.search(researchQuery);
    } catch (e: any) {
      console.error('Search provider error:', e);
    }

    // 3️⃣ Generate evidence using Gemini, feeding the web content
    notify('comparing_features', 'Comparing physical features against reference data...', 3);
    const { evidence, health, sources, evidenceQuality } = await this.queryGeminiForEvidence(
      imageBase64,
      mimeType,
      apiKey,
      identification,
      visualObservations,
      webResult
    );

    // 4️⃣ Risk evaluation
    notify('evaluating_evidence', 'Calculating counterfeit‑risk assessment...', 4);
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

  /** Identify product and produce ONE research query */
  private static async queryGeminiForIdentification(
    imageBase64: string,
    mimeType: string,
    apiKey: string
  ): Promise<{ identification: ProductIdentification; visualObservations: string[]; researchQuery: string }> {
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    const prompt = `\
You are an expert product verification analyst. Examine the provided product photograph and extract:\n- Brand, product name, model/SKU (if visible), category, and confidence (0‑100).\n- A concise list of visual observations (max 5 items).\n- ONE highly targeted research query that would retrieve the most authoritative specification page for this product.\nReturn ONLY a JSON object matching this TypeScript type:\n\ntype ProductResearchRequest = {\n  productIdentification: {\n    brand: string;\n    product: string;\n    model?: string;\n    category: string;\n    confidence: number;\n  };\n  visualObservations: string[];\n  researchQuery: string;\n};\n`;
    const requestBody = {
      contents: [
        {
          parts: [
            { inline_data: { mime_type: mimeType || 'image/jpeg', data: cleanBase64 } },
            { text: prompt },
          ],
        },
      ],
    };
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
    );
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini identification failed (${response.status}): ${err}`);
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gemini did not return parsable JSON for identification.');
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
    return { identification, visualObservations: parsed.visualObservations || [], researchQuery: parsed.researchQuery };
  }

  /** Generate structured evidence using image, identification, observations, and optional web content */
  private static async queryGeminiForEvidence(
    imageBase64: string,
    mimeType: string,
    apiKey: string,
    identification: ProductIdentification,
    visualObservations: string[],
    webResult: WebResearchResult | null
  ): Promise<{ evidence: Evidence[]; health: HealthInformation; sources: SourceItem[]; evidenceQuality: number }> {
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    const webContent = webResult ? `${webResult.title}\n${webResult.content}\nSource: ${webResult.url}` : '';
    const prompt = `\
You are an expert evidence‑based product verification investigator. Using the product image (binary), the identified product information, visual observations, and the following authoritative web content, produce structured evidence.\n\nProduct Identification:\n${JSON.stringify(identification, null, 2)}\n\nVisual Observations:\n${visualObservations.map((o) => '- ' + o).join('\n')}\n\nWeb Content (if available):\n${webContent}\n\nReturn ONLY a JSON object matching the frontend schema:\n{\n  "evidence": [{"id":"e1","feature":"string","finding":"string","severity":"low"|"medium"|"high","status":"match"|"difference"|"unverified","source":"string","referenceInfo":"string"}],\n  "health": {/* same as existing */},\n  "sources": [{"id":"s1","title":"string","url":"string","sourceType":"official"|"regulatory"|"retailer"|"reference","domain":"string","verifiedAuthority":true,"summary":"string"}],\n  "evidenceQuality": number\n}\n`;
    const requestBody = {
      contents: [
        {
          parts: [
            { inline_data: { mime_type: mimeType || 'image/jpeg', data: cleanBase64 } },
            { text: prompt },
          ],
        },
      ],
    };
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
    );
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini evidence generation failed (${response.status}): ${err}`);
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') ?? '';
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
    return { evidence, health, sources, evidenceQuality: parsed.evidenceQuality || 85 };
  }
}
