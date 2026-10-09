
// src/features/dashboard/DashboardScreen.tsx

import React, { useEffect, useMemo, useState } from 'react';

import { maskKey } from '../../utils/crypto/crypto';
import { useAccess } from '../../auth/AuthProvider';

import {
  getGeminiKey,
  removeGeminiKey,
} from '../../settings/apiKeyStorage';

import {
  clearUsageStats,
  getUsageStats,
} from '../../usage/UsageTracker';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const DashboardScreen: React.FC = () => {
  const { setAccessState } = useAccess();

  const [key, setKey] = useState<string>('');
  const [usage, setUsage] = useState<any>(null);

  useEffect(() => {
    const storedKey = getGeminiKey();

    setKey(storedKey ?? '');
    setUsage(getUsageStats());
  }, []);

  const handleReplace = () => {
    removeGeminiKey();
    setAccessState('api_key_required');
  };

  const handleClearStats = () => {
    clearUsageStats();
    setUsage(null);
  };

  /*
   * Convert numeric usage properties into chart data.
   * This keeps the dashboard flexible if UsageTracker adds
   * additional numeric statistics later.
   */
  const chartData = useMemo(() => {
    if (!usage || typeof usage !== 'object') {
      return [];
    }

    return Object.entries(usage)
      .filter(
        ([, value]) =>
          typeof value === 'number' &&
          Number.isFinite(value)
      )
      .map(([name, value]) => ({
        name: name
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (char) => char.toUpperCase()),
        value: value as number,
      }))
      .slice(0, 8);
  }, [usage]);

  const numericValues = useMemo(() => {
    if (!usage || typeof usage !== 'object') {
      return [];
    }

    return Object.entries(usage).filter(
      ([, value]) =>
        typeof value === 'number' &&
        Number.isFinite(value)
    );
  }, [usage]);

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F5] px-6 py-8">

      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#A6A7AB]">
            Usage and account information
          </p>
        </div>

        {/* API Key */}
        <section className="bg-[#141517] border border-white/[0.08] rounded-xl p-5 mb-5">

          <div className="flex items-center justify-between gap-4">

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-[#77797D] mb-2">
                Gemini API Key
              </p>

              <p className=" text-sm text-[#D5D5D7] truncate">
                {key ? maskKey(key) : 'Not set'}
              </p>
            </div>

            {key && (
              <button
                type="button"
                onClick={handleReplace}
                className="shrink-0 px-4 py-2 rounded-lg bg-white text-black text-xs font-medium hover:bg-[#E8E8E8] transition-colors"
              >
                Replace
              </button>
            )}

          </div>

        </section>

        {/* Usage */}
        <section className="bg-[#141517] border border-white/[0.08] rounded-xl p-5 mb-5">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-base font-medium">
                Usage
              </h2>

              <p className="text-xs text-[#77797D] mt-1">
                Recorded application activity
              </p>
            </div>

            {usage && (
              <button
                type="button"
                onClick={handleClearStats}
                className="text-xs text-[#A6A7AB] hover:text-white transition-colors"
              >
                Clear
              </button>
            )}

          </div>

          {!usage ? (
            <div className="h-48 flex items-center justify-center border border-dashed border-white/[0.08] rounded-lg">
              <p className="text-sm text-[#77797D]">
                No usage data available
              </p>
            </div>
          ) : (
            <>
              {/* Summary Numbers */}
              {numericValues.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

                  {numericValues.slice(0, 4).map(
                    ([name, value]) => (
                      <div
                        key={name}
                        className="bg-[#0F1012] border border-white/[0.06] rounded-lg p-4"
                      >
                        <p className="text-xs text-[#77797D] truncate">
                          {name
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (char) =>
                              char.toUpperCase()
                            )}
                        </p>

<p className="text-xl font-semibold mt-2">
  {typeof value === 'number'
    ? value.toLocaleString()
    : typeof value === 'string'
      ? value
      : String(value ?? '')}
</p>
                      </div>
                    )
                  )}

                </div>
              )}

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="h-64 w-full">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: -20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.06)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        tick={{
                          fill: '#77797D',
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fill: '#77797D',
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        cursor={{
                          fill: 'rgba(255,255,255,0.03)',
                        }}
                        contentStyle={{
                          background: '#18191B',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#F5F5F5',
                          fontSize: '12px',
                        }}
                      />

                      <Bar
                        dataKey="value"
                        fill="#D4D4D8"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={42}
                      />

                    </BarChart>
                  </ResponsiveContainer>

                </div>
              )}

              {/* No numeric data */}
              {chartData.length === 0 && (
                <div className="h-48 flex items-center justify-center border border-white/[0.06] rounded-lg">
                  <p className="text-sm text-[#77797D]">
                    No numeric usage data available
                  </p>
                </div>
              )}
            </>
          )}

        </section>

        {/* Raw Data */}
        {usage && (
          <details className="bg-[#141517] border border-white/[0.08] rounded-xl mb-5">

            <summary className="cursor-pointer px-5 py-4 text-sm text-[#A6A7AB] hover:text-white transition-colors">
              View raw usage data
            </summary>

            <pre className="border-t border-white/[0.06] p-5 overflow-x-auto text-xs leading-5 text-[#77797D]">
              {JSON.stringify(usage, null, 2)}
            </pre>

          </details>
        )}

      </div>

    </div>
  );
};