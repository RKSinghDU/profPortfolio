import { useCallback, useEffect, useState } from 'react';
import { youtubeAPI } from '../services';
import type { YouTubeVideo } from '../services';

export interface UseYouTubeVideosResult {
  videos: YouTubeVideo[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useYouTubeVideos(channelHandle: string, maxResults: number): UseYouTubeVideosResult {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!youtubeAPI.isConfigured()) {
      setError('YouTube feed not configured yet — add VITE_YOUTUBE_API_KEY to your .env file.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setVideos(await youtubeAPI.getChannelVideos(channelHandle, maxResults));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  }, [channelHandle, maxResults]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { videos, loading, error, refresh };
}
