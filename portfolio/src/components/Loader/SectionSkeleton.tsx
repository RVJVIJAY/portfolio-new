import styles from './SectionSkeleton.module.scss';

interface SectionSkeletonProps {
  /** How many placeholder cards to draw. */
  cards?: number;
  /** Column count at the large breakpoint. */
  columns?: 1 | 2 | 3 | 4;
  /** Taller cards for timeline / form-style sections. */
  tall?: boolean;
  /** Alternate background, matching the section it stands in for. */
  alt?: boolean;
}

/**
 * Suspense fallback for the lazily-loaded sections. It reserves roughly the
 * same vertical space as the real section so nothing jumps when the chunk
 * finishes downloading.
 */
export function SectionSkeleton({
  cards = 3,
  columns = 3,
  tall = false,
  alt = false,
}: SectionSkeletonProps) {
  return (
    <div
      className={`${styles.wrapper} ${alt ? styles.alt : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.inner}>
        <span className={styles.srOnly}>Loading section…</span>

        <div className={styles.head} aria-hidden="true">
          <span className={`${styles.shimmer} ${styles.eyebrow}`} />
          <span className={`${styles.shimmer} ${styles.title}`} />
          <span className={`${styles.shimmer} ${styles.lead}`} />
        </div>

        <div
          className={styles.grid}
          data-columns={columns}
          aria-hidden="true"
        >
          {Array.from({ length: cards }, (_, index) => (
            <div className={`${styles.card} ${tall ? styles.tall : ''}`} key={index}>
              <span className={`${styles.shimmer} ${styles.lineWide}`} />
              <span className={`${styles.shimmer} ${styles.line}`} />
              <span className={`${styles.shimmer} ${styles.lineShort}`} />
              {tall ? <span className={`${styles.shimmer} ${styles.line}`} /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Small inline spinner, used while the whole app boots. */
export function AppSpinner() {
  return (
    <div className={styles.boot} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.srOnly}>Loading…</span>
    </div>
  );
}
