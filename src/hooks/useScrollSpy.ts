import { useEffect, useState } from 'react';

export interface UseScrollSpyOptions {
  rootMargin?: string;
  initial?: string;
}

export function useScrollSpy(sectionIds: string[], options: UseScrollSpyOptions = {}): string {
  const [active, setActive] = useState<string>(options.initial ?? sectionIds[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: options.rootMargin ?? '-45% 0px -50% 0px' },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sectionIds.join('|'), options.rootMargin]);

  return active;
}
