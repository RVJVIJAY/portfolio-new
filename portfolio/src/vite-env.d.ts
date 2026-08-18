/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** EmailJS service id — https://dashboard.emailjs.com/admin */
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  /** EmailJS email template id. */
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  /** EmailJS public key (safe to expose in the browser). */
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
