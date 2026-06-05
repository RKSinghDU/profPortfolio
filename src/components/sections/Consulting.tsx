import { CONSULTING_CLIENTS } from '../../content/consulting';
import { SectionHeader } from '../common/SectionHeader';
import { sectionContainerBordered } from '../../styles/classNames';

export function Consulting() {
  return (
    <section id="consulting" className={sectionContainerBordered}>
      <SectionHeader
        eyebrowText="Consulting & Advisory"
        title="Bring this work to your institution."
        description="I have designed and delivered interventions for premier Indian organizations, government bodies, and academic institutions for over two decades — drawing on established management scholarship, Indian managerial traditions, and, increasingly, the responsible use of AI. Every engagement is grounded in the work I have actually done, not in borrowed frameworks."
      />
      <p className="mt-3 text-[0.9rem] text-[var(--muted)] italic">{CONSULTING_CLIENTS}</p>
    </section>
  );
}
