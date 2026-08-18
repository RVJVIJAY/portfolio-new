export type SocialIcon =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'dribbble'
  | 'website'
  | 'email';

export interface SocialLink {
  label: string;
  url: string;
  icon: SocialIcon;
}

export interface Profile {
  /** Full name, shown in the hero and the browser title. */
  name: string;
  /** Short professional headline, e.g. "Senior Frontend Engineer". */
  role: string;
  /** One-line hook under the headline. */
  tagline: string;
  /** 2–4 sentence "About" paragraph(s). */
  summary: string[];
  location: string;
  email: string;
  phone?: string;
  /** Path or URL to a portrait. Falls back to initials when omitted. */
  avatar?: string;
  /** Path or URL to a downloadable CV, e.g. "/cv.pdf". */
  resumeUrl?: string;
  /** Optional availability badge text, e.g. "Open to new roles". */
  availability?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  /** Free-form date labels — "Mar 2021", "2019". */
  start: string;
  /** Use "Present" for the current role. */
  end: string;
  location?: string;
  /** e.g. "Full-time", "Contract". */
  type?: string;
  summary?: string;
  highlights: string[];
  stack?: string[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  year?: string;
  /** Live demo / case study link. */
  url?: string;
  /** Source code link. */
  repo?: string;
  /** Featured projects render in the wider first column. */
  featured?: boolean;
}

export interface EducationItem {
  institution: string;
  degree: string;
  field?: string;
  start: string;
  end: string;
  location?: string;
  details?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface Achievement {
  title: string;
  detail?: string;
  year: string;
}

export interface ResumeData {
  profile: Profile;
  socials: SocialLink[];
  stats: Stat[];
  skills: SkillGroup[];
  experience: ExperienceItem[];
  projects: Project[];
  education: EducationItem[];
  certifications: Certification[];
  achievements: Achievement[];
}
