import React, { useState } from 'react';
import { WatchlistItem, WatchlistStatus } from '../types/auth';
import { StorageService } from '../services/storageService';
import { AnimeSeries } from '../types/anime';
import { apiClient } from '../services/apiClient';
import { Play, Trash2, Heart, Check, Clock, Bookmark } from 'lucide-react';

interface WatchlistManagerViewProps {
  onPlaySeries: (series: AnimeSeries) => void;
  onSelectSeries: (series: AnimeSeries) => void;
  onRefresh: () => void;
}

export const WatchlistManagerView: React.FC<WatchlistManagerViewProps> = ({
  onPlaySeries,
  onSelectSeries,
  onRefresh
}) => {
  const [filter, setFilter] = useState<WatchlistStatus | 'all'>('all');
  const items = StorageService.getWatchlist();

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const handleRemove = (e: React.MouseEvent, seriesId: string) => {
    e.stopPropagation();
    StorageService.setWatchlistStatus({ id: seriesId } as any, 'remove');
    onRefresh();
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, item: WatchlistItem) => {
    e.stopPropagation();
    const newStatus = e.target.value as WatchlistStatus | 'remove';
    StorageService.setWatchlistStatus(item.series, newStatus);
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            My Watchlist
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Personalized anime queue synced across your devices
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap gap-1 bg-[#121622] p-1 rounded-xl border border-[#1E2436] text-xs">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'watching', label: 'Watching' },
              { id: 'plan_to_watch', label: 'Plan to Watch' },
              { id: 'completed', label: 'Completed' },
              { id: 'favorites', label: 'Favorites' }
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-red-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-[#0D1017] border border-[#191E2B] rounded-2xl p-8">
          <Bookmark className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No series in this list</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
            Browse the catalog and click the heart icon on any anime to add it to your queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map(item => {
            const fullSeries = apiClient.getSeriesById(item.seriesId);
            return (
              <div
                key={item.seriesId}
                onClick={() => {
                  if (fullSeries) onSelectSeries(fullSeries);
                }}
                className="group relative bg-[#0D1017] border border-[#191E2B] hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 shadow-md cursor-pointer flex flex-col"
              >
                {/* Poster */}
                <div className="relative aspect-[3/4] w-full bg-neutral-900 overflow-hidden">
                  <img
                    src={item.series.image}
                    alt={item.series.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fullSeries) onPlaySeries(fullSeries);
                      }}
                      className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg"
                    >
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </button>
                  </div>

                  <button
                    onClick={(e) => handleRemove(e, item.seriesId)}
                    title="Remove"
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 text-neutral-400 hover:text-white rounded-full transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                      <span>{item.series.year}</span>
                      <span>·</span>
                      <span className="text-amber-400">★ {item.series.rating.toFixed(1)}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm truncate group-hover:text-red-400 transition-colors">
                      {item.series.title}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#1C2234]">
                    <select
                      value={item.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(e, item)}
                      className="w-full bg-[#121622] border border-[#23293D] rounded px-2 py-1 text-[11px] text-neutral-300 outline-none"
                    >
                      <option value="watching">Watching</option>
                      <option value="plan_to_watch">Plan to Watch</option>
                      <option value="completed">Completed</option>
                      <option value="favorites">Favorites</option>
                      <option value="remove">Remove</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
