import { SectionHeader } from '../common/SectionHeader';
import { sectionContainerBordered, serif } from '../../styles/classNames';

const Diamond = () => <span className="text-[var(--accent)]">&#9670;</span>;

export function About() {
  return (
    <section id="about" className={sectionContainerBordered}>
      <SectionHeader eyebrowText="About" title="A scholar of organizations." />
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
        <span><Diamond /> Human Resource Management</span>
        <span><Diamond /> Organisational Behaviour</span>
        <span><Diamond /> Research Methodology</span>
        <span><Diamond /> AI in Education</span>
      </div>
    </section>
  );
}
