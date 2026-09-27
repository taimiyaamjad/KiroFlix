import React from 'react';
import { Play, X, Clock } from 'lucide-react';
import { WatchProgress } from '../types/auth';
import { StorageService } from '../services/storageService';

interface ContinueWatchingRowProps {
  items: WatchProgress[];
  onResume: (seriesId: string, episodeId: string) => void;
  onRefresh: () => void;
}

export const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({
  items,
  onResume,
  onRefresh
}) => {
  if (!items || items.length === 0) return null;

  const handleRemove = (e: React.MouseEvent, seriesId: string) => {
    e.stopPropagation();
    StorageService.clearSeriesProgress(seriesId);
    onRefresh();
  };

  return (
    <section className="mb-10 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500" />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
            Continue Watching
          </h2>
        </div>
        <span className="text-xs text-neutral-400 font-medium">
          {items.length} {items.length === 1 ? 'title' : 'titles'} in progress
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          const percent = item.duration > 0
            ? Math.min(100, Math.round((item.currentTime / item.duration) * 100))
            : 0;
          const remainingMinutes = Math.max(1, Math.round((item.duration - item.currentTime) / 60));

          return (
            <div
              key={`${item.seriesId}-${item.episodeId}`}
              onClick={() => onResume(item.seriesId, item.episodeId)}
              className="group relative bg-[#0D1017] border border-[#191E2B] hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-md"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                <img
                  src={item.seriesImage}
                  alt={item.seriesTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => handleRemove(e, item.seriesId)}
                  title="Remove from history"
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/90 text-neutral-400 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Progress bar */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/70">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Information */}
              <div className="p-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1 font-medium">
                  <span className="text-red-400 font-mono-numbers">
                    S0{item.seasonNumber} E0{item.episodeNumber}
                  </span>
                  <span className="font-mono-numbers">{remainingMinutes}m left</span>
                </div>

                <h3 className="font-semibold text-white text-sm truncate group-hover:text-red-400 transition-colors">
                  {item.seriesTitle}
                </h3>
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {item.episodeTitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
