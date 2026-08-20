import { useEffect, useState } from 'react';
import { Icon } from '../Icon/Icon';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrolled } from '../../hooks/useScrolled';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import type { Theme } from '../../hooks/useTheme';
import { AccentPicker } from '../AccentPicker/AccentPicker';
import type { Accent } from '../../hooks/useAccent';
import styles from './Navbar.module.scss';
import { Link } from '../Link/Link';

export interface NavItem {
  id: string;
  label: string;
}

interface NavbarProps {
  brand: string;
  items: NavItem[];
  theme: Theme;
  onToggleTheme: () => void;
  accent: Accent;
  onAccentChange: (accent: Accent) => void;
}

export function Navbar({
  brand,
  items,
  theme,
  onToggleTheme,
  accent,
  onAccentChange,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();
  const spyId = useActiveSection(items.map((item) => item.id));

  /* A click wins over the scroll-spy until the smooth scroll catches up, so the
   * highlighted link always matches the link the visitor just pressed. */
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const activeId = pinnedId ?? spyId;

  useEffect(() => {
    if (pinnedId && spyId === pinnedId) setPinnedId(null);
  }, [pinnedId, spyId]);

  const handleNavClick = (id: string) => {
    setPinnedId(id);
    setMenuOpen(false);

    // Safety net in case the section never reaches the scroll-spy offset
    // (for example the last section on a short page).
    window.setTimeout(
      () => setPinnedId((current) => (current === id ? null : current)),
      1200,
    );
  };

  useLockBodyScroll(menuOpen);

  // Close the drawer on Escape and whenever we grow past the mobile breakpoint.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const media = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (media.matches) setMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    media.addEventListener('change', onChange);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      media.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  const initials = brand
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} no-print`}>
      <nav className={styles.nav} aria-label="Primary">
        <Link className={styles.brand} to="#top">
          <span className={styles.brandMark} aria-hidden="true">
            {initials}
          </span>
          <span className={styles.brandName}>{brand}</span>
        </Link>

        <ul className={styles.links}>
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={`#${item.id}`}
                className={`${styles.link} ${activeId === item.id ? styles.active : ''}`}
                aria-current={activeId === item.id ? 'page' : undefined}
                onClick={() => handleNavClick(item.id)}
              >
                <span className={styles.linkLabel}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <AccentPicker accent={accent} onChange={onAccentChange} />

          <button
            type="button"
            className={styles.iconButton}
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size="1.15rem" />
          </button>

          <button
            type="button"
            className={`${styles.iconButton} ${styles.menuButton}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size="1.35rem" />
          </button>
        </div>
      </nav>

      <div id="mobile-menu" className={styles.drawer} hidden={!menuOpen}>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={`#${item.id}`}
                className={`${styles.drawerLink} ${activeId === item.id ? styles.active : ''}`}
                aria-current={activeId === item.id ? 'page' : undefined}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
                <Icon name="arrowUpRight" size="1rem" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ''}`}
        onClick={() => setMenuOpen(false)}
        tabIndex={-1}
        aria-hidden="true"
      />
    </header>
  );
}
