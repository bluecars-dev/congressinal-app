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
    { id: 1, label: 'Identifying product markings' },
    { id: 2, label: 'Searching manufacturer specifications' },
    { id: 3, label: 'Comparing features against references' },
    { id: 4, label: 'Calculating risk assessment' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] flex flex-col justify-between px-6 py-14 max-w-md mx-auto select-none">
      {/* Top Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-[#F5F5F5]">
          INVESTIGATING
        </h2>
      </div>

      {/* Middle Content: Image Preview + Progress Steps */}
      <div className="space-y-8 my-auto py-6">
        {/* Thumbnail Preview */}
        {imagePreview && (
          <div className="w-24 h-24 mx-auto rounded-xl border border-white/10 p-1 overflow-hidden bg-black/40">
            <img
              src={imagePreview}
              alt="Inspecting product"
              className="w-full h-full object-cover rounded-lg opacity-90"
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
                  isPending ? 'opacity-30' : 'opacity-100'
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
          <p className="text-xs  text-[#A6A7AB] leading-relaxed">
            {progress.message || 'Examining product evidence...'}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px]  text-[#A6A7AB]/60">
        <span>Step {Math.min(progress.stepNumber, 4)} of 4</span>
        <span>Reference verification active</span>
      </div>
    </div>
  );
};
