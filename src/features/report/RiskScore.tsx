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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

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
  }, [
    risk.dominantPercentage,
    risk.low,
    risk.medium,
    risk.high,
  ]);

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

  const tierLabel =
    risk.dominant === 'low'
      ? 'Low risk'
      : risk.dominant === 'medium'
      ? 'Medium risk'
      : 'High risk';

  const likelihoodLabel =
    risk.dominant === 'low'
      ? 'Likelihood of being authentic'
      : risk.dominant === 'medium'
      ? 'Likelihood of needing verification'
      : 'Likelihood of being inauthentic';

  const description =
    risk.dominant === 'low'
      ? 'The analysis found few signs that would suggest this product is inauthentic.'
      : risk.dominant === 'medium'
      ? 'The analysis found some signs that should be verified before trusting the product.'
      : 'The analysis found multiple signs associated with this product being inauthentic.';

  return (
    <div className="py-2 space-y-6 border-y border-white/[0.08]">

      {/* Main result */}
      <div>
        <div
          className="text-sm font-semibold mb-3"
          style={{ color: riskColor }}
        >
          {tierLabel}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-semibold tracking-tight text-[#F5F5F5] leading-none">
            {animatedPercentages.dominant}%
          </span>

          <span className="text-sm text-[#A6A7AB]">
            {likelihoodLabel}
          </span>
        </div>

        <p className="text-sm text-[#A6A7AB] leading-6 mt-3">
          {description}
        </p>
      </div>

      {/* Risk assessment */}
      <div className="space-y-3">
        <div>
          <div className="text-sm font-medium text-[#F5F5F5]">
            Confidence
          </div>

          <p className="text-xs text-[#A6A7AB] mt-1 leading-5">
            The model’s confidence in each risk level is shown below. Higher percentages indicate that the model found more evidence supporting that risk level.
          </p>
        </div>

        {/* Segmented bar */}
        <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden flex gap-0.5">
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

        {/* Risk labels */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-sm font-semibold text-[#F5F5F5]">
              {animatedPercentages.low}%
            </div>

            <div className="text-xs text-[#A6A7AB] mt-0.5">
            Looks authentic
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#F5F5F5]">
              {animatedPercentages.medium}%
            </div>

            <div className="text-xs text-[#A6A7AB] mt-0.5">
              Needs verification
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#F5F5F5]">
              {animatedPercentages.high}%
            </div>

            <div className="text-xs text-[#A6A7AB] mt-0.5">
              Potentially inauthentic
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};