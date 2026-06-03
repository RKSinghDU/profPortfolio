export interface CarouselDotsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function CarouselDots({ count, activeIndex, onSelect }: CarouselDotsProps) {
  if (count <= 1) return null;
  return (
    <div className="flex justify-center mt-4 gap-2">
      {Array.from({ length: count }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          aria-label={`Go to slide ${idx + 1}`}
          className={`h-2 rounded-full transition-all ${
            activeIndex === idx ? 'w-5 bg-[var(--accent)]' : 'w-2 bg-[var(--line3)] hover:bg-[var(--accent)]/60'
          }`}
        />
      ))}
    </div>
  );
}
