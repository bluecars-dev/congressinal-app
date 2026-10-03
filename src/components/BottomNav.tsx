import React from 'react';
import { Home, History, Scan } from 'lucide-react';

export type NavTab = 'home' | 'history';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenScanner: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenScanner,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pointer-events-none pb-safe">
      <div className="mx-6 mb-5 pointer-events-auto">
        <div className="glass-panel rounded-full px-6 py-2.5 flex items-center justify-between border border-white/15 shadow-2xl backdrop-blur-heavy">
          {/* Home Tab (⌂) */}
          <button
            type="button"
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'home' ? 'text-[#F5F5F5]' : 'text-[#A6A7AB] hover:text-[#E5E7EB]'
            }`}
          >
            <Home className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-mono tracking-wider">Home</span>
          </button>

          {/* Visually Dominant Scan Action (◉) */}
          <button
            type="button"
            onClick={onOpenScanner}
            aria-label="Open Camera Scanner"
            className="w-14 h-14 -my-4 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-[#ececec]"
          >
            <Scan className="w-6 h-6 stroke-[2.2]" />
          </button>

          {/* History Tab (◷) */}
          <button
            type="button"
            onClick={() => onTabChange('history')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'history' ? 'text-[#F5F5F5]' : 'text-[#A6A7AB] hover:text-[#E5E7EB]'
            }`}
          >
            <History className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-mono tracking-wider">History</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
