# R. K. Singh — Personal Academic Website

Personal portfolio website for **Prof. Reetesh Kumar Singh**, Professor of Commerce, Department of Commerce, Faculty of Commerce and Business, Delhi School of Economics, University of Delhi.

**Live at:** [rksingh.tech](https://rksingh.tech)

---

## What it does

- Showcases publications, editorial board memberships, and teaching innovations
- Lists consulting and advisory engagements
- Surfaces the five most recent lectures from [@rksinghdu](https://www.youtube.com/@rksinghdu) via the YouTube Data API
- Embeds curated LinkedIn posts as a responsive carousel
- Provides a Student Portal linking to access-restricted tools (simulations, attendance, etc.)
- Routes contact-form submissions to inbox via EmailJS — no backend required
- Warm-heritage visual style in both light and dark modes

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19, Vite 7 |
| Language | TypeScript (strict, `verbatimModuleSyntax`) |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Email | @emailjs/browser |
| Hosting | Vercel |
| Domain | rksingh.tech (registered via get.tech) |

## Project structure

```
src/
├── components/
│   ├── ProfessorPortfolio.tsx   # top-level page composition
│   ├── layout/                  # Header, Footer, ThemeStyles
│   ├── sections/                # Hero, About, Research, Innovations,
│   │                            #   Consulting, StudentPortal, Videos,
│   │                            #   LinkedInPosts, Contact, Figures
│   └── common/                  # SectionHeader, CarouselArrows, CarouselDots
├── content/                     # editable site content — no JSX, just data
│   ├── siteConfig.ts            #   name, email, social links, YouTube handle
│   ├── nav.ts                   #   nav menu items
│   ├── figures.ts               #   the 4 stat tiles below the hero
│   ├── innovations.tsx          #   innovation cards (icon + tag + body)
│   ├── consulting.ts            #   consulting clients paragraph
│   ├── publications.ts          #   journal articles + editorial boards
│   ├── portalTools.ts           #   Student Portal links
│   └── linkedinPosts.ts         #   LinkedIn embed URLs
├── hooks/                       # useTheme, useScrollSpy, useResponsiveSlides,
│                                #   useCarousel, useContactForm, useYouTubeVideos
├── services/                    # YouTubeAPI, EmailService, ThemeManager, Cache
├── styles/classNames.ts         # shared Tailwind class fragments
└── utils/format.ts              # view-count and relative-date helpers
```

The pattern: **components stay thin, content lives in `content/`, side effects live in `services/` and `hooks/`.** When you want to update text or links, you almost never need to touch a `.tsx` component — only `content/`.

## Quick start

```bash
git clone <repo-url>
cd <repo-folder>
npm install
cp .env.example .env             # then fill in the keys (see below)
npm run dev                      # opens at http://localhost:5173
```

## Environment variables

Create a `.env` file in the project root:

```
VITE_YOUTUBE_API_KEY=AIzaSy...
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

**YouTube API key** — Google Cloud Console → APIs & Services → Library → enable *YouTube Data API v3* → Credentials → Create API key. Then **restrict** the key:
- *Application restrictions* → HTTP referrers → list your domains (`localhost:5173/*`, `rksingh.tech/*`, `www.rksingh.tech/*`)
- *API restrictions* → YouTube Data API v3 only

The key is bundled into the client-side JS, so restrictions are what stop it being abused. Free quota: 10,000 units/day.

**EmailJS** — sign up at emailjs.com → add a Gmail email service → create a template with variables `{{from_name}}`, `{{from_email}}`, `{{message}}` (these must match the form field names exactly) → copy the Service ID, Template ID, and Public Key from the dashboard. Free tier: 200 emails/month.

> ⚠️ Vite only reads `.env` at startup. After editing it, **stop and restart `npm run dev`** for changes to take effect.

## Editing content

Most updates happen in `src/content/` — no React knowledge needed.

| To update… | Edit |
|---|---|
| Name, email, address, social links | `siteConfig.ts` |
| The 4 statistics tiles | `figures.ts` |
| Innovation cards | `innovations.tsx` |
| Journal articles & editorial boards | `publications.ts` |
| Student Portal tools | `portalTools.ts` |
| LinkedIn featured posts | `linkedinPosts.ts` |
| Consulting clients paragraph | `consulting.ts` |
| Navigation menu | `nav.ts` |

**Adding a LinkedIn post:** open the post on LinkedIn → ⋯ menu → "Embed this post" → copy the URL from `src="..."` → paste into the `LINKEDIN_POSTS` array as a new `{ url: '...' }` entry. Save the file; the carousel updates automatically.

## Scripts

```bash
npm run dev        # development server with hot reload
npm run build      # tsc + vite build → dist/
npm run preview    # preview the production build locally
npm run lint       # eslint check
```

## Theme

The site supports light and dark modes (toggle in the nav). Both use the *Warm Heritage* palette:

- **Light** — ivory background, indigo headings, terracotta accent
- **Dark** — espresso background, warm ivory text, brightened terracotta accent

The palette lives as CSS custom properties in `src/components/layout/ThemeStyles.tsx`. Edit those variables to retheme the whole site at once.

The user's choice persists to `localStorage` under the key `rk-theme` and defaults to the system preference on first visit.

## Deployment

The site auto-deploys to Vercel on every push to `main`. Pull-request branches get preview URLs automatically.

First-time setup:

1. Import the repo on **vercel.com → Add New → Project**.
2. Vercel auto-detects the Vite preset; leave defaults.
3. Add all four `VITE_*` env vars in *Project Settings → Environment Variables*.
4. Add custom domains in *Settings → Domains*: both `rksingh.tech` and `www.rksingh.tech`.
5. Configure DNS at get.tech:
   - **A record** for `@` → the IP shown in Vercel's domain panel (typically `76.76.21.21`)
   - **CNAME record** for `www` → `cname.vercel-dns-0.com`
6. After DNS propagates, add the live domains to your YouTube API key referrer list and EmailJS allowed-origins list.

## Author

**Prof. Reetesh Kumar Singh**
Department of Commerce, Faculty of Commerce and Business, Delhi School of Economics, University of Delhi
[rksingh@commerce.du.ac.in](mailto:rksingh@commerce.du.ac.in) · [LinkedIn](https://www.linkedin.com/in/dr-r-k-singh-b4b4641b) · [YouTube](https://www.youtube.com/@rksinghdu)
