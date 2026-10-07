import React, { useState } from 'react';
import { Evidence } from '../../types/evidence';
import { ChevronDown, ChevronUp, ArrowDown } from 'lucide-react';

interface EvidenceItemProps {
  evidence: Evidence;
}

export const EvidenceItem: React.FC<EvidenceItemProps> = ({ evidence }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    switch (evidence.status) {
      case 'match':
        return (
          <span className="text-[10px]  font-semibold tracking-wider  text-[#4ADE80] px-2 py-0.5 rounded bg-[#4ADE80]/10 border border-[#4ADE80]/20">
            Match
          </span>
        );
      case 'difference':
        return (
          <span className="text-[10px]  font-semibold tracking-wider  text-[#FB7185] px-2 py-0.5 rounded bg-[#FB7185]/10 border border-[#FB7185]/20">
            Difference
          </span>
        );
      case 'unverified':
      default:
        return (
          <span className="text-[10px]  font-semibold tracking-wider  text-[#FBBF24] px-2 py-0.5 rounded bg-[#FBBF24]/10 border border-[#FBBF24]/20">
            Unverified
          </span>
        );
    }
  };

  return (
    <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.035] transition-colors">
      {/* Primary Row: What was examined, Match state, What was found, Where it came from */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-start justify-between gap-3 active:bg-white/[0.04] transition-colors"
      >
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* 1. What was examined + 3. Match state */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs  font-semibold  tracking-wider text-[#F5F5F5]">
              {evidence.feature}
            </span>
            {getStatusBadge()}
          </div>

          {/* 2. What was found */}
          <p className="text-xs text-[#E5E7EB] font-normal leading-relaxed">
            {evidence.finding}
          </p>

          {/* 4. Where the evidence came from */}
          {evidence.source && (
            <div className="pt-1 text-[11px]  text-[#A6A7AB] flex items-center gap-1.5">
              <span className="uppercase text-[9px] text-[#A6A7AB]/70 tracking-wider">Source:</span>
              <span className="truncate">{evidence.source}</span>
            </div>
          )}
        </div>

        {/* Tactile disclosure toggle */}
        <div className="p-1 rounded text-[#A6A7AB] flex-shrink-0 mt-0.5">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#F5F5F5]" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded Investigation Detail: Finding -> Reference -> Source */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] bg-black/20 space-y-3.5 text-xs animate-fade-in">
          {/* Finding -> Reference -> Source chain */}
          <div className="space-y-2 pt-1  text-[11px]">
            {/* Finding */}
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="text-[9px] tracking-widest text-[#A6A7AB]">Finding</div>
              <div className="text-[#F5F5F5] font-sans text-xs">{evidence.finding}</div>
            </div>

            <div className="flex justify-center text-[#A6A7AB]/40 py-0.5">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Reference */}
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="text-[9px] tracking-widest text-[#A6A7AB]">Reference</div>
              <div className="text-[#E5E7EB] font-sans text-xs">
                {evidence.referenceInfo || 'Manufacturer standard specification'}
              </div>
            </div>

            <div className="flex justify-center text-[#A6A7AB]/40 py-0.5">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Source */}
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="text-[9px] tracking-widest text-[#A6A7AB]">Source</div>
              <div className="text-[#E5E7EB] font-sans text-xs">
                {evidence.source || 'Official product specifications'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
