import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, Linkedin, Youtube, University, ChevronLeft, ChevronRight, Play, Eye, Calendar, RefreshCw, AlertCircle, Monitor } from 'lucide-react';
import emailjs from '@emailjs/browser';

// YouTube API types
interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
  viewCount?: number;
  url: string;
}

// Contact form types - FIXED: Added index signature
interface ContactFormData {
  from_name: string;
  from_email: string;
  message: string;
  [key: string]: unknown; // This fixes the Record<string, unknown> error
}

// Theme types
type Theme = 'light' | 'dark' | 'system';

// YouTube API Service
class YouTubeAPI {
  private baseURL = 'https://www.googleapis.com/youtube/v3';
  private apiKey: string;
  private cacheExpiry = 1000 * 60 * 30; // 30 minutes
  
  constructor() {
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
  }

  async getChannelVideos(channelHandle: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    const cacheKey = `youtube_videos_${channelHandle}_${maxResults}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Get channel ID from handle
      const channelId = await this.getChannelIdFromHandle(channelHandle);
      
      // Search for videos
      const searchResponse = await fetch(`${this.baseURL}/search?` + new URLSearchParams({
        key: this.apiKey,
        channelId: channelId,
        part: 'snippet',
        order: 'date',
        type: 'video',
        maxResults: maxResults.toString()
      }));

      if (!searchResponse.ok) throw new Error('Failed to fetch videos');
      
      const searchData = await searchResponse.json();
      
      if (!searchData.items) return [];

      // Get video details
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      const videoResponse = await fetch(`${this.baseURL}/videos?` + new URLSearchParams({
        key: this.apiKey,
        id: videoIds,
        part: 'statistics,contentDetails'
      }));

      const videoData = await videoResponse.json();

      // Process videos
      const videos: YouTubeVideo[] = searchData.items.map((video: any, index: number) => {
        const details = videoData.items[index];
        return {
          id: video.id.videoId,
          title: this.decodeHtmlEntities(video.snippet.title),
          description: this.decodeHtmlEntities(video.snippet.description),
          thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
          publishedAt: video.snippet.publishedAt,
          duration: details?.contentDetails?.duration ? this.parseDuration(details.contentDetails.duration) : undefined,
          viewCount: details?.statistics?.viewCount ? parseInt(details.statistics.viewCount) : undefined,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`
        };
      });

      this.saveToCache(cacheKey, videos);
      return videos;
    } catch (error) {
      console.error('YouTube API Error:', error);
      // Return cached data if API fails
      const cached = this.getFromCache(cacheKey, true);
      if (cached) return cached;
      throw error;
    }
  }

  private async getChannelIdFromHandle(handle: string): Promise<string> {
    const cleanHandle = handle.replace('@', '');
    const response = await fetch(`${this.baseURL}/search?` + new URLSearchParams({
      key: this.apiKey,
      q: cleanHandle,
      type: 'channel',
      part: 'snippet',
      maxResults: '1'
    }));

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].snippet.channelId;
    }
    throw new Error(`Channel not found: ${handle}`);
  }

  private decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  private parseDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  }

  private getFromCache(key: string, ignoreExpiry = false): YouTubeVideo[] | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (!ignoreExpiry && Date.now() - timestamp > this.cacheExpiry) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  private saveToCache(key: string, data: YouTubeVideo[]): void {
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
      console.warn('Failed to cache YouTube data');
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Custom hook for theme management
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
    
    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme to document
  const applyTheme = useCallback((darkMode: boolean) => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark-mode');
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#ffffff';
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#1f2937';
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  // Apply theme when isDarkMode changes
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode, applyTheme]);

  // Update theme
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemDark);
    } else {
      setIsDarkMode(newTheme === 'dark');
    }
  };

  return { theme, isDarkMode, updateTheme };
};

// Enhanced Theme Toggle Component
const ThemeToggle = ({ isDarkMode, theme, updateTheme }: {
  isDarkMode: boolean;
  theme: Theme;
  updateTheme: (theme: Theme) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = () => {
    // Simple toggle between light and dark
    updateTheme(isDarkMode ? 'light' : 'dark');
  };

  // FIXED: Added proper event handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  const themeOptions = [
    { value: 'light' as Theme, label: 'Light', icon: Sun },
    { value: 'dark' as Theme, label: 'Dark', icon: Moon },
    { value: 'system' as Theme, label: 'System', icon: Monitor }
  ];

  return (
    <div className="relative">
      {/* Simple Toggle Button */}
      <button
        onClick={handleToggle}
        onContextMenu={handleContextMenu}
        className={`p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isDarkMode 
            ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
            : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
        }`}
        title="Click to toggle theme, right-click for options"
      >
        {isDarkMode ? <Sun size={20} className="sm:w-6 sm:h-6" /> : <Moon size={20} className="sm:w-6 sm:h-6" />}
      </button>

      {/* Advanced Options Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className={`absolute right-0 top-full mt-2 z-20 min-w-[120px] rounded-lg shadow-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {themeOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    updateTheme(option.value);
                    setShowMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors duration-200 flex items-center gap-2 ${
                    theme === option.value
                      ? isDarkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${index === themeOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                >
                  <IconComponent size={16} />
                  <span>{option.label}</span>
                  {theme === option.value && <span className="ml-auto">✓</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default function ProfessorPortfolio() {
  // Use the advanced theme hook
  const { theme, isDarkMode, updateTheme } = useTheme();
  
  const [formData, setFormData] = useState<ContactFormData>({
    from_name: '',
    from_email: '',
    message: ''
  });

  // Contact form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // YouTube carousel state
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const youtubeAPI = useRef(new YouTubeAPI());

  // Channel configuration
  const CHANNEL_HANDLE = '@rksinghdu'; // Your YouTube channel handle
  const MAX_VIDEOS = 5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.from_name.trim() || !formData.from_email.trim() || !formData.message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // FIXED: No need to cast anymore due to index signature
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSubmitStatus('success');
      setFormData({ from_name: '', from_email: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Email send error:', error);
      setSubmitStatus('error');
      
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch YouTube videos
  const fetchVideos = async () => {
    if (!youtubeAPI.current.isConfigured()) {
      setVideosError('YouTube API not configured. Add VITE_YOUTUBE_API_KEY to your .env file');
      setVideosLoading(false);
      return;
    }

    setVideosLoading(true);
    setVideosError(null);

    try {
      const fetchedVideos = await youtubeAPI.current.getChannelVideos(CHANNEL_HANDLE, MAX_VIDEOS);
      console.log('🔍 Debug - Fetched videos:', fetchedVideos);
      console.log('🔍 Debug - First video thumbnail:', fetchedVideos[0]?.thumbnail);
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('❌ Error fetching videos:', error);
      setVideosError(error instanceof Error ? error.message : 'Failed to fetch videos');
    } finally {
      setVideosLoading(false);
    }
  };

  // Responsive slides calculation
  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesToShow(1);
      else if (width < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // Carousel navigation
  const nextSlide = () => {
    setCurrentVideoIndex(prev => {
      const maxIndex = Math.max(0, videos.length - slidesToShow);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentVideoIndex(prev => {
      const maxIndex = Math.max(0, videos.length - slidesToShow);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  // Utility functions
  const formatViewCount = (count?: number): string => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // FIXED: Added proper event handlers for image load events
  const handleImageLoad = (thumbnail: string) => {
    console.log('✅ Image loaded successfully:', thumbnail);
  };

  const handleImageError = (thumbnail: string) => {
    console.log('❌ Image failed to load:', thumbnail);
  };

  return (
    <div className={`min-h-screen font-sans p-3 sm:p-6 space-y-6 sm:space-y-10 max-w-5xl mx-auto transition-colors duration-300`}>
      
      {/* Enhanced Dark Mode Toggle */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle 
          isDarkMode={isDarkMode} 
          theme={theme} 
          updateTheme={updateTheme} 
        />
      </div>

      {/* Profile Section */}
      <section className={`rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <img 
          src="/photo.png"
          alt="Profile" 
          className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover flex-shrink-0" 
        />
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold">REETESH KUMAR SINGH</h1>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Professor</p>
          <p className="text-sm sm:text-base">rksingh@commerce.du.ac.in</p>
          <p className="text-sm sm:text-base">University of Delhi, Department of Commerce</p>
          <p className="text-sm sm:text-base">Specializations: Human Resource Management, Organisational Behaviour</p>
          <div className="flex justify-center sm:justify-start space-x-4 mt-2">
            <a href="https://www.linkedin.com/in/dr-r-k-singh-b4b4641b" target="_blank" rel="noopener noreferrer" className="text-blue-500"><Linkedin/></a>
            <a href="https://www.youtube.com/@rksinghdu" target="_blank" rel="noopener noreferrer" className="text-red-500"><Youtube size={28}/></a>
            <a href="https://smrth.in/pN" target="_blank" rel="noopener noreferrer" className="text-[#9a4cb2]"><University/></a>
          </div>
        </div>
      </section>

      {/* YouTube Videos Carousel Section */}
      <section className={`rounded-2xl shadow-lg p-4 sm:p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Latest YouTube Videos</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {videos.length > 0 ? `${videos.length} videos` : 'Loading videos...'}
            </p>
          </div>
          <button
            onClick={fetchVideos}
            disabled={videosLoading}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            } ${videosLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Refresh videos"
          >
            <RefreshCw className={`h-4 w-4 ${videosLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Error State */}
        {videosError && (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-500 mb-4">{videosError}</p>
            <button
              onClick={fetchVideos}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {videosLoading && !videosError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden shadow-md animate-pulse ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div className={`w-full h-32 sm:h-40 ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}></div>
                <div className="p-3">
                  <div className={`h-4 rounded mb-2 ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                  <div className={`h-3 rounded w-2/3 ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Carousel */}
        {!videosLoading && !videosError && videos.length > 0 && (
          <div className="relative">
            {/* Navigation Buttons */}
            {videos.length > slidesToShow && (
              <>
                <button
                  onClick={prevSlide}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-white hover:bg-gray-50 text-gray-800'
                  } -ml-4 hover:scale-110`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-white hover:bg-gray-50 text-gray-800'
                  } -mr-4 hover:scale-110`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Videos Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentVideoIndex * (100 / slidesToShow)}%)`
                }}
              >
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className={`flex-shrink-0 px-2`}
                    style={{ width: `${100 / slidesToShow}%` }}
                  >
                    <div
                      className={`rounded-xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg cursor-pointer ${
                        isDarkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => window.open(video.url, '_blank')}
                    >
                      {/* Thumbnail */}
                      <div className="relative bg-gray-200 overflow-hidden rounded-t-xl">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-32 sm:h-40"
                          onLoad={() => handleImageLoad(video.thumbnail)}
                          onError={() => handleImageError(video.thumbnail)}
                          style={{ 
                            display: 'block',
                            width: '100%',
                            height: '128px',
                            objectFit: 'cover',
                            backgroundColor: 'transparent',
                            border: 'none',
                            outline: 'none'
                          }}
                        />
                        
                        <div className="absolute inset-0 hover:backdrop-blur-sm transition-all duration-200 flex items-center justify-center">
                          <Play className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
                        </div>
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2 mb-2">
                          {video.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{formatViewCount(video.viewCount)} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(video.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            {videos.length > slidesToShow && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: Math.max(1, videos.length - slidesToShow + 1) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      currentVideoIndex === index
                        ? 'bg-blue-500 w-4'
                        : isDarkMode
                        ? 'bg-gray-600 hover:bg-gray-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Videos State */}
        {!videosLoading && !videosError && videos.length === 0 && (
          <div className="text-center py-8">
            <Play className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No videos found
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Check your channel configuration
            </p>
          </div>
        )}
      </section>

      {/* OER Section */}
      <section className={`rounded-2xl shadow-lg p-4 sm:p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Open Educational Resources (OER)</h2>
        <div className={`p-4 rounded-lg backdrop-blur-md transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`font-medium text-base sm:text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Human Resource Management Materials</h3>
          <p className={`text-sm italic mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Educational resources and research materials...</p>
          <button className="w-full sm:w-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base">
            Open Full Resource
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`rounded-2xl shadow-lg p-4 sm:p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Contact Me</h2>
        
        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            ✅ Message sent successfully! I'll get back to you soon.
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            ❌ Failed to send message. Please try again or email me directly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="from_name"
            placeholder="Your Name"
            value={formData.from_name}
            onChange={handleInputChange}
            required
            className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-colors duration-300 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-black'
            }`}
          />
          
          <input
            type="email"
            name="from_email"
            placeholder="Your Email"
            value={formData.from_email}
            onChange={handleInputChange}
            required
            className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-colors duration-300 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-black'
            }`}
          />
          
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            required
            className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-colors duration-300 resize-none ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-black'
            }`}
          />
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-300 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {/* Contact Info */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Or email me directly at: 
            <a href="mailto:rksingh@commerce.du.ac.in" className="text-blue-500 hover:underline ml-1">
              rksingh@commerce.du.ac.in
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}
