import { Section } from '../Section/Section';
import type { ExperienceItem } from '../../data/types';
import styles from './Experience.module.scss';

interface ExperienceProps {
  items: ExperienceItem[];
}

export function Experience({ items }: ExperienceProps) {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      icon="briefcase"
      title="Where I have worked"
      lead="Roles, responsibilities and the results that came out of them."
      alt
    >
      <ol className={styles.timeline}>
        {items.map((item) => (
          <li className={styles.item} key={`${item.company}-${item.start}`}>
            <span className={styles.marker} aria-hidden="true" />

            <article className={styles.card}>
              <header className={styles.head}>
                <div>
                  <h3 className={styles.role}>{item.role}</h3>
                  <p className={styles.company}>
                    {item.company}
                    {item.location ? <span className={styles.sep}>·</span> : null}
                    {item.location}
                  </p>
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
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
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
          </li>
        ))}
      </ol>
    </Section>
  );
}
