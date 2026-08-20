import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import emailjs from '@emailjs/browser';
import { Section } from '../Section/Section';
import { Icon, type IconName } from '../Icon/Icon';
import type { Profile, SocialLink } from '../../data/types';
import styles from './Contact.module.scss';
import { Link } from '../Link/Link';

interface ContactProps {
  profile: Profile;
  socials: SocialLink[];
}

/* Yup schema — the single source of truth for the form rules. */
const contactSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Please enter your name')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .trim()
    .required('Please enter your email')
    .email('Please enter a valid email address'),
  subject: yup
    .string()
    .trim()
    .required('Please enter a subject')
    .min(3, 'Subject must be at least 3 characters'),
  message: yup
    .string()
    .trim()
    .required('Please enter a message')
    .min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = yup.InferType<typeof contactSchema>;

/* EmailJS delivers the form straight to the inbox from the browser — no
 * backend of any kind. Add the three ids to a .env file (see .env.example). */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';

const isEmailJsConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

type Status =
  | { state: 'idle' }
  | { state: 'success'; message: string }
  | { state: 'error'; message: string };

export function Contact({ profile, socials }: ContactProps) {
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  /** Opens the visitor's mail client with everything pre-filled. */
  const openMailClient = (values: ContactFormValues) => {
    const subject = encodeURIComponent(values.subject);
    const body = encodeURIComponent(
      `${values.message}\n\n— ${values.name} (${values.email})`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (values: ContactFormValues) => {
    setStatus({ state: 'idle' });

    if (!isEmailJsConfigured) {
      openMailClient(values);
      setStatus({
        state: 'success',
        message: 'Opening your email app with the message ready to send.',
      });
      reset();
      return;
    }

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          // EmailJS default template names ({{name}}, {{email}}, {{title}}…)
          name: values.name,
          email: values.email,
          title: values.subject,
          message: values.message,
          time: new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
          // Aliases, so a template written with either naming style works.
          from_name: values.name,
          from_email: values.email,
          reply_to: values.email,
          subject: values.subject,
          to_email: profile.email,
        },
        { publicKey: PUBLIC_KEY },
      );

      setStatus({
        state: 'success',
        message: `Thanks ${values.name.split(' ')[0]} — your message is on its way. I will reply shortly.`,
      });
      reset();
    } catch {
      setStatus({
        state: 'error',
        message: 'Something went wrong sending the message. Opening your email app instead…',
      });
      openMailClient(values);
    }
  };

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      icon="email"
      title="Get In Touch"
      lead="I'm currently open to React Frontend Developer opportunities, freelance projects, and collaborations. Feel free to reach out."
    >
      <div className={styles.grid}>
        <div className={styles.details}>
          <Link className={styles.detailCard} to={`mailto:${profile.email}`}>
            <span className={styles.detailIcon}>
              <Icon name="email" size="1.15rem" />
            </span>
            <span>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>{profile.email}</span>
            </span>
          </Link>

          {profile.phone ? (
            <Link
              className={styles.detailCard}
              to={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}
            >
              <span className={styles.detailIcon}>
                <Icon name="phone" size="1.15rem" />
              </span>
              <span>
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>{profile.phone}</span>
              </span>
            </Link>
          ) : null}

          <div className={styles.detailCard}>
            <span className={styles.detailIcon}>
              <Icon name="location" size="1.15rem" />
            </span>
            <span>
              <span className={styles.detailLabel}>Location</span>
              <span className={styles.detailValue}>{profile.location}</span>
            </span>
          </div>

          {socials.length > 0 ? (
            <ul className={styles.socials}>
              {socials.map((social) => (
                <li key={social.label}>
                  <Link to={social.url}>
                    <Icon name={social.icon as IconName} size="1.05rem" />
                    {social.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                {...register('name')}
              />
              {errors.name ? (
                <p className={styles.error} id="contact-name-error" role="alert">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                {...register('email')}
              />
              {errors.email ? (
                <p className={styles.error} id="contact-email-error" role="alert">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              placeholder="Frontend role / project enquiry"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
              {...register('subject')}
            />
            {errors.subject ? (
              <p className={styles.error} id="contact-subject-error" role="alert">
                {errors.subject.message}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              rows={6}
              placeholder="Tell me about the role, project or collaboration…"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              {...register('message')}
            />
            {errors.message ? (
              <p className={styles.error} id="contact-message-error" role="alert">
                {errors.message.message}
              </p>
            ) : null}
          </div>

          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Send message
                <Icon name="arrowUpRight" size="1.05rem" />
              </>
            )}
          </button>

          <p
            className={`${styles.status} ${
              status.state === 'error' ? styles.statusError : ''
            }`}
            role="status"
            aria-live="polite"
          >
            {status.state === 'idle' ? '' : status.message}
          </p>
        </form>
      </div>
    </Section>
  );
}
