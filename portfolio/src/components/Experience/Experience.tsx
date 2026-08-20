import type { CSSProperties } from 'react';
import { Section } from '../Section/Section';
import { Reveal } from '../Reveal/Reveal';
import { useElementProgress } from '../../hooks/useElementProgress';
import { usePointerGlow } from '../../hooks/usePointerGlow';
import type { ExperienceItem } from '../../data/types';
import styles from './Experience.module.scss';

interface ExperienceProps {
  items: ExperienceItem[];
}

export function Experience({ items }: ExperienceProps) {
  /* The accent segment of the rail draws itself downward as the reader moves
   * through the list — the timeline literally fills in as you read it. */
  const { ref: timelineRef, progress } = useElementProgress<HTMLOListElement>();
  const glowRef = usePointerGlow<HTMLDivElement>();

  return (
    <Section
      id="experience"
      index="03"
      eyebrow="Experience"
      icon="briefcase"
      title="Where I have worked"
      lead="Roles, responsibilities and the results that came out of them."
      alt
    >
      <div ref={glowRef}>
        <ol
          className={styles.timeline}
          ref={timelineRef}
          style={{ '--fill': progress } as CSSProperties}
        >
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={`${item.company}-${item.start}`}
              index={index}
              className={styles.item}
            >
              <span className={styles.marker} aria-hidden="true" />

              <article className={styles.card} data-glow>
                <header className={styles.head}>
                  <div className={styles.identity}>
                    <p className={styles.company}>{item.company}</p>
                    <h3 className={styles.role}>{item.role}</h3>
                    {item.location ? (
                      <p className={styles.location}>{item.location}</p>
                    ) : null}
                  </div>

                  <p className={styles.period}>
                    <span className={styles.dates}>
                      {item.start} — {item.end}
                    </span>
                    {item.type ? <span className={styles.type}>{item.type}</span> : null}
                  </p>
                </header>

                {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}

                {item.highlights.length > 0 ? (
                  <ul className={styles.highlights}>
                    {item.highlights.map((highlight, highlightIndex) => (
                      <li key={highlight} style={{ '--i': highlightIndex } as CSSProperties}>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {item.stack && item.stack.length > 0 ? (
                  <ul className={styles.stack}>
                    {item.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
