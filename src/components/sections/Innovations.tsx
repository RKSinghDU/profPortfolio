import { INNOVATIONS } from '../../content/innovations';
import { SectionHeader } from '../common/SectionHeader';
import { card, cardHoverLift, sectionContainerBordered, serif } from '../../styles/classNames';

export function Innovations() {
  return (
    <section id="innovations" className={sectionContainerBordered}>
      <SectionHeader
        eyebrowText="Selected Work"
        title="Innovations in teaching."
        description="Tools I have designed for teaching and assessment. Access to the working tools is reserved for my students through the Student Portal."
      />
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {INNOVATIONS.map(({ icon: Icon, tag, title, body }) => (
          <article key={title} className={`group ${card} p-6 ${cardHoverLift}`}>
            <Icon className="text-[var(--accent)] mb-4" size={26} strokeWidth={1.5} />
            <div className="text-[0.66rem] tracking-[0.14em] uppercase text-[var(--accent)] mb-1">{tag}</div>
            <h3 className={`${serif} text-[var(--heading)] text-[1.2rem] mb-2`}>{title}</h3>
            <p className="text-[0.93rem] text-[var(--muted2)] leading-relaxed">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
