import React, { useState } from 'react';
import { Evidence } from '../../types/evidence';
import { ChevronDown, ChevronUp, ExternalLink, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';

interface EvidenceItemProps {
  evidence: Evidence;
  productImageUrl?: string;
}

export const EvidenceItem: React.FC<EvidenceItemProps> = ({ evidence, productImageUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    if (evidence.status === 'match') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide uppercase bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/25">
          Match
        </span>
      );
    }
    if (evidence.status === 'unverified') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide uppercase bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/25">
          Unverified
        </span>
      );
    }
    // Difference with severity
    if (evidence.severity === 'high') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wide uppercase bg-[#FB7185]/15 text-[#FB7185] border border-[#FB7185]/25">
          High Diff
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide uppercase bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/25">
        Medium Diff
      </span>
    );
  };

  return (
    <div className="glass-panel-subtle rounded-2xl overflow-hidden border border-white/10 transition-colors hover:border-white/18">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4.5 flex items-start justify-between gap-3"
      >
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge()}
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F5] font-mono">
              {evidence.feature}
            </span>
          </div>

          <p className="text-xs text-[#A6A7AB] font-normal leading-relaxed line-clamp-2">
            {evidence.finding}
          </p>
        </div>

        <div className="p-1 rounded-lg text-[#A6A7AB] flex-shrink-0 mt-0.5">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#F5F5F5]" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <div className="px-4.5 pb-4.5 pt-1 border-t border-white/[0.06] space-y-3.5 text-xs animate-fade-in">
          {/* Side by side comparison (Your Image vs Reference) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/08 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6A7AB]">
                Your Image
              </span>
              {productImageUrl ? (
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-black/40 border border-white/05 relative">
                  <img
                    src={productImageUrl}
                    alt="Inspection target"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-white/[0.04] pointer-events-none" />
                </div>
              ) : (
                <div className="w-full aspect-[4/3] rounded-lg bg-black/40 flex items-center justify-center text-[10px] text-[#A6A7AB]">
                  Sample Target
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/08 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6A7AB]">
                Manufacturer Standard
              </span>
              <div className="w-full aspect-[4/3] rounded-lg bg-black/40 p-2 border border-white/05 flex flex-col justify-center text-[11px] text-[#E5E7EB] leading-tight">
                {evidence.referenceInfo || 'Documented engineering specifications'}
              </div>
            </div>
          </div>

          {/* Finding Detailed Analysis */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6A7AB]">
              Finding
            </span>
            <p className="text-xs text-[#F5F5F5] leading-relaxed">
              {evidence.finding}
            </p>
          </div>

          {/* Source Citation */}
          {evidence.source && (
            <div className="space-y-1 pt-1 border-t border-white/[0.04]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6A7AB]">
                Authoritative Reference
              </span>
              <p className="text-[11px] font-mono text-[#E5E7EB]">
                {evidence.source}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
