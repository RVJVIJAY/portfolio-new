import { Icon } from '../Icon/Icon';
import { useScrolled } from '../../hooks/useScrolled';
import styles from './BackToTop.module.scss';

export function BackToTop() {
  const visible = useScrolled(600);

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ''} no-print`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <Icon name="arrowUp" size="1.15rem" />
    </button>
  );
}
