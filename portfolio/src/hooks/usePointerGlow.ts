import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Makes every `[data-glow]` descendant track the pointer.
 *
 * One listener on the container writes `--px` / `--py` onto whichever card the
 * cursor is over, and the card's ::before paints a soft accent glow there. A
 * listener per card would be dozens of listeners for the same effect.
 */
export function usePointerGlow<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    // Coarse pointers have no hover state — the glow would only ever fire on tap.
    if (window.matchMedia('(hover: none)').matches) return;

    const onPointerMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>('[data-glow]');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      card.style.setProperty('--px', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--py', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    };

    node.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => node.removeEventListener('pointermove', onPointerMove);
  }, [reduced]);

  return ref;
}
