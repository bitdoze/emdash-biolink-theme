This is an EmDash site -- a CMS built on Astro with a full admin UI. It is the
**Biolink theme**: a link-in-bio template where each page is a `profiles` entry
whose layout is an ordered list of content blocks.

## Commands

```bash
npm run dev           # Astro dev server on workerd (local D1/R2 emulation)
npm run build         # Production build → dist/
npm run preview       # Preview the built worker locally
npm run deploy        # astro build && wrangler deploy
npm run typecheck     # astro check
npx wrangler types    # Regenerate worker-configuration.d.ts
npx emdash types      # Regenerate TypeScript types (emdash-env.d.ts)
npx emdash seed       # Apply seed/seed.json (local SQLite DB only)
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File                          | Purpose                                                                  |
| ----------------------------- | ------------------------------------------------------------------------ |
| `astro.config.mjs`            | Astro config: `emdash()` integration, D1, R2, astro-icon                 |
| `src/worker.ts`               | Cloudflare Workers entry: fetch handler + cron scheduled handler         |
| `wrangler.jsonc`              | Worker name, `DB` (D1) + `MEDIA` (R2) bindings, cron trigger             |
| `worker-configuration.d.ts`   | Generated binding types (`wrangler types`)                               |
| `src/live.config.ts`          | EmDash loader registration (boilerplate -- don't modify)                 |
| `seed/seed.json`              | Schema definition + demo content (blockTypes, `profiles` collection)     |
| `emdash-env.d.ts`             | Generated types -- `Profile`, `ProfileLayout*Block` union                 |
| `src/pages/index.astro`       | `/` renders the `home` profile, or newest profile as fallback            |
| `src/pages/[slug].astro`      | `/:slug` renders any other Bio Page; `/home` redirects to `/`            |
| `src/components/BioPage.astro`| Full page shell: avatar/header, blocks, footer, light/dark toggle        |
| `src/components/BioBlocks.astro` | `Blocks` renderer + `defineBlockComponents` map                       |
| `src/components/blocks/`      | One component per block type                                             |
| `src/components/Icon.astro`   | Icon wrapper around `astro-icon`                                         |
| `src/icons.ts`                | Icon registry: field value -> Iconify name + label (keep in sync w/ seed)|
| `src/utils/theme.ts`          | Palette presets, hex->light/dark counterpart math, CSS var generation    |
| `src/utils/embed.ts`          | Safe embed URL resolution (YouTube, Vimeo, Spotify, SoundCloud)          |
| `src/styles/theme.css`        | Design system: CSS variables, card styles, dark/light                    |

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (menus, widgets, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall. The docs reflect current behaviour; assumptions may not.

This template ships with `.mcp.json`, `.cursor/mcp.json`, and `.vscode/mcp.json` so Claude Code, Cursor, and VS Code auto-discover the docs server. Other tools (OpenCode, Windsurf, etc.) need a manual one-time setup -- see [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp).

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- The site runs on Cloudflare Workers: `d1({ binding: "DB" })` + `r2({ binding: "MEDIA" })` from `@emdash-cms/cloudflare`, bindings declared in `wrangler.jsonc`. No Node-only APIs in request-path code.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- When Astro's cache is enabled, pass content-query hints to `Astro.cache.set(cacheHint)`. Use the `WithCacheHint` variants for site settings, menus, taxonomies, and widget areas rendered by cached routes.
- Taxonomy names in queries must match the seed's `"name"` field exactly.
- **No plugins.** This theme deliberately uses only built-in field types. Appearance customisation is done with `select` presets + hex `string` overrides; do not add `@emdash-cms/*` plugins.
- Blocks are defined under `blockTypes` in `seed/seed.json` **before** the `profiles` collection that references them. When adding a block type: seed `blockTypes` entry -> component in `src/components/blocks/` -> entry in `BioBlocks.astro` -> regenerate types.
- When adding an icon option: add the key to `src/icons.ts`, the select `options` in `seed/seed.json`, and the Iconify name to the `icon({ include })` list in `astro.config.mjs`. Regenerate types afterwards.

## Schema

- `profiles` collection: `title`, `bio`, `avatar` (image), `location`, `layout` (blocks), plus appearance fields (`theme_mode`, `color_scheme`, `accent_color`, `bg_style`, `bg_color`, `bg_image`, `text_color`, `card_color`, `card_style`, `corner_radius`, `avatar_shape`, `font`, `footer_branding`).
- Block types: `social_icons`, `link`, `link_list`, `heading`, `project`, `text`, `image`, `embed`, `divider`.

## Theming model

`resolveBioTheme()` in `src/utils/theme.ts` turns the appearance fields into
CSS custom properties emitted as `light-dark(<light>, <dark>)` pairs in an
inline `style` attribute on `<html>` -- inline so per-page values always win
over the `:root` defaults in `theme.css`. The `light`/`dark` class on `<html>`
(or the visitor's OS preference) resolves them. Keep it that way: don't move
per-page vars back into a `<style>` tag, dev-mode stylesheet order will
override them.
