import { Section } from '../Section/Section';
import { Icon } from '../Icon/Icon';
import type { Achievement, Certification, EducationItem } from '../../data/types';
import styles from './Education.module.scss';
import { Link } from '../Link/Link';

interface EducationProps {
  items: EducationItem[];
  certifications: Certification[];
  achievements: Achievement[];
}

export function Education({ items, certifications, achievements }: EducationProps) {
  return (
    <Section
      id="education"
      eyebrow="Education"
      icon="graduation"
      title="Education & highlights"
      alt
    >
      <div className={styles.grid}>
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>
            <Icon name="graduation" size="1.1rem" />
            Education
          </h3>

          <ul className={styles.list}>
            {items.map((item) => (
              <li className={styles.card} key={`${item.institution}-${item.end}`}>
                <p className={styles.period}>
                  {item.start} — {item.end}
                </p>
                <h4 className={styles.degree}>
                  {item.degree}
                  {item.field ? `, ${item.field}` : ''}
                </h4>
                <p className={styles.institution}>
                  {item.institution}
                  {item.location ? <span className={styles.sep}>·</span> : null}
                  {item.location}
                </p>
                {item.details ? <p className={styles.details}>{item.details}</p> : null}
              </li>
            ))}
          </ul>
        </div>

        {certifications.length > 0 ? (
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>
              <Icon name="award" size="1.1rem" />
              Certifications
            </h3>

            <ul className={styles.list}>
              {certifications.map((cert) => (
                <li className={styles.card} key={cert.name}>
                  <p className={styles.period}>{cert.year}</p>
                  <h4 className={styles.degree}>
                    {cert.url ? (
                      <Link to={cert.url}>
                        {cert.name}
                        <Icon name="arrowUpRight" size="0.95rem" />
                      </Link>
                    ) : (
                      cert.name
                    )}
                  </h4>
                  <p className={styles.institution}>{cert.issuer}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {achievements.length > 0 ? (
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>
              <Icon name="check" size="1.1rem" />
              Achievements & activities
            </h3>

            <ul className={styles.list}>
              {achievements.map((achievement) => (
                <li className={styles.card} key={achievement.title}>
                  <p className={styles.period}>{achievement.year}</p>
                  <h4 className={styles.degree}>{achievement.title}</h4>
                  {achievement.detail ? (
                    <p className={styles.institution}>{achievement.detail}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
