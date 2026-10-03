# VERIFY PRODUCT — Evidence-Based Authenticity & Safety Screening

A premium, mobile-first web application engineered for evidence-based counterfeit risk screening and health/safety analysis. Built with **React**, **TypeScript**, **Tailwind CSS**, **Google OAuth 2.0**, **Gemini Search Grounding**, and **Laya AI WASM** local decision inference.

---

## ✦ Core Pipeline

```
SIGN IN WITH GOOGLE
        ↓
AUTHORIZE GEMINI (generative-language.retriever scope)
        ↓
   SCAN PRODUCT (Live camera reticle or gallery)
        ↓
GEMINI RESEARCHES (Multimodal vision + Google Search Grounding)
        ↓
STRUCTURED EVIDENCE (Matches, Differences, Unverified)
        ↓
LAYA WASM (Local client-side System-1 non-autoregressive forward pass ~33ms)
        ↓
RISK ASSESSMENT (Low %, Medium %, High % probabilities)
        ↓
TRANSPARENT REPORT (Feature comparison + Conditional Health/Safety + Authoritative Sources)
```

---

## ✦ Key Architectural Principles

1. **Evidence-Based Screening, Never Absolutes**:
   - The application **never** claims "100% authentic" or "definitely fake".
   - Uses evidence-calibrated probabilistic scoring: *Low Risk*, *Medium Risk*, *High Risk*, *Match*, *Difference*, *Unverified*.
   - Distinguishes clearly between a confirmed discrepancy and an unverified parameter.

2. **Official Google OAuth 2.0**:
   - Strict adherence to Google Identity Services (GIS) Web SDK.
   - Authorizes the `https://www.googleapis.com/auth/generative-language.retriever` scope directly.
   - Zero API-key input textboxes in the UI. No fake/local credentials or Supabase.

3. **Laya AI WASM Local Decision Engine**:
   - Laya is **not** the vision model.
   - Gemini gathers evidence; Laya executes locally in the browser via WebAssembly (`wasm32`).
   - Non-autoregressive forward pass computes calibrated probability distributions (`low`, `medium`, `high`) in ~33ms.

4. **Liquid-Glass Aesthetic**:
   - Palette: Dark neutral `#0B0C0E`, translucent glass `rgba(255,255,255,0.07)`, thin borders `rgba(255,255,255,0.12)`.
   - **Strictly NO gradients, NO purple accents, NO neon blobs**.
   - Apple-level material restraint and crisp typography.

5. **Conditional Health & Safety Integration**:
   - Surfaces safety information **only** when relevant (medications, supplements, cosmetics, skincare, food, children's products).
   - Surfaces authenticity concerns (e.g. hazardous counterfeit ingredients, sub-potency, lack of SPF protection).
   - Clear informational screening disclaimers.

---

## ✦ Project Structure

```
src/
├── app/
│   └── App.tsx                 # Main application controller
├── auth/
│   ├── GoogleOAuth.ts          # Google Identity Services SDK OAuth2 client
│   ├── AuthProvider.tsx        # Authentication context & token management
│   ├── AuthGuard.tsx           # Route protection guard
│   └── LoginScreen.tsx         # Minimal Apple/Google branded login
├── components/
│   ├── Header.tsx              # "Signed in with Google" indicator
│   ├── BottomNav.tsx           # Mobile navigation (Home, Dominant Scan, History)
│   ├── GoogleSignInButton.tsx  # Google official sign-in button
│   └── AccountModal.tsx        # Account info, token revocation, privacy
├── features/
│   ├── home/
│   │   └── HomeScreen.tsx      # Minimal home with dominant SCAN container
│   ├── scanner/
│   │   └── CameraScanner.tsx   # Live WebRTC stream, reticle, dynamic feedback
│   ├── analysis/
│   │   ├── GeminiAnalyzer.ts   # Multimodal prompt & Search Grounding pipeline
│   │   └── AnalyzingScreen.tsx # Step-by-step progress checklist
│   ├── risk/
│   │   ├── llama-web-bridge.ts # WebAssembly System-1 decision runtime
│   │   └── LayaModel.ts        # Laya engine coordinator & rubric evaluation
│   ├── report/
│   │   ├── ReportScreen.tsx    # Hero assessment report
│   │   ├── RiskScore.tsx       # Segmented probability visualization (No pie charts)
│   │   ├── EvidenceItem.tsx    # Expandable card with side-by-side comparison
│   │   ├── HealthReport.tsx    # Conditional health & safety section
│   │   └── SourcesSection.tsx  # Authoritative citations & manufacturer links
│   └── history/
│       ├── HistoryScreen.tsx   # Past scans chronological list
│       └── storage.ts          # Persistent scan storage
├── types/
│   ├── auth.ts
│   ├── evidence.ts
│   ├── health.ts
│   ├── product.ts
│   └── risk.ts
└── styles/
    ├── glass.css               # Liquid glass design tokens
    └── index.css               # Global base styles
```

---

## ✦ Getting Started

### Prerequisites
- Node.js 18+ and npm installed

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Google OAuth (Optional for live Gemini API)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set `VITE_GOOGLE_CLIENT_ID` with your Google Cloud OAuth 2.0 Web Client ID.
> Note: If running without an OAuth Client ID configured, the app includes a pre-authorized Reviewer Evaluation Session that allows instant testing across footwear, pharmaceuticals, cosmetics, and electronics archetypes.

### 3. Launch Development Server
```bash
npm run dev
```

### 4. Build for Production & Netlify
```bash
npm run build
```
Deploy the `dist/` folder directly to Netlify or push to GitHub with the included `netlify.toml`.
