/* ---------------------------------------------------------------------------
 * Colour maths for the custom accent.
 *
 * A preset accent ships hand-tuned light and dark values. A colour the visitor
 * picks has neither, so this module derives them: it keeps the hue and
 * saturation they chose and moves only the lightness, far enough that the
 * result clears 4.5:1 against whichever canvas it lands on. A colour that is
 * already readable comes back untouched.
 * ------------------------------------------------------------------------- */

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

/** The two canvases an accent has to survive, from main.scss. */
const LIGHT_BG = '#f7f8fc';
const DARK_BG = '#0b1120';
const WHITE = '#ffffff';
const INK = '#0b1120';

const MIN_CONTRAST = 4.5;

/** Lightness search resolution. 0.005 over the 0–1 range = 200 steps. */
const L_STEP = 0.005;
const L_MAX_STEPS = 200;

const HEX = /^#([\da-f]{3}|[\da-f]{6})$/i;

export function isHex(value: string): boolean {
  return HEX.test(value.trim());
}

/** Expands `#abc` to `#aabbcc`. `<input type="color">` rejects the short form,
 *  so anything heading for that control has to come through here. */
export function normalizeHex(value: string): string {
  const body = value.trim().replace('#', '');

  if (body.length === 3) {
    return `#${body
      .split('')
      .map((char) => char + char)
      .join('')}`.toLowerCase();
  }

  return `#${body}`.toLowerCase();
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function hexToRgb(hex: string): Rgb {
  let body = hex.trim().replace('#', '');

  if (body.length === 3) {
    body = body
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const int = Number.parseInt(body, 16);

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const part = (value: number) =>
    Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0');

  return `#${part(r)}${part(g)}${part(b)}`;
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const l = (max + min) / 2;

  if (delta === 0) return { h: 0, s: 0, l };

  const s = delta / (1 - Math.abs(2 * l - 1));

  let h: number;
  if (max === rn) h = ((gn - bn) / delta) % 6;
  else if (max === gn) h = (bn - rn) / delta + 2;
  else h = (rn - gn) / delta + 4;

  h *= 60;
  if (h < 0) h += 360;

  return { h, s, l };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rgb: [number, number, number];

  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];

  return {
    r: (rgb[0] + m) * 255,
    g: (rgb[1] + m) * 255,
    b: (rgb[2] + m) * 255,
  };
}

/** WCAG relative luminance. */
function luminance({ r, g, b }: Rgb): number {
  const channel = (value: number) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio, 1 → 21. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);

  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Snap to 8-bit before measuring: the hex the browser paints is rounded, and
 *  an unrounded reading lands results just under the threshold. */
function quantize({ r, g, b }: Rgb): Rgb {
  return {
    r: Math.round(clamp(r, 0, 255)),
    g: Math.round(clamp(g, 0, 255)),
    b: Math.round(clamp(b, 0, 255)),
  };
}

/**
 * An accent has two jobs, and has to pass both: it is set as text on the page
 * background, and it is a fill that button text sits on top of.
 */
function isUsable(rgb: Rgb, background: Rgb): boolean {
  if (contrastRatio(rgb, background) < MIN_CONTRAST) return false;

  const carriesText = Math.max(
    contrastRatio(rgb, hexToRgb(WHITE)),
    contrastRatio(rgb, hexToRgb(INK)),
  );

  return carriesText >= MIN_CONTRAST;
}

/**
 * Walks lightness one direction until the colour is usable on `background`,
 * keeping hue and saturation fixed. A colour that already passes is returned
 * untouched, so most picks come back exactly as chosen.
 *
 * Both requirements move the same way as lightness, so a single direction
 * always converges when a solution exists.
 */
function fitToBackground(hsl: Hsl, background: Rgb, direction: 1 | -1): Hsl {
  let l = clamp(hsl.l, 0, 1);

  for (let i = 0; i <= L_MAX_STEPS; i += 1) {
    if (isUsable(quantize(hslToRgb({ ...hsl, l })), background)) break;

    const next = l + direction * L_STEP;
    // Only the end we are travelling toward can stop the walk. Checking both
    // ends would abort on the first step whenever the start sits near one.
    if (next < 0 || next > 1) break;

    l = next;
  }

  return { ...hsl, l: clamp(l, 0, 1) };
}

/**
 * Whichever of white / ink reads better across *both* the accent and its hover
 * shade — the two share one `--c-on-accent`, so the weaker pairing decides.
 */
function readableOn(base: Rgb, strong: Rgb): string {
  const score = (candidate: string) =>
    Math.min(
      contrastRatio(base, hexToRgb(candidate)),
      contrastRatio(strong, hexToRgb(candidate)),
    );

  return score(WHITE) >= score(INK) ? WHITE : INK;
}

function shiftLightness(hsl: Hsl, delta: number): Hsl {
  return { ...hsl, l: clamp(hsl.l + delta, 0.03, 0.97) };
}

function rgbaString(rgb: Rgb, alpha: number): string {
  const round = (value: number) => Math.round(clamp(value, 0, 255));
  return `rgba(${round(rgb.r)}, ${round(rgb.g)}, ${round(rgb.b)}, ${alpha})`;
}

export interface AccentTokens {
  base: string;
  strong: string;
  soft: string;
  on: string;
}

export interface AccentDerivation {
  /** The hex the visitor actually picked, unmodified. */
  hex: string;
  light: AccentTokens;
  dark: AccentTokens;
}

/**
 * Turns one picked colour into the eight values the theme needs.
 *
 * Light mode darkens toward readability, dark mode lightens — so a single pick
 * yields a pair that works on both canvases, the same way the hand-tuned preset
 * palettes do.
 */
export function deriveAccent(hex: string): AccentDerivation {
  const safeHex = isHex(hex) ? hex : '#4f46e5';
  const hsl = rgbToHsl(hexToRgb(safeHex));

  // Light mode darkens toward readability, dark mode lightens.
  const lightHsl = fitToBackground(hsl, hexToRgb(LIGHT_BG), -1);
  const darkHsl = fitToBackground(hsl, hexToRgb(DARK_BG), 1);

  // Hover moves further from the canvas: darker on light, lighter on dark.
  const lightStrongHsl = shiftLightness(lightHsl, -0.08);
  const darkStrongHsl = shiftLightness(darkHsl, 0.1);

  const lightBase = quantize(hslToRgb(lightHsl));
  const lightStrong = quantize(hslToRgb(lightStrongHsl));
  const darkBase = quantize(hslToRgb(darkHsl));
  const darkStrong = quantize(hslToRgb(darkStrongHsl));

  return {
    hex: safeHex,
    light: {
      base: rgbToHex(lightBase),
      strong: rgbToHex(lightStrong),
      soft: rgbaString(lightBase, 0.1),
      on: readableOn(lightBase, lightStrong),
    },
    dark: {
      base: rgbToHex(darkBase),
      strong: rgbToHex(darkStrong),
      soft: rgbaString(darkBase, 0.14),
      on: readableOn(darkBase, darkStrong),
    },
  };
}

/** CSS custom properties the page reads for a custom accent. Order matters
 *  only for readability; the names are shared with the index.html bootstrap. */
export function accentCssVars(derived: AccentDerivation): Record<string, string> {
  return {
    '--accent-light': derived.light.base,
    '--accent-light-strong': derived.light.strong,
    '--accent-light-soft': derived.light.soft,
    '--accent-light-on': derived.light.on,
    '--accent-dark': derived.dark.base,
    '--accent-dark-strong': derived.dark.strong,
    '--accent-dark-soft': derived.dark.soft,
    '--accent-dark-on': derived.dark.on,
  };
}
