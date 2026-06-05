import { SectionHeader } from '../common/SectionHeader';
import { sectionContainerBordered, serif } from '../../styles/classNames';

const Diamond = () => <span className="text-[var(--accent)]">&#9670;</span>;

const SCHOLAR_URL = 'https://scholar.google.com/citations?user=iYM763EAAAAJ&hl=en';

export function About() {
  return (
    <section id="about" className={sectionContainerBordered}>
      <SectionHeader eyebrowText="About" title="A scholar of organizational effectiveness." />
      <p className="-mt-2 mb-8 text-[0.95rem] text-[var(--muted2)]">
        <a
          href={SCHOLAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          900+ citations &middot; h-index 14
        </a>{' '}
        <span className="text-[var(--muted)]">(Google Scholar)</span>
      </p>
      <div className="grid md:grid-cols-2 gap-10">
        <p className="text-[1.05rem] leading-relaxed text-[var(--body)]">
          <span className={`${serif} float-left text-[3.4rem] leading-[0.7] pr-2 pt-1 text-[var(--accent)]`}>I</span>
          am a Professor in the Department of Commerce at the Faculty of Commerce and Business, Delhi School of
          Economics, University of Delhi. For over three decades, I have served in various capacities as Head of
          the Department of Commerce and Dean of the Faculty of Commerce and Business, and as Deputy Dean
          (Academic Affairs and Projects) at the University of Delhi. My scholarly work examines what makes
          organizations effective through the lenses of human resource management, organizational behavior,
          workplace spirituality, culture, and responsible technology use.
        </p>
        <p className="text-[1.05rem] leading-relaxed text-[var(--body)]">
          My research has appeared in journals published by Emerald, Wiley, Springer, Routledge, and Taylor &amp;
          Francis. Beyond the classroom, I am a corporate trainer to Fortune 500 companies and an evaluator of
          academic and policy research. A steady thread runs through all of it — the conviction that rigorous
          scholarship and thoughtful teaching are not in tension. They reinforce each other.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-[var(--muted2)]">
        <span><Diamond /> Human Resource Management</span>
        <span><Diamond /> Organisational Behaviour</span>
        <span><Diamond /> Research Methodology</span>
        <span><Diamond /> AI in Education</span>
      </div>
    </section>
  );
}
