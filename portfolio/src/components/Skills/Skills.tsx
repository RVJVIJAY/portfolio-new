import { Section } from '../Section/Section';
import type { SkillGroup } from '../../data/types';
import styles from './Skills.module.scss';

interface SkillsProps {
  groups: SkillGroup[];
}

export function Skills({ groups }: SkillsProps) {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      icon="code"
      title="Tools I work with"
      lead="The languages, frameworks and platforms I reach for day to day."
    >
      <div className={styles.grid}>
        {groups.map((group) => (
          <article className={styles.card} key={group.category}>
            <h3 className={styles.category}>{group.category}</h3>
            <ul className={styles.tags}>
              {group.items.map((item) => (
                <li key={item} className={styles.tag}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
