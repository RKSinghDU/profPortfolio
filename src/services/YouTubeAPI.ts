import { LocalStorageCache } from './Cache';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
  viewCount?: number;
  url: string;
}

interface SearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium?: { url: string };
      default: { url: string };
    };
    publishedAt: string;
  };
}

interface VideoDetails {
  id: string;
  contentDetails?: { duration?: string };
  statistics?: { viewCount?: string };
}

const THIRTY_MINUTES = 1000 * 60 * 30;

export class YouTubeAPI {
  private readonly baseURL = 'https://www.googleapis.com/youtube/v3';
  private readonly cache: LocalStorageCache<YouTubeVideo[]>;
  private readonly apiKey: string;

  constructor(apiKey: string, cacheTtlMs: number = THIRTY_MINUTES) {
    this.apiKey = apiKey;
    this.cache = new LocalStorageCache<YouTubeVideo[]>(cacheTtlMs);
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async getChannelVideos(channelHandle: string, maxResults = 10): Promise<YouTubeVideo[]> {
    const cacheKey = `youtube_videos_${channelHandle}_${maxResults}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const channelId = await this.resolveChannelId(channelHandle);
      const searchItems = await this.fetchSearchItems(channelId, maxResults);
      if (searchItems.length === 0) return [];

      const detailsById = await this.fetchVideoDetails(searchItems.map(i => i.id.videoId));
      const videos = searchItems.map(item => this.toVideo(item, detailsById.get(item.id.videoId)));

      this.cache.set(cacheKey, videos);
      return videos;
    } catch (error) {
      console.error('YouTube API Error:', error);
      const stale = this.cache.get(cacheKey, { ignoreExpiry: true });
      if (stale) return stale;
      throw error;
    }
  }

  private async resolveChannelId(handle: string): Promise<string> {
    const data = await this.request<{ items?: Array<{ snippet: { channelId: string } }> }>('/search', {
      q: handle.replace('@', ''),
      type: 'channel',
      part: 'snippet',
      maxResults: '1',
    });
    const first = data.items?.[0];
    if (!first) throw new Error(`Channel not found: ${handle}`);
    return first.snippet.channelId;
  }

  private async fetchSearchItems(channelId: string, maxResults: number): Promise<SearchItem[]> {
    const data = await this.request<{ items?: SearchItem[] }>('/search', {
      channelId,
      part: 'snippet',
      order: 'date',
      type: 'video',
      maxResults: String(maxResults),
    });
    return data.items ?? [];
  }

  private async fetchVideoDetails(ids: string[]): Promise<Map<string, VideoDetails>> {
    if (ids.length === 0) return new Map();
    const data = await this.request<{ items?: VideoDetails[] }>('/videos', {
      id: ids.join(','),
      part: 'statistics,contentDetails',
    });
    const detailsById = new Map<string, VideoDetails>();
    for (const item of data.items ?? []) {
      detailsById.set(item.id, item);
    }
    return detailsById;
  }

  private async request<T>(path: string, params: Record<string, string>): Promise<T> {
    const search = new URLSearchParams({ key: this.apiKey, ...params });
    const response = await fetch(`${this.baseURL}${path}?${search}`);
    if (!response.ok) throw new Error(`YouTube request failed: ${response.status}`);
    return response.json() as Promise<T>;
  }

  private toVideo(item: SearchItem, details?: VideoDetails): YouTubeVideo {
    return {
      id: item.id.videoId,
      title: decodeHtmlEntities(item.snippet.title),
      description: decodeHtmlEntities(item.snippet.description),
      thumbnail: item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      duration: details?.contentDetails?.duration ? parseIsoDuration(details.contentDetails.duration) : undefined,
      viewCount: details?.statistics?.viewCount ? parseInt(details.statistics.viewCount, 10) : undefined,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    };
  }
}

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function parseIsoDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '';
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  if (hours) return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
}
