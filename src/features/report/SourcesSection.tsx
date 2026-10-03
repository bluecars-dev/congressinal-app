import React from 'react';
import { SourceItem } from '../../types/product';
import { ExternalLink, CheckCircle, Shield, Globe } from 'lucide-react';

interface SourcesSectionProps {
  sources: SourceItem[];
}

export const SourcesSection: React.FC<SourcesSectionProps> = ({ sources }) => {
  const getSourceBadge = (type: string) => {
    switch (type) {
      case 'official':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide uppercase bg-white/10 text-[#F5F5F5] border border-white/20">
            Official Manufacturer
          </span>
        );
      case 'regulatory':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide uppercase bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/25">
            Regulatory Authority
          </span>
        );
      case 'retailer':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide uppercase bg-white/[0.06] text-[#A6A7AB] border border-white/10">
            Authorized Retailer
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide uppercase bg-white/[0.04] text-[#A6A7AB] border border-white/08">
            Reference Archive
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-widest text-[#A6A7AB] uppercase">
          Research Sources
        </span>
        <span className="text-[10px] font-mono text-[#A6A7AB]">
          {sources.length} sources analyzed
        </span>
      </div>

      {/* Sources List */}
      <div className="space-y-2.5">
        {sources.map((src) => (
          <a
            key={src.id}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-2xl glass-panel-subtle border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.06] group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {getSourceBadge(src.sourceType)}
                  {src.verifiedAuthority && (
                    <span className="flex items-center gap-1 text-[10px] text-[#4ADE80] font-mono">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <div className="text-xs font-medium text-[#F5F5F5] group-hover:text-white transition-colors truncate">
                  {src.title}
                </div>

                {src.summary && (
                  <p className="text-[11px] text-[#A6A7AB] leading-relaxed line-clamp-2">
                    {src.summary}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#A6A7AB]/70 pt-0.5">
                  <Globe className="w-3 h-3 text-[#A6A7AB]/60" />
                  <span>{src.domain}</span>
                </div>
              </div>

              <div className="p-1 rounded-lg text-[#A6A7AB] group-hover:text-[#F5F5F5] transition-colors flex-shrink-0">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
