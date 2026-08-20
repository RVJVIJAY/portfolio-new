import { useCallback, useEffect, useMemo, useState } from 'react';
import { accentCssVars, deriveAccent, isHex, normalizeHex } from '../utils/color';

/** Must stay in step with the `$accents` map in src/styles/_accents.scss. */
export type PresetAccent = 'indigo' | 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose';

/** `custom` is driven by inline CSS variables instead of a generated block. */
export type Accent = PresetAccent | 'custom';

export const ACCENTS: ReadonlyArray<{ id: PresetAccent; label: string }> = [
  { id: 'indigo', label: 'Indigo' },
  { id: 'violet', label: 'Violet' },
  { id: 'cyan', label: 'Cyan' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'amber', label: 'Amber' },
  { id: 'rose', label: 'Rose' },
];

export const DEFAULT_ACCENT: PresetAccent = 'indigo';
export const DEFAULT_CUSTOM_HEX = '#4f46e5';

const ACCENT_KEY = 'portfolio-accent';
const CUSTOM_KEY = 'portfolio-accent-custom';

function isPreset(value: string | null): value is PresetAccent {
  return ACCENTS.some((accent) => accent.id === value);
}

/* Both readers mirror the bootstrap script in index.html. If you change one,
 * change both — a mismatch shows up as the accent flipping on first paint. */
function getInitialAccent(): Accent {
  if (typeof window === 'undefined') return DEFAULT_ACCENT;

  const stored = window.localStorage.getItem(ACCENT_KEY);
  if (stored === 'custom') return 'custom';
  return isPreset(stored) ? stored : DEFAULT_ACCENT;
}

/* The custom entry holds the picked hex *and* the eight derived variables. The
 * bootstrap script replays the cached variables verbatim, which is what keeps
 * the colour maths out of index.html and in one place. */
function getInitialCustomHex(): string {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM_HEX;

  const stored = window.localStorage.getItem(CUSTOM_KEY);
  if (!stored) return DEFAULT_CUSTOM_HEX;

  // A bare hex is still accepted, so an entry written by an older build loads.
  if (isHex(stored)) return normalizeHex(stored);

  try {
    const parsed: unknown = JSON.parse(stored);
    const hex = (parsed as { hex?: unknown })?.hex;
    if (typeof hex === 'string' && isHex(hex)) return normalizeHex(hex);
  } catch {
    /* Corrupt entry — fall through to the default. */
  }

  return DEFAULT_CUSTOM_HEX;
}

/**
 * Persisted accent, applied as `data-accent` on <html>.
 *
 * Presets resolve through generated CSS blocks. A custom colour instead writes
 * eight inline custom properties — a light set and a dark set — and lets the
 * same cascade in main.scss choose between them, so switching light/dark still
 * works without recomputing anything.
 */
export function useAccent() {
  const [accent, setAccentState] = useState<Accent>(getInitialAccent);
  const [customHex, setCustomHexState] = useState<string>(getInitialCustomHex);

  const derived = useMemo(() => deriveAccent(customHex), [customHex]);

  /* Paint immediately — this runs on every frame of a colour drag. */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.accent = accent;

    const vars = accentCssVars(derived);

    if (accent === 'custom') {
      for (const [name, value] of Object.entries(vars)) {
        root.style.setProperty(name, value);
      }
    } else {
      // Leaving the variables behind would keep a stale colour alive if the
      // visitor switched back to custom without picking again.
      for (const name of Object.keys(vars)) {
        root.style.removeProperty(name);
      }
    }
  }, [accent, derived]);

  /* Persist separately and debounced: the native colour input streams a change
   * per pointer move, and a synchronous storage write on each one is the one
   * part of this that would actually stutter. */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(ACCENT_KEY, accent);

      if (accent === 'custom') {
        window.localStorage.setItem(
          CUSTOM_KEY,
          JSON.stringify({ hex: derived.hex, vars: accentCssVars(derived) }),
        );
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [accent, derived]);

  const setAccent = useCallback((next: Accent) => setAccentState(next), []);

  /** Picking a colour selects the custom accent in the same gesture. */
  const setCustomHex = useCallback((hex: string) => {
    if (!isHex(hex)) return;
    setCustomHexState(normalizeHex(hex));
    setAccentState('custom');
  }, []);

  return { accent, customHex, derived, setAccent, setCustomHex };
}
