export type WatchlistStatus = 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'favorites';

export interface WatchProgress {
  seriesId: string;
  seriesTitle: string;
  seriesImage: string;
  episodeId: string;
  episodeNumber: number;
  seasonNumber: number;
  episodeTitle: string;
  currentTime: number; // in seconds
  duration: number; // in seconds
  completed: boolean;
  lastWatchedAt: number; // timestamp
}

export interface WatchlistItem {
  seriesId: string;
  series: {
    id: string;
    title: string;
    image: string;
    rating: number;
    year: number;
    genres: string[];
    totalEpisodes: number;
  };
  status: WatchlistStatus;
  userRating?: number;
  notes?: string;
  addedAt: number;
  updatedAt: number;
}

export interface ClerkUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  username: string;
  createdAt: number;
  lastSignInAt: number;
  twoFactorEnabled: boolean;
  preferences: {
    preferredAudio: 'ja' | 'en' | 'es' | 'fr';
    preferredQuality: '1080p' | '720p' | '480p' | '360p';
    autoPlayNext: boolean;
    autoSkipIntro: boolean;
    cinemaBackdrop: boolean;
  };
}

export interface ApiConfig {
  mode: 'internal' | 'custom';
  customBaseUrl: string; // e.g. http://localhost:8080
  apiToken?: string; // Master bearer token for authenticating calls
  etpToken?: string;
  defaultQuality: '1080p' | '720p' | '480p' | '360p';
  defaultLanguage: 'en' | 'ja';
}
