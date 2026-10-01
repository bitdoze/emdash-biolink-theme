import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import icon from "astro-icon";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		icon({
			include: {
				"simple-icons": [
					"x",
					"instagram",
					"youtube",
					"tiktok",
					"linkedin",
					"github",
					"gitlab",
					"facebook",
					"threads",
					"bluesky",
					"mastodon",
					"discord",
					"twitch",
					"telegram",
					"whatsapp",
					"pinterest",
					"snapchat",
					"reddit",
					"spotify",
					"applemusic",
					"soundcloud",
					"bandcamp",
					"vimeo",
					"medium",
					"substack",
					"patreon",
					"kofi",
					"buymeacoffee",
					"dribbble",
					"behance",
					"codepen",
					"rss",
				],
				lucide: [
					"globe",
					"mail",
					"phone",
					"link-2",
					"map-pin",
					"arrow-up-right",
					"sun",
					"moon",
					"zap",
					"play",
				],
			},
		}),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
		}),
	],
	devToolbar: { enabled: false },
});
