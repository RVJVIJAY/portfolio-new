import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface RotatingOptions {
  /** Milliseconds between typed characters. */
  typeMs?: number;
  /** Milliseconds between deleted characters — deleting reads faster. */
  deleteMs?: number;
  /** How long a completed word sits before it is erased. */
  holdMs?: number;
}

/**
 * Types a list of words out one character at a time, erases, moves on.
 *
 * Reduced-motion visitors get the first word, printed once and left alone.
 */
export function useRotatingText(words: string[], options: RotatingOptions = {}) {
  const { typeMs = 65, deleteMs = 32, holdMs = 1700 } = options;
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced || words.length === 0) return;

    const word = words[index % words.length];
    const complete = text === word;

    // Word finished: hold it on screen, then start erasing.
    if (!deleting && complete) {
      const timer = window.setTimeout(() => setDeleting(true), holdMs);
      return () => window.clearTimeout(timer);
    }

    // Word erased: advance to the next one.
    if (deleting && text === '') {
      setDeleting(false);
      setIndex((current) => (current + 1) % words.length);
      return;
    }

    const timer = window.setTimeout(
      () => setText(word.slice(0, text.length + (deleting ? -1 : 1))),
      deleting ? deleteMs : typeMs,
    );

    return () => window.clearTimeout(timer);
  }, [words, index, text, deleting, typeMs, deleteMs, holdMs, reduced]);

  if (reduced) {
    return { text: words[0] ?? '', done: true };
  }

  return { text, done: false };
}
