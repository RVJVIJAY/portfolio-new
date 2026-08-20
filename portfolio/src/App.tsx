import { Suspense, lazy, useEffect, useMemo } from 'react';
import { Navbar, type NavItem } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { SectionSkeleton } from './components/Loader/SectionSkeleton';
import { useTheme } from './hooks/useTheme';
import { useAccent } from './hooks/useAccent';
import { resume } from './data/resume';
import { Link } from './components/Link/Link';

/* Above-the-fold (Navbar + Hero) ships in the main bundle; everything below is
 * code-split and streamed in behind <Suspense> as the visitor scrolls. */
const About = lazy(() =>
  import('./components/About/About').then((m) => ({ default: m.About })),
);
const Skills = lazy(() =>
  import('./components/Skills/Skills').then((m) => ({ default: m.Skills })),
);
const Experience = lazy(() =>
  import('./components/Experience/Experience').then((m) => ({ default: m.Experience })),
);
const Projects = lazy(() =>
  import('./components/Projects/Projects').then((m) => ({ default: m.Projects })),
);
const Education = lazy(() =>
  import('./components/Education/Education').then((m) => ({ default: m.Education })),
);
const Contact = lazy(() =>
  import('./components/Contact/Contact').then((m) => ({ default: m.Contact })),
);
const Footer = lazy(() =>
  import('./components/Footer/Footer').then((m) => ({ default: m.Footer })),
);
const BackToTop = lazy(() =>
  import('./components/BackToTop/BackToTop').then((m) => ({ default: m.BackToTop })),
);

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { accent, customHex, derived: accentDerivation, setAccent, setCustomHex } =
    useAccent();
  const {
    profile,
    socials,
    stats,
    skills,
    experience,
    projects,
    education,
    certifications,
    achievements,
  } = resume;

  useEffect(() => {
    document.title = `${profile.name} — ${profile.role}`;
  }, [profile.name, profile.role]);

  // Sections with no data drop out of the nav and out of the page.
  const navItems = useMemo<NavItem[]>(
    () =>
      [
        { id: 'about', label: 'About', show: profile.summary.length > 0 },
        { id: 'skills', label: 'Skills', show: skills.length > 0 },
        { id: 'experience', label: 'Experience', show: experience.length > 0 },
        { id: 'projects', label: 'Projects', show: projects.length > 0 },
        { id: 'education', label: 'Education', show: education.length > 0 },
        { id: 'contact', label: 'Contact', show: true },
      ]
        .filter((item) => item.show)
        .map(({ id, label }) => ({ id, label })),
    [profile.summary.length, skills.length, experience.length, projects.length, education.length],
  );

  const focusAreas = useMemo(() => skills.map((group) => group.category), [skills]);

  return (
    <>
      <Link className="skip-link" to="#main">
        Skip to content
      </Link>

      <Navbar
        brand={profile.name}
        items={navItems}
        theme={theme}
        onToggleTheme={toggleTheme}
        accent={accent}
        customHex={customHex}
        accentDerivation={accentDerivation}
        onAccentChange={setAccent}
        onCustomAccentChange={setCustomHex}
      />

      <main id="main">
        <Hero profile={profile} socials={socials} stats={stats} />

        {profile.summary.length > 0 ? (
          <Suspense fallback={<SectionSkeleton cards={2} columns={2} tall alt />}>
            <About profile={profile} focusAreas={focusAreas} />
          </Suspense>
        ) : null}

        {skills.length > 0 ? (
          <Suspense fallback={<SectionSkeleton cards={4} columns={4} />}>
            <Skills groups={skills} />
          </Suspense>
        ) : null}

        {experience.length > 0 ? (
          <Suspense fallback={<SectionSkeleton cards={2} columns={1} tall alt />}>
            <Experience items={experience} />
          </Suspense>
        ) : null}

        {projects.length > 0 ? (
          <Suspense fallback={<SectionSkeleton cards={3} columns={3} tall />}>
            <Projects items={projects} />
          </Suspense>
        ) : null}

        {education.length > 0 ? (
          <Suspense fallback={<SectionSkeleton cards={3} columns={3} alt />}>
            <Education
              items={education}
              certifications={certifications}
              achievements={achievements}
            />
          </Suspense>
        ) : null}

        <Suspense fallback={<SectionSkeleton cards={2} columns={2} tall />}>
          <Contact profile={profile} socials={socials} />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer
          profile={profile}
          socials={socials}
          items={navItems}
          year={new Date().getFullYear()}
        />
        <BackToTop />
      </Suspense>
    </>
  );
}
