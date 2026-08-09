# Youssef Bushra — Portfolio

> A **"Living System Map"** developer portfolio. The site presents itself as a
> running distributed system: sections are *services* on an animated
> architecture graph, with data-flow packets pulsing between nodes — a nod to
> the backend / distributed-systems work it showcases.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** and
**Framer Motion**. Dark/light themed, fully responsive, accessible, and static —
deployable to Vercel in one click.

> ### 🎨 Creative variant (this branch)
> This branch layers a heavier animation pass on top of the base design, to
> compare side-by-side:
> - **Decrypt / scramble text** on the hero name, role, and every section
>   heading (`ScrambleText`)
> - **Aurora** — slow drifting gradient blobs behind the hero node graph
> - **Spotlight cards** — project cards get a pointer-following glow, a gradient
>   border that lights up under the cursor, and a subtle 3D tilt (`SpotlightCard`)
> - **Magnetic buttons** — the hero CTAs drift toward the cursor (`Magnetic`)
> - **Scroll-progress bar** pinned to the top (`ScrollProgress`)
>
> All of it respects `prefers-reduced-motion` and stays overflow-free on mobile.

## ✨ Highlights

- **Animated node-graph backdrop** (`<canvas>`) with proximity edges and flowing
  "packets" — pauses off-screen and when the tab is hidden, and renders a single
  static frame under `prefers-reduced-motion`.
- **Command palette (⌘K / Ctrl+K)** — jump to any section, toggle theme, download
  CV, copy email, open links. Fully keyboard-navigable.
- **Boot sequence intro** — a one-time "initializing services…" animation
  (shown once per browser, skippable, disabled under reduced-motion).
- **Minimap rail** — a persistent node map (desktop) that tracks and jumps to the
  active section.
- **Live status ticker** in the hero — a rotating focus line + animated throughput
  sparkline.
- **Interactive tech tags** — hover any tech to trace it across experience &
  projects; click a project tech to filter the grid.
- **Dark + light** themes via `next-themes` (no flash on load), toggle in the nav.
- **Rich, free visitor analytics** (see below) — Vercel Web Analytics + Speed
  Insights, with optional GA4.
- **Data-driven content** — everything lives in typed files under `content/`, so
  you edit data, not JSX.
- **Working contact form** (Formspree) with a graceful `mailto:` fallback.
- **Download CV** button (nav, hero, and command palette) + generated
  node-graph **Open Graph** social image.
- Scroll-spy navigation, section reveals, keyboard-navigable, WCAG-AA contrast.

## 📊 Knowing your visitors (analytics)

All of this is **free** and works on Vercel's Hobby plan — no paid services.

**1. Vercel Web Analytics + Speed Insights** (already wired via `<Analytics />`
and `<SpeedInsights />` in `app/layout.tsx`). After deploying, open your project
on Vercel → **Analytics** tab → **Enable**. You'll then see, with zero extra
config: page views, top pages, **countries & cities**, **devices / OS /
browsers**, **referrers**, and Core Web Vitals — all privacy-first (no cookies).

**2. Rich custom events.** The site sends privacy-respecting events you can view
in the Vercel Analytics **Events** panel:

| Event | When |
| --- | --- |
| `visit` | once per load — carries referrer, UTM tags, language, timezone, screen/viewport, device pixel ratio, orientation, touch, connection type, returning-visitor flag, local hour |
| `section_view` | a section scrolls into view |
| `cv_download` | the CV is downloaded (with source) |
| `contact_submit` | the contact form is submitted |
| `command_palette_open` / `command_run` | palette usage |
| `theme_toggle`, `tech_filter`, `project_archive_toggle`, `social_click`, `cta_click`, `boot_skipped` | corresponding interactions |

No PII, no fingerprinting libraries — just the signals a browser already exposes
plus the actions people take.

**3. Optional — Google Analytics 4** for deeper demographic reports. Set
`NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` in your env (Vercel → Settings → Environment
Variables). Leaving it blank keeps GA fully disabled — no script is loaded. GA4
is also free.

## 🚀 Getting started

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

## ✏️ Editing your content

All content is centralized and typed — no need to touch components:

| File | What it holds |
| --- | --- |
| `content/profile.ts` | Name, role, tagline, summary, socials, hero stats, nav nodes |
| `content/experience.ts` | Work history (roles, stacks, impact bullets) |
| `content/projects.ts` | Projects — set `featured: true/false` to curate the grid vs. the archive |
| `content/skills.ts` | Skill groups shown in the capability matrix |
| `content/education.ts` | Education + certifications / awards / roles |

Types live in `lib/types.ts`, so your editor will guide the shape of each entry.

## 📮 Contact form (Formspree)

The form works out of the box using a `mailto:` fallback. To receive messages
**in-page** without opening a mail client:

1. Create a free form at <https://formspree.io>.
2. Copy the ID from your endpoint URL: `https://formspree.io/f/<THIS_PART>`.
3. Add it to `.env.local` (copy from `.env.example`):

   ```bash
   NEXT_PUBLIC_FORMSPREE_ID=your_form_id
   ```

4. On Vercel, add the same variable under **Project → Settings → Environment
   Variables**.

If the variable is empty, the form falls back to opening the visitor's mail
client addressed to you.

## ☁️ Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at <https://vercel.com/new> — the framework auto-detects as Next.js.
3. (Optional) add `NEXT_PUBLIC_FORMSPREE_ID` under Environment Variables.
4. Deploy. No extra configuration required.

## 🎨 Theming

Colors are defined as RGB CSS variables in `app/globals.css` (`:root` for light,
`.dark` for dark) and surfaced to Tailwind in `tailwind.config.ts`. Change
`--accent` / `--accent-2` in one place to re-skin the whole site.

## 🧩 Project structure

```
app/            layout, page, global styles, opengraph-image
components/
  system/       NodeGraphBackground, CommandPalette, BootSequence, Minimap,
                StatusTicker, TechContext, VisitTracker
  layout/       Nav, ThemeToggle, Footer, ThemeProvider, SectionShell
  sections/     Hero, About, Experience, Projects, Skills, Contact
  ui/           MonogramAvatar, TechChip, TechTag, CVButton, SectionHeading,
                RevealOnScroll
content/        typed CV data (edit here)
lib/            types, Framer Motion variants, analytics helpers
public/         CV PDF, robots.txt
```

## 📝 Notes

- The photo slot uses a generated node-graph monogram (`MonogramAvatar`). To use
  a real photo instead, drop an image into `public/` and swap it into
  `components/sections/Hero.tsx`.
- The **CV** lives at `public/Youssef_Bushra_Fouad_CV.pdf`; replace that file to
  update the download everywhere (nav, hero, command palette).

---

Designed & built by Youssef Bushra Fouad.
