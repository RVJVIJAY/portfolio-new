import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/** Splits "2+" into "", 2, "+" so the prefix/suffix survive the animation. */
const PARTS = /^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/s;

/**
 * Counts a stat label up from zero once `active` turns true.
 *
 * Values that carry no number ("Present", "—") and users who asked for reduced
 * motion get the original string back untouched.
 */
export function useCountUp(value: string, active: boolean, duration = 1400) {
  const reduced = useReducedMotion();
  const match = PARTS.exec(value);
  const [display, setDisplay] = useState(value);
  const frame = useRef(0);

  useEffect(() => {
    if (!match || reduced || !active) {
      setDisplay(value);
      return;
    }

    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(',', '.'));
    const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Expo-out, so the number races ahead and then eases into place.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = (target * eased).toFixed(decimals);

      setDisplay(`${prefix}${current}${suffix}`);

      if (t < 1) frame.current = requestAnimationFrame(step);
    };

    setDisplay(`${prefix}${(0).toFixed(decimals)}${suffix}`);
    frame.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame.current);
    // `match` is derived from `value`; depending on it directly would restart
    // the animation on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, active, duration, reduced]);

  return display;
}
