import type { ReactElement, SVGProps } from 'react';

export type IconName =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'dribbble'
  | 'website'
  | 'email'
  | 'phone'
  | 'location'
  | 'download'
  | 'arrowUpRight'
  | 'arrowUp'
  | 'external'
  | 'code'
  | 'briefcase'
  | 'graduation'
  | 'award'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'close'
  | 'check';

/** Single-path (or grouped) 24×24 stroke icons, sized by `font-size` via 1em. */
const PATHS: Record<IconName, ReactElement> = {
  github: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2.2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.24 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.44-2.69 5.41-5.26 5.7.41.36.78 1.07.78 2.16v3.2c0 .31.2.67.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      stroke="none"
      d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"
    />
  ),
  twitter: (
    <path
      fill="currentColor"
      stroke="none"
      d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.67l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z"
    />
  ),
  dribbble: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8.6 2.7c4.2 4.5 6.4 9.5 7.3 16.4M2.3 10.4c6.8.5 12-1.2 16-5.6M21.7 13.6c-5-1.4-9.7-.9-13.6 2.4" />
    </>
  ),
  website: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </>
  ),
  email: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 7 7.35 5.15a2 2 0 0 0 2.3 0L20.5 7" />
    </>
  ),
  phone: (
    <path d="M6.6 2.5h3l1.5 4-2 1.4a12.5 12.5 0 0 0 6 6l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.6 4.7a2 2 0 0 1 2-2.2Z" />
  ),
  location: (
    <>
      <path d="M12 21.5S4.5 15.6 4.5 10a7.5 7.5 0 0 1 15 0c0 5.6-7.5 11.5-7.5 11.5Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  download: <path d="M12 3.5v12m0 0 4.5-4.5M12 15.5 7.5 11M4 19.5h16" />,
  arrowUpRight: <path d="M7 17 17 7m0 0H8.5M17 7v8.5" />,
  arrowUp: <path d="M12 19V5m0 0-6.5 6.5M12 5l6.5 6.5" />,
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </>
  ),
  code: <path d="m8.5 8.5-4 3.5 4 3.5M15.5 8.5l4 3.5-4 3.5M13.5 5l-3 14" />,
  briefcase: (
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2.5" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M2.5 12h19" />
    </>
  ),
  graduation: (
    <>
      <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" />
      <path d="M6.5 11.2V16c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-4.8M21.5 9v5" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-1 7 4.5-2.5 4.5 2.5-1-7" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </>
  ),
  moon: <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5a8.5 8.5 0 1 0 10.8 10.8Z" />,
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  /** Any CSS length; defaults to 1em so the icon tracks its parent font-size. */
  size?: string | number;
  title?: string;
}

export function Icon({ name, size = '1em', title, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
