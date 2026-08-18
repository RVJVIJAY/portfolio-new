import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Destination: '#section', 'https://…', 'mailto:…', 'tel:…' or a file path. */
  to: string;
  children: ReactNode;
}

const EXTERNAL = /^(https?:)?\/\//i;

/**
 * The single link component used across the site.
 *
 * It renders a real anchor — the only element browsers, screen readers and
 * "open in new tab" understand — while centralising the details that are easy
 * to get wrong link by link:
 *
 * - external URLs open in a new tab with `rel="noreferrer noopener"`;
 * - `mailto:`, `tel:`, in-page `#hash` links and downloads stay in the tab;
 * - anything passed explicitly (target, rel, download, aria-*) wins.
 */
export function Link({ to, children, target, rel, ...rest }: LinkProps) {
  const isExternal = EXTERNAL.test(to);

  const resolvedTarget = target ?? (isExternal ? '_blank' : undefined);
  const resolvedRel =
    rel ?? (resolvedTarget === '_blank' ? 'noreferrer noopener' : undefined);

  return (
    <a href={to} target={resolvedTarget} rel={resolvedRel} {...rest}>
      {children}
    </a>
  );
}
