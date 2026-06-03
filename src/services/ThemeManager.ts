export type Theme = 'light' | 'dark';

export class ThemeManager {
  private readonly storageKey: string;

  constructor(storageKey = 'rk-theme') {
    this.storageKey = storageKey;
  }

  getInitial(): Theme {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(this.storageKey);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  save(theme: Theme): void {
    localStorage.setItem(this.storageKey, theme);
  }
}
