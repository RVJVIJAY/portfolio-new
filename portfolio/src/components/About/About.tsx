import { Section } from '../Section/Section';
import { Icon } from '../Icon/Icon';
import type { Profile } from '../../data/types';
import styles from './About.module.scss';
import { Link } from '../Link/Link';

interface AboutProps {
  profile: Profile;
  /** Short "what I do" cards; derived from the skill categories. */
  focusAreas: string[];
}

export function About({ profile, focusAreas }: AboutProps) {
  return (
    <Section id="about" eyebrow="About" icon="code" title="A little about me" alt>
      <div className={styles.grid}>
        <div className={styles.copy}>
          {profile.summary.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        <aside className={styles.panel}>
          <h3 className={styles.panelTitle}>What I focus on</h3>
          <ul className={styles.focusList}>
            {focusAreas.map((area) => (
              <li key={area}>
                <Icon name="check" size="1rem" />
                {area}
              </li>
            ))}
          </ul>

          <dl className={styles.details}>
            <div>
              <dt>Location</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <Link to={`mailto:${profile.email}`}>{profile.email}</Link>
              </dd>
            </div>
            {profile.phone ? (
              <div>
                <dt>Phone</dt>
                <dd>
                  <Link to={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </div>
    </Section>
  );
}
