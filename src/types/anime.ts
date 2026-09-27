export interface AnimeSearchResult {
  id: string;
  type: 'series' | 'movie';
  title: string;
  description: string;
  url: string;
  image: string;
}

export interface SearchApiResponse {
  count: number;
  query: string;
  results: AnimeSearchResult[];
}

export interface AnimeEpisode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: number; // in seconds
  url: string; // crunchyroll watch url e.g. https://www.crunchyroll.com/watch/GR3K0XK9R/...
  streamUrl: string; // direct playable stream
  availableDubs: string[]; // ["ja", "en", "es", "fr"]
  availableSubs: string[]; // ["English", "Spanish", "French", "Japanese"]
  introStart?: number;
  introEnd?: number;
  outroStart?: number;
  outroEnd?: number;
}

export interface AnimeSeason {
  id: string;
  seasonNumber: number;
  title: string;
  episodes: AnimeEpisode[];
}

export interface AnimeSeries {
  id: string;
  type: 'series' | 'movie';
  title: string;
  japaneseTitle?: string;
  description: string;
  url: string;
  image: string;
  bannerImage?: string;
  rating: number; // 0 - 5 or 0 - 10
  year: number;
  status: 'Releasing' | 'Completed' | 'Upcoming';
  genres: string[];
  studios: string[];
  totalEpisodes: number;
  seasons: AnimeSeason[];
  featured?: boolean;
  trendingRank?: number;
}

export interface DownloadApiResponse {
  job_id: string;
  status: 'ready' | 'processing' | 'queued' | 'error';
  title: string;
  url: string;
  quality: string;
  language: string;
  file_url?: string;
  size_mb?: number;
  download_speed?: string;
  eta_seconds?: number;
  error?: string;
}

export interface HealthApiResponse {
  active_jobs: number;
  cleanup_seconds: number;
  status: 'ok' | 'degraded' | 'offline';
  tracked_files: number;
  uptime_seconds: number;
}
