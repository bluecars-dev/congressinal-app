import React, { useState } from 'react';
import { ProductAssessment } from '../../types/product';
import { RiskScore } from './RiskScore';
import { EvidenceItem } from './EvidenceItem';
import { HealthReport } from './HealthReport';
import { SourcesSection } from './SourcesSection';
import { ArrowLeft, Share2, Scan, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

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
        `Verification Report: ${assessment.productIdentification.brand} ${assessment.productIdentification.product}\nRisk Tier: ${assessment.risk.dominant.toUpperCase()} (${assessment.risk.dominantPercentage}%)\nEvidence Items: ${assessment.evidence.length}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] pb-28 max-w-md mx-auto select-none">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-30 bg-[#0B0C0E]/80 backdrop-blur-glass border-b border-white/[0.08] px-5 py-3.5 flex items-center justify-between">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 text-xs font-mono text-[#A6A7AB] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-[11px] font-mono tracking-widest text-[#A6A7AB] uppercase">
          Assessment Report
        </span>

        <button
          onClick={handleShare}
          type="button"
          className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-[#A6A7AB] hover:text-[#F5F5F5] transition-colors"
          title="Share assessment summary"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="px-5 pt-6 space-y-6">
        {/* Product Identity Header */}
        <div className="flex items-start gap-4">
          {assessment.imageUrl && (
            <div className="w-20 h-20 rounded-2xl glass-panel p-1 flex-shrink-0 overflow-hidden border border-white/12 shadow-sm">
              <img
                src={assessment.imageUrl}
                alt="Product inspected"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          )}

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono tracking-widest uppercase text-[#A6A7AB]">
                {assessment.productIdentification.brand}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-[#A6A7AB] border border-white/08">
                {assessment.productIdentification.confidence}% ID Confidence
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5] leading-tight truncate">
              {assessment.productIdentification.product}
            </h1>

            {assessment.productIdentification.model && (
              <p className="text-xs text-[#A6A7AB] truncate">
                {assessment.productIdentification.model}
              </p>
            )}

            {assessment.productIdentification.upcOrSerial && (
              <p className="text-[10px] font-mono text-[#A6A7AB]/70 pt-0.5">
                Ref: {assessment.productIdentification.upcOrSerial}
              </p>
            )}
          </div>
        </div>

        {/* Hero Risk Assessment Card */}
        <RiskScore risk={assessment.risk} />

        {/* Evidence Section */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-widest text-[#A6A7AB] uppercase">
              Evidence ({assessment.evidence.length})
            </span>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[10px] font-mono">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  filter === 'all'
                    ? 'bg-white text-black font-medium'
                    : 'text-[#A6A7AB] hover:text-[#F5F5F5]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('difference')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  filter === 'difference'
                    ? 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/30'
                    : 'text-[#A6A7AB] hover:text-[#F5F5F5]'
                }`}
              >
                Diff ({diffCount})
              </button>
              <button
                onClick={() => setFilter('match')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  filter === 'match'
                    ? 'bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30'
                    : 'text-[#A6A7AB] hover:text-[#F5F5F5]'
                }`}
              >
                Match ({matchCount})
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredEvidence.map((ev) => (
              <EvidenceItem
                key={ev.id}
                evidence={ev}
                productImageUrl={assessment.imageUrl}
              />
            ))}
          </div>
        </div>

        {/* Health & Safety Section */}
        <HealthReport health={assessment.health} />

        {/* Research Sources Section */}
        <SourcesSection sources={assessment.sources} />

        {/* Evidence-Based Screening Legal Notice */}
        <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] flex items-start gap-3 text-xs text-[#A6A7AB] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#A6A7AB] mt-0.5 flex-shrink-0" />
          <div className="space-y-1 text-[11px]">
            <span className="font-medium text-[#F5F5F5] block">
              Evidence-Based Screening System
            </span>
            <p>
              This system does not claim to definitively prove that an item is authentic or counterfeit. Assessments are probabilistic risk evaluations computed locally from structured evidence.
            </p>
          </div>
        </div>

        {/* Action Button: Scan Another Item */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onNewScan}
            className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#ececec] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Scan className="w-4 h-4" />
            <span>Scan Another Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};
