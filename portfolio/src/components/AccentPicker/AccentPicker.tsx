import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../Icon/Icon';
import { ACCENTS, type Accent } from '../../hooks/useAccent';
import styles from './AccentPicker.module.scss';

interface AccentPickerProps {
  accent: Accent;
  onChange: (accent: Accent) => void;
}

/**
 * Swatch popover for the site's accent colour.
 *
 * The swatches are plain toggle buttons rather than a radio group: Tab already
 * moves between them, `aria-pressed` announces which one is on, and there is no
 * arrow-key contract to get half-right.
 */
export function AccentPicker({ accent, onChange }: AccentPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();

  const activeLabel = ACCENTS.find((item) => item.id === accent)?.label ?? accent;

  // Close on Escape or on a press outside the popover.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <div className={styles.picker} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        aria-label={`Accent colour: ${activeLabel}. Choose a different colour`}
        title="Accent colour"
      >
        <span className={styles.dot} data-accent-swatch={accent} aria-hidden="true" />
      </button>

      {open ? (
        <div className={styles.panel} id={panelId} role="group" aria-label="Accent colour">
          <p className={styles.title}>Accent</p>

          <ul className={styles.list}>
            {ACCENTS.map((item) => {
              const isActive = item.id === accent;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={styles.swatch}
                    data-accent-swatch={item.id}
                    aria-pressed={isActive}
                    aria-label={item.label}
                    title={item.label}
                    onClick={() => {
                      onChange(item.id);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                  >
                    {isActive ? <Icon name="check" size="0.85rem" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
