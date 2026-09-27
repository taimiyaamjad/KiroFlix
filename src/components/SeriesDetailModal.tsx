import React, { useState, useEffect } from 'react';
import { AnimeSeries, AnimeEpisode } from '../types/anime';
import { Play, Plus, Check, Download, Heart, X, Radio, Sparkles, Film, Clock } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { apiClient } from '../services/apiClient';
import { WatchlistStatus } from '../types/auth';

interface SeriesDetailModalProps {
  series: AnimeSeries | null;
  onClose: () => void;
  onPlayEpisode: (series: AnimeSeries, episodeNumber?: number) => void;
  onDownloadRequest: (episode: AnimeEpisode) => void;
  onWatchlistChange: () => void;
}

export const SeriesDetailModal: React.FC<SeriesDetailModalProps> = ({
  series,
  onClose,
  onPlayEpisode,
  onDownloadRequest,
  onWatchlistChange
}) => {
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(1);
  const [streamStatus, setStreamStatus] = useState<string>('Metadata streaming active');
  const [streamProgress, setStreamProgress] = useState(100);

  useEffect(() => {
    if (series) {
      setSelectedSeasonNumber(series.seasons[0]?.seasonNumber || 1);
      // Initiate real-time metadata streaming
      const cancel = apiClient.streamSeriesMetadata(series.id, (chunk) => {
        setStreamStatus(chunk.message);
        setStreamProgress(chunk.progress);
      });
      return () => cancel();
    }
  }, [series]);

  if (!series) return null;

  const currentStatus = StorageService.getSeriesWatchlistStatus(series.id);
  const activeSeason = series.seasons.find(s => s.seasonNumber === selectedSeasonNumber) || series.seasons[0];

  const handleStatusSelect = (status: WatchlistStatus | 'remove') => {
    StorageService.setWatchlistStatus(
      {
        id: series.id,
        title: series.title,
        image: series.image,
        rating: series.rating,
        year: series.year,
        genres: series.genres,
        totalEpisodes: series.totalEpisodes
      },
      status
    );
    onWatchlistChange();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0D1017] border border-[#222736] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Backdrop Banner with Scrim */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-neutral-900">
          <img
            src={series.bannerImage || series.image}
            alt={series.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-[#0D1017]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Series Overview Header */}
        <div className="relative px-6 -mt-20 z-10">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Poster Thumbnail */}
            <div className="w-28 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#222736] shadow-2xl bg-neutral-900 flex-shrink-0">
              <img
                src={series.image}
                alt={series.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Info */}
            <div className="flex-1 min-w-0">
              {/* Unboxed Metadata (Zero pills) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-medium mb-1.5">
                <span>{series.year}</span>
                <span aria-hidden="true">·</span>
                <span>{series.genres.join(', ')}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-numbers">{series.totalEpisodes} Episodes</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-mono-numbers">★ {series.rating.toFixed(1)}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-neutral-500">CR-ID: {series.id}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display mb-1">
                {series.title}
              </h2>
              {series.japaneseTitle && (
                <p className="text-xs text-neutral-400 mb-3">{series.japaneseTitle}</p>
              )}

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl line-clamp-3 mb-4">
                {series.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onPlayEpisode(series, 1);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-md"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Episode 1</span>
                </button>

                {/* Watchlist Status Dropdown */}
                <select
                  value={currentStatus || 'none'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'none') handleStatusSelect('remove');
                    else handleStatusSelect(val as WatchlistStatus);
                  }}
                  className="bg-[#141826] border border-[#23293D] rounded-lg px-3 py-2.5 text-xs text-white outline-none cursor-pointer hover:border-neutral-600 transition-colors"
                >
                  <option value="none">+ Add to List</option>
                  <option value="watching">Currently Watching</option>
                  <option value="plan_to_watch">Plan to Watch</option>
                  <option value="completed">Completed</option>
                  <option value="favorites">Favorites</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Metadata Streaming Stream Indicator */}
        <div className="px-6 py-2.5 mt-4 bg-[#11141E] border-y border-[#1A1F2D] flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-neutral-300 truncate">
              {streamStatus}
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono-numbers">
            {streamProgress}% buffer
          </span>
        </div>

        {/* Season Navigation & Episodes List */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base">Episodes</h3>

            {/* Season switcher */}
            {series.seasons.length > 1 && (
              <div className="flex gap-1 bg-[#121622] p-1 rounded-lg border border-[#1E2436]">
                {series.seasons.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      selectedSeasonNumber === s.seasonNumber
                        ? 'bg-red-600 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Season {s.seasonNumber}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Episode List Cards */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {activeSeason?.episodes.map((ep) => {
              const epProgress = StorageService.getEpisodeProgress(series.id, ep.id);
              return (
                <div
                  key={ep.id}
                  className="flex items-center gap-4 p-3 bg-[#11141F] hover:bg-[#161B2B] border border-[#1E2336] rounded-xl transition-all group"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      onPlayEpisode(series, ep.episodeNumber);
                      onClose();
                    }}
                    className="relative w-24 sm:w-32 aspect-video rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={ep.thumbnail || series.image}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                      <Play className="w-5 h-5 fill-white text-white opacity-80 group-hover:opacity-100" />
                    </div>
                  </div>

                  {/* Episode details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1 font-medium">
                      <span className="text-red-400 font-mono-numbers">
                        Episode {ep.episodeNumber}
                      </span>
                      <span className="font-mono-numbers">{Math.floor(ep.duration / 60)}m</span>
                    </div>

                    <h4
                      onClick={() => {
                        onPlayEpisode(series, ep.episodeNumber);
                        onClose();
                      }}
                      className="text-white text-sm font-semibold truncate group-hover:text-red-400 transition-colors cursor-pointer"
                    >
                      {ep.title}
                    </h4>

                    <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                      {ep.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-500 font-mono">
                      <span>Dubs: {ep.availableDubs.join(', ')}</span>
                      <span>·</span>
                      <span>Subs: {ep.availableSubs.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDownloadRequest(ep)}
                      title="Test Episode Retrieval / Download"
                      className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        onPlayEpisode(series, ep.episodeNumber);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Play
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
