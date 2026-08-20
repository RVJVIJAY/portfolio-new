import { useEffect, useRef, useState } from 'react';

export interface RevealOptions {
  /** Fraction of the element that must be on screen before it fires. */
  threshold?: number;
  /** Shrinks the trigger area so elements settle before they hit the fold. */
  rootMargin?: string;
  /** When false the element re-hides after it scrolls back out of view. */
  once?: boolean;
}

/**
 * Fires the first time an element scrolls into view.
 *
 * Degrades to "always visible" when IntersectionObserver is unavailable, so a
 * failed observer can never leave the page blank.
 *
 * Accepts a bare threshold number for the original call style: useReveal(0.2).
 */
export function useReveal<T extends HTMLElement>(options: RevealOptions | number = {}) {
  const settings = typeof options === 'number' ? { threshold: options } : options;
  const { threshold = 0.12, rootMargin = '0px 0px -8% 0px', once = true } = settings;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
