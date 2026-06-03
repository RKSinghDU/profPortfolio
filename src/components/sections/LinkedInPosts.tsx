import { ArrowUpRight, Linkedin } from 'lucide-react';
import { LINKEDIN_POSTS } from '../../content/linkedinPosts';
import type { LinkedInPost } from '../../content/linkedinPosts';
import { SITE } from '../../content/siteConfig';
import { useCarousel } from '../../hooks/useCarousel';
import { CarouselArrows } from '../common/CarouselArrows';
import { CarouselDots } from '../common/CarouselDots';
import { card, eyebrow, sectionContainerBordered, sectionHeading, serif } from '../../styles/classNames';

export interface LinkedInPostsProps {
  slidesToShow: number;
}

export function LinkedInPosts({ slidesToShow }: LinkedInPostsProps) {
  const carousel = useCarousel(LINKEDIN_POSTS.length, slidesToShow);
  const dotCount = Math.max(1, LINKEDIN_POSTS.length - slidesToShow + 1);

  return (
    <section id="linkedin" className={sectionContainerBordered}>
      <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
        <div>
          <span className={eyebrow}>From LinkedIn</span>
          <h2 className={`${sectionHeading} mt-3`}>Recent posts</h2>
          <p className="text-[0.9rem] text-[var(--muted)] mt-1">
            {LINKEDIN_POSTS.length > 0
              ? `${LINKEDIN_POSTS.length} featured ${LINKEDIN_POSTS.length === 1 ? 'post' : 'posts'}`
              : 'Featured updates from LinkedIn'}
          </p>
        </div>
        <a
          href={SITE.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-[var(--line3)] text-[var(--accent)] text-[0.86rem] hover:bg-[var(--accent-10)] transition-colors"
        >
          <Linkedin size={16} /> View profile
        </a>
      </div>

      {LINKEDIN_POSTS.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="relative">
          {carousel.canPaginate && <CarouselArrows onPrev={carousel.prev} onNext={carousel.next} />}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${carousel.index * (100 / slidesToShow)}%)` }}
            >
              {LINKEDIN_POSTS.map((post, i) => (
                <PostCard key={i} post={post} index={i} slidesToShow={slidesToShow} />
              ))}
            </div>
          </div>
          {carousel.canPaginate && (
            <CarouselDots count={dotCount} activeIndex={carousel.index} onSelect={carousel.goTo} />
          )}
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className={`${card} p-7 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left`}>
      <Linkedin className="text-[var(--accent)] shrink-0" size={38} strokeWidth={1.5} />
      <div className="flex-1">
        <h3 className={`${serif} text-[var(--heading)] text-[1.2rem]`}>Featured posts coming soon.</h3>
        <p className="text-[0.93rem] text-[var(--muted2)] mt-1">
          In the meantime, follow along on LinkedIn for updates on research, teaching, and AI in education.
        </p>
      </div>
      <a
        href={SITE.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-[0.88rem] hover:bg-[var(--accent-deep)] transition-colors shrink-0"
      >
        Follow on LinkedIn <ArrowUpRight size={16} />
      </a>
    </div>
  );
}

function PostCard({ post, index, slidesToShow }: { post: LinkedInPost; index: number; slidesToShow: number }) {
  return (
    <div className="flex-shrink-0 px-2" style={{ width: `${100 / slidesToShow}%` }}>
      <div
        className={`rounded-md overflow-hidden ${card} p-2 transition-all hover:shadow-[0_16px_32px_-22px_rgba(193,80,46,0.5)]`}
      >
        {post.caption && (
          <p className="text-[0.85rem] text-[var(--muted2)] italic px-2 pt-1.5 pb-2">{post.caption}</p>
        )}
        <iframe
          src={post.url}
          width="100%"
          height="540"
          style={{ border: 0, display: 'block', borderRadius: 4 }}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          title={`LinkedIn post ${index + 1}`}
        />
      </div>
    </div>
  );
}
