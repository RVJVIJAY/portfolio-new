import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Icon } from '../Icon/Icon';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrolled } from '../../hooks/useScrolled';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import type { Theme } from '../../hooks/useTheme';
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
}

const pad = (index: number) => String(index + 1).padStart(2, '0');

export function Navbar({ brand, items, theme, onToggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();
  const progress = useScrollProgress();
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
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} no-print`}
      data-menu-open={menuOpen}
    >
      <nav className={styles.nav} aria-label="Primary">
        <Link className={styles.brand} to="#top">
          <span className={styles.brandMark} aria-hidden="true">
            <span className={styles.brandMarkFill} />
            <span className={styles.brandMarkText}>{initials}</span>
          </span>
          <span className={styles.brandName}>{brand}</span>
        </Link>

        <ul className={styles.links}>
          {items.map((item, index) => (
            <li key={item.id}>
              <Link
                to={`#${item.id}`}
                className={`${styles.link} ${activeId === item.id ? styles.active : ''}`}
                aria-current={activeId === item.id ? 'page' : undefined}
                onClick={() => handleNavClick(item.id)}
              >
                <span className={styles.linkIndex} aria-hidden="true">
                  {pad(index)}
                </span>
                {/* Two copies of the label: one slides out, its twin slides in. */}
                <span className={styles.linkText}>
                  <span>{item.label}</span>
                  <span aria-hidden="true">{item.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {/* Both icons ride one strip that slides between them. The visible
                glyph is the theme you would switch *to*: a sun while dark. */}
            <span className={styles.themeIcons} aria-hidden="true">
              <Icon name="sun" size="1.05rem" />
              <Icon name="moon" size="1.05rem" />
            </span>
          </button>

          <button
            type="button"
            className={`${styles.iconButton} ${styles.menuButton}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className={styles.burger} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      {/* Reading progress, pinned to the header's bottom hairline. */}
      <span
        className={styles.progress}
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      <div
        id="mobile-menu"
        className={styles.drawer}
        aria-hidden={!menuOpen}
        aria-label="Sections"
      >
        <ul className={styles.drawerList}>
          {items.map((item, index) => (
            <li key={item.id} style={{ '--i': index } as CSSProperties}>
              <Link
                to={`#${item.id}`}
                className={`${styles.drawerLink} ${activeId === item.id ? styles.active : ''}`}
                aria-current={activeId === item.id ? 'page' : undefined}
                onClick={() => handleNavClick(item.id)}
              >
                <span className={styles.drawerIndex} aria-hidden="true">
                  {pad(index)}
                </span>
                <span className={styles.drawerLabel}>{item.label}</span>
                <Icon name="arrowUpRight" size="1.1rem" />
              </Link>
            </li>
          ))}
        </ul>

        <p className={styles.drawerFoot} style={{ '--i': items.length } as CSSProperties}>
          {brand}
        </p>
      </div>
    </header>
  );
}
