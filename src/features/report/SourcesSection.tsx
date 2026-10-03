import React from 'react';
import { SourceItem } from '../../types/product';
import { ExternalLink } from 'lucide-react';

interface SourcesSectionProps {
  sources: SourceItem[];
}

export const SourcesSection: React.FC<SourcesSectionProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="py-4 border-t border-white/[0.08] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A6A7AB]">
          REFERENCE SOURCES ({sources.length})
        </span>
      </div>

      <div className="space-y-1.5">
        {sources.map((src) => (
          <a
            key={src.id}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] active:scale-[0.99] transition-all group"
          >
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-[#F5F5F5] group-hover:text-white truncate">
                {src.title}
              </div>
              <div className="text-[10px] font-mono text-[#A6A7AB] flex items-center gap-2 pt-0.5">
                <span className="uppercase">{src.sourceType}</span>
                <span>&bull;</span>
                <span className="truncate">{src.domain}</span>
              </div>
            </div>

            <ExternalLink className="w-3.5 h-3.5 text-[#A6A7AB] group-hover:text-[#F5F5F5] flex-shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};
