import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Play, Info, Loader2 } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { SearchApiResponse, AnimeSeries } from '../types/anime';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSeries: (series: AnimeSeries) => void;
  onPlaySeries: (series: AnimeSeries) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSeries,
  onPlaySeries
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      handleSearch(query || 'Solo');
    }
  }, [isOpen]);

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const data = await apiClient.search(searchTerm, 12);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    handleSearch(val);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0D1017] border border-[#222736] rounded-2xl shadow-2xl overflow-hidden mt-6 sm:mt-12 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-[#1A1F2D] flex items-center gap-3">
          <Search className="w-5 h-5 text-red-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={onInputChange}
            placeholder="Search anime series, movies, or genres..."
            className="flex-1 bg-transparent text-white placeholder-neutral-500 text-sm sm:text-base outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                handleSearch('');
              }}
              className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isLoading && (
            <Loader2 className="w-4 h-4 text-neutral-400 animate-spin flex-shrink-0" />
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6">
          {results && results.results.length > 0 ? (
            <div className="space-y-3">
              <div className="text-xs text-neutral-500 font-medium mb-2">
                Found {results.count} matching {results.count === 1 ? 'title' : 'titles'}
              </div>
              {results.results.map((item) => {
                const fullSeries = apiClient.getSeriesById(item.id);
                const targetSeries: AnimeSeries = fullSeries || {
                  id: item.id,
                  type: item.type || 'series',
                  title: item.title,
                  description: item.description,
                  url: item.url,
                  image: item.image,
                  rating: 4.8,
                  year: 2024,
                  status: 'Releasing',
                  genres: ['Anime', 'Action', 'Fantasy'],
                  studios: ['Animation Studio'],
                  totalEpisodes: 1,
                  seasons: [
                    {
                      id: `${item.id}-s1`,
                      seasonNumber: 1,
                      title: 'Season 1',
                      episodes: [
                        {
                          id: `${item.id}-ep1`,
                          episodeNumber: 1,
                          seasonNumber: 1,
                          title: item.title,
                          description: item.description,
                          thumbnail: item.image,
                          duration: 1440,
                          url: item.url,
                          streamUrl: item.url || '',
                          availableDubs: ['en', 'ja', 'hi', 'es'],
                          availableSubs: ['English', 'Japanese']
                        }
                      ]
                    }
                  ]
                };

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectSeries(targetSeries);
                      onClose();
                    }}
                    className="group flex items-start gap-4 p-3 bg-[#121622] hover:bg-[#181D2D] border border-[#1D2232] hover:border-neutral-700 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                        <span className="capitalize text-neutral-300 font-medium">{item.type}</span>
                        {targetSeries && (
                          <>
                            <span>·</span>
                            <span className="text-amber-400 font-mono-numbers">★ {targetSeries.rating}</span>
                          </>
                        )}
                        {targetSeries.genres && targetSeries.genres.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-neutral-500">{targetSeries.genres[0]}</span>
                          </>
                        )}
                      </div>

                      <h4 className="font-semibold text-white text-base group-hover:text-red-400 transition-colors truncate">
                        {item.title}
                      </h4>

                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlaySeries(targetSeries);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Watch Now</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSeries(targetSeries);
                            onClose();
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 text-xs rounded-md transition-colors cursor-pointer"
                        >
                          <Info className="w-3 h-3" />
                          <span>Episodes & Info</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500">
              <p className="text-sm">No titles found matching "{query}"</p>
              <p className="text-xs text-neutral-600 mt-1">
                Try searching for popular anime like "Solo Leveling", "Cyberpunk", or "Demon Slayer"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
