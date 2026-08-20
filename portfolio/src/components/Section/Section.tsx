import type { ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { Icon, type IconName } from '../Icon/Icon';
import styles from './Section.module.scss';

interface SectionProps {
  id: string;
  /** Running order, printed as an oversized mono index: 01, 02, 03… */
  index?: string;
  eyebrow?: string;
  title: string;
  icon?: IconName;
  lead?: string;
  /** Alternate background, used to separate neighbouring sections. */
  alt?: boolean;
  children: ReactNode;
}

/**
 * Shared section shell: numbered heading block, a hairline that draws itself
 * across the page, and the reveal that cascades into the section's contents.
 */
export function Section({
  id,
  index,
  eyebrow,
  title,
  icon,
  lead,
  alt,
  children,
}: SectionProps) {
  const { ref, isVisible } = useReveal<HTMLElement>({ threshold: 0.05 });

  return (
    <section
      id={id}
      ref={ref}
      className={[styles.section, alt ? styles.alt : '', isVisible ? styles.visible : '']
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={`${id}-title`}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <div className={styles.tag}>
            {index ? (
              <span className={styles.index} aria-hidden="true">
                {index}
              </span>
            ) : null}
            {eyebrow ? (
              <p className={styles.eyebrow}>
                {icon ? <Icon name={icon} size="0.85rem" /> : null}
                <span>{eyebrow}</span>
              </p>
            ) : null}
          </div>

          <span className={styles.rule} aria-hidden="true" />

          <h2 className={styles.title} id={`${id}-title`}>
            {/* Masked so the heading wipes up from the rule above it. */}
            <span className={styles.titleLine}>
              <span>{title}</span>
            </span>
          </h2>

          {lead ? <p className={styles.lead}>{lead}</p> : null}
        </header>

        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
