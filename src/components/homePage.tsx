import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Linkedin, Youtube, GraduationCap, ChevronLeft, ChevronRight, Play, Eye,
  Calendar, RefreshCw, AlertCircle, Lock, ArrowUpRight, BookOpen, Mail,
  MapPin, Send, Menu, X, Layers, ClipboardCheck, FileText, CalendarDays, Sparkles,
  Sun, Moon,
} from 'lucide-react';
import emailjs from '@emailjs/browser';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
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

interface ContactFormData {
  from_name: string;
  from_email: string;
  message: string;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ */
/*  YouTube API service (preserved from original project)              */
/* ------------------------------------------------------------------ */
class YouTubeAPI {
  private baseURL = 'https://www.googleapis.com/youtube/v3';
  private apiKey: string;
  private cacheExpiry = 1000 * 60 * 30; // 30 minutes

  constructor() {
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
  }

  async getChannelVideos(channelHandle: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    const cacheKey = `youtube_videos_${channelHandle}_${maxResults}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const channelId = await this.getChannelIdFromHandle(channelHandle);
      const searchResponse = await fetch(`${this.baseURL}/search?` + new URLSearchParams({
        key: this.apiKey,
        channelId: channelId,
        part: 'snippet',
        order: 'date',
        type: 'video',
        maxResults: maxResults.toString(),
      }));
      if (!searchResponse.ok) throw new Error('Failed to fetch videos');

      const searchData = await searchResponse.json();
      if (!searchData.items) return [];

      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      const videoResponse = await fetch(`${this.baseURL}/videos?` + new URLSearchParams({
        key: this.apiKey,
        id: videoIds,
        part: 'statistics,contentDetails',
      }));
      const videoData = await videoResponse.json();

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
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        };
      });

      this.saveToCache(cacheKey, videos);
      return videos;
    } catch (error) {
      console.error('YouTube API Error:', error);
      const fallback = this.getFromCache(cacheKey, true);
      if (fallback) return fallback;
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
      maxResults: '1',
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

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */
const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'innovations', label: 'Innovations' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'portal', label: 'Student Portal' },
  { id: 'contact', label: 'Contact' },
];

const FIGURES = [
  { n: '25+', t: 'Years Teaching' },
  { n: '5k+', t: 'Students Mentored' },
  { n: '40+', t: 'Theses Examined' },
  { n: '6', t: 'Tools Built' },
];

const INNOVATIONS = [
  { icon: Layers, tag: 'Simulation', title: 'Organizational Behaviour Simulation', body: 'Students take on management roles and work through decisions across multiple rounds, turning abstract concepts into lived, decision-driven experience.' },
  { icon: ClipboardCheck, tag: 'System', title: 'Attendance System', body: 'A clean digital record across sections, signed into with students’ own university accounts — replacing manual registers.' },
  { icon: FileText, tag: 'System', title: 'Examination Paper Portal', body: 'Manages question papers from submission to secure storage, organized and safely held until they are needed.' },
  { icon: CalendarDays, tag: 'Tool', title: 'Timetable Maker', body: 'Assembles and manages teaching timetables, reducing a fiddly manual task to a few guided steps.' },
  { icon: Sparkles, tag: 'AI', title: 'AI-Assisted Evaluation', body: 'Applies structured rubrics to score student answers consistently, while keeping final judgment with the teacher.' },
];

const CONSULTING = [
  { title: 'Organization Development & Change', body: 'Diagnosis, design, and facilitation of OD and change initiatives, drawing on contemporary frameworks and Indian managerial traditions.' },
  { title: 'Teaching–Learning Process Design', body: 'Experiential and simulation-based learning, active-learning course design, and fair, rigorous assessment.' },
  { title: 'HR & Leadership Solutions', body: 'People processes, leadership development, and organizational-behaviour interventions for high-performing teams.' },
  { title: 'AI in Teaching & Learning', body: 'Practical, responsible adoption — from rubric-based evaluation systems to automated workflows — grounded in systems run at scale across my own courses.' },
  { title: 'Assessment & Evaluation Systems', body: 'Rubrics, evaluation frameworks, and AI-supported scoring that bring consistency across large cohorts.' },
  { title: 'Research Methodology & Mentoring', body: 'Research design, qualitative and quantitative methods, and doctoral-level guidance.' },
];

const COURSES = [
  { code: 'COMC004', title: 'Organizational Behaviour & Leadership', body: 'How individuals and groups behave within organizations, and the leadership that shapes them.' },
  { code: 'DSEH02', title: 'Organizational Change & Development', body: 'How organizations change, adapt, and develop — and the interventions that guide them.' },
  { code: 'PHDCC001', title: 'Research Methodology (Doctoral)', body: 'Research design and methodology for doctoral scholars, from philosophy of research to scholarly craft.' },
];

// Replace each '#' with the deployed Apps Script web-app URL (access-restricted to your students).
const PORTAL_TOOLS = [
  { title: 'Simulations', body: 'Launch the organizational behaviour simulation.', url: '#' },
  { title: 'Attendance', body: 'Mark and view your attendance.', url: '#' },
  { title: 'Examinations', body: 'Examination paper portal.', url: '#' },
  { title: 'Reference Materials', body: 'Readings, slides, and course documents.', url: '#' },
];

const CHANNEL_HANDLE = '@rksinghdu';
const MAX_VIDEOS = 5;

/* ------------------------------------------------------------------ */
/*  LinkedIn featured posts                                            */
/*                                                                     */
/*  To add a post:                                                     */
/*   1.  Open the post on LinkedIn.                                    */
/*   2.  Click the "..." menu on the post → "Embed this post".         */
/*   3.  In the dialog, copy the URL inside src="..." of the iframe.   */
/*       It looks like:                                                */
/*       https://www.linkedin.com/embed/feed/update/urn:li:share:7...  */
/*   4.  Paste it as a new entry below. `caption` is optional.         */
/* ------------------------------------------------------------------ */
const LINKEDIN_POSTS: { url: string; caption?: string }[] = [
  // Example (replace with your real embed URLs):
  // { url: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7012345678901234567',
  {  url: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7463366561613918208?collapsed=1',
     url: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7460547859545845765?collapsed=1',
     url: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7423261493195988992?collapsed=1'
  }
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ProfessorPortfolio() {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('rk-theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('rk-theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Contact form
  const [formData, setFormData] = useState<ContactFormData>({ from_name: '', from_email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // YouTube
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const youtubeAPI = useRef(new YouTubeAPI());

  // LinkedIn carousel
  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  /* ---- navigation ---- */
  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* ---- contact form ---- */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.from_name.trim() || !formData.from_email.trim() || !formData.message.trim()) {
      alert('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setSubmitStatus('success');
      setFormData({ from_name: '', from_email: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Email send error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- youtube ---- */
  const fetchVideos = async () => {
    if (!youtubeAPI.current.isConfigured()) {
      setVideosError('YouTube feed not configured yet — add VITE_YOUTUBE_API_KEY to your .env file.');
      setVideosLoading(false);
      return;
    }
    setVideosLoading(true);
    setVideosError(null);
    try {
      const fetched = await youtubeAPI.current.getChannelVideos(CHANNEL_HANDLE, MAX_VIDEOS);
      setVideos(fetched);
    } catch (error) {
      setVideosError(error instanceof Error ? error.message : 'Failed to fetch videos');
    } finally {
      setVideosLoading(false);
    }
  };

  useEffect(() => {
    const updateSlides = () => {
      const w = window.innerWidth;
      if (w < 640) setSlidesToShow(1);
      else if (w < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };
    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  useEffect(() => { fetchVideos(); }, []);

  const nextSlide = () => {
    setCurrentVideoIndex((prev) => {
      const maxIndex = Math.max(0, videos.length - slidesToShow);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };
  const prevSlide = () => {
    setCurrentVideoIndex((prev) => {
      const maxIndex = Math.max(0, videos.length - slidesToShow);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const nextPost = () => {
    setCurrentPostIndex((prev) => {
      const maxIndex = Math.max(0, LINKEDIN_POSTS.length - slidesToShow);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };
  const prevPost = () => {
    setCurrentPostIndex((prev) => {
      const maxIndex = Math.max(0, LINKEDIN_POSTS.length - slidesToShow);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const formatViewCount = (count?: number): string => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  /* ---- shared class fragments ---- */
  const serif = "font-['Marcellus']";
  const eyebrow = `${serif} text-[0.72rem] tracking-[0.22em] uppercase text-[var(--accent)]`;
  const sectionPad = 'scroll-mt-24 py-20';

  return (
    <div className={`${dark ? 'theme-dark' : 'theme-light'} min-h-screen bg-[var(--bg)] text-[var(--ink)] selection:bg-[var(--accent)] selection:text-[var(--bg)]`}
         style={{ fontFamily: '"Mukta", system-ui, sans-serif' }}>

      {/* ---------------- NAV ---------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--nav-bg)] border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center gap-4">
          <button onClick={() => goTo('home')} className="flex items-center gap-3 shrink-0">
            <span className={`${serif} w-10 h-10 grid place-items-center rounded-full border border-[var(--accent)] text-[var(--accent)] text-sm`}>RKS</span>
            <span className="text-left leading-none">
              <span className={`${serif} block text-[var(--heading)] text-[1.05rem]`}>R. K. Singh</span>
              <span className="block text-[0.6rem] tracking-[0.16em] uppercase text-[var(--muted)]">University of Delhi</span>
            </span>
          </button>

          {/* desktop links */}
          <nav className="ml-auto hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => goTo(n.id)}
                className={`px-3 py-2 text-[0.82rem] tracking-wide transition-colors border-b-2 ${
                  active === n.id ? 'text-[var(--accent)] border-[var(--accent)]' : 'text-[var(--muted2)] border-transparent hover:text-[var(--heading)]'
                }`}>
                {n.label}
              </button>
            ))}
          </nav>

          {/* desktop theme toggle */}
          <button onClick={() => setDark((v) => !v)} aria-label="Toggle theme"
            className="hidden md:grid place-items-center w-9 h-9 ml-1 rounded-full border border-[var(--line3)] text-[var(--accent)] hover:bg-[var(--accent-10)] transition-colors">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* mobile toggle */}
          <button onClick={() => setDark((v) => !v)} aria-label="Toggle theme"
            className="ml-auto md:hidden grid place-items-center w-9 h-9 rounded-full text-[var(--accent)]">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="md:hidden text-[var(--heading)] p-2" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[var(--line2)] bg-[var(--bg)]">
            <div className="max-w-6xl mx-auto px-5 py-2 flex flex-col">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => goTo(n.id)}
                  className={`text-left py-2.5 text-[0.95rem] border-b border-[var(--line-ink)] ${
                    active === n.id ? 'text-[var(--accent)]' : 'text-[var(--ink)]'
                  }`}>
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ---------------- HERO ---------------- */}
        <section id="home" className="scroll-mt-24 relative overflow-hidden">
          {/* warm atmosphere */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(193,80,46,0.12), transparent 65%)' }} />
          <div className="pointer-events-none absolute bottom-0 -left-20 w-80 h-80 rounded-full"
               style={{ background: 'radial-gradient(circle, var(--accent-10), transparent 65%)' }} />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-14 grid md:grid-cols-[1.3fr_0.9fr] gap-10 md:gap-12 items-center">
            <div className="animate-[rise_0.7s_ease-out]">
              <span className={eyebrow}>Professor of Commerce &middot; University of Delhi</span>
              <h1 className={`${serif} text-[var(--heading)] mt-4 leading-[1.05] text-[clamp(2.6rem,6.5vw,4.6rem)]`}>
                Reetesh Kumar<br />Singh
              </h1>
              <p className="mt-4 text-[var(--muted2)] text-[clamp(1rem,2vw,1.2rem)] italic">
                Human Resource Management <span className="text-[var(--accent)]">&#9670;</span> Organisational Behaviour <span className="text-[var(--accent)]">&#9670;</span> Research Methodology
              </p>
              <p className="mt-5 max-w-[52ch] text-[1.08rem] text-[var(--body)] leading-relaxed">
                A teacher and researcher of organizations at the University of Delhi — and a builder of
                simulations and AI-assisted tools that bring rigour and accessibility to the way we teach and assess.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => goTo('research')}
                  className="px-5 py-2.5 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-[0.88rem] tracking-wide hover:bg-[var(--accent-deep)] transition-colors">
                  Explore my research
                </button>
                <button onClick={() => goTo('consulting')}
                  className="px-5 py-2.5 rounded-sm border border-[var(--accent)] text-[var(--accent)] text-[0.88rem] tracking-wide hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors">
                  Consulting &amp; advisory
                </button>
                <button onClick={() => goTo('portal')}
                  className="px-5 py-2.5 rounded-sm border border-[var(--ink-30)] text-[var(--heading)] text-[0.88rem] tracking-wide hover:border-[var(--heading)] transition-colors">
                  Student Portal
                </button>
              </div>
            </div>

            {/* portrait */}
            <div className="relative mx-auto md:mx-0 w-60 sm:w-72 animate-[rise_0.9s_ease-out]">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-md border border-[var(--accent-45)]" />
              <div className="relative rounded-md overflow-hidden border border-[var(--accent)] bg-[var(--portrait-bg)]">
                <img src="/photo.png" alt="Prof. Reetesh Kumar Singh" className="w-full aspect-square object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- FIGURES ---------------- */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 border border-[var(--line)] rounded-md overflow-hidden bg-[var(--surface)]">
            {FIGURES.map((f, i) => (
              <div key={f.t}
                className={`p-6 text-center border-[var(--line2)] ${i < 3 ? 'md:border-r' : ''} ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''}`}>
                <div className={`${serif} text-[var(--accent)] text-3xl`}><span className="text-[var(--ink-30)]">{f.n}</span></div>
                <div className="mt-2 text-[0.72rem] tracking-[0.12em] uppercase text-[var(--muted)]">{f.t}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-[0.78rem] text-[var(--accent)] italic mt-2">[ figures are placeholders — edit in the FIGURES array ]</p>
        </div>

        {/* ---------------- ABOUT ---------------- */}
        <section id="about" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[var(--line-ink)]`}>
          <div className="flex items-baseline gap-4 flex-wrap mb-8">
            <span className={eyebrow}>About</span>
            <h2 className={`${serif} text-[var(--heading)] text-[clamp(1.8rem,4.4vw,2.6rem)]`}>A scholar of organizations.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <p className="text-[1.05rem] leading-relaxed text-[var(--body)]">
              <span className={`${serif} float-left text-[3.4rem] leading-[0.7] pr-2 pt-1 text-[var(--accent)]`}>I</span>
              am a Professor in the Department of Commerce at the Faculty of Commerce and Business, Delhi School of
              Economics, University of Delhi. My work sits at the meeting point of human resource management,
              organisational behaviour, and research methodology — taught across postgraduate and doctoral programmes.
            </p>
            <p className="text-[1.05rem] leading-relaxed text-[var(--body)]">
              Beyond the classroom I examine doctoral theses, evaluate academic and policy research, and contribute to
              scholarly publishing. A steady thread runs through all of it: the belief that well-designed tools should
              free teachers to teach, and give students clearer, fairer, more engaging learning — without surrendering
              the human judgment at the heart of education.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-[var(--muted2)]">
            <span><span className="text-[var(--accent)]">&#9670;</span> Human Resource Management</span>
            <span><span className="text-[var(--accent)]">&#9670;</span> Organisational Behaviour</span>
            <span><span className="text-[var(--accent)]">&#9670;</span> Research Methodology</span>
            <span><span className="text-[var(--accent)]">&#9670;</span> AI in Education</span>
          </div>
        </section>

        {/* ---------------- RESEARCH ---------------- */}
        <section id="research" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[var(--line-ink)]`}>
          <span className={eyebrow}>Publications &amp; Research</span>
          <h2 className={`${serif} text-[var(--heading)] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-3`}>Publications &amp; Research</h2>
          <p className="max-w-[64ch] text-[var(--muted2)]">Peer-reviewed articles, books and chapters, and a substantial body of evaluative and editorial work. A complete list appears in my CV.</p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-[0.72rem] tracking-[0.18em] uppercase text-[var(--accent)] mb-3">Journal Articles</div>
              <ul className="space-y-3 text-[0.95rem] text-[var(--body)]">
                <li className="text-[var(--accent)] italic">[ Author(s). (Year). &ldquo;Title.&rdquo; Journal, Vol(Issue), pages. ]</li>
                <li className="text-[var(--accent)] italic">[ Author(s). (Year). &ldquo;Title.&rdquo; Journal, Vol(Issue), pages. ]</li>
              </ul>
            </div>
            <div>
              <div className="text-[0.72rem] tracking-[0.18em] uppercase text-[var(--accent)] mb-3">Books &amp; Chapters</div>
              <ul className="space-y-3 text-[0.95rem] text-[var(--body)]">
                <li className="text-[var(--accent)] italic">[ Author(s). (Year). Title. Publisher. ]</li>
              </ul>
            </div>
            <div>
              <div className="text-[0.72rem] tracking-[0.18em] uppercase text-[var(--accent)] mb-3">Editorial &amp; Evaluative</div>
              <ul className="space-y-3 text-[0.95rem] text-[var(--body)]">
                <li>Manuscript review for scholarly journals.</li>
                <li>Examiner of doctoral theses across Indian universities.</li>
                <li>Evaluator of academic &amp; policy research.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------- INNOVATIONS ---------------- */}
        <section id="innovations" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[var(--line-ink)]`}>
          <span className={eyebrow}>Selected Work</span>
          <h2 className={`${serif} text-[var(--heading)] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-3`}>Innovations in teaching.</h2>
          <p className="max-w-[64ch] text-[var(--muted2)]">Tools I have designed for teaching and assessment. Access to the working tools is reserved for my students through the Student Portal.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INNOVATIONS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="group bg-[var(--surface)] border border-[var(--line)] rounded-md p-6 transition-all hover:-translate-y-1 hover:shadow-[0_18px_36px_-22px_rgba(193,80,46,0.5)]">
                  <Icon className="text-[var(--accent)] mb-4" size={26} strokeWidth={1.5} />
                  <div className="text-[0.66rem] tracking-[0.14em] uppercase text-[var(--accent)] mb-1">{c.tag}</div>
                  <h3 className={`${serif} text-[var(--heading)] text-[1.2rem] mb-2`}>{c.title}</h3>
                  <p className="text-[0.93rem] text-[var(--muted2)] leading-relaxed">{c.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------------- CONSULTING ---------------- */}
        <section id="consulting" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[var(--line-ink)]`}>
          <span className={eyebrow}>Consulting &amp; Advisory</span>
          <h2 className={`${serif} text-[var(--heading)] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-3`}>Bring this work to your institution.</h2>
          <p className="max-w-[64ch] text-[var(--muted2)]">I work with educational institutions, corporates, and teams — bridging established management scholarship with hands-on implementation and the responsible use of AI.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONSULTING.map((c) => (
              <div key={c.title} className="bg-[var(--surface)] border border-[var(--line)] rounded-md p-6 border-l-2 border-l-[var(--accent)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_36px_-22px_rgba(193,80,46,0.5)]">
                <h3 className={`${serif} text-[var(--heading)] text-[1.15rem] mb-2`}>{c.title}</h3>
                <p className="text-[0.93rem] text-[var(--muted2)] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button onClick={() => goTo('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[var(--heading)] text-[var(--bg)] text-[0.88rem] hover:bg-[var(--heading-hover)] transition-colors">
              Discuss an engagement <ArrowUpRight size={16} />
            </button>
          </div>
        </section>

        {/* ---------------- TEACHING ---------------- */}
        <section id="teaching" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[var(--line-ink)]`}>
          <span className={eyebrow}>Teaching</span>
          <h2 className={`${serif} text-[var(--heading)] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-3`}>Courses</h2>
          <p className="max-w-[64ch] text-[var(--muted2)]">Across postgraduate and doctoral programmes in the Department of Commerce. Course materials for enrolled students live in the Student Portal.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES.map((c) => (
              <div key={c.code} className="bg-[var(--surface)] border border-[var(--line)] rounded-md p-6">
                <div className="text-[0.66rem] tracking-[0.14em] uppercase text-[var(--accent)] mb-1">{c.code}</div>
                <h3 className={`${serif} text-[var(--heading)] text-[1.15rem] mb-2`}>{c.title}</h3>
                <p className="text-[0.93rem] text-[var(--muted2)] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- STUDENT PORTAL ---------------- */}
        <section id="portal" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[var(--line-ink)]`}>
          <span className={eyebrow}>Student Portal</span>
          <h2 className={`${serif} text-[var(--heading)] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-4`}>For my students.</h2>
          <div className="max-w-[62ch] bg-[var(--panel)] border-l-4 border-[var(--accent)] rounded-r-md px-5 py-4 text-[0.95rem] text-[var(--body)]">
            <strong className="text-[var(--heading)]">Sign in with your University of Delhi account.</strong> Access is restricted to the current class roster — please use your institutional email, not a personal one. Each tool opens in a new tab.
          </div>
          <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PORTAL_TOOLS.map((t) => (
              <a key={t.title} href={t.url} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col bg-[var(--surface)] border border-[var(--line)] rounded-md p-5 transition-all hover:border-[var(--accent)] hover:shadow-[0_14px_30px_-20px_rgba(193,80,46,0.55)]">
                <span className="inline-flex items-center gap-1.5 text-[0.64rem] tracking-[0.1em] uppercase text-[var(--accent)] mb-3">
                  <Lock size={12} /> Sign-in required
                </span>
                <h3 className={`${serif} text-[var(--heading)] text-[1.1rem]`}>{t.title}</h3>
                <p className="text-[0.88rem] text-[var(--muted2)] mt-1 mb-4">{t.body}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-[0.82rem] text-[var(--accent)] font-medium">
                  Open <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ---------------- YOUTUBE ---------------- */}
        <section id="videos" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[var(--line-ink)]`}>
          <div className="flex items-end justify-between gap-4 mb-7">
            <div>
              <span className={eyebrow}>Lectures</span>
              <h2 className={`${serif} text-[var(--heading)] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3`}>Latest from YouTube</h2>
              <p className="text-[0.9rem] text-[var(--muted)] mt-1">{videos.length > 0 ? `${videos.length} videos` : 'Loading videos…'}</p>
            </div>
            <button onClick={fetchVideos} disabled={videosLoading}
              className={`p-2.5 rounded-md border border-[var(--line3)] text-[var(--accent)] hover:bg-[var(--accent-10)] transition-colors ${videosLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Refresh videos">
              <RefreshCw className={videosLoading ? 'animate-spin' : ''} size={16} />
            </button>
          </div>

          {videosError && (
            <div className="text-center py-10 bg-[var(--surface)] border border-[var(--line)] rounded-md">
              <AlertCircle className="mx-auto text-[var(--accent)] mb-3" size={34} />
              <p className="text-[var(--muted2)] mb-4 px-4">{videosError}</p>
              <button onClick={fetchVideos} className="px-4 py-2 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-sm">Try Again</button>
            </div>
          )}

          {videosLoading && !videosError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-md overflow-hidden bg-[var(--surface)] border border-[var(--line2)] animate-pulse">
                  <div className="w-full h-40 bg-[var(--skeleton)]" />
                  <div className="p-3">
                    <div className="h-4 rounded bg-[var(--skeleton)] mb-2" />
                    <div className="h-3 rounded w-2/3 bg-[var(--skeleton)]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!videosLoading && !videosError && videos.length > 0 && (
            <div className="relative">
              {videos.length > slidesToShow && (
                <>
                  <button onClick={prevSlide}
                    className="absolute left-0 -ml-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[var(--surface)] border border-[var(--line3)] text-[var(--heading)] shadow hover:scale-110 transition-transform">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={nextSlide}
                    className="absolute right-0 -mr-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[var(--surface)] border border-[var(--line3)] text-[var(--heading)] shadow hover:scale-110 transition-transform">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out"
                     style={{ transform: `translateX(-${currentVideoIndex * (100 / slidesToShow)}%)` }}>
                  {videos.map((video) => (
                    <div key={video.id} className="flex-shrink-0 px-2" style={{ width: `${100 / slidesToShow}%` }}>
                      <div onClick={() => window.open(video.url, '_blank')}
                        className="cursor-pointer rounded-md overflow-hidden bg-[var(--surface)] border border-[var(--line)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_-22px_rgba(193,80,46,0.5)]">
                        <div className="relative">
                          <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover block" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-[var(--ink-30)] transition-opacity">
                            <Play className="text-[var(--bg)]" size={34} />
                          </div>
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 bg-[var(--line-ink)]5 text-[var(--bg)] text-xs px-2 py-0.5 rounded">{video.duration}</span>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm text-[var(--heading)] line-clamp-2 mb-2">{video.title}</h3>
                          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                            <span className="flex items-center gap-1"><Eye size={13} /> {formatViewCount(video.viewCount)} views</span>
                            <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(video.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ---------------- LINKEDIN POSTS ---------------- */}
        <section id="linkedin" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[var(--line-ink)]`}>
          <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
            <div>
              <span className={eyebrow}>From LinkedIn</span>
              <h2 className={`${serif} text-[var(--heading)] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3`}>Recent posts</h2>
              <p className="text-[0.9rem] text-[var(--muted)] mt-1">
                {LINKEDIN_POSTS.length > 0 ? `${LINKEDIN_POSTS.length} featured ${LINKEDIN_POSTS.length === 1 ? 'post' : 'posts'}` : 'Featured updates from LinkedIn'}
              </p>
            </div>
            <a href="https://www.linkedin.com/in/dr-r-k-singh-b4b4641b" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-[var(--line3)] text-[var(--accent)] text-[0.86rem] hover:bg-[var(--accent-10)] transition-colors">
              <Linkedin size={16} /> View profile
            </a>
          </div>

          {LINKEDIN_POSTS.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-md p-7 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <Linkedin className="text-[var(--accent)] shrink-0" size={38} strokeWidth={1.5} />
              <div className="flex-1">
                <h3 className={`${serif} text-[var(--heading)] text-[1.2rem]`}>Featured posts coming soon.</h3>
                <p className="text-[0.93rem] text-[var(--muted2)] mt-1">In the meantime, follow along on LinkedIn for updates on research, teaching, and AI in education.</p>
              </div>
              <a href="https://www.linkedin.com/in/dr-r-k-singh-b4b4641b" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-[0.88rem] hover:bg-[var(--accent-deep)] transition-colors shrink-0">
                Follow on LinkedIn <ArrowUpRight size={16} />
              </a>
            </div>
          ) : (
            <div className="relative">
              {LINKEDIN_POSTS.length > slidesToShow && (
                <>
                  <button onClick={prevPost}
                    className="absolute left-0 -ml-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[var(--surface)] border border-[var(--line3)] text-[var(--heading)] shadow hover:scale-110 transition-transform">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={nextPost}
                    className="absolute right-0 -mr-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[var(--surface)] border border-[var(--line3)] text-[var(--heading)] shadow hover:scale-110 transition-transform">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentPostIndex * (100 / slidesToShow)}%)` }}>
                  {LINKEDIN_POSTS.map((post, i) => (
                    <div key={i} className="flex-shrink-0 px-2" style={{ width: `${100 / slidesToShow}%` }}>
                      <div className="rounded-md overflow-hidden bg-[var(--surface)] border border-[var(--line)] p-2 transition-all hover:shadow-[0_16px_32px_-22px_rgba(193,80,46,0.5)]">
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
                          title={`LinkedIn post ${i + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {LINKEDIN_POSTS.length > slidesToShow && (
                <div className="flex justify-center mt-4 gap-2">
                  {Array.from({ length: Math.max(1, LINKEDIN_POSTS.length - slidesToShow + 1) }).map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentPostIndex(idx)}
                      className={`h-2 rounded-full transition-all ${currentPostIndex === idx ? 'w-5 bg-[var(--accent)]' : 'w-2 bg-[var(--line3)] hover:bg-[var(--accent)]/60'}`}
                      aria-label={`Go to slide ${idx + 1}`} />
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="text-[0.78rem] text-[var(--accent)] italic text-center mt-4">
            [ Add posts in the <code>LINKEDIN_POSTS</code> array — see the comment there for how to fetch the embed URL. ]
          </p>
        </section>

        {/* ---------------- REFERENCE MATERIALS / OER ---------------- */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 scroll-mt-24 py-20 border-b border-[var(--line-ink)]">
          <span className={eyebrow}>Open Educational Resources</span>
          <h2 className={`${serif} text-[var(--heading)] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-6`}>Reference Materials &amp; OER</h2>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-md p-6 flex flex-col sm:flex-row sm:items-center gap-5">
            <BookOpen className="text-[var(--accent)] shrink-0" size={34} strokeWidth={1.5} />
            <div className="flex-1">
              <h3 className={`${serif} text-[var(--heading)] text-[1.2rem]`}>Human Resource Management Materials</h3>
              <p className="text-[0.93rem] text-[var(--muted2)] mt-1">Open educational resources, readings, and research materials, freely available to learners.</p>
            </div>
            <a href="https://smrth.in/pN" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-[0.88rem] hover:bg-[var(--accent-deep)] transition-colors shrink-0">
              Open Resource <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

        {/* ---------------- CONTACT ---------------- */}
        <section id="contact" className="max-w-6xl mx-auto px-5 sm:px-8 scroll-mt-24 py-20">
          <span className={eyebrow}>Contact</span>
          <h2 className={`${serif} text-[var(--heading)] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-3`}>Get in touch.</h2>
          <p className="max-w-[60ch] text-[var(--muted2)] mb-8">I welcome correspondence from students, researchers, academic collaborators, and organizations interested in consulting or advisory work.</p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* form */}
            <div>
              {submitStatus === 'success' && (
                <div className="mb-4 px-4 py-3 rounded-md bg-[var(--ok-bg)] text-[var(--ok-fg)] text-sm">Message sent successfully — I&rsquo;ll get back to you soon.</div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-4 px-4 py-3 rounded-md bg-[var(--err-bg)] text-[var(--accent-deep)] text-sm">Could not send — please try again, or email me directly.</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="from_name" placeholder="Your Name" value={formData.from_name} onChange={handleInputChange} required
                  className="w-full rounded-md border border-[var(--line-input)] bg-[var(--surface)] px-4 py-3 text-[var(--heading)] placeholder-[var(--placeholder)] focus:outline-none focus:border-[var(--accent)]" />
                <input type="email" name="from_email" placeholder="Your Email" value={formData.from_email} onChange={handleInputChange} required
                  className="w-full rounded-md border border-[var(--line-input)] bg-[var(--surface)] px-4 py-3 text-[var(--heading)] placeholder-[var(--placeholder)] focus:outline-none focus:border-[var(--accent)]" />
                <textarea name="message" placeholder="Your Message" rows={4} value={formData.message} onChange={handleInputChange} required
                  className="w-full rounded-md border border-[var(--line-input)] bg-[var(--surface)] px-4 py-3 text-[var(--heading)] placeholder-[var(--placeholder)] focus:outline-none focus:border-[var(--accent)] resize-none" />
                <button type="submit" disabled={isSubmitting}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-sm text-[var(--bg)] text-[0.9rem] font-medium transition-colors ${isSubmitting ? 'bg-[var(--disabled)] cursor-not-allowed' : 'bg-[var(--accent)] hover:bg-[var(--accent-deep)]'}`}>
                  {isSubmitting ? 'Sending…' : <>Send Message <Send size={15} /></>}
                </button>
              </form>
            </div>

            {/* details */}
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="text-[var(--accent)] mt-1" size={18} />
                <div>
                  <div className="text-[0.7rem] tracking-[0.14em] uppercase text-[var(--accent)]">Email</div>
                  <a href="mailto:rksingh@commerce.du.ac.in" className="text-[var(--heading)] hover:text-[var(--accent)] transition-colors">rksingh@commerce.du.ac.in</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-[var(--accent)] mt-1" size={18} />
                <div>
                  <div className="text-[0.7rem] tracking-[0.14em] uppercase text-[var(--accent)]">Office</div>
                  <p className="text-[var(--body)]">Department of Commerce, Delhi School of Economics, University of Delhi, Delhi – 110007</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <a href="https://www.linkedin.com/in/dr-r-k-singh-b4b4641b" target="_blank" rel="noopener noreferrer"
                   className="text-[var(--heading)] hover:text-[var(--accent)] transition-colors" aria-label="LinkedIn"><Linkedin size={22} /></a>
                <a href="https://www.youtube.com/@rksinghdu" target="_blank" rel="noopener noreferrer"
                   className="text-[var(--heading)] hover:text-[var(--accent)] transition-colors" aria-label="YouTube"><Youtube size={24} /></a>
                <a href="https://smrth.in/pN" target="_blank" rel="noopener noreferrer"
                   className="text-[var(--heading)] hover:text-[var(--accent)] transition-colors" aria-label="More"><GraduationCap size={24} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-wrap gap-3 justify-between items-center text-[0.82rem]">
          <span><span className={`${serif} text-[var(--footer-name)]`}>Reetesh Kumar Singh</span> &middot; Department of Commerce, University of Delhi</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* palettes + keyframes */}
      <style>{`
        @keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .theme-light, .theme-dark{
          transition: background-color .35s ease, color .35s ease;
        }
        .theme-light *{ transition: background-color .35s ease, border-color .35s ease, color .35s ease; }
        .theme-dark *{ transition: background-color .35s ease, border-color .35s ease, color .35s ease; }

        /* ---------- WARM HERITAGE · LIGHT ---------- */
        .theme-light{
          --bg:#FBF5E9;
          --surface:#FFFBF2;
          --panel:#F1E8D6;
          --heading:#1F2247;
          --heading-hover:#2A2E5C;
          --ink:#2A2740;
          --body:#46425C;
          --muted2:#5A566E;
          --muted:#6E6A82;
          --placeholder:#9A93A8;
          --accent:#C1502E;
          --accent-deep:#A3401F;
          --gold:#B8862F;
          --skeleton:#EADfca;
          --disabled:#C9A99B;
          --ok-bg:#E6EFDF;  --ok-fg:#3D6B2E;
          --err-bg:#F3DAD2; --err-fg:#A3401F;
          --footer-bg:#1F2247; --footer-text:#D9D5E4; --footer-name:#E9C46A;
          --nav-bg:rgba(251,245,233,0.85);
          --line:rgba(193,80,46,0.20);
          --line2:rgba(193,80,46,0.15);
          --line3:rgba(193,80,46,0.25);
          --line-input:rgba(193,80,46,0.30);
          --accent-45:rgba(193,80,46,0.45);
          --accent-10:rgba(193,80,46,0.10);
          --line-ink:rgba(31,34,71,0.10);
          --ink-30:rgba(31,34,71,0.30);
          --overlay:rgba(31,34,71,0.30);
          --portrait-bg:#1F2247;
        }

        /* ---------- WARM HERITAGE · DARK (espresso & terracotta) ---------- */
        .theme-dark{
          --bg:#1A130D;
          --surface:#241A12;
          --panel:#2C2016;
          --heading:#F3E6CE;
          --heading-hover:#FFF3DC;
          --ink:#E4D6C1;
          --body:#CBBCA4;
          --muted2:#B3A488;
          --muted:#9A8C74;
          --placeholder:#8A7C66;
          --accent:#E07647;
          --accent-deep:#C1502E;
          --gold:#E9C46A;
          --skeleton:#2E2118;
          --disabled:#5E4636;
          --ok-bg:#22301E;  --ok-fg:#A9C99A;
          --err-bg:#3A211A; --err-fg:#E8A48C;
          --footer-bg:#120C08; --footer-text:#C9B89E; --footer-name:#E9C46A;
          --nav-bg:rgba(26,19,13,0.85);
          --line:rgba(224,118,71,0.26);
          --line2:rgba(224,118,71,0.18);
          --line3:rgba(224,118,71,0.32);
          --line-input:rgba(224,118,71,0.34);
          --accent-45:rgba(224,118,71,0.45);
          --accent-10:rgba(224,118,71,0.12);
          --line-ink:rgba(243,230,206,0.12);
          --ink-30:rgba(243,230,206,0.28);
          --overlay:rgba(10,7,4,0.55);
          --portrait-bg:#0E0A06;
        }
      `}</style>
    </div>
  );
}
