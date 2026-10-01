import node from "@astrojs/node";
import react from "@astrojs/react";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
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
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	devToolbar: { enabled: false },
});
