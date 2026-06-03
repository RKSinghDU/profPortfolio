import { ArrowUpRight, Lock } from 'lucide-react';
import { PORTAL_TOOLS } from '../../content/portalTools';
import { SectionHeader } from '../common/SectionHeader';
import { card, sectionContainerBordered, serif } from '../../styles/classNames';

export function StudentPortal() {
  return (
    <section id="portal" className={sectionContainerBordered}>
      <SectionHeader eyebrowText="Student Portal" title="For my students." />
      <div className="max-w-[62ch] bg-[var(--panel)] border-l-4 border-[var(--accent)] rounded-r-md px-5 py-4 text-[0.95rem] text-[var(--body)] mt-4">
        <strong className="text-[var(--heading)]">Sign in with your University of Delhi account.</strong> Access is
        restricted to the current class roster — please use your institutional email, not a personal one. Each tool
        opens in a new tab.
      </div>
      <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PORTAL_TOOLS.map(t => (
          <a
            key={t.title}
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex flex-col ${card} p-5 transition-all hover:border-[var(--accent)] hover:shadow-[0_14px_30px_-20px_rgba(193,80,46,0.55)]`}
          >
            <span className="inline-flex items-center gap-1.5 text-[0.64rem] tracking-[0.1em] uppercase text-[var(--accent)] mb-3">
              <Lock size={12} /> Sign-in required
            </span>
            <h3 className={`${serif} text-[var(--heading)] text-[1.1rem]`}>{t.title}</h3>
            <p className="text-[0.88rem] text-[var(--muted2)] mt-1 mb-4">{t.body}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-[0.82rem] text-[var(--accent)] font-medium">
              Open
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
