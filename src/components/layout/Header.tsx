import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { NAV } from '../../content/nav';
import { SITE } from '../../content/siteConfig';
import { serif } from '../../styles/classNames';

export interface HeaderProps {
  activeId: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (id: string) => void;
}

export function Header({ activeId, isDark, onToggleTheme, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (id: string) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--nav-bg)] border-b border-[var(--line)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center gap-4">
        <button onClick={() => handleNavigate('home')} className="flex items-center gap-3 shrink-0">
          <span
            className={`${serif} w-10 h-10 grid place-items-center rounded-full border border-[var(--accent)] text-[var(--accent)] text-sm`}
          >
            {SITE.initials}
          </span>
          <span className="text-left leading-none">
            <span className={`${serif} block text-[var(--heading)] text-[1.05rem]`}>{SITE.shortName}</span>
            <span className="block text-[0.6rem] tracking-[0.16em] uppercase text-[var(--muted)]">
              {SITE.affiliation}
            </span>
          </span>
        </button>

        <nav className="ml-auto hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => handleNavigate(n.id)}
              className={`px-3 py-2 text-[0.82rem] tracking-wide transition-colors border-b-2 ${
                activeId === n.id
                  ? 'text-[var(--accent)] border-[var(--accent)]'
                  : 'text-[var(--muted2)] border-transparent hover:text-[var(--heading)]'
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="hidden md:grid place-items-center w-9 h-9 ml-1 rounded-full border border-[var(--line3)] text-[var(--accent)] hover:bg-[var(--accent-10)] transition-colors"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="ml-auto md:hidden grid place-items-center w-9 h-9 rounded-full text-[var(--accent)]"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          className="md:hidden text-[var(--heading)] p-2"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--line2)] bg-[var(--bg)]">
          <div className="max-w-6xl mx-auto px-5 py-2 flex flex-col">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => handleNavigate(n.id)}
                className={`text-left py-2.5 text-[0.95rem] border-b border-[var(--line-ink)] ${
                  activeId === n.id ? 'text-[var(--accent)]' : 'text-[var(--ink)]'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
