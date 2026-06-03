import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselArrowsProps {
  onPrev: () => void;
  onNext: () => void;
}

const arrowClass =
  'absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[var(--surface)] border border-[var(--line3)] text-[var(--heading)] shadow hover:scale-110 transition-transform';

export function CarouselArrows({ onPrev, onNext }: CarouselArrowsProps) {
  return (
    <>
      <button onClick={onPrev} className={`${arrowClass} left-0 -ml-3`} aria-label="Previous">
        <ChevronLeft size={18} />
      </button>
      <button onClick={onNext} className={`${arrowClass} right-0 -mr-3`} aria-label="Next">
        <ChevronRight size={18} />
      </button>
    </>
  );
}
