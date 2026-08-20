import { Icon, type IconName } from '../Icon/Icon';
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
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <p className={styles.name}>{profile.name}</p>
          <p className={styles.role}>{profile.role}</p>
          <Link className={styles.email} to={`mailto:${profile.email}`}>
            {profile.email}
          </Link>
        </div>

        <nav className={styles.nav} aria-label="Footer">
          <p className={styles.navTitle}>Sections</p>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <Link to={`#${item.id}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {socials.length > 0 ? (
          <div className={styles.socialBlock}>
            <p className={styles.navTitle}>Elsewhere</p>
            <ul className={styles.socials}>
              {socials.map((social) => (
                <li key={social.label}>
                  <Link
                    to={social.url}
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon name={social.icon as IconName} size="1.1rem" />
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
