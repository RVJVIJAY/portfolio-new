import type { ResumeData } from './types';

/* ===========================================================================
 * THE ONLY FILE YOU NEED TO EDIT.
 * Every section of the site renders from this object. Delete any array entry
 * you do not need; sections with no data hide themselves automatically.
 * =========================================================================== */

export const resume: ResumeData = {
  profile: {
    name: 'Vijay R',
    role: 'Frontend Developer',
    tagline:
      'I build scalable, responsive web applications for healthcare and wellness platforms — with clean, reusable UI at the core.',
    summary: [
      'Frontend Developer with 2+ years of experience building scalable, responsive web applications using React.js, TypeScript, Redux Toolkit and React Query. I work mainly on healthcare and wellness platforms, where reusable components and reliable role-based access matter as much as the pixels.',
      'At Dreams Technologies I build multi-role portals end to end — API integration, form validation, dashboards, real-time chat and video consultations — translating Figma designs into pixel-accurate interfaces and catching UI/UX issues before they reach a release.',
    ],
    location: 'Madurai, Tamil Nadu, India',
    email: 'vijay31235@gmail.com',
    phone: '+91 79042 48458',
    // Save your photo as portfolio/public/avatar.jpg — the hero falls back to
    // your initials automatically if the file is missing.
    avatar: '/avatar.jpg',
    // Drop the PDF in portfolio/public/ to enable the download button.
    resumeUrl: '/Vijay_R_Resume.pdf',
    availability: 'Open to frontend opportunities',
  },

  socials: [
    { label: 'GitHub', url: 'https://github.com/RVJVIJAY', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/vj12', icon: 'linkedin' },
    { label: 'Email', url: 'mailto:vijay31235@gmail.com', icon: 'email' },
  ],

  stats: [
    { value: '2+', label: 'Years of experience' },
    { value: '2', label: 'Healthcare platforms shipped' },
    { value: '6+', label: 'User roles supported' },
  ],

  skills: [
    {
      category: 'Frontend',
      items: [
        'React.js',
        'JavaScript (ES6+)',
        'TypeScript',
        'HTML5',
        'CSS3',
        'SCSS',
        'Tailwind CSS',
        'Bootstrap',
        'PrimeReact',
        'Ant Design',
      ],
    },
    {
      category: 'State Management',
      items: ['Redux Toolkit', 'React Query', 'Context API'],
    },
    {
      category: 'Forms & Validation',
      items: ['React Hook Form', 'Yup'],
    },
    {
      category: 'API & Integration',
      items: ['REST APIs', 'Axios'],
    },
    {
      category: 'Real-Time Communication',
      items: ['Socket.IO', 'Agora'],
    },
    {
      category: 'Tools & Platforms',
      items: ['Git', 'GitHub', 'Vite', 'Webpack', 'Figma'],
    },
    {
      category: 'AI Tools',
      items: ['ChatGPT', 'GitHub Copilot', 'Cursor', 'Claude', 'Windsurf', 'Antigravity'],
    },
  ],

  experience: [
    {
      company: 'Dreams Technologies',
      role: 'Frontend Developer',
      start: 'Jul 2024',
      end: 'Aug 2026',
      location: 'Coimbatore, India',
      type: 'Full-time',
      summary:
        'Build multi-role healthcare applications from architecture through to release, working closely with backend and design.',
      highlights: [
        'Built responsive, reusable React components for multi-role healthcare applications, improving development speed and UI consistency across modules.',
        'Integrated REST APIs across multiple modules and optimized frontend performance, reducing unnecessary re-renders and improving page load responsiveness.',
        'Implemented form validation, role-based authentication and dashboard modules used across Client, Patient and Admin portals.',
        'Collaborated closely with backend and design teams to translate Figma designs into pixel-accurate, scalable frontend solutions.',
        'Identified and resolved UI/UX bugs proactively, contributing to a more stable and polished user experience across releases.',
      ],
      stack: ['React.js', 'TypeScript', 'Redux Toolkit', 'React Query', 'SCSS', 'Axios'],
    },
  ],

  projects: [
    {
      title: 'Healing Sky — Healthcare & Wellness Platform',
      description:
        'Multi-role (Client, Patient, Super Admin) wellness platform covering Mental Health, Psychiatry and Yoga programs. Set up the project architecture, built reusable UI components with form validation, and delivered blog/content management, meeting scheduling and account reporting modules.',
      tags: [
        'React.js',
        'TypeScript',
        'Redux Toolkit',
        'PrimeReact',
        'Axios',
        'React Hook Form',
        'Yup',
      ],
      featured: true,
    },
    {
      title: 'UCC (Urgent Care Colombia) — Healthcare Management System',
      description:
        'Multi-role platform for Patients, Doctors, Nurses, Office Managers, Coordinators and Admins with role-based auth, OTP login and access control. Built doctor dashboards, patient queue and appointment booking (Telehealth / In-Office / Home Visit), real-time chat via Socket.IO and Agora video consultations.',
      tags: [
        'React.js',
        'TypeScript',
        'Redux Toolkit',
        'React Query',
        'PrimeReact',
        'Socket.IO',
        'Agora',
        'Axios',
        'Yup',
      ],
      featured: true,
    },
  ],

  education: [
    {
      institution: 'Thiagarajar College, Madurai',
      degree: 'Master of Science',
      field: 'Computer Science',
      start: '2022',
      end: '2024',
      location: 'Madurai, India',
      details: 'CGPA: 8.42',
    },
    {
      institution: 'NMSSVN College, Madurai',
      degree: 'Bachelor of Science',
      field: 'Information Technology',
      start: '2019',
      end: '2022',
      location: 'Madurai, India',
      details: 'CGPA: 8.26',
    },
  ],

  certifications: [
    {
      name: 'Python — Certificate of Achievement',
      issuer: 'GUVI',
      year: '2023',
    },
    {
      name: 'Front End Development (HTML)',
      issuer: 'Great Learning Academy',
      year: '2023',
    },
  ],

  achievements: [
    {
      title: '2nd Prize — Web Designing',
      detail: "interFACE'24 (State-Level), The Gandhigram Rural Institute",
      year: '2024',
    },
    {
      title: 'Coding Brigaders — Participation',
      detail: 'Techno Club, Thiagarajar College',
      year: '2023',
    },
    {
      title: 'Debugging Event — Participation',
      detail: 'Techno Club, Thiagarajar College',
      year: '2023',
    },
  ],
};
