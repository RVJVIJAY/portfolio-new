import { useEffect, useRef, useState } from 'react';

/**
 * How far the viewport has travelled through one element, 0 → 1.
 *
 * Drives scroll-linked fills — the accent segment that draws itself down the
 * experience timeline as you read it.
 */
export function useElementProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      // Anchor on a point 55% down the viewport: the fill tracks roughly where
      // the reader's eye sits rather than the very top of the screen.
      const anchor = window.innerHeight * 0.55;
      const travelled = anchor - rect.top;

      setProgress(Math.min(Math.max(travelled / rect.height, 0), 1));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { ref, progress };
}
