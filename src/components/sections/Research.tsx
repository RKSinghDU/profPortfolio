import { SectionHeader } from '../common/SectionHeader';
import { sectionContainerBordered } from '../../styles/classNames';

export function Research() {
  return (
    <section id="research" className={sectionContainerBordered}>
      <SectionHeader
        eyebrowText="Publications & Research"
        title="Publications & Research"
        description="Peer-reviewed articles, books and chapters, and a substantial body of evaluative and editorial work. A complete list appears in my CV."
      />

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <ResearchColumn label="Journal Articles">
          <li className="text-[var(--accent)] italic">
            <p>Simple Arora, Priya Chaudhary, Corresponding Author: Reetesh K. Singh. (2026). 
              <br/> &ldquo;Adoption of HR analytics for future-proof decision making: role of attitude toward artificial intelligence as a moderator&rdquo; 
              <br/>International Journal of Organizational Analysis, Vol 33(Issue 9)
            </p>
          </li>
          <li className="text-[var(--accent)] italic">
            [ Author(s). (Year). &ldquo;Title.&rdquo; Journal, Vol(Issue), pages. ]
          </li>
        </ResearchColumn>
        <ResearchColumn label="Books & Chapters">
          <li className="text-[var(--accent)] italic">[ Author(s). (Year). Title. Publisher. ]</li>
        </ResearchColumn>
        <ResearchColumn label="Editorial & Evaluative">
          <li>Manuscript review for scholarly journals.</li>
          <li>Examiner of doctoral theses across Indian universities.</li>
          <li>Evaluator of academic &amp; policy research.</li>
        </ResearchColumn>
      </div>
    </section>
  );
}

interface ResearchColumnProps {
  label: string;
  children: React.ReactNode;
}

function ResearchColumn({ label, children }: ResearchColumnProps) {
  return (
    <div>
      <div className="text-[0.72rem] tracking-[0.18em] uppercase text-[var(--accent)] mb-3">{label}</div>
      <ul className="space-y-3 text-[0.95rem] text-[var(--body)]">{children}</ul>
    </div>
  );
}
