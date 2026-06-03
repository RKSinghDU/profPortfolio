import { ArrowUpRight } from 'lucide-react';
import { CONSULTING } from '../../content/consulting';
import { SectionHeader } from '../common/SectionHeader';
import { card, cardHoverLift, sectionContainerBordered, serif } from '../../styles/classNames';

export interface ConsultingProps {
  onNavigate: (id: string) => void;
}

export function Consulting({ onNavigate }: ConsultingProps) {
  return (
    <section id="consulting" className={sectionContainerBordered}>
      <SectionHeader
        eyebrowText="Consulting & Advisory"
        title="Bring this work to your institution."
        description="I work with educational institutions, corporates, and teams — bridging established management scholarship with hands-on implementation and the responsible use of AI."
      />
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CONSULTING.map(c => (
          <article
            key={c.title}
            className={`${card} p-6 border-l-2 border-l-[var(--accent)] ${cardHoverLift}`}
          >
            <h3 className={`${serif} text-[var(--heading)] text-[1.15rem] mb-2`}>{c.title}</h3>
            <p className="text-[0.93rem] text-[var(--muted2)] leading-relaxed">{c.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-8">
        <button
          onClick={() => onNavigate('contact')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[var(--heading)] text-[var(--bg)] text-[0.88rem] hover:bg-[var(--heading-hover)] transition-colors"
        >
          Discuss an engagement <ArrowUpRight size={16} />
        </button>
      </div>
    </section>
  );
}
