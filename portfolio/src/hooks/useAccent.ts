import { useCallback, useEffect, useState } from 'react';

/** Must stay in step with the `$accents` map in src/styles/_accents.scss. */
export type Accent = 'indigo' | 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose';

export const ACCENTS: ReadonlyArray<{ id: Accent; label: string }> = [
  { id: 'indigo', label: 'Indigo' },
  { id: 'violet', label: 'Violet' },
  { id: 'cyan', label: 'Cyan' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'amber', label: 'Amber' },
  { id: 'rose', label: 'Rose' },
];

export const DEFAULT_ACCENT: Accent = 'indigo';

const STORAGE_KEY = 'portfolio-accent';

function isAccent(value: string | null): value is Accent {
  return ACCENTS.some((accent) => accent.id === value);
}

/* Mirrors the bootstrap script in index.html. If you change one, change both —
 * a mismatch shows up as the accent flipping colour on the first paint. */
function getInitialAccent(): Accent {
  if (typeof window === 'undefined') return DEFAULT_ACCENT;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isAccent(stored) ? stored : DEFAULT_ACCENT;
}

/**
 * Persisted accent colour, applied as `data-accent` on <html>.
 *
 * Independent of light/dark: the visitor picks a hue here and a mode there, and
 * every combination has hand-tuned values in `_accents.scss`.
 */
export function useAccent() {
  const [accent, setAccentState] = useState<Accent>(getInitialAccent);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    window.localStorage.setItem(STORAGE_KEY, accent);
  }, [accent]);

  const setAccent = useCallback((next: Accent) => setAccentState(next), []);

  return { accent, setAccent };
}
