import React from 'react';
import { RiskResult } from '../../types/risk';
import { Cpu } from 'lucide-react';

interface RiskScoreProps {
  risk: RiskResult;
}

export const RiskScore: React.FC<RiskScoreProps> = ({ risk }) => {
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

  const riskColor = getRiskColor(risk.dominant);
  const tierLabel = `${risk.dominant.toUpperCase()} RISK`;

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/12 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-widest text-[#A6A7AB] uppercase">
          Risk Assessment
        </span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono text-[#A6A7AB]">
          <Cpu className="w-3 h-3 text-[#A6A7AB]" />
          <span>Laya WASM &middot; {risk.executionTimeMs}ms</span>
        </div>
      </div>

      {/* Hero Dominant Percentage */}
      <div className="space-y-1">
        <div
          className="text-xs font-semibold tracking-wider font-mono"
          style={{ color: riskColor }}
        >
          {tierLabel}
        </div>
        <div className="text-6xl font-bold tracking-tight text-[#F5F5F5] font-mono">
          {risk.dominantPercentage}%
        </div>
      </div>

      {/* Clean Horizontal Segmented Bar (NO PIE CHARTS) */}
      <div className="space-y-2.5 pt-1">
        <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden flex gap-1 p-0.5">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${risk.low}%`,
              backgroundColor: '#4ADE80',
            }}
            title={`Low Risk: ${risk.low}%`}
          />
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${risk.medium}%`,
              backgroundColor: '#FBBF24',
            }}
            title={`Medium Risk: ${risk.medium}%`}
          />
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${risk.high}%`,
              backgroundColor: '#FB7185',
            }}
            title={`High Risk: ${risk.high}%`}
          />
        </div>

        {/* Breakdown Values */}
        <div className="grid grid-cols-3 text-[11px] font-mono pt-1 text-[#A6A7AB]">
          <div>
            <div className="text-[10px] text-[#A6A7AB]/70 uppercase">Low</div>
            <div className="text-[#F5F5F5] font-medium mt-0.5">{risk.low}%</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#A6A7AB]/70 uppercase">Medium</div>
            <div className="text-[#F5F5F5] font-medium mt-0.5">{risk.medium}%</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#A6A7AB]/70 uppercase">High</div>
            <div className="text-[#F5F5F5] font-medium mt-0.5">{risk.high}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
