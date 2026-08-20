import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import type { Profile, SocialLink, Stat } from '../../data/types';
import { useReveal } from '../../hooks/useReveal';
import { useCountUp } from '../../hooks/useCountUp';
import { useRotatingText } from '../../hooks/useRotatingText';
import { usePointerParallax } from '../../hooks/usePointerParallax';
import styles from './Hero.module.scss';
import { Link } from '../Link/Link';

interface HeroProps {
  profile: Profile;
  socials: SocialLink[];
  stats: Stat[];
  /** Skill categories, rotated through by the typewriter line. */
  focusAreas: string[];
}

/** Resolve /public assets against the deployed base path (e.g. GitHub Pages). */
const withBase = (path: string) =>
  path.startsWith('/') ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}` : path;

/** One stat, counting up the first time it reaches the viewport. */
function HeroStat({ stat, index }: { stat: Stat; index: number }) {
  const { ref, isVisible } = useReveal<HTMLLIElement>({ threshold: 0.5 });
  const value = useCountUp(stat.value, isVisible);

  return (
    <li ref={ref} className={styles.stat} style={{ '--i': index } as CSSProperties}>
      <span className={styles.statIndex} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      {/* The settled value stays in the a11y tree; the ticking copy is decorative. */}
      <span className={styles.statValue} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{stat.value}</span>
      <span className={styles.statLabel}>{stat.label}</span>
    </li>
  );
}

export function Hero({ profile, socials, stats, focusAreas }: HeroProps) {
  // The portrait is dropped entirely when the image is missing or fails to
  // load — nothing is rendered in its place.
  const [avatarFailed, setAvatarFailed] = useState(false);
  const showPortrait = Boolean(profile.avatar) && !avatarFailed;

  /* Hero copy is above the fold, so the entrance is driven by mount rather than
   * by scrolling into view. One frame of delay lets the first paint land first. */
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const parallaxRef = usePointerParallax<HTMLElement>();
  const rotating = useRotatingText(focusAreas);

  const cvFileName = profile.resumeUrl?.split('/').pop() ?? 'resume.pdf';

  /* The role becomes one masked display line per word, each sliding up in turn. */
  const roleWords = profile.role.split(' ').filter(Boolean);

  return (
    <section className={styles.hero} id="top" data-ready={ready} ref={parallaxRef}>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.aura} />
        <div className={styles.auraAlt} />
      </div>

      <div className={`${styles.inner} ${showPortrait ? '' : styles.solo}`}>
        <div className={styles.content}>
          {profile.availability ? (
            <p className={styles.badge} style={{ '--i': 0 } as CSSProperties}>
              <span className={styles.dot} aria-hidden="true" />
              {profile.availability}
            </p>
          ) : null}

          <h1 className={styles.headline}>
            {roleWords.map((word, index) => (
              <span
                key={word}
                className={styles.lineWrap}
                style={{ '--i': index + 1 } as CSSProperties}
              >
                <span>
                  {word}
                  {index === roleWords.length - 1 ? (
                    <span className={styles.period} aria-hidden="true">
                      .
                    </span>
                  ) : null}
                </span>
              </span>
            ))}
          </h1>

          <p className={styles.signature} style={{ '--i': 3 } as CSSProperties}>
            Hi, I&rsquo;m <em>{profile.name}</em>
            <span className={styles.sigRule} aria-hidden="true" />
            <span className={styles.sigLocation}>
              <Icon name="location" size="0.9rem" />
              {profile.location}
            </span>
          </p>

          <p className={styles.tagline} style={{ '--i': 4 } as CSSProperties}>
            {profile.tagline}
          </p>

          {focusAreas.length > 0 ? (
            <p className={styles.rotator} style={{ '--i': 5 } as CSSProperties}>
              <span className={styles.rotatorLabel}>Focused on</span>
              <span className={styles.rotatorValue}>
                {rotating.text}
                <span className={styles.caret} aria-hidden="true" />
              </span>
            </p>
          ) : null}

          <div className={styles.actions} style={{ '--i': 6 } as CSSProperties}>
            <Link className={styles.primary} to="#contact">
              Get in touch
              <Icon name="arrowUpRight" size="1rem" />
            </Link>

            {profile.resumeUrl ? (
              <Link
                className={styles.secondary}
                to={withBase(profile.resumeUrl)}
                download={cvFileName}
                type="application/pdf"
              >
                <Icon name="download" size="1rem" />
                Download CV
              </Link>
            ) : null}
          </div>

          <div className={styles.contactRow} style={{ '--i': 7 } as CSSProperties}>
            <ul className={styles.meta}>
              <li>
                <Link to={`mailto:${profile.email}`}>
                  <Icon name="email" size="0.95rem" />
                  {profile.email}
                </Link>
              </li>
              {profile.phone ? (
                <li>
                  <Link to={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>
                    <Icon name="phone" size="0.95rem" />
                    {profile.phone}
                  </Link>
                </li>
              ) : null}
            </ul>

            {socials.length > 0 ? (
              <ul className={styles.socials}>
                {socials.map((social) => (
                  <li key={social.label}>
                    <Link to={social.url} aria-label={social.label} title={social.label}>
                      <Icon name={social.icon as IconName} size="1.05rem" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {showPortrait ? (
          <div className={styles.portrait} style={{ '--i': 2 } as CSSProperties}>
            <div className={styles.portraitFrame}>
              <span className={styles.corner} data-corner="tl" aria-hidden="true" />
              <span className={styles.corner} data-corner="br" aria-hidden="true" />
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
            <p className={styles.portraitCaption}>
              <span>{profile.name}</span>
              <span>{profile.role}</span>
            </p>
          </div>
        ) : null}
      </div>

      {stats.length > 0 ? (
        <ul className={styles.stats}>
          {stats.map((stat, index) => (
            <HeroStat key={stat.label} stat={stat} index={index} />
          ))}
        </ul>
      ) : null}

      <p className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollLine} />
        Scroll
      </p>
    </section>
  );
}
