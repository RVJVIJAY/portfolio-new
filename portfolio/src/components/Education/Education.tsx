import type { ReactNode } from 'react';
import { Section } from '../Section/Section';
import { Reveal } from '../Reveal/Reveal';
import { Icon, type IconName } from '../Icon/Icon';
import { usePointerGlow } from '../../hooks/usePointerGlow';
import type { Achievement, Certification, EducationItem } from '../../data/types';
import styles from './Education.module.scss';
import { Link } from '../Link/Link';

interface EducationProps {
  items: EducationItem[];
  certifications: Certification[];
  achievements: Achievement[];
}

/** One column of the three; each card fades up behind the one before it. */
function Column({
  title,
  icon,
  count,
  children,
}: {
  title: string;
  icon: IconName;
  count: number;
  children: ReactNode;
}) {
  return (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>
        <Icon name={icon} size="1rem" />
        <span>{title}</span>
        <span className={styles.columnCount} aria-hidden="true">
          {String(count).padStart(2, '0')}
        </span>
      </h3>
      <ul className={styles.list}>{children}</ul>
    </div>
  );
}

export function Education({ items, certifications, achievements }: EducationProps) {
  const gridRef = usePointerGlow<HTMLDivElement>();

  return (
    <Section
      id="education"
      index="05"
      eyebrow="Education"
      icon="graduation"
      title="Education & highlights"
      alt
    >
      <div className={styles.grid} ref={gridRef}>
        <Column title="Education" icon="graduation" count={items.length}>
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={`${item.institution}-${item.end}`}
              index={index}
              className={styles.card}
              data-glow
            >
              <p className={styles.period}>
                {item.start} — {item.end}
              </p>
              <h4 className={styles.heading}>
                {item.degree}
                {item.field ? `, ${item.field}` : ''}
              </h4>
              <p className={styles.meta}>
                {item.institution}
                {item.location ? <span className={styles.sep}>·</span> : null}
                {item.location}
              </p>
              {item.details ? <p className={styles.details}>{item.details}</p> : null}
            </Reveal>
          ))}
        </Column>

        {certifications.length > 0 ? (
          <Column title="Certifications" icon="award" count={certifications.length}>
            {certifications.map((cert, index) => (
              <Reveal
                as="li"
                key={cert.name}
                index={index}
                className={styles.card}
                data-glow
              >
                <p className={styles.period}>{cert.year}</p>
                <h4 className={styles.heading}>
                  {cert.url ? (
                    <Link to={cert.url}>
                      <span>{cert.name}</span>
                      <Icon name="arrowUpRight" size="0.9rem" />
                    </Link>
                  ) : (
                    cert.name
                  )}
                </h4>
                <p className={styles.meta}>{cert.issuer}</p>
              </Reveal>
            ))}
          </Column>
        ) : null}

        {achievements.length > 0 ? (
          <Column title="Achievements & activities" icon="check" count={achievements.length}>
            {achievements.map((achievement, index) => (
              <Reveal
                as="li"
                key={achievement.title}
                index={index}
                className={styles.card}
                data-glow
              >
                <p className={styles.period}>{achievement.year}</p>
                <h4 className={styles.heading}>{achievement.title}</h4>
                {achievement.detail ? (
                  <p className={styles.meta}>{achievement.detail}</p>
                ) : null}
              </Reveal>
            ))}
          </Column>
        ) : null}
      </div>
    </Section>
  );
}
