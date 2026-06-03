import { COURSES } from '../../content/courses';
import { SectionHeader } from '../common/SectionHeader';
import { card, sectionContainerBordered, serif } from '../../styles/classNames';

export function Teaching() {
  return (
    <section id="teaching" className={sectionContainerBordered}>
      <SectionHeader
        eyebrowText="Teaching"
        title="Courses"
        description="Across postgraduate and doctoral programmes in the Department of Commerce. Course materials for enrolled students live in the Student Portal."
      />
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COURSES.map(c => (
          <article key={c.code} className={`${card} p-6`}>
            <div className="text-[0.66rem] tracking-[0.14em] uppercase text-[var(--accent)] mb-1">{c.code}</div>
            <h3 className={`${serif} text-[var(--heading)] text-[1.15rem] mb-2`}>{c.title}</h3>
            <p className="text-[0.93rem] text-[var(--muted2)] leading-relaxed">{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
