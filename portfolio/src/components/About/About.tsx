import { Section } from '../Section/Section';
import { Reveal } from '../Reveal/Reveal';
import type { Profile } from '../../data/types';
import styles from './About.module.scss';
import { Link } from '../Link/Link';

interface AboutProps {
  profile: Profile;
  /** Short "what I do" rows; derived from the skill categories. */
  focusAreas: string[];
}

export function About({ profile, focusAreas }: AboutProps) {
  const details: Array<{ label: string; value: string; href?: string }> = [
    { label: 'Location', value: profile.location },
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  ];

  if (profile.phone) {
    details.push({
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/[^+\d]/g, '')}`,
    });
  }

  return (
    <Section id="about" index="01" eyebrow="About" icon="code" title="A little about me" alt>
      <div className={styles.grid}>
        <div className={styles.copy}>
          {profile.summary.map((paragraph, index) => (
            <Reveal
              as="p"
              key={paragraph.slice(0, 40)}
              index={index}
              className={index === 0 ? styles.leadParagraph : undefined}
            >
              {paragraph}
            </Reveal>
          ))}
        </div>

        <Reveal as="aside" variant="right" className={styles.panel}>
          <h3 className={styles.panelTitle}>
            <span>What I focus on</span>
            <span className={styles.panelCount} aria-hidden="true">
              {String(focusAreas.length).padStart(2, '0')}
            </span>
          </h3>

          <ul className={styles.focusList}>
            {focusAreas.map((area, index) => (
              <li key={area}>
                <span className={styles.focusIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.focusLabel}>{area}</span>
                <span className={styles.focusRule} aria-hidden="true" />
              </li>
            ))}
          </ul>

          <dl className={styles.details}>
            {details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>
                  {detail.href ? <Link to={detail.href}>{detail.value}</Link> : detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
