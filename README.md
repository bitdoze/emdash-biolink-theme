# Biolink — a link-in-bio theme for EmDash

A blocks-based link-in-bio theme for [EmDash](https://emdashhq.com/), the CMS built on Astro. Give creators a page they fully control: profile, social links, custom links, projects, embeds — all edited as reorderable blocks in the admin UI, with per-page theming.

<p align="center">
	<img src="docs/screenshot-dark.png" alt="Biolink theme — dark mode" width="360" />
	&nbsp;&nbsp;
	<img src="docs/screenshot-light.png" alt="Biolink theme — light mode" width="360" />
</p>

- **Stack:** Astro 7 + [EmDash CMS](https://emdashhq.com/) + SQLite + local file storage
- **Rendering:** server-side (`output: "server"`), no client JS except a tiny theme toggle
- **Icons:** [astro-icon](https://github.com/natemoo-re/astro-icon) with Simple Icons + Lucide — pick icons from a dropdown, no SVG hunting
- **Plugins:** none — every field is a built-in EmDash field type

## Features

- **Profile header** — avatar, name, bio, location/handle line
- **Social icons row** — 30+ networks (GitHub, X, Instagram, YouTube, TikTok, LinkedIn, Bluesky, Mastodon, Discord, Twitch, Telegram, WhatsApp, Reddit, Spotify, Substack, Patreon, Ko-fi, Dribbble, Behance, CodePen, RSS…) plus generic website/email/phone/link icons
- **Block editor** — add, reorder, duplicate and delete blocks per page:
  | Block | What it does |
  |---|---|
  | Social Icons | Row of icon buttons linking to profiles |
  | Link | Full-width link card with optional description, icon or thumbnail, featured style |
  | Link List | Compact group of smaller links |
  | Heading | Section title + optional subtitle |
  | Project | Card with image, title, description and tag |
  | Text | Free-form rich text |
  | Image | Image with optional caption and link |
  | Embed | YouTube, Vimeo, Spotify, SoundCloud (graceful link fallback for anything else) |
  | Divider | Line, dots or space |
- **Appearance controls** per bio page, all in the admin:
  - Theme mode: system / light / dark (with a visitor-facing toggle in system mode)
  - 10 color schemes: violet, ocean, sunset, forest, rose, amber, candy, cyber, mono, slate
  - Hex overrides for accent, background, text and card colors — light/dark counterparts are derived automatically
  - Background: gradient, solid color, or image upload
  - Card style: soft, outline, solid, glass
  - Corner radius: rounded, pill, sharp
  - Avatar shape, font stack, optional "Powered by EmDash" footer
- **Multiple pages** — the `home` profile renders at `/`, every other Bio Page renders at `/:slug`

## Getting started

Scaffold a new site from the theme with `npm create astro`:

```bash
npm create astro@latest -- my-links --template github:bitdoze/emdash-biolink-theme --no-ai
cd my-links
npm install
npm run dev
```

(`--no-ai` keeps the theme's own `AGENTS.md` — otherwise create-astro replaces it with generic Astro docs. Plain `git clone` works too: clone, `npm install`, `npm run dev`.)

Then open the admin and complete the setup wizard:

- **Site:** http://localhost:4321
- **Admin:** http://localhost:4321/_emdash/admin

The wizard runs migrations and applies `seed/seed.json`, which creates the **Bio Pages** collection, all block types, and a demo profile you can edit or replace. The demo avatar is downloaded from a remote URL during seeding.

If you ever need to re-apply the seed manually:

```bash
npx emdash seed
```

## Editing your page

In the admin, open **Bio Pages → home**. The entry has three groups:

1. **Profile** — name, bio, profile picture, location/handle
2. **Appearance** — theme mode, color scheme, color overrides, background style/image, card style, corner radius, avatar shape, font, footer branding
3. **Blocks** — the page layout. Use **Add block**, drag to reorder, duplicate or delete

Publish and the page is live at `/` (or `/:slug` for additional pages).

### Social icons

The **Social Icons** block is a list of `network` + `url` pairs. The network dropdown is the icon picker — each option maps to a Simple Icons or Lucide icon. The mapping lives in `src/icons.ts`; the icon allowlist lives in `astro.config.mjs` (`icon({ include: … })`). Add a new network by extending both plus the field's `options` in `seed/seed.json`.

### Colors without a color picker

EmDash core has no color field, so the theme offers both presets and free-form overrides:

- **Color scheme** — pick a palette; it defines accent, background, card and text for both light and dark
- **Accent / Background / Text / Card color** — paste any hex value (`#ff5722`) to override the preset. A matching counterpart for the opposite scheme is derived automatically, and button text contrast is computed for readability

### Multiple pages

Create more Bio Pages in the admin to publish additional link pages — each keeps its own blocks and theme. A page with slug `links` renders at `/links`. `home` always renders at `/` and `/home` redirects there.

## Commands

```bash
npm run dev          # dev server
npm run build        # production build → dist/
npm run preview      # local preview of the build
npm start            # serve the production build (Node standalone)
npm run typecheck    # astro check
npx emdash seed      # apply seed/seed.json
npx emdash types     # regenerate emdash-env.d.ts from the schema
```

## Project structure

```
seed/seed.json            schema + block types + demo content
src/pages/index.astro     / → the "home" profile (or newest profile)
src/pages/[slug].astro    /:slug → any other Bio Page
src/components/BioPage.astro   page shell: header, theming, footer, toggle
src/components/BioBlocks.astro block → component map
src/components/blocks/    one component per block type
src/components/Icon.astro icon wrapper (astro-icon)
src/icons.ts              network/icon key → Iconify name + label
src/utils/theme.ts        palettes, color math, CSS variable generation
src/utils/embed.ts        embed provider resolution
src/styles/theme.css      the design system (CSS variables + components)
```

## Deployment

The site is a standard Node.js Astro app (`@astrojs/node` standalone). Build it and run the server, setting the environment your `astro.config.mjs` expects:

```bash
npm run build
npm start          # serves dist/server/entry.mjs
```

To deploy on Cloudflare Workers or another runtime, swap the adapter and the `emdash()` database/storage drivers in `astro.config.mjs` — see [the EmDash deployment docs](https://docs.emdashcms.com/).

## Environment

`EMDASH_ENCRYPTION_KEY` is only needed to encrypt plugin secrets. This theme uses no plugins, so it can stay unset — see `.env.example`. Generate one if you add plugins later:

```bash
npx emdash secrets generate
```

## Built with

- [EmDash](https://emdashhq.com/) — CMS on Astro ([docs](https://docs.emdashcms.com/), [source](https://github.com/emdash-cms/emdash))
- [Astro](https://astro.build/) — the web framework
- [astro-icon](https://github.com/natemoo-re/astro-icon) + [Iconify](https://iconify.design/) — Simple Icons & Lucide icon sets

## License

MIT — see [LICENSE](LICENSE).
