import { GraduationCap, Linkedin, Youtube } from 'lucide-react';
import { SITE } from '../../content/siteConfig';
import { eyebrow, serif } from '../../styles/classNames';

export interface HeroProps {
  onNavigate: (id: string) => void;
}

const Diamond = () => <span className="text-[var(--accent)]">&#9670;</span>;

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="home" className="scroll-mt-24 relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(193,80,46,0.12), transparent 65%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-20 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, var(--accent-10), transparent 65%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-14 grid md:grid-cols-[1.3fr_0.9fr] gap-10 md:gap-12 items-center">
        <div className="animate-[rise_0.7s_ease-out]">
          <span className={eyebrow}>Professor of Commerce &middot; {SITE.affiliation}</span>
          <h1 className={`${serif} text-[var(--heading)] mt-4 leading-[1.05] text-[clamp(2.6rem,6.5vw,4.6rem)]`}>
            Reetesh Kumar<br />Singh
          </h1>
          <p className="mt-4 text-[var(--muted2)] text-[clamp(1rem,2vw,1.2rem)] italic">
            Human Resource Management <Diamond /> Organisational Behaviour <Diamond /> Research Methodology
          </p>
          <p className="mt-5 max-w-[52ch] text-[1.08rem] text-[var(--body)] leading-relaxed">
            A teacher and researcher of organizations at the University of Delhi — and a builder of
            simulations and AI-assisted tools that bring rigour and accessibility to the way we teach and assess.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('research')}
              className="px-5 py-2.5 rounded-sm bg-[var(--accent)] text-[var(--bg)] text-[0.88rem] tracking-wide hover:bg-[var(--accent-deep)] transition-colors"
            >
              Explore my research
            </button>
            <button
              onClick={() => onNavigate('consulting')}
              className="px-5 py-2.5 rounded-sm border border-[var(--accent)] text-[var(--accent)] text-[0.88rem] tracking-wide hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors"
            >
              Consulting &amp; advisory
            </button>
            <button
              onClick={() => onNavigate('portal')}
              className="px-5 py-2.5 rounded-sm border border-[var(--ink-30)] text-[var(--heading)] text-[0.88rem] tracking-wide hover:border-[var(--heading)] transition-colors"
            >
              Student Portal
            </button>
          </div>

          <div className="mt-7 flex items-center gap-4">
            <span className="text-[0.66rem] tracking-[0.2em] uppercase text-[var(--muted)]">Connect</span>
            <span className="w-8 h-px bg-[var(--line3)]" aria-hidden="true" />
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--heading)] hover:text-[var(--accent)] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--heading)] hover:text-[var(--accent)] transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={22} />
            </a>
            <a
              href={SITE.social.resources}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--heading)] hover:text-[var(--accent)] transition-colors"
              aria-label="Samarth / Resources"
            >
              <GraduationCap size={22} />
            </a>
          </div>
        </div>

        <div className="relative mx-auto md:mx-0 w-60 sm:w-72 animate-[rise_0.9s_ease-out]">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-md border border-[var(--accent-45)]" />
          <div className="relative rounded-md overflow-hidden border border-[var(--accent)] bg-[var(--portrait-bg)]">
            <img src="/photo.png" alt="Prof. Reetesh Kumar Singh" className="w-full aspect-square object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
