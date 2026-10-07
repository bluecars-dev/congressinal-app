import React, { useEffect, useState } from 'react';
import { RiskResult } from '../../types/risk';

interface RiskScoreProps {
  risk: RiskResult;
}

export const RiskScore: React.FC<RiskScoreProps> = ({ risk }) => {
  const [animatedPercentages, setAnimatedPercentages] = useState({
    dominant: 0,
    low: 0,
    medium: 0,
    high: 0,
  });

  // Micro-interaction: Smooth counter and bar animation on mount
  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setAnimatedPercentages({
        dominant: risk.dominantPercentage,
        low: risk.low,
        medium: risk.medium,
        high: risk.high,
      });
      return;
    }

    const duration = 650;
    const start = performance.now();

    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setAnimatedPercentages({
        dominant: Math.round(ease * risk.dominantPercentage),
        low: Math.round(ease * risk.low),
        medium: Math.round(ease * risk.medium),
        high: Math.round(ease * risk.high),
      });

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [risk.dominantPercentage, risk.low, risk.medium, risk.high]);

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
    <div className="py-2 space-y-5 border-y border-white/[0.08]">
      {/* Top Assessment Overview */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span
            className="text-xs  font-semibold tracking-wider uppercase"
            style={{ color: riskColor }}
          >
            {tierLabel}
          </span>
          <span className="text-[11px]  text-[#A6A7AB]">
        
          </span>
        </div>

        {/* Large Dominant Percentage */}
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold tracking-tight text-[#F5F5F5]  leading-none">
            {animatedPercentages.dominant}%
          </span>
        </div>
        <p className="text-[11px] text-[#A6A7AB]  pt-0.5">
          Confidence
        </p>
      </div>

      {/* Clean Horizontal Distribution Bar */}
      <div className="space-y-2.5 pt-1">
        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden flex gap-0.5">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${animatedPercentages.low}%`,
              backgroundColor: '#4ADE80',
            }}
          />
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${animatedPercentages.medium}%`,
              backgroundColor: '#FBBF24',
            }}
          />
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${animatedPercentages.high}%`,
              backgroundColor: '#FB7185',
            }}
          />
        </div>

        {/* Statistical Probability Breakdown */}
        <div className="grid grid-cols-3 text-left pt-1 gap-2 ">
          <div>
            <div className="text-sm font-semibold text-[#F5F5F5]">
              {animatedPercentages.low}%
            </div>
            <div className="text-[10px] text-[#A6A7AB] leading-tight mt-0.5">
              Low-risk probability
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#F5F5F5]">
              {animatedPercentages.medium}%
            </div>
            <div className="text-[10px] text-[#A6A7AB] leading-tight mt-0.5">
              Medium-risk probability
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#F5F5F5]">
              {animatedPercentages.high}%
            </div>
            <div className="text-[10px] text-[#A6A7AB] leading-tight mt-0.5">
              High-risk probability
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
