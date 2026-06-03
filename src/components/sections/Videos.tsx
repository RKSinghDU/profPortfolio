import { AlertCircle, Calendar, Eye, Play, RefreshCw } from 'lucide-react';
import { SITE } from '../../content/siteConfig';
import { useCarousel } from '../../hooks/useCarousel';
import { useYouTubeVideos } from '../../hooks/useYouTubeVideos';
import { formatRelativeDate, formatViewCount } from '../../utils/format';
import { CarouselArrows } from '../common/CarouselArrows';
import {
  card,
  eyebrow,
  sectionContainerBordered,
  sectionHeading,
  serif,
} from '../../styles/classNames';
import type { YouTubeVideo } from '../../services';

export interface VideosProps {
  slidesToShow: number;
}

export function Videos({ slidesToShow }: VideosProps) {
  const { videos, loading, error, refresh } = useYouTubeVideos(
    SITE.youtube.channelHandle,
    SITE.youtube.maxVideos,
  );
  const carousel = useCarousel(videos.length, slidesToShow);

  return (
    <section id="videos" className={sectionContainerBordered}>
      <div className="flex items-end justify-between gap-4 mb-7">
        <div>
          <span className={eyebrow}>Lectures</span>
          <h2 className={`${sectionHeading} mt-3`}>Latest from YouTube</h2>
          <p className="text-[0.9rem] text-[var(--muted)] mt-1">
            {videos.length > 0 ? `${videos.length} videos` : 'Loading videos…'}
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          title="Refresh videos"
          className={`p-2.5 rounded-md border border-[var(--line3)] text-[var(--accent)] hover:bg-[var(--accent-10)] transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
        </button>
      </div>

      {error && <ErrorState message={error} onRetry={refresh} />}
      {loading && !error && <VideosSkeleton />}
      {!loading && !error && videos.length > 0 && (
        <div className="relative">
          {carousel.canPaginate && <CarouselArrows onPrev={carousel.prev} onNext={carousel.next} />}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${carousel.index * (100 / slidesToShow)}%)` }}
            >
              {videos.map(video => (
                <VideoCard key={video.id} video={video} slidesToShow={slidesToShow} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={`text-center py-10 ${card}`}>
      <AlertCircle className="mx-auto text-[var(--accent)] mb-3" size={34} />
      <p className="text-[var(--muted2)] mb-4 px-4">{message}</p>
      <button onClick={onRetry} className="px-4 py-2 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-sm">
        Try Again
      </button>
    </div>
  );
}

function VideosSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="rounded-md overflow-hidden bg-[var(--surface)] border border-[var(--line2)] animate-pulse"
        >
          <div className="w-full h-40 bg-[var(--skeleton)]" />
          <div className="p-3">
            <div className="h-4 rounded bg-[var(--skeleton)] mb-2" />
            <div className="h-3 rounded w-2/3 bg-[var(--skeleton)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoCard({ video, slidesToShow }: { video: YouTubeVideo; slidesToShow: number }) {
  return (
    <div className="flex-shrink-0 px-2" style={{ width: `${100 / slidesToShow}%` }}>
      <button
        type="button"
        onClick={() => window.open(video.url, '_blank')}
        className={`text-left w-full cursor-pointer rounded-md overflow-hidden ${card} transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_-22px_rgba(193,80,46,0.5)]`}
      >
        <div className="relative">
          <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover block" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-[var(--ink-30)] transition-opacity">
            <Play className="text-[var(--bg)]" size={34} />
          </div>
          {video.duration && (
            <span className="absolute bottom-2 right-2 bg-[var(--overlay)] text-[var(--bg)] text-xs px-2 py-0.5 rounded">
              {video.duration}
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className={`${serif} font-medium text-sm text-[var(--heading)] line-clamp-2 mb-2`}>{video.title}</h3>
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1">
              <Eye size={13} /> {formatViewCount(video.viewCount)} views
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> {formatRelativeDate(video.publishedAt)}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
