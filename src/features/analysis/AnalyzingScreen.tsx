import React from 'react';
import { AnalysisProgress } from './GeminiAnalyzer';
import { Check, Circle } from 'lucide-react';

interface AnalyzingScreenProps {
  imagePreview: string;
  progress: AnalysisProgress;
}

export const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({
  imagePreview,
  progress,
}) => {
  const steps = [
    { id: 1, label: 'Product identified' },
    { id: 2, label: 'Manufacturer information found' },
    { id: 3, label: 'Reference information collected' },
    { id: 4, label: 'Comparing visible features' },
    { id: 5, label: 'Evaluating evidence (Laya WASM)' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col justify-between px-6 py-12 max-w-md mx-auto select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-[#A6A7AB] uppercase">
            Analysis in Progress
          </span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-[#F5F5F5]">
          ANALYZING
        </h2>
      </div>

      {/* Middle Content: Image Preview + Progress Steps */}
      <div className="space-y-8 my-auto py-6">
        {/* Thumbnail Preview */}
        {imagePreview && (
          <div className="w-28 h-28 mx-auto rounded-2xl glass-panel p-1.5 overflow-hidden shadow-md">
            <img
              src={imagePreview}
              alt="Analyzing product"
              className="w-full h-full object-cover rounded-xl opacity-90"
            />
          </div>
        )}

        {/* Steps List */}
        <div className="space-y-4 max-w-xs mx-auto">
          {steps.map((step) => {
            const isCompleted = step.id < progress.stepNumber;
            const isCurrent = step.id === progress.stepNumber;
            const isPending = step.id > progress.stepNumber;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3.5 transition-all duration-300 ${
                  isPending ? 'opacity-35' : 'opacity-100'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {isCompleted && (
                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[#4ADE80]">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  )}

                  {isCurrent && (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  )}

                  {isPending && (
                    <Circle className="w-3.5 h-3.5 text-[#6F7076]" />
                  )}
                </div>

                <span
                  className={`text-sm ${
                    isCurrent
                      ? 'text-[#F5F5F5] font-medium'
                      : isCompleted
                      ? 'text-[#E5E7EB]'
                      : 'text-[#6F7076]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Active Stage Detail */}
        <div className="text-center pt-2">
          <p className="text-xs font-mono text-[#A6A7AB] leading-relaxed">
            {progress.message || 'Building assessment...'}
          </p>
        </div>
      </div>

      {/* Footer System Specs */}
      <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#A6A7AB]/60">
        <span>Step {progress.stepNumber} of 5</span>
        <span>Local Client Inference</span>
      </div>
    </div>
  );
};
