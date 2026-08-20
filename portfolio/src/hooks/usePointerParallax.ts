import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Publishes the pointer's position inside an element as `--mx` / `--my`,
 * each normalised to -1 → 1 from the centre.
 *
 * Layers downstream multiply those by however far they should drift, which
 * keeps the parallax purely declarative in CSS.
 */
export function usePointerParallax<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const apply = () => {
      frame = 0;
      node.style.setProperty('--mx', nextX.toFixed(3));
      node.style.setProperty('--my', nextY.toFixed(3));
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      nextX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      nextY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onPointerLeave = () => {
      nextX = 0;
      nextY = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    node.addEventListener('pointermove', onPointerMove, { passive: true });
    node.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [reduced]);

  return ref;
}
