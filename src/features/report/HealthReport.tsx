import React from 'react';
import { HealthInformation } from '../../types/health';

interface HealthReportProps {
  health: HealthInformation;
}

export const HealthReport: React.FC<HealthReportProps> = ({ health }) => {
  // If not relevant: compact contextual statement without giant empty card
  if (!health.relevant) {
    return (
      <div className="py-2 text-[11px]  text-[#A6A7AB] border-t border-white/[0.06]">
        <span>Health &amp; Safety: </span>
        <span className="text-[#A6A7AB]/80">No health-related concerns documented for this product category.</span>
      </div>
    );
  }

  // If relevant: professional investigation format
  return (
    <div className="py-4 border-t border-white/[0.08] space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs  font-semibold uppercase tracking-wider text-[#FB7185]">
          HEALTH &amp; SAFETY
        </span>
        {health.category && (
          <span className="text-[10px]  uppercase text-[#A6A7AB]">
            Category: {health.category}
          </span>
        )}
      </div>

      {/* Why this matters */}
      {health.authenticityConcern && (
        <div className="space-y-1">
          <div className="text-[10px]  uppercase tracking-wider text-[#A6A7AB]">
            Why this matters
          </div>
          <p className="text-xs text-[#E5E7EB] leading-relaxed">
            {health.authenticityConcern}
          </p>
        </div>
      )}

      {/* Warnings / Formulation Notes */}
      {health.warnings && health.warnings.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px]  uppercase tracking-wider text-[#A6A7AB]">
            Precautionary notices
          </div>
          <ul className="space-y-1 text-xs text-[#A6A7AB] list-disc list-inside">
            {health.warnings.map((warn, i) => (
              <li key={i} className="leading-relaxed">
                {warn}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Allergens / Ingredients */}
      {health.allergens && health.allergens.length > 0 && (
        <div className="p-3 rounded-lg bg-white/[0.025] border border-white/[0.06] text-xs space-y-1">
          <div className="text-[10px]  uppercase tracking-wider text-[#FBBF24]">
            Allergen Information
          </div>
          <p className="text-[#F5F5F5]">{health.allergens.join(', ')}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="pt-2 text-[10px]  text-[#A6A7AB]/70 leading-relaxed">
        {health.disclaimer}
      </div>
    </div>
  );
};
