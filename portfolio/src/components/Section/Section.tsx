import type { ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { Icon, type IconName } from '../Icon/Icon';
import styles from './Section.module.scss';

interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  icon?: IconName;
  lead?: string;
  /** Alternate background, used to separate neighbouring sections. */
  alt?: boolean;
  children: ReactNode;
}

/** Shared section shell: heading block, reveal-on-scroll, consistent rhythm. */
export function Section({ id, eyebrow, title, icon, lead, alt, children }: SectionProps) {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={[
        styles.section,
        alt ? styles.alt : '',
        'reveal',
        isVisible ? 'reveal--visible' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={`${id}-title`}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          {eyebrow ? (
            <p className={styles.eyebrow}>
              {icon ? <Icon name={icon} /> : null}
              <span>{eyebrow}</span>
            </p>
          ) : null}
          <h2 className={styles.title} id={`${id}-title`}>
            {title}
          </h2>
          {lead ? <p className={styles.lead}>{lead}</p> : null}
        </header>

        {children}
      </div>
    </section>
  );
}
