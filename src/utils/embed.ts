/**
 * Resolve a user-supplied URL into an embeddable iframe source.
 * Supports YouTube, Vimeo and Spotify; anything else returns null and the
 * block renders as a regular link card.
 */

export interface ResolvedEmbed {
	src: string;
	/** "video" renders a 16:9 frame; "audio" renders a compact player. */
	kind: "video" | "audio";
	title: string;
}

const YOUTUBE =
	/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const VIMEO = /vimeo\.com\/(\d+)/;
const SPOTIFY = /open\.spotify\.com\/(track|album|playlist|episode|show|artist)\/([a-zA-Z0-9]+)/;

export function resolveEmbed(url: string | undefined | null): ResolvedEmbed | null {
	if (!url) return null;

	const yt = url.match(YOUTUBE);
	if (yt) {
		return {
			src: `https://www.youtube.com/embed/${yt[1]}`,
			kind: "video",
			title: "YouTube video",
		};
	}

	const vi = url.match(VIMEO);
	if (vi) {
		return {
			src: `https://player.vimeo.com/video/${vi[1]}`,
			kind: "video",
			title: "Vimeo video",
		};
	}

	const sp = url.match(SPOTIFY);
	if (sp) {
		return {
			src: `https://open.spotify.com/embed/${sp[1]}/${sp[2]}`,
			kind: "audio",
			title: "Spotify player",
		};
	}

	return null;
}
