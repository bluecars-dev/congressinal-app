import React from 'react';
import { ProductAssessment } from '../../types/product';
import { Scan, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

interface HomeScreenProps {
  onOpenScanner: () => void;
  recentScan: ProductAssessment | null;
  onSelectScan: (assessment: ProductAssessment) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenScanner,
  recentScan,
  onSelectScan,
}) => {
  const getRiskLabel = (assessment: ProductAssessment) => {
    const tier = assessment.risk.dominant;
    const pct = assessment.risk.dominantPercentage;
    const text = tier === 'low' ? 'Low risk' : tier === 'medium' ? 'Medium risk' : 'High risk';
    const color = tier === 'low' ? '#4ADE80' : tier === 'medium' ? '#FBBF24' : '#FB7185';
    return { text: `${text} &middot; ${pct}%`, color };
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-6 max-w-md mx-auto w-full select-none">
      {/* Brand & Mission Statement */}
      <div className="pt-4 space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight leading-[1.1] text-[#F5F5F5]">
          VERIFY<br />PRODUCT
        </h1>

        <p className="text-base text-[#A6A7AB] font-normal leading-relaxed">
          Know what you&apos;re looking at.<br />
          Understand the evidence.
        </p>
      </div>

      {/* Dominant SCAN Interactive Area */}
      <div className="my-auto py-8 flex flex-col items-center space-y-6">
        {/* Dominant Scan Action Container */}
        <button
          type="button"
          onClick={onOpenScanner}
          className="w-full aspect-[16/10] max-h-52 rounded-3xl glass-panel-interactive flex flex-col items-center justify-center gap-3 p-6 text-center border border-white/15 group shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Corner Markers */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/30 rounded-tl-md" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/30 rounded-tr-md" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/30 rounded-bl-md" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/30 rounded-br-md" />

          <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-105 active:scale-95 transition-transform shadow-lg">
            <Scan className="w-8 h-8 stroke-[2]" />
          </div>

          <span className="text-lg font-semibold tracking-wide text-[#F5F5F5] uppercase font-mono">
            SCAN
          </span>
        </button>

        <p className="text-xs text-[#A6A7AB] text-center font-normal leading-relaxed max-w-xs">
          Analyze products for authenticity, risk &amp; safety.
        </p>
      </div>

      {/* Recent Scan Card */}
      {recentScan && (
        <div className="pb-16 pt-2">
          <div className="text-[11px] font-mono tracking-widest text-[#A6A7AB] uppercase mb-2 px-1">
            Recent scan
          </div>

          <button
            type="button"
            onClick={() => onSelectScan(recentScan)}
            className="w-full text-left p-4 rounded-2xl glass-panel-subtle border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              {recentScan.imageUrl && (
                <div className="w-10 h-10 rounded-xl overflow-hidden glass-panel flex-shrink-0 p-0.5">
                  <img
                    src={recentScan.imageUrl}
                    alt={recentScan.productIdentification.product}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#F5F5F5] truncate group-hover:text-white transition-colors">
                  {recentScan.productIdentification.brand} {recentScan.productIdentification.product}
                </div>
                <div
                  className="text-[11px] font-mono font-medium pt-0.5"
                  dangerouslySetInnerHTML={{ __html: getRiskLabel(recentScan).text }}
                  style={{ color: getRiskLabel(recentScan).color }}
                />
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#A6A7AB] group-hover:text-[#F5F5F5] transition-colors flex-shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
};
