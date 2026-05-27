import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Linkedin, Youtube, GraduationCap, ChevronLeft, ChevronRight, Play, Eye,
  Calendar, RefreshCw, AlertCircle, Lock, ArrowUpRight, BookOpen, Mail,
  MapPin, Send, Menu, X, Layers, ClipboardCheck, FileText, CalendarDays, Sparkles,
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
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ProfessorPortfolio() {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

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
  const eyebrow = `${serif} text-[0.72rem] tracking-[0.22em] uppercase text-[#C1502E]`;
  const sectionPad = 'scroll-mt-24 py-20';

  return (
    <div className="min-h-screen bg-[#FBF5E9] text-[#2A2740] selection:bg-[#C1502E] selection:text-[#FBF5E9]"
         style={{ fontFamily: '"Mukta", system-ui, sans-serif' }}>

      {/* ---------------- NAV ---------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FBF5E9]/85 border-b border-[#C1502E]/20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center gap-4">
          <button onClick={() => goTo('home')} className="flex items-center gap-3 shrink-0">
            <span className={`${serif} w-10 h-10 grid place-items-center rounded-full border border-[#C1502E] text-[#C1502E] text-sm`}>RKS</span>
            <span className="text-left leading-none">
              <span className={`${serif} block text-[#1F2247] text-[1.05rem]`}>R. K. Singh</span>
              <span className="block text-[0.6rem] tracking-[0.16em] uppercase text-[#6E6A82]">University of Delhi</span>
            </span>
          </button>

          {/* desktop links */}
          <nav className="ml-auto hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => goTo(n.id)}
                className={`px-3 py-2 text-[0.82rem] tracking-wide transition-colors border-b-2 ${
                  active === n.id ? 'text-[#C1502E] border-[#C1502E]' : 'text-[#5A566E] border-transparent hover:text-[#1F2247]'
                }`}>
                {n.label}
              </button>
            ))}
          </nav>

          {/* mobile toggle */}
          <button className="ml-auto md:hidden text-[#1F2247] p-2" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#C1502E]/15 bg-[#FBF5E9]">
            <div className="max-w-6xl mx-auto px-5 py-2 flex flex-col">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => goTo(n.id)}
                  className={`text-left py-2.5 text-[0.95rem] border-b border-[#1F2247]/10 ${
                    active === n.id ? 'text-[#C1502E]' : 'text-[#3A3654]'
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
               style={{ background: 'radial-gradient(circle, rgba(31,34,71,0.08), transparent 65%)' }} />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-14 grid md:grid-cols-[1.3fr_0.9fr] gap-10 md:gap-12 items-center">
            <div className="animate-[rise_0.7s_ease-out]">
              <span className={eyebrow}>Professor of Commerce &middot; University of Delhi</span>
              <h1 className={`${serif} text-[#1F2247] mt-4 leading-[1.05] text-[clamp(2.6rem,6.5vw,4.6rem)]`}>
                Reetesh Kumar<br />Singh
              </h1>
              <p className="mt-4 text-[#5A566E] text-[clamp(1rem,2vw,1.2rem)] italic">
                Human Resource Management <span className="text-[#C1502E]">&#9670;</span> Organisational Behaviour <span className="text-[#C1502E]">&#9670;</span> Research Methodology
              </p>
              <p className="mt-5 max-w-[52ch] text-[1.08rem] text-[#46425C] leading-relaxed">
                A teacher and researcher of organizations at the University of Delhi — and a builder of
                simulations and AI-assisted tools that bring rigour and accessibility to the way we teach and assess.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => goTo('research')}
                  className="px-5 py-2.5 rounded-sm bg-[#C1502E] text-[#FBF5E9] text-[0.88rem] tracking-wide hover:bg-[#A3401F] transition-colors">
                  Explore my research
                </button>
                <button onClick={() => goTo('consulting')}
                  className="px-5 py-2.5 rounded-sm border border-[#C1502E] text-[#C1502E] text-[0.88rem] tracking-wide hover:bg-[#C1502E] hover:text-[#FBF5E9] transition-colors">
                  Consulting &amp; advisory
                </button>
                <button onClick={() => goTo('portal')}
                  className="px-5 py-2.5 rounded-sm border border-[#1F2247]/30 text-[#1F2247] text-[0.88rem] tracking-wide hover:border-[#1F2247] transition-colors">
                  Student Portal
                </button>
              </div>
            </div>

            {/* portrait */}
            <div className="relative mx-auto md:mx-0 w-60 sm:w-72 animate-[rise_0.9s_ease-out]">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-md border border-[#C1502E]/45" />
              <div className="relative rounded-md overflow-hidden border border-[#C1502E] bg-[#1F2247]">
                <img src="/photo.png" alt="Prof. Reetesh Kumar Singh" className="w-full aspect-square object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- FIGURES ---------------- */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 border border-[#C1502E]/20 rounded-md overflow-hidden bg-[#FFFBF2]">
            {FIGURES.map((f, i) => (
              <div key={f.t}
                className={`p-6 text-center border-[#C1502E]/15 ${i < 3 ? 'md:border-r' : ''} ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''}`}>
                <div className={`${serif} text-[#C1502E] text-3xl`}><span className="text-[#1F2247]/30">{f.n}</span></div>
                <div className="mt-2 text-[0.72rem] tracking-[0.12em] uppercase text-[#6E6A82]">{f.t}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-[0.78rem] text-[#C1502E] italic mt-2">[ figures are placeholders — edit in the FIGURES array ]</p>
        </div>

        {/* ---------------- ABOUT ---------------- */}
        <section id="about" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[#1F2247]/10`}>
          <div className="flex items-baseline gap-4 flex-wrap mb-8">
            <span className={eyebrow}>About</span>
            <h2 className={`${serif} text-[#1F2247] text-[clamp(1.8rem,4.4vw,2.6rem)]`}>A scholar of organizations.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <p className="text-[1.05rem] leading-relaxed text-[#46425C]">
              <span className={`${serif} float-left text-[3.4rem] leading-[0.7] pr-2 pt-1 text-[#C1502E]`}>I</span>
              am a Professor in the Department of Commerce at the Faculty of Commerce and Business, Delhi School of
              Economics, University of Delhi. My work sits at the meeting point of human resource management,
              organisational behaviour, and research methodology — taught across postgraduate and doctoral programmes.
            </p>
            <p className="text-[1.05rem] leading-relaxed text-[#46425C]">
              Beyond the classroom I examine doctoral theses, evaluate academic and policy research, and contribute to
              scholarly publishing. A steady thread runs through all of it: the belief that well-designed tools should
              free teachers to teach, and give students clearer, fairer, more engaging learning — without surrendering
              the human judgment at the heart of education.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-[#5A566E]">
            <span><span className="text-[#C1502E]">&#9670;</span> Human Resource Management</span>
            <span><span className="text-[#C1502E]">&#9670;</span> Organisational Behaviour</span>
            <span><span className="text-[#C1502E]">&#9670;</span> Research Methodology</span>
            <span><span className="text-[#C1502E]">&#9670;</span> AI in Education</span>
          </div>
        </section>

        {/* ---------------- RESEARCH ---------------- */}
        <section id="research" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[#1F2247]/10`}>
          <span className={eyebrow}>Publications &amp; Research</span>
          <h2 className={`${serif} text-[#1F2247] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-3`}>Publications &amp; Research</h2>
          <p className="max-w-[64ch] text-[#5A566E]">Peer-reviewed articles, books and chapters, and a substantial body of evaluative and editorial work. A complete list appears in my CV.</p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-[0.72rem] tracking-[0.18em] uppercase text-[#C1502E] mb-3">Journal Articles</div>
              <ul className="space-y-3 text-[0.95rem] text-[#46425C]">
                <li className="text-[#C1502E] italic">[ Author(s). (Year). &ldquo;Title.&rdquo; Journal, Vol(Issue), pages. ]</li>
                <li className="text-[#C1502E] italic">[ Author(s). (Year). &ldquo;Title.&rdquo; Journal, Vol(Issue), pages. ]</li>
              </ul>
            </div>
            <div>
              <div className="text-[0.72rem] tracking-[0.18em] uppercase text-[#C1502E] mb-3">Books &amp; Chapters</div>
              <ul className="space-y-3 text-[0.95rem] text-[#46425C]">
                <li className="text-[#C1502E] italic">[ Author(s). (Year). Title. Publisher. ]</li>
              </ul>
            </div>
            <div>
              <div className="text-[0.72rem] tracking-[0.18em] uppercase text-[#C1502E] mb-3">Editorial &amp; Evaluative</div>
              <ul className="space-y-3 text-[0.95rem] text-[#46425C]">
                <li>Manuscript review for scholarly journals.</li>
                <li>Examiner of doctoral theses across Indian universities.</li>
                <li>Evaluator of academic &amp; policy research.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------- INNOVATIONS ---------------- */}
        <section id="innovations" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[#1F2247]/10`}>
          <span className={eyebrow}>Selected Work</span>
          <h2 className={`${serif} text-[#1F2247] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-3`}>Innovations in teaching.</h2>
          <p className="max-w-[64ch] text-[#5A566E]">Tools I have designed for teaching and assessment. Access to the working tools is reserved for my students through the Student Portal.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INNOVATIONS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="group bg-[#FFFBF2] border border-[#C1502E]/20 rounded-md p-6 transition-all hover:-translate-y-1 hover:shadow-[0_18px_36px_-22px_rgba(193,80,46,0.5)]">
                  <Icon className="text-[#C1502E] mb-4" size={26} strokeWidth={1.5} />
                  <div className="text-[0.66rem] tracking-[0.14em] uppercase text-[#C1502E] mb-1">{c.tag}</div>
                  <h3 className={`${serif} text-[#1F2247] text-[1.2rem] mb-2`}>{c.title}</h3>
                  <p className="text-[0.93rem] text-[#5A566E] leading-relaxed">{c.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------------- CONSULTING ---------------- */}
        <section id="consulting" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[#1F2247]/10`}>
          <span className={eyebrow}>Consulting &amp; Advisory</span>
          <h2 className={`${serif} text-[#1F2247] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-3`}>Bring this work to your institution.</h2>
          <p className="max-w-[64ch] text-[#5A566E]">I work with educational institutions, corporates, and teams — bridging established management scholarship with hands-on implementation and the responsible use of AI.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONSULTING.map((c) => (
              <div key={c.title} className="bg-[#FFFBF2] border border-[#C1502E]/20 rounded-md p-6 border-l-2 border-l-[#C1502E] transition-all hover:-translate-y-1 hover:shadow-[0_18px_36px_-22px_rgba(193,80,46,0.5)]">
                <h3 className={`${serif} text-[#1F2247] text-[1.15rem] mb-2`}>{c.title}</h3>
                <p className="text-[0.93rem] text-[#5A566E] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button onClick={() => goTo('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#1F2247] text-[#FBF5E9] text-[0.88rem] hover:bg-[#2A2E5C] transition-colors">
              Discuss an engagement <ArrowUpRight size={16} />
            </button>
          </div>
        </section>

        {/* ---------------- TEACHING ---------------- */}
        <section id="teaching" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[#1F2247]/10`}>
          <span className={eyebrow}>Teaching</span>
          <h2 className={`${serif} text-[#1F2247] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-3`}>Courses</h2>
          <p className="max-w-[64ch] text-[#5A566E]">Across postgraduate and doctoral programmes in the Department of Commerce. Course materials for enrolled students live in the Student Portal.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES.map((c) => (
              <div key={c.code} className="bg-[#FFFBF2] border border-[#C1502E]/20 rounded-md p-6">
                <div className="text-[0.66rem] tracking-[0.14em] uppercase text-[#C1502E] mb-1">{c.code}</div>
                <h3 className={`${serif} text-[#1F2247] text-[1.15rem] mb-2`}>{c.title}</h3>
                <p className="text-[0.93rem] text-[#5A566E] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- STUDENT PORTAL ---------------- */}
        <section id="portal" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[#1F2247]/10`}>
          <span className={eyebrow}>Student Portal</span>
          <h2 className={`${serif} text-[#1F2247] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-4`}>For my students.</h2>
          <div className="max-w-[62ch] bg-[#F1E8D6] border-l-4 border-[#C1502E] rounded-r-md px-5 py-4 text-[0.95rem] text-[#46425C]">
            <strong className="text-[#1F2247]">Sign in with your University of Delhi account.</strong> Access is restricted to the current class roster — please use your institutional email, not a personal one. Each tool opens in a new tab.
          </div>
          <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PORTAL_TOOLS.map((t) => (
              <a key={t.title} href={t.url} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col bg-[#FFFBF2] border border-[#C1502E]/20 rounded-md p-5 transition-all hover:border-[#C1502E] hover:shadow-[0_14px_30px_-20px_rgba(193,80,46,0.55)]">
                <span className="inline-flex items-center gap-1.5 text-[0.64rem] tracking-[0.1em] uppercase text-[#C1502E] mb-3">
                  <Lock size={12} /> Sign-in required
                </span>
                <h3 className={`${serif} text-[#1F2247] text-[1.1rem]`}>{t.title}</h3>
                <p className="text-[0.88rem] text-[#5A566E] mt-1 mb-4">{t.body}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-[0.82rem] text-[#C1502E] font-medium">
                  Open <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ---------------- YOUTUBE ---------------- */}
        <section id="videos" className={`max-w-6xl mx-auto px-5 sm:px-8 ${sectionPad} border-b border-[#1F2247]/10`}>
          <div className="flex items-end justify-between gap-4 mb-7">
            <div>
              <span className={eyebrow}>Lectures</span>
              <h2 className={`${serif} text-[#1F2247] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3`}>Latest from YouTube</h2>
              <p className="text-[0.9rem] text-[#6E6A82] mt-1">{videos.length > 0 ? `${videos.length} videos` : 'Loading videos…'}</p>
            </div>
            <button onClick={fetchVideos} disabled={videosLoading}
              className={`p-2.5 rounded-md border border-[#C1502E]/25 text-[#C1502E] hover:bg-[#C1502E]/10 transition-colors ${videosLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Refresh videos">
              <RefreshCw className={videosLoading ? 'animate-spin' : ''} size={16} />
            </button>
          </div>

          {videosError && (
            <div className="text-center py-10 bg-[#FFFBF2] border border-[#C1502E]/20 rounded-md">
              <AlertCircle className="mx-auto text-[#C1502E] mb-3" size={34} />
              <p className="text-[#5A566E] mb-4 px-4">{videosError}</p>
              <button onClick={fetchVideos} className="px-4 py-2 rounded-sm bg-[#C1502E] text-[#FBF5E9] text-sm">Try Again</button>
            </div>
          )}

          {videosLoading && !videosError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-md overflow-hidden bg-[#FFFBF2] border border-[#C1502E]/15 animate-pulse">
                  <div className="w-full h-40 bg-[#EADfca]" />
                  <div className="p-3">
                    <div className="h-4 rounded bg-[#EADfca] mb-2" />
                    <div className="h-3 rounded w-2/3 bg-[#EADfca]" />
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
                    className="absolute left-0 -ml-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[#FFFBF2] border border-[#C1502E]/25 text-[#1F2247] shadow hover:scale-110 transition-transform">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={nextSlide}
                    className="absolute right-0 -mr-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[#FFFBF2] border border-[#C1502E]/25 text-[#1F2247] shadow hover:scale-110 transition-transform">
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
                        className="cursor-pointer rounded-md overflow-hidden bg-[#FFFBF2] border border-[#C1502E]/20 transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_-22px_rgba(193,80,46,0.5)]">
                        <div className="relative">
                          <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover block" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-[#1F2247]/30 transition-opacity">
                            <Play className="text-[#FBF5E9]" size={34} />
                          </div>
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 bg-[#1F2247]/105 text-[#FBF5E9] text-xs px-2 py-0.5 rounded">{video.duration}</span>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm text-[#1F2247] line-clamp-2 mb-2">{video.title}</h3>
                          <div className="flex items-center justify-between text-xs text-[#6E6A82]">
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

        {/* ---------------- REFERENCE MATERIALS / OER ---------------- */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 scroll-mt-24 py-20 border-b border-[#1F2247]/10">
          <span className={eyebrow}>Open Educational Resources</span>
          <h2 className={`${serif} text-[#1F2247] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-6`}>Reference Materials &amp; OER</h2>
          <div className="bg-[#FFFBF2] border border-[#C1502E]/20 rounded-md p-6 flex flex-col sm:flex-row sm:items-center gap-5">
            <BookOpen className="text-[#C1502E] shrink-0" size={34} strokeWidth={1.5} />
            <div className="flex-1">
              <h3 className={`${serif} text-[#1F2247] text-[1.2rem]`}>Human Resource Management Materials</h3>
              <p className="text-[0.93rem] text-[#5A566E] mt-1">Open educational resources, readings, and research materials, freely available to learners.</p>
            </div>
            <a href="https://smrth.in/pN" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#C1502E] text-[#FBF5E9] text-[0.88rem] hover:bg-[#A3401F] transition-colors shrink-0">
              Open Resource <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

        {/* ---------------- CONTACT ---------------- */}
        <section id="contact" className="max-w-6xl mx-auto px-5 sm:px-8 scroll-mt-24 py-20">
          <span className={eyebrow}>Contact</span>
          <h2 className={`${serif} text-[#1F2247] text-[clamp(1.8rem,4.4vw,2.6rem)] mt-3 mb-3`}>Get in touch.</h2>
          <p className="max-w-[60ch] text-[#5A566E] mb-8">I welcome correspondence from students, researchers, academic collaborators, and organizations interested in consulting or advisory work.</p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* form */}
            <div>
              {submitStatus === 'success' && (
                <div className="mb-4 px-4 py-3 rounded-md bg-[#E6EFDF] text-[#3D6B2E] text-sm">Message sent successfully — I&rsquo;ll get back to you soon.</div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-4 px-4 py-3 rounded-md bg-[#F3DAD2] text-[#A3401F] text-sm">Could not send — please try again, or email me directly.</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="from_name" placeholder="Your Name" value={formData.from_name} onChange={handleInputChange} required
                  className="w-full rounded-md border border-[#C1502E]/30 bg-[#FFFBF2] px-4 py-3 text-[#1F2247] placeholder-[#9A93A8] focus:outline-none focus:border-[#C1502E]" />
                <input type="email" name="from_email" placeholder="Your Email" value={formData.from_email} onChange={handleInputChange} required
                  className="w-full rounded-md border border-[#C1502E]/30 bg-[#FFFBF2] px-4 py-3 text-[#1F2247] placeholder-[#9A93A8] focus:outline-none focus:border-[#C1502E]" />
                <textarea name="message" placeholder="Your Message" rows={4} value={formData.message} onChange={handleInputChange} required
                  className="w-full rounded-md border border-[#C1502E]/30 bg-[#FFFBF2] px-4 py-3 text-[#1F2247] placeholder-[#9A93A8] focus:outline-none focus:border-[#C1502E] resize-none" />
                <button type="submit" disabled={isSubmitting}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-sm text-[#FBF5E9] text-[0.9rem] font-medium transition-colors ${isSubmitting ? 'bg-[#C9A99B] cursor-not-allowed' : 'bg-[#C1502E] hover:bg-[#A3401F]'}`}>
                  {isSubmitting ? 'Sending…' : <>Send Message <Send size={15} /></>}
                </button>
              </form>
            </div>

            {/* details */}
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="text-[#C1502E] mt-1" size={18} />
                <div>
                  <div className="text-[0.7rem] tracking-[0.14em] uppercase text-[#C1502E]">Email</div>
                  <a href="mailto:rksingh@commerce.du.ac.in" className="text-[#1F2247] hover:text-[#C1502E] transition-colors">rksingh@commerce.du.ac.in</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-[#C1502E] mt-1" size={18} />
                <div>
                  <div className="text-[0.7rem] tracking-[0.14em] uppercase text-[#C1502E]">Office</div>
                  <p className="text-[#46425C]">Department of Commerce, Delhi School of Economics, University of Delhi, Delhi – 110007</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <a href="https://www.linkedin.com/in/dr-r-k-singh-b4b4641b" target="_blank" rel="noopener noreferrer"
                   className="text-[#1F2247] hover:text-[#C1502E] transition-colors" aria-label="LinkedIn"><Linkedin size={22} /></a>
                <a href="https://www.youtube.com/@rksinghdu" target="_blank" rel="noopener noreferrer"
                   className="text-[#1F2247] hover:text-[#C1502E] transition-colors" aria-label="YouTube"><Youtube size={24} /></a>
                <a href="https://smrth.in/pN" target="_blank" rel="noopener noreferrer"
                   className="text-[#1F2247] hover:text-[#C1502E] transition-colors" aria-label="More"><GraduationCap size={24} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-[#1F2247] text-[#D9D5E4]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-wrap gap-3 justify-between items-center text-[0.82rem]">
          <span><span className={`${serif} text-[#E9C46A]`}>Reetesh Kumar Singh</span> &middot; Department of Commerce, University of Delhi</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* keyframes */}
      <style>{`@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
