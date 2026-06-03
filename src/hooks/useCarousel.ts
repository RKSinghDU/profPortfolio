import { useState } from 'react';

export interface UseCarouselResult {
  index: number;
  maxIndex: number;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  canPaginate: boolean;
}

export function useCarousel(itemCount: number, slidesToShow: number): UseCarouselResult {
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, itemCount - slidesToShow);

  return {
    index,
    maxIndex,
    canPaginate: itemCount > slidesToShow,
    next: () => setIndex(i => (i >= maxIndex ? 0 : i + 1)),
    prev: () => setIndex(i => (i <= 0 ? maxIndex : i - 1)),
    goTo: (i: number) => setIndex(Math.max(0, Math.min(i, maxIndex))),
  };
}
