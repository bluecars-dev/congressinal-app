import React from 'react';

import { ProductAssessment } from '../../types/product';
import { Scan, ChevronRight } from 'lucide-react';

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

    const text =
      tier === 'low'
        ? 'Low risk'
        : tier === 'medium'
        ? 'Medium risk'
        : 'High risk';

    const color =
      tier === 'low'
        ? '#4ADE80'
        : tier === 'medium'
        ? '#FBBF24'
        : '#FB7185';

    return { text: `${text} · ${pct}%`, color };
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-6 max-w-md mx-auto w-full">

      {/* Evident Logo */}
      <div className="pt-4">
 <img
  src="/evident-logo.png"
  alt="Evident"
  className="w-[32vw] max-w-[500px] min-w-[380px] h-auto object-contain"
/>
      </div>

      {/* Scan */}
      <div className="my-auto py-10 flex flex-col items-center">
        <button
          type="button"
          onClick={onOpenScanner}
          className="w-full aspect-[16/10] max-h-52 rounded-3xl glass-panel-interactive flex flex-col items-center justify-center gap-4 p-6 text-center group active:scale-[0.985]"
        >
          <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-105 active:scale-95 transition-transform shadow-lg">
            <Scan className="w-8 h-8 stroke-[2]" />
          </div>

          <span className="text-lg font-semibold text-[#F5F5F5]">
            Scan product
          </span>
        </button>

        <p className="mt-5 text-sm text-[#A6A7AB] text-center leading-relaxed max-w-xs">
          Take a photo to check product details and identify potential warning signs.
        </p>
      </div>

      {/* Recent Scan */}
      {recentScan && (
        <div className="pb-16 pt-2">
          <div className="text-xs font-medium text-[#A6A7AB] mb-3 px-1">
            Recent scan
          </div>

          <button
            type="button"
            onClick={() => onSelectScan(recentScan)}
            className="w-full text-left p-4 rounded-2xl glass-panel-subtle flex items-center justify-between gap-3 group active:scale-[0.99] transition-all"
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
                <div className="text-sm font-medium text-[#F5F5F5] truncate">
                  {recentScan.productIdentification.brand}{' '}
                  {recentScan.productIdentification.product}
                </div>

                <div
                  className="text-xs font-medium pt-0.5"
                  dangerouslySetInnerHTML={{
                    __html: getRiskLabel(recentScan).text,
                  }}
                  style={{ color: getRiskLabel(recentScan).color }}
                />
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#72747A] flex-shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
};