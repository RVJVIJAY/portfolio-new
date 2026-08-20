import { Icon } from '../Icon/Icon';
import { useScrolled } from '../../hooks/useScrolled';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import styles from './BackToTop.module.scss';

const RADIUS = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function BackToTop() {
  const visible = useScrolled(600);
  const progress = useScrollProgress();

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ''} no-print`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      {/* The ring doubles as a reading-progress readout. */}
      <svg className={styles.ring} viewBox="0 0 34 34" aria-hidden="true">
        <circle className={styles.track} cx="17" cy="17" r={RADIUS} />
        <circle
          className={styles.bar}
          cx="17"
          cy="17"
          r={RADIUS}
          style={{
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: CIRCUMFERENCE * (1 - progress),
          }}
        />
      </svg>

      <Icon name="arrowUp" size="1rem" />
    </button>
  );
}
