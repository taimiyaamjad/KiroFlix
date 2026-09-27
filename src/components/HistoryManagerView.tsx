import React from 'react';
import { StorageService } from '../services/storageService';
import { apiClient } from '../services/apiClient';
import { AnimeSeries } from '../types/anime';
import { Play, Trash2, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

interface HistoryManagerViewProps {
  onPlayEpisode: (series: AnimeSeries, episodeNumber?: number) => void;
  onSelectSeries: (series: AnimeSeries) => void;
  onRefresh: () => void;
}

export const HistoryManagerView: React.FC<HistoryManagerViewProps> = ({
  onPlayEpisode,
  onSelectSeries,
  onRefresh
}) => {
  const historyItems = StorageService.getAllProgress();
  const stats = StorageService.getUserStats();

  const handleClear = () => {
    localStorage.removeItem('kuroflix_watch_progress_v1');
    onRefresh();
  };

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Watch History & Progress
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Tracked progress with millisecond precision and instant resume playback
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-400 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-[#0D1017] rounded-xl border border-[#191E2B]">
          <span className="text-neutral-500 text-xs block mb-1">Total Time Streamed</span>
          <span className="text-xl sm:text-2xl font-bold text-white font-mono-numbers">
            {stats.hoursWatched} <span className="text-xs text-neutral-400 font-sans">hours</span>
          </span>
        </div>
        <div className="p-4 bg-[#0D1017] rounded-xl border border-[#191E2B]">
          <span className="text-neutral-500 text-xs block mb-1">Episodes Finished</span>
          <span className="text-xl sm:text-2xl font-bold text-white font-mono-numbers">
            {stats.completedEpisodesCount} <span className="text-xs text-neutral-400 font-sans">episodes</span>
          </span>
        </div>
        <div className="p-4 bg-[#0D1017] rounded-xl border border-[#191E2B]">
          <span className="text-neutral-500 text-xs block mb-1">Series Started</span>
          <span className="text-xl sm:text-2xl font-bold text-white font-mono-numbers">
            {new Set(historyItems.map(h => h.seriesId)).size}{' '}
            <span className="text-xs text-neutral-400 font-sans">titles</span>
          </span>
        </div>
        <div className="p-4 bg-[#0D1017] rounded-xl border border-[#191E2B]">
          <span className="text-neutral-500 text-xs block mb-1">Active Device Sync</span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono-numbers">
            Online <span className="text-xs text-neutral-400 font-sans">(Cloud)</span>
          </span>
        </div>
      </div>

      {historyItems.length === 0 ? (
        <div className="py-20 text-center bg-[#0D1017] border border-[#191E2B] rounded-2xl p-8">
          <Clock className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No viewing history yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
            Start streaming any anime episode and your progress will automatically be saved here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {historyItems.map(item => {
            const series = apiClient.getSeriesById(item.seriesId);
            const percent = item.duration > 0
              ? Math.min(100, Math.round((item.currentTime / item.duration) * 100))
              : 0;

            return (
              <div
                key={`${item.seriesId}-${item.episodeId}-${item.lastWatchedAt}`}
                className="flex items-center gap-4 p-3 bg-[#0D1017] hover:bg-[#121622] border border-[#191E2B] hover:border-neutral-700 rounded-xl transition-all"
              >
                {/* Thumbnail with progress bar */}
                <div
                  onClick={() => {
                    if (series) onPlayEpisode(series, item.episodeNumber);
                  }}
                  className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 cursor-pointer group"
                >
                  <img
                    src={item.seriesImage}
                    alt={item.seriesTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-black/70">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                    <span className="text-red-400 font-mono-numbers">
                      S0{item.seasonNumber} E0{item.episodeNumber}
                    </span>
                    <span>·</span>
                    <span className="font-mono-numbers">{Math.floor(item.currentTime / 60)}m watched</span>
                    <span>·</span>
                    <span className="text-neutral-500">{formatTimestamp(item.lastWatchedAt)}</span>
                  </div>

                  <h3
                    onClick={() => {
                      if (series) onSelectSeries(series);
                    }}
                    className="font-semibold text-white text-sm sm:text-base truncate hover:text-red-400 cursor-pointer"
                  >
                    {item.seriesTitle}
                  </h3>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {item.episodeTitle}
                  </p>
                </div>

                {/* Completion Status & Resume button */}
                <div className="flex items-center gap-3">
                  {item.completed ? (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="hidden sm:inline text-xs text-neutral-400 font-mono-numbers">
                      {percent}%
                    </span>
                  )}

                  <button
                    onClick={() => {
                      if (series) onPlayEpisode(series, item.episodeNumber);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resume</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
