// src/app/App.tsx

import React, { useState, useEffect } from 'react';

import { AccessProvider, useAccess } from '../auth/AuthProvider';

import { Header } from '../components/Header';
import { BottomNav, NavTab } from '../components/BottomNav';

import { HomeScreen } from '../features/home/HomeScreen';
import { HistoryScreen } from '../features/history/HistoryScreen';
import { CameraScanner } from '../features/scanner/CameraScanner';
import { AnalyzingScreen } from '../features/analysis/AnalyzingScreen';
import { ReportScreen } from '../features/report/ReportScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';

import {
  GeminiAnalyzer,
  AnalysisProgress,
} from '../features/analysis/GeminiAnalyzer';

import { ScanStorage } from '../features/history/storage';
import { ProductAssessment } from '../types/product';

import {
  AlertCircle,
  RotateCcw,
  Camera,
} from 'lucide-react';

import { PrivacyConsentScreen } from '../onboarding/PrivacyConsentScreen';

const MainAppContent: React.FC = () => {
  const { accessState } = useAccess();

  // Onboarding flow
  if (accessState === 'privacy_required') {
    return <PrivacyConsentScreen />;
  }

  // Ready state — full app UI
  const [activeTab, setActiveTab] = useState<
    NavTab | 'settings'
  >('home');

  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const [activeImagePreview, setActiveImagePreview] =
    useState<string>('');

  const [activeMimeType, setActiveMimeType] =
    useState<string>('image/jpeg');

  const [analysisError, setAnalysisError] =
    useState<string | null>(null);

  const [analysisProgress, setAnalysisProgress] =
    useState<AnalysisProgress>({
      stage: 'idle',
      message: '',
      stepNumber: 0,
      totalSteps: 4,
    });

  const [currentAssessment, setCurrentAssessment] =
    useState<ProductAssessment | null>(null);

  const [historyScans, setHistoryScans] =
    useState<ProductAssessment[]>([]);

  // Load persisted scans
  useEffect(() => {
    const stored = ScanStorage.getScans();
    setHistoryScans(stored);
  }, []);

  const runAnalysis = async (
    base64Image: string,
    mimeType: string
  ) => {
    setAnalysisError(null);
    setIsAnalyzing(true);

    try {
      const result = await GeminiAnalyzer.analyzeProduct(
        base64Image,
        mimeType,
        (progress) => setAnalysisProgress(progress)
      );

      ScanStorage.saveScan(result);

      setHistoryScans((prev) => [
        result,
        ...prev.filter((i) => i.id !== result.id),
      ]);

      setCurrentAssessment(result);
    } catch (err: any) {
      console.error('Gemini investigation failed:', err);

      setAnalysisError(
        err.message ||
          'Unable to complete product investigation.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCapture = (
    base64Image: string,
    mimeType: string
  ) => {
    setIsScannerOpen(false);

    setActiveImagePreview(base64Image);
    setActiveMimeType(mimeType);

    runAnalysis(base64Image, mimeType);
  };

  const handleRetry = () => {
    if (activeImagePreview) {
      runAnalysis(
        activeImagePreview,
        activeMimeType
      );
    }
  };

  const handleSelectRecent = (
    assessment: ProductAssessment
  ) => {
    setCurrentAssessment(assessment);
  };

  const handleClearHistory = () => {
    ScanStorage.clearHistory();
    setHistoryScans([]);
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col justify-between selection:bg-white/20 selection:text-white relative">

      {isScannerOpen && (
        <CameraScanner
          onCapture={handleCapture}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      {isAnalyzing && (
        <AnalyzingScreen
          imagePreview={activeImagePreview}
          progress={analysisProgress}
        />
      )}

      {analysisError && !isAnalyzing && (
        <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col justify-between px-6 py-14 max-w-md mx-auto select-none">

          <div className="space-y-4 pt-6">

            <span className="text-[11px] font-mono tracking-widest text-[#FB7185] uppercase block">
              Investigation Error
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F5]">
              UNABLE TO COMPLETE INVESTIGATION
            </h2>

            {activeImagePreview && (
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 my-4 bg-black/40">
                <img
                  src={activeImagePreview}
                  alt="Failed scan target"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">

              <div className="flex items-center gap-2 text-[#FB7185] text-xs font-mono">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Error details</span>
              </div>

              <p className="text-xs text-[#A6A7AB] font-mono leading-relaxed">
                {analysisError}
              </p>

            </div>

            <p className="text-xs text-[#A6A7AB] leading-relaxed">
              The application requires an authorized Gemini response
              and will not present fabricated evidence.
            </p>

          </div>

          <div className="space-y-3 pt-6">

            <button
              type="button"
              onClick={handleRetry}
              className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase font-mono hover:bg-[#ececec] transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Investigation</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAnalysisError(null);
                setIsScannerOpen(true);
              }}
              className="w-full py-3.5 rounded-full border border-white/15 text-[#F5F5F5] font-semibold text-xs tracking-wider uppercase font-mono hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Take New Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setAnalysisError(null)}
              className="w-full py-2.5 text-xs text-[#A6A7AB] hover:text-[#F5F5F5] font-mono transition-colors text-center"
            >
              Return Home
            </button>

          </div>

        </div>
      )}

      {currentAssessment &&
        !isAnalyzing &&
        !isScannerOpen &&
        !analysisError && (
          <ReportScreen
            assessment={currentAssessment}
            onBack={() => setCurrentAssessment(null)}
            onNewScan={() => {
              setCurrentAssessment(null);
              setIsScannerOpen(true);
            }}
          />
        )}

      {!currentAssessment &&
        !isAnalyzing &&
        !isScannerOpen &&
        !analysisError && (
          <>
            <Header />

            <main className="flex-1 flex flex-col">

              {activeTab === 'settings' && (
                <SettingsScreen />
              )}

              {activeTab === 'home' && (
                <HomeScreen
                  onOpenScanner={() =>
                    setIsScannerOpen(true)
                  }
                  recentScan={
                    historyScans[0] || null
                  }
                  onSelectScan={
                    handleSelectRecent
                  }
                />
              )}

              {activeTab === 'history' && (
                <HistoryScreen
                  scans={historyScans}
                  onSelectScan={
                    handleSelectRecent
                  }
                  onClearHistory={
                    handleClearHistory
                  }
                />
              )}

            </main>

            <BottomNav
              activeTab={activeTab as any}
              onTabChange={(tab) =>
                setActiveTab(tab as any)
              }
              onOpenScanner={() =>
                setIsScannerOpen(true)
              }
            />
          </>
        )}

    </div>
  );
};

export const App: React.FC = () => (
  <AccessProvider>
    <MainAppContent />
  </AccessProvider>
);

export default App;