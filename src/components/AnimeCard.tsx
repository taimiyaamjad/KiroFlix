import React from 'react';
import { Play, Heart, Check, MoreVertical } from 'lucide-react';
import { AnimeSeries } from '../types/anime';
import { StorageService } from '../services/storageService';

interface AnimeCardProps {
  series: AnimeSeries;
  onPlay: (series: AnimeSeries) => void;
  onSelect: (series: AnimeSeries) => void;
  onWatchlistToggle: () => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  series,
  onPlay,
  onSelect,
  onWatchlistToggle
}) => {
  const currentStatus = StorageService.getSeriesWatchlistStatus(series.id);
  const isInWatchlist = !!currentStatus;
  const latestProgress = StorageService.getSeriesLatestProgress(series.id);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchlist) {
      StorageService.setWatchlistStatus(series, 'remove');
    } else {
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
        'watching'
      );
    }
    onWatchlistToggle();
  };

  // Calculate percentage if watching
  const progressPercent = latestProgress && latestProgress.duration > 0
    ? Math.min(100, Math.round((latestProgress.currentTime / latestProgress.duration) * 100))
    : 0;

  return (
    <div
      onClick={() => onSelect(series)}
      className="group relative flex flex-col bg-[#0D1017] border border-[#191E2B] hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-black/50 cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
        <img
          src={series.image}
          alt={series.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay with Play Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(series);
            }}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform cursor-pointer"
            aria-label="Play anime"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        </div>

        {/* Quick Watchlist Bookmark Button */}
        <button
          onClick={handleWatchlistClick}
          aria-label={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isInWatchlist
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-black/60 text-white/80 hover:bg-black/90 hover:text-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isInWatchlist ? 'fill-white' : ''}`} />
        </button>

        {/* Progress bar on bottom edge of poster if in progress */}
        {latestProgress && progressPercent > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-black/60">
            <div
              className="h-full bg-red-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Content: Title and clean unboxed metadata (Zero pills) */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5 font-medium">
            <span>{series.year}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">{series.totalEpisodes} Eps</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-mono-numbers">★ {series.rating.toFixed(1)}</span>
          </div>

          <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-1 group-hover:text-red-400 transition-colors">
            {series.title}
          </h3>
        </div>

        {/* Quiet genre summary */}
        <div className="mt-2 text-xs text-neutral-400 line-clamp-1">
          {series.genres.slice(0, 2).join(' · ')}
        </div>
      </div>
    </div>
  );
};
