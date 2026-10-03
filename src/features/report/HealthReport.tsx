import React from 'react';
import { HealthInformation } from '../../types/health';
import { AlertTriangle, CheckCircle2, ShieldCheck, HeartPulse, Info } from 'lucide-react';

interface HealthReportProps {
  health: HealthInformation;
}

export const HealthReport: React.FC<HealthReportProps> = ({ health }) => {
  if (!health.relevant) {
    return (
      <div className="glass-panel-subtle rounded-2xl p-5 border border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-[#A6A7AB]" />
          <span className="text-[11px] font-mono tracking-widest text-[#A6A7AB] uppercase">
            Health &amp; Safety
          </span>
        </div>
        <p className="text-xs text-[#E5E7EB] font-normal leading-relaxed">
          No significant health-related implications identified for this physical item.
        </p>
        <p className="text-[11px] text-[#A6A7AB] font-mono">
          Standard consumer product safety information is available from the manufacturer.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/12 space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-[#FB7185]" />
          <span className="text-[11px] font-mono tracking-widest text-[#FB7185] uppercase">
            Health &amp; Safety
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6A7AB] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/08">
          {health.category || 'Regulated Item'}
        </span>
      </div>

      <div className="text-xs text-[#F5F5F5] font-medium leading-relaxed">
        This product category may have direct health or biological implications.
      </div>

      {/* Authenticity Concern */}
      {health.authenticityConcern && (
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/08 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6A7AB]">
            Authenticity Concern
          </span>
          <p className="text-xs text-[#E5E7EB] leading-relaxed">
            {health.authenticityConcern}
          </p>
        </div>
      )}

      {/* Ingredients Verification */}
      {health.ingredients && health.ingredients.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6A7AB]">
            Formulation &amp; Ingredients
          </span>
          <div className="space-y-1.5">
            {health.ingredients.map((ing, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#E5E7EB]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80] mt-0.5 flex-shrink-0" />
                <span className="leading-snug">{ing}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allergen Information */}
      {health.allergens && health.allergens.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#FBBF24]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
              Allergen Notice
            </span>
          </div>
          {health.allergens.map((alg, i) => (
            <p key={i} className="text-xs text-[#F5F5F5] leading-relaxed">
              {alg}
            </p>
          ))}
        </div>
      )}

      {/* Warnings & Safety Notes */}
      {health.warnings && health.warnings.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6A7AB]">
            Precautionary Warnings
          </span>
          <div className="space-y-1.5">
            {health.warnings.map((warn, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#A6A7AB]">
                <span className="text-[#FB7185] font-mono mt-0.5">&bull;</span>
                <span className="leading-relaxed">{warn}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      {health.usageInstructions && (
        <div className="pt-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6A7AB] block mb-1">
            Usage Protocol
          </span>
          <p className="text-xs text-[#A6A7AB] leading-relaxed font-mono">
            {health.usageInstructions}
          </p>
        </div>
      )}

      {/* Mandatory Regulatory / Screening Disclaimer */}
      <div className="pt-3 border-t border-white/[0.08] flex items-start gap-2.5 text-[11px] text-[#A6A7AB]/75 leading-relaxed">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#A6A7AB]" />
        <span>{health.disclaimer}</span>
      </div>
    </div>
  );
};
