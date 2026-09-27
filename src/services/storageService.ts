import { WatchProgress, WatchlistItem, WatchlistStatus } from '../types/auth';

const STORAGE_PROGRESS_KEY = 'kuroflix_watch_progress_v1';
const STORAGE_WATCHLIST_KEY = 'kuroflix_watchlist_v1';
const STORAGE_DOWNLOADS_KEY = 'kuroflix_downloads_v1';

export class StorageService {
  /**
   * Save or update watch progress for an episode
   */
  public static saveProgress(progress: WatchProgress): void {
    try {
      const all = this.getAllProgress();
      // Remove any existing entry for this series
      const filtered = all.filter(p => !(p.seriesId === progress.seriesId && p.episodeId === progress.episodeId));
      filtered.unshift({
        ...progress,
        lastWatchedAt: Date.now()
      });

      // Keep up to 100 recent entries
      const pruned = filtered.slice(0, 100);
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(pruned));

      // Also ensure this series is in the 'watching' watchlist if not completed
      if (!progress.completed) {
        this.autoSetWatchingStatus(progress.seriesId);
      }
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }

  /**
   * Get all progress entries sorted by last watched
   */
  public static getAllProgress(): WatchProgress[] {
    try {
      const data = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading progress:', e);
    }
    return [];
  }

  /**
   * Get continue watching list (latest progress per series)
   */
  public static getContinueWatching(): WatchProgress[] {
    const all = this.getAllProgress();
    const seenSeries = new Set<string>();
    const list: WatchProgress[] = [];

    for (const item of all) {
      if (!seenSeries.has(item.seriesId)) {
        seenSeries.add(item.seriesId);
        // Only include if not finished or at least 15s in
        if (item.currentTime > 15 && (!item.completed || item.currentTime < item.duration - 30)) {
          list.push(item);
        }
      }
    }
    return list;
  }

  /**
   * Get progress for a specific episode
   */
  public static getEpisodeProgress(seriesId: string, episodeId: string): WatchProgress | null {
    const all = this.getAllProgress();
    return all.find(p => p.seriesId === seriesId && p.episodeId === episodeId) || null;
  }

  /**
   * Get progress for the latest episode of a series
   */
  public static getSeriesLatestProgress(seriesId: string): WatchProgress | null {
    const all = this.getAllProgress();
    return all.find(p => p.seriesId === seriesId) || null;
  }

  /**
   * Delete progress for a series
   */
  public static clearSeriesProgress(seriesId: string): void {
    const all = this.getAllProgress();
    const filtered = all.filter(p => p.seriesId !== seriesId);
    localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(filtered));
  }

  /**
   * Watchlist operations
   */
  public static getWatchlist(): WatchlistItem[] {
    try {
      const data = localStorage.getItem(STORAGE_WATCHLIST_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading watchlist:', e);
    }
    return [];
  }

  public static setWatchlistStatus(
    series: { id: string; title: string; image: string; rating: number; year: number; genres: string[]; totalEpisodes: number },
    status: WatchlistStatus | 'remove'
  ): void {
    const list = this.getWatchlist();
    const index = list.findIndex(item => item.seriesId === series.id);

    if (status === 'remove') {
      if (index !== -1) {
        list.splice(index, 1);
      }
    } else {
      if (index !== -1) {
        list[index].status = status;
        list[index].updatedAt = Date.now();
      } else {
        list.unshift({
          seriesId: series.id,
          series,
          status,
          addedAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    }

    try {
      localStorage.setItem(STORAGE_WATCHLIST_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving watchlist:', e);
    }
  }

  public static getSeriesWatchlistStatus(seriesId: string): WatchlistStatus | null {
    const list = this.getWatchlist();
    const found = list.find(item => item.seriesId === seriesId);
    return found ? found.status : null;
  }

  private static autoSetWatchingStatus(seriesId: string): void {
    const list = this.getWatchlist();
    const found = list.find(item => item.seriesId === seriesId);
    if (!found) {
      // Don't overwrite if user deliberately planned or completed
      // But if absent, we leave it or let user manually bookmark
    }
  }

  /**
   * Total stats calculation
   */
  public static getUserStats() {
    const progressList = this.getAllProgress();
    const watchlist = this.getWatchlist();

    const totalSecondsWatched = progressList.reduce((acc, p) => acc + (p.currentTime || 0), 0);
    const completedEpisodesCount = progressList.filter(p => p.completed).length;
    const completedSeriesCount = watchlist.filter(w => w.status === 'completed').length;

    return {
      hoursWatched: Math.round((totalSecondsWatched / 3600) * 10) / 10,
      completedEpisodesCount,
      completedSeriesCount,
      watchlistTotal: watchlist.length
    };
  }
}
