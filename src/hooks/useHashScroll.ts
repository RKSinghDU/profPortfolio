import { useEffect } from 'react';

/**
 * Scrolls to the element named in location.hash once React has rendered it.
 *
 * The site is client-rendered: index.html ships an empty <div id="root">, so when
 * the browser parses the document and tries to honour a hash such as #portal, the
 * target element does not exist yet. The browser gives up and the visitor lands on
 * the hero instead. Anyone arriving cold from an email link hits this every time.
 *
 * This retries on each animation frame until the element appears, then scrolls.
 * scrollIntoView({ block: 'start' }) honours the target's CSS scroll-margin-top,
 * so per-section offsets stay declarative in the markup.
 *
 * A second pass runs shortly afterwards because late-arriving images, web fonts
 * and async sections (Videos, LinkedIn) can shift layout after the first scroll.
 */
export function useHashScroll(timeoutMs = 4000, settleDelayMs = 400): void {
  useEffect(() => {
    const raw = window.location.hash;
    if (raw.length < 2) return;

    let id: string;
    try {
      id = decodeURIComponent(raw.slice(1));
    } catch {
      id = raw.slice(1);
    }
    if (!id) return;

    let cancelled = false;
    let settleTimer = 0;
    const deadline = Date.now() + timeoutMs;

    const scrollTo = (el: Element) => el.scrollIntoView({ block: 'start', behavior: 'auto' });

    const attempt = () => {
      if (cancelled) return;

      const el = document.getElementById(id);
      if (el) {
        scrollTo(el);
        settleTimer = window.setTimeout(() => {
          if (cancelled) return;
          const again = document.getElementById(id);
          if (again) scrollTo(again);
        }, settleDelayMs);
        return;
      }

      if (Date.now() < deadline) window.requestAnimationFrame(attempt);
    };

    window.requestAnimationFrame(attempt);

    return () => {
      cancelled = true;
      window.clearTimeout(settleTimer);
    };
  }, [timeoutMs, settleDelayMs]);
}
