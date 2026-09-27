import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { VideoPlayer } from './components/VideoPlayer';
import { AnimeCard } from './components/AnimeCard';
import { ContinueWatchingRow } from './components/ContinueWatchingRow';
import { SearchModal } from './components/SearchModal';
import { SeriesDetailModal } from './components/SeriesDetailModal';
import { WatchlistManagerView } from './components/WatchlistManagerView';
import { HistoryManagerView } from './components/HistoryManagerView';
import { apiClient } from './services/apiClient';
import { StorageService } from './services/storageService';
import { AnimeSeries, AnimeEpisode } from './types/anime';
import { WatchProgress } from './types/auth';
import {
  Flame,
  Sparkles,
  Compass,
  Heart,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

function AnimeApp() {
  const [activeTab, setActiveTab] = useState<'browse' | 'trending' | 'watchlist' | 'history'>('browse');
  const [allSeries, setAllSeries] = useState<AnimeSeries[]>([]);
  const [featuredSeries, setFeaturedSeries] = useState<AnimeSeries | null>(null);
  const [activeVideoSeries, setActiveVideoSeries] = useState<AnimeSeries | null>(null);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | undefined>(undefined);
  const [detailModalSeries, setDetailModalSeries] = useState<AnimeSeries | null>(null);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Continue Watching data
  const [continueWatchingItems, setContinueWatchingItems] = useState<WatchProgress[]>([]);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'info' | 'success' | 'warning' } | null>(null);

  const refreshUserData = () => {
    setContinueWatchingItems(StorageService.getContinueWatching());
  };

  useEffect(() => {
    const list = apiClient.getAllSeries();
    setAllSeries(list);
    const featured = list.find(s => s.featured) || list[0];
    setFeaturedSeries(featured);
    refreshUserData();
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePlayEpisode = (series: AnimeSeries, episodeNumber: number = 1) => {
    const allEps = series.seasons.flatMap(s => s.episodes);
    const targetEp = allEps.find(e => e.episodeNumber === episodeNumber) || allEps[0];
    setActiveVideoSeries(series);
    setActiveEpisodeId(targetEp?.id);
  };

  const handleResumeProgress = (seriesId: string, episodeId: string) => {
    const series = apiClient.getSeriesById(seriesId);
    if (series) {
      setActiveVideoSeries(series);
      setActiveEpisodeId(episodeId);
    }
  };

  const handleDownloadRequest = async (episode: AnimeEpisode) => {
    showToast('Download Queued', `Preparing download for ${episode.title}...`, 'info');
    try {
      const res = await apiClient.getDownloadJob(episode.url, 'en', '1080p');
      if (res.status === 'error') {
        showToast('Download Error', res.error || 'Server returned an error', 'warning');
      } else {
        showToast(
          'Download Ready',
          `Starting download: ${res.title} (${res.size_mb || 'High Quality'} MB)`,
          'success'
        );
        // Automatically trigger browser download if file URL is available
        if (res.file_url) {
          const a = document.createElement('a');
          a.href = res.file_url;
          a.download = res.title || 'episode.mkv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
    } catch {
      showToast('Download Failed', 'Could not reach streaming / download server.', 'warning');
    }
  };

  const showToast = (title: string, desc: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F3F4F6] flex flex-col selection:bg-red-600 selection:text-white pb-16 md:pb-0">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'browse' && (
          <div>
            {/* Hero Showcase Banner */}
            {featuredSeries && (
              <HeroBanner
                series={featuredSeries}
                onPlayEpisode={handlePlayEpisode}
                onOpenDetails={(s) => setDetailModalSeries(s)}
                onWatchlistChange={refreshUserData}
              />
            )}

            {/* Personalized Continue Watching Section */}
            <div className="pt-8">
              <ContinueWatchingRow
                items={continueWatchingItems}
                onResume={handleResumeProgress}
                onRefresh={refreshUserData}
              />
            </div>

            {/* Trending Row */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                    Trending This Season
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('trending')}
                  className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  View All Trending →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allSeries
                  .slice()
                  .sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99))
                  .slice(0, 5)
                  .map((series) => (
                    <AnimeCard
                      key={series.id}
                      series={series}
                      onPlay={() => handlePlayEpisode(series, 1)}
                      onSelect={(s) => setDetailModalSeries(s)}
                      onWatchlistToggle={refreshUserData}
                    />
                  ))}
              </div>
            </section>

            {/* Action & Dark Fantasy Row */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-500" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                    Action & Dark Fantasy
                  </h2>
                </div>
                <span className="text-xs text-neutral-500">Curated Crunchyroll Releases</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allSeries
                  .filter((s) => s.genres.includes('Action') || s.genres.includes('Dark Fantasy'))
                  .map((series) => (
                    <AnimeCard
                      key={series.id}
                      series={series}
                      onPlay={() => handlePlayEpisode(series, 1)}
                      onSelect={(s) => setDetailModalSeries(s)}
                      onWatchlistToggle={refreshUserData}
                    />
                  ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-in fade-in duration-200">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
                Top Trending Anime
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Highest ranked anime broadcasts and streaming sensations
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allSeries.map((series, idx) => (
                <div key={series.id} className="relative">
                  <div className="absolute -top-3 -left-3 z-10 w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-lg font-mono-numbers">
                    {idx + 1}
                  </div>
                  <AnimeCard
                    series={series}
                    onPlay={() => handlePlayEpisode(series, 1)}
                    onSelect={(s) => setDetailModalSeries(s)}
                    onWatchlistToggle={refreshUserData}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'watchlist' && (
          <WatchlistManagerView
            onPlaySeries={(s) => handlePlayEpisode(s, 1)}
            onSelectSeries={(s) => setDetailModalSeries(s)}
            onRefresh={refreshUserData}
          />
        )}

        {activeTab === 'history' && (
          <HistoryManagerView
            onPlayEpisode={(s, ep) => handlePlayEpisode(s, ep)}
            onSelectSeries={(s) => setDetailModalSeries(s)}
            onRefresh={refreshUserData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#181B22] bg-[#06070A] py-8 px-4 sm:px-8 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="font-bold text-white font-display text-sm">Animo</span>
            <span>·</span>
            <span>Stream your favorite anime in high definition</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>Dark Theme</span>
            <span>·</span>
            <span>Fast Streaming</span>
            <span>·</span>
            <span>© {new Date().getFullYear()} Animo</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#08090C]/95 border-t border-[#1A1F2D] backdrop-blur-lg flex items-center justify-around py-2 px-1 text-[11px] text-neutral-400">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'browse' ? 'text-red-500 font-semibold' : ''}`}
        >
          <Compass className="w-4 h-4" />
          <span>Browse</span>
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'trending' ? 'text-red-500 font-semibold' : ''}`}
        >
          <Flame className="w-4 h-4" />
          <span>Trending</span>
        </button>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center gap-1 p-1"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'watchlist' ? 'text-red-500 font-semibold' : ''}`}
        >
          <Heart className="w-4 h-4" />
          <span>Watchlist</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'history' ? 'text-red-500 font-semibold' : ''}`}
        >
          <Clock className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>

      {/* Video Player Modal */}
      {activeVideoSeries && (
        <VideoPlayer
          series={activeVideoSeries}
          initialEpisodeId={activeEpisodeId}
          onClose={() => {
            setActiveVideoSeries(null);
            refreshUserData();
          }}
          onDownloadRequest={handleDownloadRequest}
        />
      )}

      {/* Series Detail Modal */}
      {detailModalSeries && (
        <SeriesDetailModal
          series={detailModalSeries}
          onClose={() => setDetailModalSeries(null)}
          onPlayEpisode={(s, ep) => handlePlayEpisode(s, ep)}
          onDownloadRequest={handleDownloadRequest}
          onWatchlistChange={refreshUserData}
        />
      )}

      {/* Real-time Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSeries={(s) => setDetailModalSeries(s)}
        onPlaySeries={(s) => handlePlayEpisode(s, 1)}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-50 bg-[#121622] border border-[#23293D] rounded-xl p-4 shadow-2xl flex items-start gap-3 max-w-sm animate-in slide-in-from-bottom-5">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : toastMessage.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white">{toastMessage.title}</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">{toastMessage.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AnimeApp />
    </AuthProvider>
  );
}
