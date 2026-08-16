# Youssef Bushra, portfolio

> A developer portfolio built as a dossier: one continuous document, dense
> enough that every screen carries information, legible to a recruiter and
> an engineer alike.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** and
**Framer Motion**. Light and dark themed, responsive, accessible, and static
enough to deploy to Vercel in one click.

## Design system

| Token | Choice |
| --- | --- |
| Ground | Near-white page with tinted panels. `#FCFCFD` light, `#101215` dark. No pure black or white. Light is the primary design target. |
| Accent | One signal amber, `#F5A524`, used for fills. Text and links use `--accent-text`, the same hue adjusted per theme so it passes WCAG AA. |
| Type | Archivo, variable on weight and width, carrying both headings and body. IBM Plex Mono for every date, figure and label. |
| Radius | 3px, everywhere, no exceptions |
| Structure | Each section is a row in one document: a hairline rule, a sticky label gutter carrying the section name and a piece of real metadata, then the content. No centred headings. |

Colors are RGB CSS variables in `app/globals.css` (`:root` light, `.dark` dark)
surfaced to Tailwind in `tailwind.config.ts`. Change `--accent` in one place to
re-skin the site.

## What's on the page

- **Identity band**, not a hero. The first screen carries the photo, name,
  role, the claim, both actions, location, availability, profile links and four
  figures, because it is the only screen some readers will look at.
- **Command palette (⌘K / Ctrl+K)**, jump to any section, toggle theme, download
  the CV, open links. Fully keyboard-navigable.
- **Light and dark** via `next-themes`, following the system preference by
  default, with a toggle in the nav.
- **Working contact form** posting to Formspree through `@formspree/react`,
  with per-field validation errors plus loading, error and success states.
- **Data-driven content**, everything lives in typed files under `content/`.
- Scroll-spy navigation, visible keyboard focus, and `prefers-reduced-motion`
  honored throughout.

## Knowing your visitors (analytics)

All of this is free and works on Vercel's Hobby plan.

**1. Vercel Web Analytics and Speed Insights** (wired via `<Analytics />` and
`<SpeedInsights />` in `app/layout.tsx`). After deploying, open the project on
Vercel, go to **Analytics**, then **Enable**. You get page views, top pages,
countries and cities, devices, OS, browsers, referrers and Core Web Vitals, all
privacy-first with no cookies.

**2. Custom events**, visible in the Vercel Analytics **Events** panel:

| Event | When |
| --- | --- |
| `visit` | once per load, carrying referrer, UTM tags, language, timezone, screen and viewport, device pixel ratio, orientation, touch, connection type, returning-visitor flag, local hour |
| `section_view` | a section scrolls into view |
| `cv_download` | the CV is downloaded, with source |
| `contact_submit` | the contact form is submitted |
| `command_palette_open`, `command_run` | palette usage |
| `theme_toggle`, `social_click`, `cta_click` | corresponding interactions |

No PII and no fingerprinting libraries, just the signals a browser already
exposes plus the actions people take.

**3. Optional Google Analytics 4.** Set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` in your
env (Vercel, Settings, Environment Variables). Leaving it blank keeps GA fully
disabled, no script is loaded.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Editing your content

All content is centralized and typed, so you edit data rather than JSX:

| File | What it holds |
| --- | --- |
| `content/profile.ts` | Name, role, hero thesis, tagline, summary, socials, headline facts, nav items |
| `content/experience.ts` | Roles, including the `start` date the Experience heading is derived from |
| `content/skills.ts` | Skill groups and spoken languages |
| `content/education.ts` | Degree and dates |

Types live in `lib/types.ts`, so your editor will guide the shape of each entry.

**Dates matter.** `start` and `end` are ISO year-month strings (`"2024-08"`).
Omit `end` on the current role and set `current: true`.

There is no Work section at present. To bring one back, recover
`content/projects.ts` and `components/sections/Projects.tsx` from commit
`055ae74`, re-add `Projects` to `app/page.tsx`, and put a `projects` entry back
in `navNodes`.

## Portrait

The hero photo is `public/portrait.jpg`, framed with `object-position` in
`components/sections/Hero.tsx` rather than a destructive crop, so the framing
can be changed without re-exporting. Aim for a square-ish crop, 800x800 or
larger.

## Contact form (Formspree)

The form posts to Formspree via `@formspree/react` and needs no configuration.
The form id is a constant at the top of `components/sections/Contact.tsx`; it
is public either way, since it ships in the client bundle. To point the form at
a different Formspree form, change that constant.

**No email address or phone number appears anywhere on the site or in the CV.**
The form is the only contact route, alongside the GitHub and LinkedIn links.
Keep it that way when editing `content/profile.ts`: adding a `mailto:` link
would put the address back in front of scrapers.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at <https://vercel.com/new>, the framework auto-detects as Next.js.
3. Deploy. No environment variables are required.
4. Enable **Analytics** and **Speed Insights** in the project's dashboard tabs;
   the code is already wired, but nothing is recorded until they are switched
   on.
5. Once a custom domain is attached, set `NEXT_PUBLIC_SITE_URL` so canonical
   and Open Graph URLs point at it. Without it the site falls back to Vercel's
   production URL, which is correct for a `*.vercel.app` deployment.

## Project structure

```
app/            layout, page, global styles, opengraph-image
components/
  system/       CommandPalette, VisitTracker
  layout/       Nav, ThemeToggle, Footer, ThemeProvider, SectionShell
  sections/     Hero, About, Experience, Skills, Contact
  ui/           CVButton, ContactLink, SocialLinks
content/        typed CV data (edit here)
lib/            types, timeline math, Framer Motion variants, analytics helpers
public/         CV PDF, portrait, robots.txt
```

## Notes

- The CV lives at `public/portfolio.pdf`. Replace that file to update the
  download everywhere (nav, hero, contact, command palette). It downloads as
  `youssefbushra.pdf`. Check any replacement for a phone number or
  email address before committing it.
- Section ids (`#about`, `#experience`, `#skills`, `#contact`) are stable, so
  existing links and analytics keep working.

---

Designed and built by Youssef Bushra Fouad.
