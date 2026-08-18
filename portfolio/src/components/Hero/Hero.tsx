import { useState } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import type { Profile, SocialLink, Stat } from '../../data/types';
import styles from './Hero.module.scss';
import { Link } from '../Link/Link';

interface HeroProps {
  profile: Profile;
  socials: SocialLink[];
  stats: Stat[];
}

export function Hero({ profile, socials, stats }: HeroProps) {
  // The portrait is dropped entirely when the image is missing or fails to
  // load — nothing is rendered in its place.
  const [avatarFailed, setAvatarFailed] = useState(false);
  const showPortrait = Boolean(profile.avatar) && !avatarFailed;

  // Resolve /public assets against the deployed base path so the CV still
  // downloads when the site is hosted from a sub-folder (e.g. GitHub Pages).
  const withBase = (path: string) =>
    path.startsWith('/') ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}` : path;

  const cvFileName = profile.resumeUrl?.split('/').pop() ?? 'resume.pdf';

  return (
    <section className={styles.hero} id="top">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.glowAlt} aria-hidden="true" />

      <div className={`${styles.inner} ${showPortrait ? '' : styles.solo}`}>
        <div className={styles.content}>
          {profile.availability ? (
            <p className={styles.badge}>
              <span className={styles.dot} aria-hidden="true" />
              {profile.availability}
            </p>
          ) : null}

          <h1 className={styles.name}>
            Hi, I&rsquo;m <span className={styles.highlight}>{profile.name}</span>
          </h1>

          <p className={styles.role}>{profile.role}</p>
          <p className={styles.tagline}>{profile.tagline}</p>

          <ul className={styles.meta}>
            <li>
              <Icon name="location" size="1rem" />
              {profile.location}
            </li>
            <li>
              <Link to={`mailto:${profile.email}`}>
                <Icon name="email" size="1rem" />
                {profile.email}
              </Link>
            </li>
            {profile.phone ? (
              <li>
                <Link to={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>
                  <Icon name="phone" size="1rem" />
                  {profile.phone}
                </Link>
              </li>
            ) : null}
          </ul>

          <div className={styles.actions}>
            <Link className={styles.primary} to="#contact">
              Get in touch
              <Icon name="arrowUpRight" size="1.05rem" />
            </Link>

            {profile.resumeUrl ? (
              <Link
                className={styles.secondary}
                to={withBase(profile.resumeUrl)}
                download={cvFileName}
                type="application/pdf"
              >
                <Icon name="download" size="1.05rem" />
                Download CV
              </Link>
            ) : null}
          </div>

          {socials.length > 0 ? (
            <ul className={styles.socials}>
              {socials.map((social) => (
                <li key={social.label}>
                  <Link
                    to={social.url}
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon name={social.icon as IconName} size="1.15rem" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {showPortrait ? (
          <div className={styles.portrait}>
            <div className={styles.portraitFrame}>
              <img
                src={withBase(profile.avatar as string)}
                alt={`Portrait of ${profile.name}`}
                width={640}
                height={640}
                loading="eager"
                decoding="async"
                onError={() => setAvatarFailed(true)}
              />
            </div>
          </div>
        ) : null}
      </div>

      {stats.length > 0 ? (
        <ul className={styles.stats}>
          {stats.map((stat) => (
            <li key={stat.label}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
