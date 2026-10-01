/**
 * Icon registry for social and custom links.
 *
 * Each entry maps the value stored by the `icon`/`network` select fields to an
 * Iconify icon (`set:name`) plus a human-readable label used for tooltips and
 * aria-labels. Icons render through `astro-icon`; the iconify collections are
 * whitelisted in `astro.config.mjs`.
 *
 * Keep this list in sync with the select options in `seed/seed.json`.
 */

export interface IconEntry {
	/** Iconify icon name, e.g. "simple-icons:github" or "lucide:mail" */
	icon: string;
	label: string;
}

export const ICONS: Record<string, IconEntry> = {
	website: { icon: "lucide:globe", label: "Website" },
	email: { icon: "lucide:mail", label: "Email" },
	phone: { icon: "lucide:phone", label: "Phone" },
	link: { icon: "lucide:link-2", label: "Link" },
	x: { icon: "simple-icons:x", label: "X" },
	instagram: { icon: "simple-icons:instagram", label: "Instagram" },
	youtube: { icon: "simple-icons:youtube", label: "YouTube" },
	tiktok: { icon: "simple-icons:tiktok", label: "TikTok" },
	linkedin: { icon: "simple-icons:linkedin", label: "LinkedIn" },
	github: { icon: "simple-icons:github", label: "GitHub" },
	gitlab: { icon: "simple-icons:gitlab", label: "GitLab" },
	facebook: { icon: "simple-icons:facebook", label: "Facebook" },
	threads: { icon: "simple-icons:threads", label: "Threads" },
	bluesky: { icon: "simple-icons:bluesky", label: "Bluesky" },
	mastodon: { icon: "simple-icons:mastodon", label: "Mastodon" },
	discord: { icon: "simple-icons:discord", label: "Discord" },
	twitch: { icon: "simple-icons:twitch", label: "Twitch" },
	telegram: { icon: "simple-icons:telegram", label: "Telegram" },
	whatsapp: { icon: "simple-icons:whatsapp", label: "WhatsApp" },
	pinterest: { icon: "simple-icons:pinterest", label: "Pinterest" },
	snapchat: { icon: "simple-icons:snapchat", label: "Snapchat" },
	reddit: { icon: "simple-icons:reddit", label: "Reddit" },
	spotify: { icon: "simple-icons:spotify", label: "Spotify" },
	applemusic: { icon: "simple-icons:applemusic", label: "Apple Music" },
	soundcloud: { icon: "simple-icons:soundcloud", label: "SoundCloud" },
	bandcamp: { icon: "simple-icons:bandcamp", label: "Bandcamp" },
	vimeo: { icon: "simple-icons:vimeo", label: "Vimeo" },
	medium: { icon: "simple-icons:medium", label: "Medium" },
	substack: { icon: "simple-icons:substack", label: "Substack" },
	patreon: { icon: "simple-icons:patreon", label: "Patreon" },
	kofi: { icon: "simple-icons:kofi", label: "Ko-fi" },
	buymeacoffee: { icon: "simple-icons:buymeacoffee", label: "Buy Me a Coffee" },
	dribbble: { icon: "simple-icons:dribbble", label: "Dribbble" },
	behance: { icon: "simple-icons:behance", label: "Behance" },
	codepen: { icon: "simple-icons:codepen", label: "CodePen" },
	rss: { icon: "simple-icons:rss", label: "RSS" },
};

/** All icon keys, in display order — used for the admin select options. */
export const ICON_KEYS = Object.keys(ICONS);

export function getIcon(key: string | undefined | null): IconEntry | undefined {
	if (!key) return undefined;
	return ICONS[key];
}
