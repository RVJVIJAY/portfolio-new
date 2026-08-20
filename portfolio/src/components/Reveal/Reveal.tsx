import { createElement } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { useReveal } from '../../hooks/useReveal';

export type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'mask' | 'line' | 'fade';

type RevealTag =
  | 'div'
  | 'span'
  | 'p'
  | 'li'
  | 'ul'
  | 'ol'
  | 'article'
  | 'section'
  | 'aside'
  | 'header'
  | 'footer'
  | 'figure';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Defaults to a div; use `li`, `article`… to stay semantic. */
  as?: RevealTag;
  /** Direction the element travels from. `line` grows a hairline horizontally. */
  variant?: RevealVariant;
  /** Position in a group — multiplies the stagger step so siblings cascade. */
  index?: number;
  /** How much of the element must be on screen before it settles. */
  threshold?: number;
  children?: ReactNode;
}

/**
 * Wraps one element in a scroll-triggered entrance.
 *
 * The visual states live in main.scss (`.reveal*`); this only decides *when*
 * they flip, so a single IntersectionObserver per element is all the work the
 * animation costs. Anything inside a list gets `index` and cascades.
 */
export function Reveal({
  as = 'div',
  variant = 'up',
  index = 0,
  threshold,
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLElement>(
    threshold === undefined ? {} : { threshold },
  );

  const classes = [
    'reveal',
    `reveal--${variant}`,
    isVisible ? 'reveal--visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  /* Every tag in RevealTag is an HTMLElement, so one cast here keeps the call
   * site free of per-tag generics. */
  return createElement(
    as as 'div',
    {
      ...rest,
      ref: ref as Ref<HTMLDivElement>,
      className: classes,
      style: { ...style, '--i': index } as CSSProperties,
    },
    children,
  );
}
