/**
 * Theme resolution for bio pages.
 *
 * `resolveBioTheme()` maps the appearance fields on a Bio Page entry to a set
 * of CSS custom properties emitted as `light-dark(<light>, <dark>)` pairs, so
 * the `light`/`dark` class convention on <html> (see the EmDash dark mode
 * guide) resolves them automatically.
 */

export interface BioThemeInput {
	theme_mode?: string | null;
	color_scheme?: string | null;
	accent_color?: string | null;
	bg_style?: string | null;
	bg_color?: string | null;
	text_color?: string | null;
	card_color?: string | null;
	card_style?: string | null;
	corner_radius?: string | null;
	avatar_shape?: string | null;
	font?: string | null;
	footer_branding?: boolean | null;
}

interface SchemeColors {
	bg: string;
	card: string;
	text: string;
	muted: string;
	accent: string;
	onAccent: string;
}

interface PalettePreset {
	light: SchemeColors;
	dark: SchemeColors;
}

/* ------------------------------------------------------------------ */
/* Color math                                                          */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] | null {
	const m = hex.trim().match(/^#(?:([0-9a-f]{3})|([0-9a-f]{6})|([0-9a-f]{8}))$/i);
	if (!m) return null;
	let h = m[1] ?? m[2] ?? m[3];
	if (h.length === 3) h = h.split("").map((c) => c + c).join("");
	if (h.length === 8) h = h.slice(0, 6);
	const n = parseInt(h, 16);
	return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function rgbToHex(r: number, g: number, b: number): string {
	const c = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
	return `#${c(r)}${c(g)}${c(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	r /= 255; g /= 255; b /= 255;
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	const l = (max + min) / 2;
	if (max === min) return [0, 0, l];
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	let h = 0;
	if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
	else if (max === g) h = ((b - r) / d + 2) / 6;
	else h = ((r - g) / d + 4) / 6;
	return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
	h = ((h % 360) + 360) % 360;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0, g = 0, b = 0;
	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];
	return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/** Relative luminance 0–1 for a hex color; null when unparseable. */
function luminance(hex: string): number | null {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;
	const [r, g, b] = rgb.map((v) => {
		const s = v / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Given a user-supplied color meant for one scheme, derive a sensible value
 * for the opposite scheme by flipping lightness while keeping hue.
 */
function counterpart(hex: string, forScheme: "light" | "dark"): string {
	const rgb = hexToRgb(hex);
	if (!rgb) return hex;
	const [h, s, l] = rgbToHsl(...rgb);
	if (forScheme === "dark") {
		// A light color on a light background becomes a deep tone in dark mode.
		return l > 0.5 ? hslToHex(h, Math.min(s, 0.55), 0.14) : hex;
	}
	// A dark color on a dark background becomes a light tone in light mode.
	return l < 0.5 ? hslToHex(h, Math.min(s, 0.6), 0.9) : hex;
}

/** Pick readable foreground text for an arbitrary accent color. */
function onAccentColor(hex: string): string {
	const lum = luminance(hex);
	if (lum === null) return "#ffffff";
	return lum > 0.42 ? "#16131f" : "#ffffff";
}

function singlePair(value: string | null | undefined): [string | null, string | null] {
	if (!value) return [null, null];
	const rgb = hexToRgb(value);
	if (!rgb) return [value, value]; // any CSS color applies to both schemes
	const [, , l] = rgbToHsl(...rgb);
	// A near-neutral mid-tone is usable in both schemes as-is.
	if (l > 0.3 && l < 0.7) return [value, value];
	return l <= 0.5
		? [value, counterpart(value, "dark")]
		: [counterpart(value, "light"), value];
}

/* ------------------------------------------------------------------ */
/* Presets                                                             */
/* ------------------------------------------------------------------ */

const BASE_LIGHT: Omit<SchemeColors, "accent" | "onAccent"> = {
	bg: "#f4f4f8",
	card: "#ffffff",
	text: "#181622",
	muted: "#5c5a6e",
};

const BASE_DARK: Omit<SchemeColors, "accent" | "onAccent"> = {
	bg: "#0d0d15",
	card: "#16161f",
	text: "#f3f2f8",
	muted: "#a09eae",
};

function preset(
	accentLight: string,
	accentDark: string,
	over: { light?: Partial<typeof BASE_LIGHT>; dark?: Partial<typeof BASE_DARK> } = {},
): PalettePreset {
	return {
		light: { ...BASE_LIGHT, accent: accentLight, onAccent: "#ffffff", ...over.light },
		dark: { ...BASE_DARK, accent: accentDark, onAccent: "#12101c", ...over.dark },
	};
}

export const COLOR_SCHEMES: Record<string, PalettePreset> = {
	violet: preset("#6d28d9", "#a78bfa", { dark: { bg: "#100e1a", card: "#191624" } }),
	ocean: preset("#0369a1", "#38bdf8", { dark: { bg: "#0a1220", card: "#101a2a" } }),
	sunset: preset("#c2410c", "#fb923c", { dark: { bg: "#170f0a", card: "#201409" } }),
	forest: preset("#15803d", "#4ade80", { dark: { bg: "#0b130d", card: "#111d14" } }),
	rose: preset("#be123c", "#fb7185", { dark: { bg: "#18090f", card: "#220f18" } }),
	amber: preset("#b45309", "#fbbf24", { dark: { bg: "#161006", card: "#201708" } }),
	candy: preset("#db2777", "#f472b6", { dark: { bg: "#190b14", card: "#22101c" } }),
	cyber: preset("#0e7490", "#22d3ee", { dark: { bg: "#071418", card: "#0d2027" } }),
	mono: {
		light: { ...BASE_LIGHT, bg: "#f5f5f5", card: "#ffffff", text: "#111111", muted: "#5c5c5c", accent: "#111111", onAccent: "#ffffff" },
		dark: { ...BASE_DARK, bg: "#0a0a0a", card: "#171717", text: "#fafafa", muted: "#a3a3a3", accent: "#fafafa", onAccent: "#111111" },
	},
	slate: preset("#475569", "#94a3b8", { dark: { bg: "#0d1117", card: "#151b24" } }),
};

const FONT_STACKS: Record<string, string> = {
	modern: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
	classic: 'ui-serif, "Iowan Old Style", Georgia, "Times New Roman", serif',
	mono: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
	rounded: 'ui-rounded, "SF Rounded", "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT", "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif',
};

const RADII: Record<string, string> = {
	sharp: "0.375rem",
	rounded: "1.1rem",
	pill: "999px",
};

const AVATAR_RADII: Record<string, string> = {
	circle: "50%",
	rounded: "1.5rem",
	square: "0.375rem",
};

/* ------------------------------------------------------------------ */
/* Resolver                                                            */
/* ------------------------------------------------------------------ */

export interface ResolvedBioTheme {
	/** Inline `style` attribute contents for `<html>` — custom property declarations. */
	style: string;
	/** Class list for the page root element. */
	classes: string[];
	/** Whether the visitor-facing light/dark toggle should render. */
	allowToggle: boolean;
	/** Whether the "Powered by EmDash" footer renders. */
	showBranding: boolean;
}

export function resolveBioTheme(data: BioThemeInput): ResolvedBioTheme {
	const scheme = COLOR_SCHEMES[data.color_scheme ?? ""] ?? COLOR_SCHEMES.violet;

	const light = { ...scheme.light };
	const dark = { ...scheme.dark };

	const applyPair = (
		input: string | null | undefined,
		assign: (l: string, d: string) => void,
	) => {
		const [l, d] = singlePair(input);
		if (l && d) assign(l, d);
	};

	applyPair(data.accent_color, (l, d) => {
		light.accent = l;
		dark.accent = d;
		light.onAccent = onAccentColor(l);
		dark.onAccent = onAccentColor(d);
	});
	applyPair(data.bg_color, (l, d) => {
		light.bg = l;
		dark.bg = d;
	});
	applyPair(data.text_color, (l, d) => {
		light.text = l;
		dark.text = d;
	});
	applyPair(data.card_color, (l, d) => {
		light.card = l;
		dark.card = d;
	});

	const vars: Record<string, string> = {
		"--bio-bg": `light-dark(${light.bg}, ${dark.bg})`,
		"--bio-card": `light-dark(${light.card}, ${dark.card})`,
		"--bio-text": `light-dark(${light.text}, ${dark.text})`,
		"--bio-muted": `light-dark(${light.muted}, ${dark.muted})`,
		"--bio-accent": `light-dark(${light.accent}, ${dark.accent})`,
		"--bio-on-accent": `light-dark(${light.onAccent}, ${dark.onAccent})`,
		"--bio-font": FONT_STACKS[data.font ?? "modern"] ?? FONT_STACKS.modern,
		"--bio-radius": RADII[data.corner_radius ?? "rounded"] ?? RADII.rounded,
		"--bio-avatar-radius": AVATAR_RADII[data.avatar_shape ?? "circle"] ?? AVATAR_RADII.circle,
	};

	// Emitted as an inline `style` attribute on <html> so per-page values win
	// over the `:root` defaults in theme.css regardless of stylesheet order.
	const declarations = Object.entries(vars)
		.map(([k, v]) => `${k}: ${v};`)
		.join(" ");

	const mode = data.theme_mode === "light" || data.theme_mode === "dark" ? data.theme_mode : "system";
	const cardStyle = ["soft", "outline", "solid", "glass"].includes(data.card_style ?? "")
		? data.card_style!
		: "soft";
	const bgStyle = ["color", "gradient", "image"].includes(data.bg_style ?? "")
		? data.bg_style!
		: "gradient";

	return {
		style: declarations,
		classes: [
			"bio-page",
			`bio-card-${cardStyle}`,
			`bio-bg-${bgStyle}`,
			`bio-mode-${mode}`,
		],
		allowToggle: mode === "system",
		showBranding: data.footer_branding !== false,
	};
}
