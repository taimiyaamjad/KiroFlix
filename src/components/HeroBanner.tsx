import React from 'react';
import { Play, Plus, Check, Info, Film } from 'lucide-react';
import { AnimeSeries } from '../types/anime';
import { StorageService } from '../services/storageService';

interface HeroBannerProps {
  series: AnimeSeries;
  onPlayEpisode: (series: AnimeSeries, episodeNumber?: number) => void;
  onOpenDetails: (series: AnimeSeries) => void;
  onWatchlistChange: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  series,
  onPlayEpisode,
  onOpenDetails,
  onWatchlistChange
}) => {
  const currentStatus = StorageService.getSeriesWatchlistStatus(series.id);
  const isInWatchlist = !!currentStatus;

  const toggleWatchlist = () => {
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
    onWatchlistChange();
  };

  const bgImage = series.bannerImage || series.image;

  return (
    <section className="relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-end overflow-hidden border-b border-[#181B22]">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={series.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-90 transform scale-102 transition-transform duration-1000 ease-out"
        />
        {/* Measured scrims for 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[#08090C]/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 pb-12 pt-28">
        <div className="max-w-2xl">
          {/* Clean Unboxed Metadata (Zero pills!) */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-400 mb-3 font-medium">
            <span className="text-red-500 font-semibold uppercase tracking-wider text-xs">Featured Premiere</span>
            <span aria-hidden="true">·</span>
            <span>{series.year}</span>
            <span aria-hidden="true">·</span>
            <span>{series.genres.slice(0, 3).join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">{series.totalEpisodes} Episodes</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-mono-numbers">★ {series.rating.toFixed(1)}</span>
          </div>

          {/* Primary Title with text-wrap: balance */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 font-display [text-wrap:balance]">
            {series.title}
          </h1>

          {/* Synopsis with line clamp */}
          <p className="text-sm sm:text-base text-neutral-300 line-clamp-3 mb-6 leading-relaxed max-w-xl">
            {series.description}
          </p>

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlayEpisode(series, 1)}
              className="flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch S1 E1</span>
            </button>

            <button
              onClick={toggleWatchlist}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
                isInWatchlist
                  ? 'bg-[#18202F] text-blue-400 border-blue-500/40 hover:bg-[#1E293B]'
                  : 'bg-[#12151D]/90 text-white border-[#2A3142] hover:bg-[#1A1F2B]'
              }`}
            >
              {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <button
              onClick={() => onOpenDetails(series)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-300 bg-[#12151D]/80 hover:bg-[#1A1F2B] border border-[#222736] rounded-lg transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>Episodes & Info</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
