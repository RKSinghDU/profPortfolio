import { ExternalLink } from 'lucide-react';
import { EDITORIAL_BOARDS, JOURNAL_ARTICLES, type Publication } from '../../content/publications';
import { SectionHeader } from '../common/SectionHeader';
import { sectionContainerBordered } from '../../styles/classNames';

export function Research() {
  return (
    <section id="research" className={sectionContainerBordered}>
      <SectionHeader
        eyebrowText="Publications & Research"
        title="Publications & Research"
        description="Peer-reviewed articles, and a substantial body of evaluative and editorial work."
      />

      <div className="mt-8 grid md:grid-cols-2 gap-10">
        <ResearchColumn label="Journal Articles">
          <ol className="space-y-5 text-[0.95rem] text-[var(--body)] list-decimal list-inside marker:text-[var(--accent)]">
            {JOURNAL_ARTICLES.map((article, idx) => (
              <ArticleItem key={`${article.title}-${idx}`} article={article} />
            ))}
          </ol>
        </ResearchColumn>

        <ResearchColumn label="Editorial / Reviewer Boards">
          <ul className="space-y-2.5 text-[0.95rem] text-[var(--body)]">
            {EDITORIAL_BOARDS.map(board => (
              <li key={board.journal} className="leading-snug">
                <span>{board.journal}</span>
                <span className="text-[var(--muted)]"> — {board.publisher}</span>
              </li>
            ))}
          </ul>
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
      {children}
    </div>
  );
}

function ArticleItem({ article }: { article: Publication }) {
  return (
    <li className="leading-snug">
      <span>{article.title}.</span>{' '}
      <span className="italic text-[var(--muted2)]">{article.venue}</span>
      <span className="text-[var(--muted2)]">, {article.year}.</span>
      {article.doi && (
        <>
          {' '}
          <a
            href={article.doi}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
          >
            DOI <ExternalLink size={12} />
          </a>
        </>
      )}
    </li>
  );
}
