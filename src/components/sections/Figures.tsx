import { FIGURES } from '../../content/figures';
import { serif } from '../../styles/classNames';

export function Figures() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 border border-[var(--line)] rounded-md overflow-hidden bg-[var(--surface)]">
        {FIGURES.map((f, i) => (
          <div
            key={f.label}
            className={`p-6 text-center border-[var(--line2)] ${i < 3 ? 'md:border-r' : ''} ${
              i % 2 === 0 ? 'border-r' : ''
            } ${i < 2 ? 'border-b md:border-b-0' : ''}`}
          >
            <div className={`${serif} text-[var(--accent)] text-3xl`}>
              <span className="text-[var(--ink-30)]">{f.value}</span>
            </div>
            <div className="mt-2 text-[0.72rem] tracking-[0.12em] uppercase text-[var(--muted)]">{f.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
