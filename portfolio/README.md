# Vijay R — Portfolio

React + TypeScript + SCSS. A responsive, production-ready personal portfolio. Every piece
of content is driven by a single typed data file, so you never have to touch JSX to update
the site.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle in dist/
npm run preview  # serve the production build locally
```

## Putting your resume in

Edit **`src/data/resume.ts`** — that is the only file you need to change. It is typed by
`src/data/types.ts`, so your editor will tell you if a field is missing or misspelled.

| Field | Renders in |
| --- | --- |
| `profile` | Hero, About, Contact, Footer, browser title |
| `socials` | Hero, Contact, Footer |
| `stats` | Hero stat cards |
| `skills` | Skills grid + the "What I focus on" list in About |
| `experience` | Experience timeline |
| `projects` | Projects grid (`featured: true` → full-width card) |
| `education`, `certifications`, `achievements` | Education section (three columns) |

Empty arrays are safe: a section with no data hides itself **and** disappears from the
navigation automatically.

### Assets

| File | Used by | Status |
| --- | --- | --- |
| `public/Vijay_R_Resume.pdf` | "Download CV" button | ✅ in place — the button downloads it directly |
| `public/avatar.jpg` | Hero portrait | Optional. Add the file to show a portrait; without it the hero simply runs full width, with no placeholder |

## Performance

- **Code splitting** — `Navbar` and `Hero` ship in the main bundle; every section below the
  fold is a `React.lazy()` chunk with its own CSS file, pulled in on demand.
- **Suspense skeletons** — each lazy section renders
  `src/components/Loader/SectionSkeleton.tsx` while its chunk downloads. The skeleton
  reserves comparable height, so the page does not jump when the real section arrives.
  Tune the fallback shape per section with `cards`, `columns`, `tall` and `alt`.
- **Reveal on scroll** — `useReveal()` uses `IntersectionObserver`, so off-screen sections
  do no animation work.
- **No animation library** — every effect is CSS transitions and keyframes driven by a
  handful of small hooks. Nothing ships to the browser to make the site move.

## Motion

The design is dark-first and editorial: hairlines instead of shadows, oversized display
type, mono labels, one vivid accent. Motion is part of that language rather than dressing
on top of it, and it is built from four pieces.

**`<Reveal>`** (`src/components/Reveal/Reveal.tsx`) wraps one element in a scroll-triggered
entrance. Pass `variant` for the direction (`up`, `left`, `mask`, `line`…) and `index` to
stagger it behind its siblings:

```tsx
{items.map((item, index) => (
  <Reveal as="li" key={item.id} index={index} className={styles.card}>…</Reveal>
))}
```

**The `.reveal*` utilities** in `main.scss` hold the visual states. `.reveal` is the resting
(hidden) state, `.reveal--visible` the settled one, and `--i` multiplies the stagger step —
so adding a variant means adding one class, not touching any JavaScript.

**Scroll-linked hooks** drive the effects a transition cannot express on its own:

| Hook | Drives |
| --- | --- |
| `useScrollProgress()` | Header progress hairline, back-to-top ring |
| `useElementProgress()` | The accent segment that fills the experience timeline as you read |
| `useCountUp()` | Hero stats ticking up from zero |
| `useRotatingText()` | The typewriter line under the hero tagline |
| `usePointerGlow()` | Cards lighting up under the cursor (one listener per grid) |
| `usePointerParallax()` | Hero grid, aura and portrait drifting with the pointer |

**Reduced motion** is handled in both directions. `main.scss` collapses every transition and
animation under `prefers-reduced-motion: reduce` and forces all revealed elements visible;
`useReducedMotion()` lets the JavaScript-driven effects (count-ups, typewriter, pointer
tracking) opt out too, instead of animating where nobody can see them.

## Structure

```
src/
├── App.tsx                  # composes the sections, hides empty ones
├── main.tsx                 # entry point
├── data/
│   ├── resume.ts            # ← your content
│   └── types.ts             # content schema
├── hooks/
│   ├── useActiveSection.ts    # scroll-spy for the nav
│   ├── useCountUp.ts          # hero stats ticking up from zero
│   ├── useElementProgress.ts  # scroll position through one element (timeline fill)
│   ├── useLockBodyScroll.ts   # locks scrolling behind the mobile drawer
│   ├── usePointerGlow.ts      # pointer-tracked glow on [data-glow] cards
│   ├── usePointerParallax.ts  # publishes pointer position as --mx / --my
│   ├── useReducedMotion.ts    # lets JS-driven effects honour the OS setting
│   ├── useReveal.ts           # fade-in on scroll (IntersectionObserver)
│   ├── useRotatingText.ts     # typewriter for the hero focus line
│   ├── useScrolled.ts         # sticky-header + back-to-top trigger
│   ├── useScrollProgress.ts   # document scroll 0 → 1
│   └── useTheme.ts            # persisted light/dark theme
├── styles/
│   ├── _variables.scss        # breakpoints, radii, motion, z-index
│   ├── _mixins.scss           # respond-to, container, focus-ring, display, card…
│   ├── _core.scss             # @forward barrel used by every module
│   └── main.scss              # theme tokens, reset, reveal utilities, keyframes
└── components/
    ├── Reveal/Reveal.tsx      # scroll-triggered entrance wrapper
    └── <Name>/<Name>.tsx + <Name>.module.scss
```

Each component owns a co-located **SCSS module**; shared decisions live in `src/styles`.

## Theming

Colours are CSS custom properties defined in `src/styles/main.scss`. **Dark is the base** —
the design is drawn for a near-black canvas — and light is a fully-tuned warm-paper
alternate. The site follows the OS preference on first visit (only an explicit *light*
preference opts out of dark), and the header toggle stores a choice in `localStorage`. An
inline script in `index.html` applies the stored theme before the first paint, so the page
never flashes; if you change that rule, change `getInitialTheme()` in `useTheme.ts` to
match.

To restyle the whole site, change the token values under `:root` (dark) and in the
`light-tokens` mixin (light) — nothing else needs to move.

Change the accent in one place:

```scss
:root {
  --c-accent: #ff5d2e;
  --c-accent-strong: #ff8560;
  --c-accent-soft: rgba(255, 93, 46, 0.14);
  --c-on-accent: #0a0a0c;   /* text drawn on top of the accent */
}
```

### Type

Three families, four weights, all loaded in `index.html`:

| Role | Family | Weight | Applied by |
| --- | --- | --- | --- |
| Name | Urbanist | 800 | `@include name-mark` — hero signature, nav brand, footer wordmark |
| Headings | Urbanist | 600 | global `h1`–`h4`, `@include display()` |
| Body | Inter | 400 | `body` |
| Buttons & nav | Inter | 500 | `@include btn-base`, nav and card links |
| Code / tech badges | JetBrains Mono | 400 / 500 | `@include mono-label`, skill and stack chips |

`name-mark` is deliberately separate from `display()`: 800 is reserved for Vijay's name
itself and never used for an ordinary heading, so the two never compete. The stylesheet
requests only those four weights — nothing on the page falls back to a synthesised bold.

## Responsive behaviour

Mobile-first, with min-width breakpoints declared in `src/styles/_variables.scss`
(`sm 480 · md 768 · lg 1024 · xl 1280`) and applied via `@include respond-to('md')`.

- **< 768px** — single column, hamburger drawer, stacked hero, full-width buttons.
- **768–1023px** — two-column skill/project grids, inline nav.
- **≥ 1024px** — side-by-side hero, full-width featured projects, three-column education.

## Contact form

Frontend only — no server anywhere in the flow.

- **Validation** — `yup` schema + `react-hook-form` via `@hookform/resolvers`, validating on
  blur and on submit. The schema at the top of
  `src/components/Contact/Contact.tsx` is the only place the rules live.
- **Delivery** — `@emailjs/browser` posts the message straight from the browser to
  EmailJS, which forwards it to `profile.email`.

### Enabling inbox delivery

```bash
cp .env.example .env   # then paste your three EmailJS ids
```

1. Sign up at <https://www.emailjs.com> (free tier is fine).
2. Add an email service — connect the Gmail account you want the mail to land in.
3. Create a template using these variables: `{{from_name}}`, `{{from_email}}`,
   `{{reply_to}}`, `{{subject}}`, `{{message}}`, `{{to_email}}`.
4. Put the service id, template id and public key in `.env` and restart the dev server.
   The public key is designed to be exposed in the browser; `.env` is git-ignored anyway.

Until those ids are filled in, the form validates and then falls back to opening the
visitor's mail app with everything pre-filled — so it is never broken, just less seamless.
Deploying? Add the same three variables to your host's environment settings.

## Accessibility

Skip link, landmark elements, labelled form fields with `aria-invalid` /
`aria-describedby`, visible focus rings, `aria-current` on the active nav link, and full
`prefers-reduced-motion` support.

## Deploying

`npm run build` outputs a static `dist/` folder — deploy it to Netlify, Vercel, GitHub
Pages, S3 or any static host. `vite.config.ts` uses `base: './'`, so it also works from a
sub-path. For GitHub Pages at `user.github.io/repo`, that relative base is already correct.
