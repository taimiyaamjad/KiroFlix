import React from 'react';
import { Search, Heart, Clock } from 'lucide-react';

interface NavbarProps {
  activeTab: 'browse' | 'trending' | 'watchlist' | 'history';
  setActiveTab: (tab: 'browse' | 'trending' | 'watchlist' | 'history') => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#181B22] bg-[#08090C]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand wordmark */}
        <button
          onClick={() => setActiveTab('browse')}
          className="text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-red-500 transition-colors flex items-center gap-2 group cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 group-hover:scale-125 transition-transform" />
          <span className="font-display">Animo</span>
        </button>

        {/* Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <button
            onClick={() => setActiveTab('browse')}
            className={`cursor-pointer transition-colors hover:text-white ${
              activeTab === 'browse' ? 'text-white font-semibold' : ''
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`cursor-pointer transition-colors hover:text-white ${
              activeTab === 'trending' ? 'text-white font-semibold' : ''
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`cursor-pointer transition-colors hover:text-white flex items-center gap-1.5 ${
              activeTab === 'watchlist' ? 'text-white font-semibold' : ''
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-neutral-400" />
            Watchlist
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`cursor-pointer transition-colors hover:text-white flex items-center gap-1.5 ${
              activeTab === 'history' ? 'text-white font-semibold' : ''
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            History
          </button>
        </nav>

        {/* Search Action */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onOpenSearch}
            aria-label="Search anime"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-300 bg-[#12151D] hover:bg-[#1A1F2B] border border-[#222736] rounded-md transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden lg:inline text-[10px] text-neutral-500 font-mono bg-[#0D0F14] px-1.5 py-0.5 rounded border border-[#222736]">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
