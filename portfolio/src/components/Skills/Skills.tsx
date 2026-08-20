import type { CSSProperties } from 'react';
import { Section } from '../Section/Section';
import { Reveal } from '../Reveal/Reveal';
import { usePointerGlow } from '../../hooks/usePointerGlow';
import type { SkillGroup } from '../../data/types';
import styles from './Skills.module.scss';

interface SkillsProps {
  groups: SkillGroup[];
}

export function Skills({ groups }: SkillsProps) {
  const gridRef = usePointerGlow<HTMLDivElement>();

  return (
    <Section
      id="skills"
      index="02"
      eyebrow="Skills"
      icon="code"
      title="Tools I work with"
      lead="The languages, frameworks and platforms I reach for day to day."
    >
      <div className={styles.grid} ref={gridRef}>
        {groups.map((group, index) => (
          <Reveal
            as="article"
            key={group.category}
            index={index % 4}
            className={styles.card}
            data-glow
          >
            <header className={styles.cardHead}>
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.category}>{group.category}</h3>
            </header>

            <ul className={styles.tags}>
              {group.items.map((item, itemIndex) => (
                <li key={item} style={{ '--i': itemIndex } as CSSProperties}>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
