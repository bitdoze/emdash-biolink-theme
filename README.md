<div align="center">

# Biolink

**A link-in-bio theme for [EmDash](https://emdashhq.com/) on Cloudflare Workers**

Profile, socials, links and projects — edited as reorderable blocks in the EmDash admin, with per-page theming.

<p>
	<img src="docs/screenshot-dark.png" alt="Biolink theme — dark mode" width="360" />
	&nbsp;&nbsp;
	<img src="docs/screenshot-light.png" alt="Biolink theme — light mode" width="360" />
</p>

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bitdoze/emdash-biolink-theme)

[EmDash](https://emdashhq.com/) · [Docs](https://docs.emdashcms.com/) · [License](LICENSE)

</div>

## Highlights

- **Blocks, not templates** — social icons, link cards, link lists, headings, projects, text, image, embed and divider. Add, reorder, duplicate, delete — per page.
- **30+ social icons** — GitHub, X, Instagram, YouTube, TikTok, LinkedIn, Bluesky, Mastodon, Discord, Twitch, Telegram, WhatsApp, Reddit, Spotify, Substack, Patreon, Ko-fi, Dribbble, Behance, CodePen, RSS and more, via astro-icon + Iconify.
- **Theming in the admin** — 10 color schemes, hex overrides, gradient/color/image backgrounds, four card styles, three corner radii, avatar shapes, font stacks.
- **Light & dark** — `system / light / dark` modes with a visitor-facing toggle in system mode.
- **No plugins** — everything is a built-in EmDash field type.
- **Serverless** — Cloudflare Workers + D1 + R2. No server to babysit.

## Working with blocks

Each Bio Page renders its **Blocks** field top-to-bottom — an ordered stack you build in the admin. In **Bio Pages → your page → Blocks**:

- **Add block** appends a block — pick the type, fill its fields
- **Drag** blocks to reorder; **duplicate** or **delete** from each block's menu
- Repeaters inside blocks (e.g. social links) have their own **Add item / remove** controls

A typical layout: Social Icons → Heading → a few Link cards → Link List → Heading → Projects → Divider → Text.

### Social Icons

A row of round icon buttons linking to your profiles — usually the first block on the page.

| Field | Purpose |
|---|---|
| Profiles | Repeatable list. **Network** is the icon picker (30+ networks plus website/email/phone); **Profile URL** is the destination. For email use `mailto:you@example.com`, for phone `tel:+…` — those open inline instead of a new tab |

### Link

A full-width call-to-action card — the main way to send visitors somewhere.

| Field | Purpose |
|---|---|
| Title / URL | Required — card heading and destination |
| Description | One-line subtitle under the title |
| Icon | Dropdown icon shown in the card's tile |
| Thumbnail | Image shown instead of the icon (wins if both are set) |
| Featured | Accent-colored border for the card you want people to notice |
| New tab | Opens the URL in a new tab (on by default — turn off for internal pages) |

### Link List

Compact text rows with an icon and arrow — for secondary links that don't need a full card.

| Field | Purpose |
|---|---|
| Links | Repeatable list of **Label**, **URL**, optional **Icon** (defaults to a generic link icon) |

### Heading

A small-caps section title with flanking rules — separates groups of blocks ("Find me online", "Projects").

| Field | Purpose |
|---|---|
| Title / Subtitle | Title is required; subtitle sits underneath in muted text |

### Project

A horizontal card — square thumbnail, title + tag, description — for showcasing work.

| Field | Purpose |
|---|---|
| Title | Required; first letter is used as the thumbnail fallback if no image is set |
| Image | Square thumbnail (176px) on the left |
| Tag | Small badge next to the title — e.g. `Flagship`, `Video`, `Open source` |
| Description | Up to ~2 lines under the title |
| URL | Makes the whole card a link with an arrow; leave empty for a non-linked card |

### Text

A rich-text paragraph block — intro notes, disclaimers, contact blurbs. Supports headings, bold/italic, links, lists and quotes via the Portable Text editor.

### Image

A centered image block.

| Field | Purpose |
|---|---|
| Image | Required |
| Caption | Small muted line under the image |
| Link | Wraps the image in a link (opens in a new tab for external URLs) |

### Embed

Embeds a media provider inline. Supported out of the box:

- **YouTube / Vimeo** — 16:9 video player
- **Spotify** — compact audio player (tracks, albums, playlists, episodes, shows, artists)
- **SoundCloud** — compact audio player for any public track or set URL
- Anything else renders as a styled link card instead of a broken iframe

| Field | Purpose |
|---|---|
| URL | The share/watch URL — the theme converts it to the embed URL (e.g. `youtube.com/watch?v=…` or `youtu.be/…` → `youtube.com/embed/…`) |
| Caption | Optional line under the embed |

### Divider

Visual separator. **Style** options: `line`, `dots`, or `space` (invisible gap — use it to add breathing room).

## Quick start

```bash
npm create astro@latest -- my-links --template github:bitdoze/emdash-biolink-theme --no-ai
cd my-links
npm install
npm run dev
```

(`--no-ai` keeps the theme's own `AGENTS.md` — otherwise create-astro replaces it with generic Astro docs. `git clone` + `npm install` + `npm run dev` works too.)

Open the admin and complete the setup wizard:

- **Site:** http://localhost:4321
- **Admin:** http://localhost:4321/_emdash/admin

Local dev runs on workerd with D1/R2 emulation — no Cloudflare account needed until you deploy. The wizard applies `seed/seed.json`: the **Bio Pages** collection, all block types, and a demo profile (avatar included) to edit or replace.

## Editing a page

**Bio Pages → home** in the admin:

1. **Profile** — name, bio, profile picture, location/handle
2. **Appearance** — theme mode, color scheme, color overrides, background style/image, card style, corner radius, avatar shape, font, footer branding
3. **Blocks** — the page layout. Add block, drag to reorder, duplicate, delete

Publish — live at `/`. Additional Bio Pages get their own blocks and theme at `/:slug`; `/home` redirects to `/`.

### Icons

The Social Icons block is `network` + `url` pairs; the network dropdown is the icon picker. The map lives in `src/icons.ts` and the icon allowlist in `astro.config.mjs` (`icon({ include: … })`). To add a network: extend the `options` in `seed/seed.json`, add an entry to `src/icons.ts`, and whitelist the Iconify name in `astro.config.mjs`.

### Colors

EmDash core has no color field, so the theme combines presets and free-form overrides:

- **Color scheme** — a palette covering accent, background, card and text in both modes
- **Accent / Background / Text / Card color** — hex overrides (`#ff5722`); a matching opposite-mode counterpart is derived, and button contrast is computed automatically

## Deploying

### Deploy to Cloudflare button

Use the button at the top: Workers Builds clones the repo, builds it, and provisions the D1 database and R2 bucket declared in `wrangler.jsonc`.

> [!IMPORTANT]
> **Set `EMDASH_SITE_URL` before running the setup wizard.** Setup records the origin it runs on, and passkeys only work on that origin. After the first deploy:
>
> 1. Cloudflare dashboard → your Worker → **Settings → Variables and Secrets** → add a plain-text variable `EMDASH_SITE_URL` with the production origin, e.g. `https://links.example.com` (or `https://emdash-biolink.<your-subdomain>.workers.dev` if you're staying on workers.dev)
> 2. Run the setup wizard **on that URL** — open `https://<your-domain>/_emdash/admin` and complete it there
>
> Changing the value later moves sign-in to the new domain and invalidates passkeys created on the old one. You can also set it in `wrangler.jsonc` under `"vars"`, or statically via `siteUrl` in the `emdash()` options in `astro.config.mjs`.

### CLI deploy

```bash
npx wrangler login
npm run deploy          # astro build && wrangler deploy
```

Rename the worker, D1 database (`emdash-biolink`) and R2 bucket (`emdash-biolink-media`) in `wrangler.jsonc` to taste — the first deployment provisions them. See [Deploy to Cloudflare](https://docs.emdashcms.com/deployment/cloudflare/) for custom domains, migrations and media delivery.

### Prefer Node.js?

The pages and components are runtime-agnostic. Swap `astro.config.mjs` to `@astrojs/node` + `sqlite()`/`local()` drivers per [Deploy to Node.js](https://docs.emdashcms.com/deployment/nodejs/), and delete `wrangler.jsonc` + `src/worker.ts`.

## Commands

| Command                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Dev server on workerd (local D1/R2)            |
| `npm run build`        | Production build → `dist/`                     |
| `npm run preview`      | Preview the built worker locally               |
| `npm run deploy`       | `astro build && wrangler deploy`               |
| `npm run typecheck`    | `astro check`                                  |
| `npx wrangler types`   | Regenerate `worker-configuration.d.ts`         |
| `npx emdash types`     | Regenerate `emdash-env.d.ts` from the schema   |
| `npx emdash seed`      | Apply `seed/seed.json` (local SQLite only)     |

## Project structure

```
seed/seed.json                 schema + block types + demo content
src/worker.ts                  Workers entry: fetch + scheduled handler
src/pages/index.astro          / → the "home" profile (or newest profile)
src/pages/[slug].astro         /:slug → any other Bio Page
src/components/BioPage.astro   page shell: header, theming, footer, toggle
src/components/BioBlocks.astro block → component map
src/components/blocks/         one component per block type
src/components/Icon.astro      icon wrapper (astro-icon)
src/icons.ts                   network/icon key → Iconify name + label
src/utils/theme.ts             palettes, color math, CSS variables
src/utils/embed.ts             embed provider resolution
src/styles/theme.css           the design system
wrangler.jsonc                 worker name, D1/R2 bindings, cron trigger
```

## Secrets

`EMDASH_ENCRYPTION_KEY` encrypts plugin secrets. This theme has no plugins, so it can stay unset. If you add plugins later:

```bash
npx emdash secrets generate                      # print a new key
npx wrangler secret put EMDASH_ENCRYPTION_KEY    # production
```

(`.dev.vars` for local dev — see `.env.example`.)

## Built with

- [EmDash](https://emdashhq.com/) — CMS on Astro ([docs](https://docs.emdashcms.com/) · [source](https://github.com/emdash-cms/emdash))
- [Astro](https://astro.build/) — the web framework
- [astro-icon](https://github.com/natemoo-re/astro-icon) + [Iconify](https://iconify.design/) — Simple Icons & Lucide

## License

MIT — see [LICENSE](LICENSE).
