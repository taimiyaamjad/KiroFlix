import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipForward,
  Settings,
  List,
  X,
  Sparkles,
  Download,
  Languages,
  CheckCircle2
} from 'lucide-react';
import { AnimeSeries, AnimeEpisode } from '../types/anime';
import { StorageService } from '../services/storageService';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

interface VideoPlayerProps {
  series: AnimeSeries;
  initialEpisodeId?: string;
  onClose: () => void;
  onDownloadRequest?: (episode: AnimeEpisode) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  series,
  initialEpisodeId,
  onClose,
  onDownloadRequest
}) => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten all episodes across seasons
  const allEpisodes = series.seasons.flatMap(s => s.episodes);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(() => {
    if (initialEpisodeId) {
      const idx = allEpisodes.findIndex(e => e.id === initialEpisodeId);
      return idx !== -1 ? idx : 0;
    }
    // Check if user has saved progress for this series
    const latest = StorageService.getSeriesLatestProgress(series.id);
    if (latest) {
      const idx = allEpisodes.findIndex(e => e.id === latest.episodeId);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });

  const currentEpisode = allEpisodes[currentEpisodeIndex] || allEpisodes[0];

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentEpisode.duration || 1440);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState<'1080p' | '720p' | '480p' | '360p'>(
    user?.preferences.preferredQuality || '1080p'
  );
  const [selectedAudio, setSelectedAudio] = useState<string>(
    user?.preferences.preferredAudio || 'ja'
  );
  const [selectedSub, setSelectedSub] = useState<string>('English');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState(user?.preferences.cinemaBackdrop ?? true);
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);
  const [activeStreamUrl, setActiveStreamUrl] = useState<string>(currentEpisode.streamUrl);

  // Dynamically resolve custom API stream ticket when custom endpoint is configured
  useEffect(() => {
    let isCancelled = false;
    const resolveStream = async () => {
      if (apiClient.isCustomConfigured() && currentEpisode.url) {
        try {
          const resolved = await apiClient.getWatchStreamUrl(
            currentEpisode.url,
            currentEpisode.streamUrl,
            selectedAudio,
            selectedQuality
          );
          if (!isCancelled && resolved) {
            setActiveStreamUrl(resolved);
            return;
          }
        } catch (err) {
          console.warn('Failed to resolve custom watch stream:', err);
        }
      }
      if (!isCancelled) {
        setActiveStreamUrl(currentEpisode.streamUrl);
      }
    };

    resolveStream();
    return () => {
      isCancelled = true;
    };
  }, [currentEpisode.id, currentEpisode.url, currentEpisode.streamUrl, selectedAudio, selectedQuality]);

  // Resume position loaded
  const hasLoadedResumeRef = useRef(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load resume progress when episode changes
  useEffect(() => {
    hasLoadedResumeRef.current = false;
    setCurrentTime(0);
    setAutoNextCountdown(null);

    const savedProgress = StorageService.getEpisodeProgress(series.id, currentEpisode.id);
    if (savedProgress && savedProgress.currentTime > 5 && !savedProgress.completed) {
      if (videoRef.current) {
        videoRef.current.currentTime = savedProgress.currentTime;
        setCurrentTime(savedProgress.currentTime);
      }
    }
    hasLoadedResumeRef.current = true;
  }, [currentEpisode.id, series.id]);

  // Hide controls after 3s of inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showSettingsMenu && !showEpisodeDrawer) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        seekBy(10);
      } else if (e.code === 'ArrowLeft') {
        seekBy(-10);
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'Escape') {
        if (showEpisodeDrawer) setShowEpisodeDrawer(false);
        else if (showSettingsMenu) setShowSettingsMenu(false);
        else if (!isFullscreen) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFullscreen, showEpisodeDrawer, showSettingsMenu]);

  // Video event listeners
  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // Save progress periodically (throttled)
    if (Math.floor(curr) % 3 === 0 && curr > 2) {
      const isCompleted = curr >= duration * 0.92;
      StorageService.saveProgress({
        seriesId: series.id,
        seriesTitle: series.title,
        seriesImage: series.image,
        episodeId: currentEpisode.id,
        episodeNumber: currentEpisode.episodeNumber,
        seasonNumber: currentEpisode.seasonNumber,
        episodeTitle: currentEpisode.title,
        currentTime: Math.floor(curr),
        duration: Math.floor(duration),
        completed: isCompleted,
        lastWatchedAt: Date.now()
      });
    }
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
      const savedProgress = StorageService.getEpisodeProgress(series.id, currentEpisode.id);
      if (savedProgress && savedProgress.currentTime > 5 && !savedProgress.completed) {
        videoRef.current.currentTime = savedProgress.currentTime;
        setCurrentTime(savedProgress.currentTime);
      }
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    StorageService.saveProgress({
      seriesId: series.id,
      seriesTitle: series.title,
      seriesImage: series.image,
      episodeId: currentEpisode.id,
      episodeNumber: currentEpisode.episodeNumber,
      seasonNumber: currentEpisode.seasonNumber,
      episodeTitle: currentEpisode.title,
      currentTime: Math.floor(duration),
      duration: Math.floor(duration),
      completed: true,
      lastWatchedAt: Date.now()
    });

    // Check if next episode exists
    if (currentEpisodeIndex < allEpisodes.length - 1) {
      setAutoNextCountdown(5);
    }
  };

  // Auto-next countdown timer
  useEffect(() => {
    if (autoNextCountdown === null) return;
    if (autoNextCountdown > 0) {
      const timer = setTimeout(() => setAutoNextCountdown(autoNextCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (autoNextCountdown === 0) {
      playNextEpisode();
      setAutoNextCountdown(null);
    }
  }, [autoNextCountdown]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    }
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    const target = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  const playNextEpisode = () => {
    if (currentEpisodeIndex < allEpisodes.length - 1) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      setAutoNextCountdown(null);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Check if current time is within intro / outro
  const isInsideIntro = currentEpisode.introStart && currentEpisode.introEnd
    ? currentTime >= currentEpisode.introStart && currentTime <= currentEpisode.introEnd
    : false;

  const isInsideOutro = currentEpisode.outroStart && currentEpisode.outroEnd
    ? currentTime >= currentEpisode.outroStart && currentTime <= currentEpisode.outroEnd
    : false;

  const skipIntro = () => {
    if (videoRef.current && currentEpisode.introEnd) {
      videoRef.current.currentTime = currentEpisode.introEnd + 1;
      setCurrentTime(currentEpisode.introEnd + 1);
    }
  };

  const skipOutro = () => {
    if (videoRef.current && currentEpisode.outroEnd) {
      videoRef.current.currentTime = currentEpisode.outroEnd + 1;
      setCurrentTime(currentEpisode.outroEnd + 1);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-[#050608] flex items-center justify-center select-none overflow-hidden"
    >
      {/* Ambient Theater Backdrop Glow */}
      {ambientGlow && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 blur-3xl scale-120 transition-all duration-700"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(229, 9, 20, 0.25) 0%, rgba(13, 16, 23, 0.9) 70%)`
          }}
        />
      )}

      {/* Main Video Element */}
      <video
        ref={videoRef}
        src={activeStreamUrl}
        poster={currentEpisode.thumbnail || series.bannerImage}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        playsInline
      />

      {/* Skip Intro Floating Banner */}
      {isInsideIntro && (
        <button
          onClick={skipIntro}
          className="absolute bottom-24 right-8 z-30 flex items-center gap-2 px-4 py-2.5 bg-neutral-900/90 hover:bg-neutral-800 text-white font-semibold text-xs rounded-md border border-neutral-700 shadow-xl transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <SkipForward className="w-4 h-4 text-red-500" />
          <span>Skip Opening</span>
        </button>
      )}

      {/* Skip Outro Floating Banner */}
      {isInsideOutro && (
        <button
          onClick={skipOutro}
          className="absolute bottom-24 right-8 z-30 flex items-center gap-2 px-4 py-2.5 bg-neutral-900/90 hover:bg-neutral-800 text-white font-semibold text-xs rounded-md border border-neutral-700 shadow-xl transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <SkipForward className="w-4 h-4 text-red-500" />
          <span>Skip Ending</span>
        </button>
      )}

      {/* Auto Next Episode Countdown Toast */}
      {autoNextCountdown !== null && (
        <div className="absolute top-20 right-8 z-30 bg-[#0E1118]/95 border border-red-500/40 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Next Episode</span>
            <span className="text-xs text-neutral-400 font-mono-numbers">Starting in {autoNextCountdown}s</span>
          </div>
          <p className="text-sm font-medium text-white truncate mb-3">
            {allEpisodes[currentEpisodeIndex + 1]?.title}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={playNextEpisode}
              className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Play Now
            </button>
            <button
              onClick={() => setAutoNextCountdown(null)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Overlay Header Bar */}
      <div
        className={`absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            aria-label="Close Player"
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
              <span>{series.title}</span>
              <span>·</span>
              <span>Season {currentEpisode.seasonNumber}</span>
              <span>·</span>
              <span className="text-red-400">Episode {currentEpisode.episodeNumber}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {currentEpisode.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onDownloadRequest && (
            <button
              onClick={() => onDownloadRequest(currentEpisode)}
              title="Download Episode (Crunchyroll API)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-neutral-200 text-xs rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>Download</span>
            </button>
          )}

          <button
            onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              showEpisodeDrawer
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-neutral-200 hover:bg-white/20'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Episodes</span>
          </button>
        </div>
      </div>

      {/* Overlay Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrub Bar */}
        <div className="relative mb-3 flex items-center group">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-red-600 transition-all hover:h-2.5"
          />
        </div>

        {/* Lower Controls */}
        <div className="flex items-center justify-between text-white text-sm">
          {/* Left: Play/Pause, Skip, Time */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="p-2 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button
              onClick={() => seekBy(-10)}
              title="Rewind 10s"
              className="p-1.5 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => seekBy(10)}
              title="Forward 10s"
              className="p-1.5 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Next Episode Button */}
            {currentEpisodeIndex < allEpisodes.length - 1 && (
              <button
                onClick={playNextEpisode}
                title="Next Episode"
                className="p-1.5 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                className="p-1.5 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-neutral-600 rounded appearance-none cursor-pointer accent-red-600 hidden sm:block"
              />
            </div>

            {/* Timestamps */}
            <div className="text-xs text-neutral-300 font-mono-numbers">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-neutral-500">/</span>
              <span className="text-neutral-500">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Audio Dub, Quality, Speed, Ambient, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Language indicator */}
            <div className="hidden md:flex items-center gap-1 text-xs text-neutral-400 bg-white/5 px-2 py-1 rounded">
              <Languages className="w-3.5 h-3.5 text-neutral-400" />
              <span className="uppercase font-semibold">{selectedAudio}</span>
            </div>

            {/* Quick Download Current Episode */}
            {onDownloadRequest && (
              <button
                onClick={() => onDownloadRequest(currentEpisode)}
                title="Download Episode (MKV)"
                className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Settings Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                title="Player Settings"
                className={`p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${
                  showSettingsMenu ? 'text-red-500' : 'text-neutral-300 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Settings Dropdown Popover */}
              {showSettingsMenu && (
                <div className="absolute bottom-10 right-0 w-64 bg-[#0F131C] border border-[#222736] rounded-xl p-3 shadow-2xl z-40 text-xs">
                  <div className="font-semibold text-white mb-2 pb-1.5 border-b border-neutral-800 flex items-center justify-between">
                    <span>Playback Settings</span>
                    <button onClick={() => setShowSettingsMenu(false)} className="text-neutral-500 hover:text-white">✕</button>
                  </div>

                  {/* Quality */}
                  <div className="mb-3">
                    <label className="text-neutral-400 block mb-1 font-medium">Resolution</label>
                    <div className="grid grid-cols-4 gap-1">
                      {(['1080p', '720p', '480p', '360p'] as const).map(q => (
                        <button
                          key={q}
                          onClick={() => setSelectedQuality(q)}
                          className={`py-1 rounded text-center font-mono-numbers transition-colors cursor-pointer ${
                            selectedQuality === q ? 'bg-red-600 text-white font-semibold' : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speed */}
                  <div className="mb-3">
                    <label className="text-neutral-400 block mb-1 font-medium">Speed</label>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.75, 1, 1.25, 1.5].map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            setPlaybackSpeed(s);
                            if (videoRef.current) videoRef.current.playbackRate = s;
                          }}
                          className={`py-1 rounded text-center font-mono-numbers transition-colors cursor-pointer ${
                            playbackSpeed === s ? 'bg-red-600 text-white font-semibold' : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dub Selection */}
                  <div className="mb-3">
                    <label className="text-neutral-400 block mb-1 font-medium">Audio Dub Track</label>
                    <div className="flex flex-wrap gap-1">
                      {currentEpisode.availableDubs.map(dub => (
                        <button
                          key={dub}
                          onClick={() => setSelectedAudio(dub)}
                          className={`px-2 py-0.5 rounded text-xs uppercase font-medium transition-colors cursor-pointer ${
                            selectedAudio === dub ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {dub === 'ja' ? 'Japanese' : dub === 'en' ? 'English' : dub === 'es' ? 'Spanish' : dub}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ambient Backdrop Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                    <span className="text-neutral-300">Ambient Glow</span>
                    <button
                      onClick={() => setAmbientGlow(!ambientGlow)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        ambientGlow ? 'bg-red-600' : 'bg-neutral-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          ambientGlow ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Episode Drawer Sidebar */}
      {showEpisodeDrawer && (
        <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-[#0B0D13]/95 border-l border-[#1D2230] z-30 flex flex-col p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D2230] mb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Episodes</h3>
              <p className="text-xs text-neutral-400">{series.title}</p>
            </div>
            <button
              onClick={() => setShowEpisodeDrawer(false)}
              className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {allEpisodes.map((ep, idx) => {
              const isCurrent = idx === currentEpisodeIndex;
              const epProgress = StorageService.getEpisodeProgress(series.id, ep.id);
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    setCurrentEpisodeIndex(idx);
                    setShowEpisodeDrawer(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex gap-3 cursor-pointer ${
                    isCurrent
                      ? 'bg-red-950/40 border-red-500/50 text-white'
                      : 'bg-[#121620] border-[#1D2230] text-neutral-300 hover:bg-[#181D2A] hover:border-neutral-700'
                  }`}
                >
                  <div className="relative w-20 h-12 rounded overflow-hidden flex-shrink-0 bg-neutral-900">
                    <img
                      src={ep.thumbnail || series.image}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                        <Play className="w-4 h-4 fill-white text-white" />
                      </div>
                    )}
                    {epProgress && epProgress.completed && (
                      <div className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                      <span className="text-red-500 font-mono-numbers">E{ep.episodeNumber}</span>
                      <span className="truncate">{ep.title}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {ep.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1 font-mono-numbers">
                      <span>{Math.floor(ep.duration / 60)}m</span>
                      {onDownloadRequest && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownloadRequest(ep);
                          }}
                          title="Download episode"
                          className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors inline-flex items-center"
                        >
                          <Download className="w-3 h-3 text-neutral-400 hover:text-white" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
