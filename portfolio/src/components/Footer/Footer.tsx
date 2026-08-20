import { Icon, type IconName } from '../Icon/Icon';
import { Reveal } from '../Reveal/Reveal';
import type { Profile, SocialLink } from '../../data/types';
import type { NavItem } from '../Navbar/Navbar';
import styles from './Footer.module.scss';
import { Link } from '../Link/Link';

interface FooterProps {
  profile: Profile;
  socials: SocialLink[];
  items: NavItem[];
  year: number;
}

export function Footer({ profile, socials, items, year }: FooterProps) {
  return (
    <footer className={styles.footer}>
      {/* The name set as a wordmark across the full width of the page. */}
      <Reveal as="div" variant="mask" className={styles.wordmarkWrap}>
        <p className={styles.wordmark} aria-hidden="true">
          {profile.name}
        </p>
      </Reveal>

      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <p className={styles.role}>{profile.role}</p>
          <Link className={styles.email} to={`mailto:${profile.email}`}>
            <span>{profile.email}</span>
            <Icon name="arrowUpRight" size="0.9rem" />
          </Link>
          <p className={styles.location}>{profile.location}</p>
        </div>

        <nav className={styles.nav} aria-label="Footer">
          <p className={styles.blockTitle}>Sections</p>
          <ul>
            {items.map((item, index) => (
              <li key={item.id}>
                <Link to={`#${item.id}`}>
                  <span className={styles.navIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {socials.length > 0 ? (
          <div className={styles.socialBlock}>
            <p className={styles.blockTitle}>Elsewhere</p>
            <ul className={styles.socials}>
              {socials.map((social) => (
                <li key={social.label}>
                  <Link to={social.url} aria-label={social.label} title={social.label}>
                    <Icon name={social.icon as IconName} size="1rem" />
                    <span>{social.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className={styles.bar}>
        <p>
          © {year} {profile.name}. All rights reserved.
        </p>
        <p className={styles.built}>Built with React, TypeScript &amp; SCSS.</p>
      </div>
    </footer>
  );
}
