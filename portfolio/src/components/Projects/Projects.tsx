import { Section } from '../Section/Section';
import { Icon } from '../Icon/Icon';
import type { Project } from '../../data/types';
import styles from './Projects.module.scss';
import { Link } from '../Link/Link';

interface ProjectsProps {
  items: Project[];
}

export function Projects({ items }: ProjectsProps) {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      icon="code"
      title="Selected work"
      lead="A few things I have designed, built and shipped."
    >
      <div className={styles.grid}>
        {items.map((project) => (
          <article
            className={`${styles.card} ${project.featured ? styles.featured : ''}`}
            key={project.title}
          >
            <div className={styles.cardTop}>
              <span className={styles.thumb} aria-hidden="true">
                <Icon name="code" size="1.35rem" />
              </span>
              {project.year ? <span className={styles.year}>{project.year}</span> : null}
            </div>

            <h3 className={styles.title}>
              {project.url ? (
                <Link to={project.url}>
                  {project.title}
                  <Icon name="arrowUpRight" size="1rem" />
                </Link>
              ) : (
                project.title
              )}
            </h3>

            <p className={styles.description}>{project.description}</p>

            <ul className={styles.tags}>
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>

            {project.url || project.repo ? (
              <div className={styles.links}>
                {project.url ? (
                  <Link to={project.url}>
                    <Icon name="external" size="0.95rem" />
                    Live demo
                  </Link>
                ) : null}
                {project.repo ? (
                  <Link to={project.repo}>
                    <Icon name="github" size="0.95rem" />
                    Source
                  </Link>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}
