import { ArrowUpRight } from 'lucide-react';
import { CONSULTING_CLIENTS } from '../../content/consulting';
import { SectionHeader } from '../common/SectionHeader';
import { sectionContainerBordered } from '../../styles/classNames';

export interface ConsultingProps {
  onNavigate: (id: string) => void;
}

export function Consulting({ onNavigate }: ConsultingProps) {
  return (
    <section id="consulting" className={sectionContainerBordered}>
      <SectionHeader
        eyebrowText="Consulting & Advisory"
        title="Bring this work to your institution."
        description="I have designed and delivered interventions for premier Indian organizations, government bodies, and academic institutions for over two decades — drawing on established management scholarship, Indian managerial traditions, and, increasingly, the responsible use of AI. Every engagement is grounded in the work I have actually done, not in borrowed frameworks."
      />
      <p className="mt-3 text-[0.9rem] text-[var(--muted)] italic">{CONSULTING_CLIENTS}</p>
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
