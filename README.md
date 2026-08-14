# Youssef Bushra, portfolio

> A developer portfolio built around one idea: a career reads like a distributed
> trace. Study, roles and shipped work are drawn as spans on a single time axis,
> every bar positioned and sized by a real date from `content/`.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** and
**Framer Motion**. Light and dark themed, responsive, accessible, and static
enough to deploy to Vercel in one click.

## Design system

| Token | Choice |
| --- | --- |
| Ground | Cool graphite. `#ECEEF1` light, `#0E1116` dark. No pure black or white. |
| Accent | One signal amber, `#F5A524`, used for fills. Text and links use `--accent-text`, the same hue darkened for light mode so it passes WCAG AA. |
| Display type | Bricolage Grotesque, headings only, optical sizing on |
| Body type | IBM Plex Sans |
| Data type | IBM Plex Mono, for dates, durations, tags and metadata |
| Radius | 4px, everywhere, no exceptions |
| Section marker | A short amber bar, the same mark the trace chart uses for a span. There are no eyebrow labels or section numbers. |

Colors are RGB CSS variables in `app/globals.css` (`:root` light, `.dark` dark)
surfaced to Tailwind in `tailwind.config.ts`. Change `--accent` in one place to
re-skin the site.

## What's on the page

- **Trace chart** (`components/system/TraceChart.tsx`), the signature element.
  `lib/timeline.ts` turns the ISO dates in `content/` into span offsets and
  widths on a shared axis, so a wider bar always means a longer stretch of work.
  Selecting a role swaps the detail panel below it. The chart is computed on the
  server with a single `now`, so the client never disagrees about today's date.
- **Command palette (⌘K / Ctrl+K)**, jump to any section, toggle theme, download
  the CV, copy the email, open links. Fully keyboard-navigable.
- **Tech filter**, select any tag on a project to filter the list by technology.
- **Light and dark** via `next-themes`, following the system preference by
  default, with a toggle in the nav.
- **Working contact form** (Formspree) with a `mailto:` fallback, plus loading,
  error and success states.
- **Data-driven content**, everything lives in typed files under `content/`.
- Scroll-spy navigation, reveal-on-scroll, visible keyboard focus, and
  `prefers-reduced-motion` honored throughout.

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
| `theme_toggle`, `tech_filter`, `project_archive_toggle`, `social_click`, `cta_click` | corresponding interactions |

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
| `content/experience.ts` | Roles, including the `start` / `end` dates the trace chart is drawn from |
| `content/projects.ts` | Projects, set `featured: true/false` to split the bento grid from the archive |
| `content/skills.ts` | Skill groups and spoken languages |
| `content/education.ts` | Degree, including its `start` / `end` dates |

Types live in `lib/types.ts`, so your editor will guide the shape of each entry.

**Dates matter.** `start` and `end` are ISO year-month strings (`"2024-08"`).
Omit `end` on the current role and set `current: true`, and the span runs to
today.

## Portrait

The hero has a portrait slot. Until an image is supplied it renders a
typographic amber plate, which is a finished composition rather than a
placeholder. To use a photo, drop it at `public/portrait.jpg` and set
`PORTRAIT` at the top of `components/sections/Hero.tsx`:

```ts
const PORTRAIT: string | null = "/portrait.jpg";
```

Aim for a square crop, at least 800x800.

## Contact form (Formspree)

The form works out of the box using a `mailto:` fallback. To receive messages
in-page without opening a mail client:

1. Create a free form at <https://formspree.io>.
2. Copy the ID from the endpoint URL: `https://formspree.io/f/<THIS_PART>`.
3. Add it to `.env.local` (copy from `.env.example`):

   ```bash
   NEXT_PUBLIC_FORMSPREE_ID=your_form_id
   ```

4. On Vercel, add the same variable under **Project, Settings, Environment
   Variables**.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at <https://vercel.com/new>, the framework auto-detects as Next.js.
3. Optionally add `NEXT_PUBLIC_FORMSPREE_ID` under Environment Variables.
4. Deploy. No extra configuration required.

## Project structure

```
app/            layout, page, global styles, opengraph-image
components/
  system/       TraceChart, CommandPalette, TechContext, VisitTracker
  layout/       Nav, ThemeToggle, Footer, ThemeProvider, SectionShell
  sections/     Hero, About, Experience, Projects, Skills, Contact
  ui/           SectionHead, Tag, CVButton, RevealOnScroll
content/        typed CV data (edit here)
lib/            types, timeline math, Framer Motion variants, analytics helpers
public/         CV PDF, robots.txt
```

## Notes

- The CV lives at `public/Youssef_Bushra_Fouad_CV.pdf`. Replace that file to
  update the download everywhere (nav, hero, command palette).
- Section ids (`#about`, `#experience`, `#projects`, `#skills`, `#contact`) are
  stable, so existing links and analytics keep working.

---

Designed and built by Youssef Bushra Fouad.
