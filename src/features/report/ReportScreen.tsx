import React, { useState } from 'react';
import { ProductAssessment } from '../../types/product';
import { RiskScore } from './RiskScore';
import { EvidenceItem } from './EvidenceItem';
import { HealthReport } from './HealthReport';
import { SourcesSection } from './SourcesSection';
import { ArrowLeft, Scan, Share2, Check } from 'lucide-react';

interface ReportScreenProps {
  assessment: ProductAssessment;
  onBack: () => void;
  onNewScan: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  assessment,
  onBack,
  onNewScan,
}) => {
  const [filter, setFilter] = useState<'all' | 'difference' | 'match' | 'unverified'>('all');
  const [copied, setCopied] = useState(false);

  const filteredEvidence = assessment.evidence.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const diffCount = assessment.evidence.filter((e) => e.status === 'difference').length;
  const matchCount = assessment.evidence.filter((e) => e.status === 'match').length;
  const unverifiedCount = assessment.evidence.filter((e) => e.status === 'unverified').length;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Verification Assessment: ${assessment.productIdentification.brand} ${assessment.productIdentification.product}`,
        text: `Screening report for ${assessment.productIdentification.brand} ${assessment.productIdentification.product}: ${assessment.risk.dominant.toUpperCase()} RISK (${assessment.risk.dominantPercentage}%).`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Verification Report: ${assessment.productIdentification.brand} ${assessment.productIdentification.product}\nAssessment: ${assessment.risk.dominant.toUpperCase()} RISK (${assessment.risk.dominantPercentage}%)\nEvidence findings: ${assessment.evidence.length}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] pb-28 max-w-md mx-auto select-none">
      {/* Editorial Navigation Bar */}
      <div className="sticky top-0 z-30 bg-[#0B0C0E]/90 backdrop-blur-md border-b border-white/[0.08] px-5 py-3.5 flex items-center justify-between">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 text-xs  text-[#A6A7AB] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-[11px]  tracking-widest text-[#A6A7AB] uppercase">
          Investigation Report
        </span>

        <button
          onClick={handleShare}
          type="button"
          className="p-1 text-[#A6A7AB] hover:text-[#F5F5F5] transition-colors"
          title="Share report summary"
          aria-label="Share report summary"
        >
          {copied ? <Check className="w-4 h-4 text-[#4ADE80]" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="px-5 pt-6 space-y-6">
        {/* Result Header: PRODUCT IDENTIFIED */}
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            {assessment.imageUrl && (
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black/40">
                <img
                  src={assessment.imageUrl}
                  alt={assessment.productIdentification.product}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-[10px]  tracking-widest uppercase text-[#A6A7AB] block">
                PRODUCT IDENTIFIED
              </span>
              <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5] leading-snug">
                {assessment.productIdentification.brand} {assessment.productIdentification.product}
              </h1>
              {assessment.productIdentification.model && (
                <p className="text-xs text-[#A6A7AB] ">
                  {assessment.productIdentification.model}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Risk Assessment Overview */}
        <RiskScore risk={assessment.risk} />

        {/* Evidence Findings Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs  font-semibold tracking-wider text-[#A6A7AB]">
              Evidence Findings ({assessment.evidence.length})
            </span>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 text-[10px] ">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  filter === 'all'
                    ? 'bg-white text-black font-semibold'
                    : 'text-[#A6A7AB] hover:text-[#F5F5F5]'
                }`}
              >
                All
              </button>
              {diffCount > 0 && (
                <button
                  onClick={() => setFilter('difference')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    filter === 'difference'
                      ? 'bg-[#FB7185]/20 text-[#FB7185] font-semibold border border-[#FB7185]/40'
                      : 'text-[#A6A7AB] hover:text-[#F5F5F5]'
                  }`}
                >
                  Diff ({diffCount})
                </button>
              )}
              {matchCount > 0 && (
                <button
                  onClick={() => setFilter('match')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    filter === 'match'
                      ? 'bg-[#4ADE80]/20 text-[#4ADE80] font-semibold border border-[#4ADE80]/40'
                      : 'text-[#A6A7AB] hover:text-[#F5F5F5]'
                  }`}
                >
                  Match ({matchCount})
                </button>
              )}
              {unverifiedCount > 0 && (
                <button
                  onClick={() => setFilter('unverified')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    filter === 'unverified'
                      ? 'bg-[#FBBF24]/20 text-[#FBBF24] font-semibold border border-[#FBBF24]/40'
                      : 'text-[#A6A7AB] hover:text-[#F5F5F5]'
                  }`}
                >
                  Unverified ({unverifiedCount})
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {filteredEvidence.map((ev) => (
              <EvidenceItem key={ev.id} evidence={ev} />
            ))}
          </div>
        </div>

        {/* Health & Safety Section */}
        <HealthReport health={assessment.health} />

        {/* Reference Sources Section */}
        <SourcesSection sources={assessment.sources} />

        {/* Evidence Screening Protocol Notice */}
        <div className="pt-2 pb-1 text-[11px]  text-[#A6A7AB]/70 leading-relaxed border-t border-white/[0.06]">
          Evidence-based screening assessment. This system does not claim to definitively prove authenticity or counterfeitness. All probabilities are calculated from visible physical markings compared against public authoritative references.
        </div>

        {/* Primary Scan Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onNewScan}
            className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase  hover:bg-[#ececec] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Scan className="w-4 h-4" />
            <span>Scan Another Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};
