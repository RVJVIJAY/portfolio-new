import type { CSSProperties } from 'react';
import { Section } from '../Section/Section';
import { Reveal } from '../Reveal/Reveal';
import { Icon } from '../Icon/Icon';
import { usePointerGlow } from '../../hooks/usePointerGlow';
import type { Project } from '../../data/types';
import styles from './Projects.module.scss';
import { Link } from '../Link/Link';

interface ProjectsProps {
  items: Project[];
}

export function Projects({ items }: ProjectsProps) {
  const gridRef = usePointerGlow<HTMLDivElement>();

  return (
    <Section
      id="projects"
      index="04"
      eyebrow="Projects"
      icon="code"
      title="Selected work"
      lead="A few things I have designed, built and shipped."
    >
      <div className={styles.grid} ref={gridRef}>
        {items.map((project, index) => (
          <Reveal
            as="article"
            key={project.title}
            index={index}
            className={`${styles.card} ${project.featured ? styles.featured : ''}`}
            data-glow
          >
            {/* Oversized ghost index that slides up behind the card on hover. */}
            <span className={styles.ghostIndex} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className={styles.cardTop}>
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {project.featured ? (
                <span className={styles.flag}>Featured</span>
              ) : null}
              {project.year ? <span className={styles.year}>{project.year}</span> : null}
            </div>

            <div className={styles.body}>
              <h3 className={styles.title}>
                {project.url ? (
                  <Link to={project.url}>
                    <span>{project.title}</span>
                    <Icon name="arrowUpRight" size="0.95rem" />
                  </Link>
                ) : (
                  project.title
                )}
              </h3>

              <p className={styles.description}>{project.description}</p>

              <ul className={styles.tags}>
                {project.tags.map((tag, tagIndex) => (
                  <li key={tag} style={{ '--i': tagIndex } as CSSProperties}>
                    {tag}
                  </li>
                ))}
              </ul>

              {project.url || project.repo ? (
                <div className={styles.links}>
                  {project.url ? (
                    <Link to={project.url}>
                      <Icon name="external" size="0.9rem" />
                      Live demo
                    </Link>
                  ) : null}
                  {project.repo ? (
                    <Link to={project.repo}>
                      <Icon name="github" size="0.9rem" />
                      Source
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
