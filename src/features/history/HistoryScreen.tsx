import React from 'react';
import { ProductAssessment } from '../../types/product';
import { ChevronRight, Trash2, History } from 'lucide-react';

interface HistoryScreenProps {
  scans: ProductAssessment[];
  onSelectScan: (assessment: ProductAssessment) => void;
  onClearHistory: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  scans,
  onSelectScan,
  onClearHistory,
}) => {
  const getRiskColor = (tier: string) => {
    switch (tier) {
      case 'low':
        return '#4ADE80';
      case 'medium':
        return '#FBBF24';
      case 'high':
        return '#FB7185';
      default:
        return '#E5E7EB';
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-6 max-w-md mx-auto w-full pb-28 select-none">
      {/* Title Header */}
      <div className="pt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F5]">
          YOUR SCANS
        </h1>

        {scans.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-[11px] font-mono text-[#A6A7AB] hover:text-[#FB7185] transition-colors flex items-center gap-1.5"
            title="Clear scan history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <p className="text-xs text-[#A6A7AB] mt-1 font-mono">
        {scans.length} screening assessments recorded
      </p>

      {/* History List */}
      <div className="mt-8 space-y-3">
        {scans.length === 0 ? (
          <div className="py-16 text-center space-y-3 glass-panel-subtle rounded-3xl p-6 border border-white/08">
            <History className="w-8 h-8 text-[#A6A7AB] mx-auto" />
            <p className="text-sm text-[#F5F5F5] font-medium">No Scans Yet</p>
            <p className="text-xs text-[#A6A7AB] max-w-xs mx-auto">
              Tap the center scan button to photograph and analyze your first product.
            </p>
          </div>
        ) : (
          scans.map((scan, idx) => {
            const riskColor = getRiskColor(scan.risk.dominant);
            return (
              <button
                key={scan.id || idx}
                type="button"
                onClick={() => onSelectScan(scan)}
                className="w-full text-left p-4.5 rounded-2xl glass-panel-subtle border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {scan.imageUrl && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden glass-panel flex-shrink-0 p-0.5 border border-white/10">
                      <img
                        src={scan.imageUrl}
                        alt={scan.productIdentification.product}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="min-w-0 space-y-0.5">
                    <div className="text-xs font-mono tracking-wider uppercase text-[#A6A7AB]">
                      {scan.productIdentification.brand}
                    </div>
                    <div className="text-sm font-semibold text-[#F5F5F5] truncate group-hover:text-white transition-colors">
                      {scan.productIdentification.product}
                    </div>
                    <div className="text-[11px] font-mono flex items-center gap-2 pt-0.5">
                      <span
                        className="font-medium uppercase"
                        style={{ color: riskColor }}
                      >
                        {scan.risk.dominant} RISK &middot; {scan.risk.dominantPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#A6A7AB] group-hover:text-[#F5F5F5] transition-colors flex-shrink-0" />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
