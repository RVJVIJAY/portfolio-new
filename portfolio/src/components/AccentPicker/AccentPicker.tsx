import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../Icon/Icon';
import { ACCENTS, type Accent } from '../../hooks/useAccent';
import type { AccentDerivation } from '../../utils/color';
import styles from './AccentPicker.module.scss';

interface AccentPickerProps {
  accent: Accent;
  customHex: string;
  derived: AccentDerivation;
  onChange: (accent: Accent) => void;
  onCustomChange: (hex: string) => void;
}

/**
 * Accent control: six presets plus a free colour picker.
 *
 * The presets are plain toggle buttons rather than a radio group — Tab already
 * moves between them, `aria-pressed` announces which is on, and there is no
 * arrow-key contract to get half-right.
 */
export function AccentPicker({
  accent,
  customHex,
  derived,
  onChange,
  onCustomChange,
}: AccentPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();
  const inputId = useId();

  const isCustom = accent === 'custom';
  const activeLabel = isCustom
    ? `custom ${customHex}`
    : (ACCENTS.find((item) => item.id === accent)?.label ?? accent);

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
        <div className={styles.panel} id={panelId}>
          <div role="group" aria-label="Preset accent colours">
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

          <div className={styles.custom}>
            <label className={styles.title} htmlFor={inputId}>
              Custom
            </label>

            <div className={styles.customRow}>
              {/* The native picker: full spectrum, eyedropper where the browser
                  offers one, and it keeps working without any JS colour UI. */}
              <span
                className={`${styles.customField} ${isCustom ? styles.customActive : ''}`}
              >
                <input
                  id={inputId}
                  type="color"
                  className={styles.colorInput}
                  value={customHex}
                  onChange={(event) => onCustomChange(event.target.value)}
                />
              </span>

              <span className={styles.hex}>{customHex.toUpperCase()}</span>
            </div>

            {/* Any hex is allowed, so the applied colour is nudged until it is
                readable on each canvas. Showing both keeps that visible rather
                than looking like the pick was ignored. */}
            <p className={styles.preview}>
              <span className={styles.previewItem}>
                <span
                  className={styles.previewDot}
                  style={{ background: derived.light.base }}
                  aria-hidden="true"
                />
                Light
              </span>
              <span className={styles.previewItem}>
                <span
                  className={styles.previewDot}
                  style={{ background: derived.dark.base }}
                  aria-hidden="true"
                />
                Dark
              </span>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
