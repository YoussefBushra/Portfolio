# Youssef Bushra — Portfolio

> A **"Living System Map"** developer portfolio. The site presents itself as a
> running distributed system: sections are *services* on an animated
> architecture graph, with data-flow packets pulsing between nodes — a nod to
> the backend / distributed-systems work it showcases.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** and
**Framer Motion**. Dark/light themed, fully responsive, accessible, and static —
deployable to Vercel in one click.

## ✨ Highlights

- **Animated node-graph backdrop** (`<canvas>`) with proximity edges and flowing
  "packets" — pauses off-screen and when the tab is hidden, and renders a single
  static frame under `prefers-reduced-motion`.
- **Dark + light** themes via `next-themes` (no flash on load), toggle in the nav.
- **Data-driven content** — everything lives in typed files under `content/`, so
  you edit data, not JSX.
- **Working contact form** (Formspree) with a graceful `mailto:` fallback.
- Scroll-spy navigation, section reveals, keyboard-navigable, WCAG-AA contrast.

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
app/            layout, page, global styles
components/
  system/       NodeGraphBackground (the animated backdrop)
  layout/       Nav, ThemeToggle, Footer, ThemeProvider, SectionShell
  sections/     Hero, About, Experience, Projects, Skills, Contact
  ui/           MonogramAvatar, TechTag, SectionHeading, RevealOnScroll
content/        typed CV data (edit here)
lib/            types + Framer Motion variants
```

## 📝 Notes

- The photo slot uses a generated node-graph monogram (`MonogramAvatar`). To use
  a real photo instead, drop an image into `public/` and swap it into
  `components/sections/Hero.tsx`.
- Want a **Download CV** button? Add your PDF to `public/` and link it from the
  hero or nav.

---

Designed & built by Youssef Bushra Fouad.
