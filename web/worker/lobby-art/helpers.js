// lobby-art/helpers - What the lobby pictures share: the sprite list (img/), the starfield, the logo text, floor tiles, scanlines and
// dark edges, and placing a crew sprite by its feet.

export const W = 480; // every picture is W x W pixels

// The lobby menu (lobby-menu.js) is always drawn over this box of every picture, in the same place; it never moves. The rule for every
// picture, old and new: inside the box stays dark and still (stars, empty space, a dark window or screen), so the menu reads clearly.
// Work the picture's idea around it. The box fits the longest menu (mid-round, with the map name line); tests/static/lobby-art.test.mjs checks it.
export const MENU_ZONE = { x: 22, y: 176, w: 296, h: 168 };
export const LOGO = "SS13.LIVE";
export const TAGLINE = "Space Station 13 in your browser";

// the sprites in img/, each a strip of 32 px frames side by side; most have one frame
const ANIMATED = { ai: 15, aimalf: 15, alert_light: 8 };
export const SPRITES = [
	"ai", "aimalf", "floor", "dark", "station",
	"crew_clown_s", "crew_clown_e", "crew_nt_s", "crew_nt_w", "crew_syndi_s", "crew_syndi_w", "crew_wizard_s", "crew_wizard_e",
	"crew_pirate_s", "crew_skel_s", "crew_secbot_s", "crew_secbot_w", "crew_ian_s", "crew_ian_e", "crew_cat_w", "crew_monkey_e",
	"crew_borg_w", "crew_drone_w", "crew_secborg_e",
	"alert_wall", "alert_fdoor", "alert_light", "alert_clownE", "alert_ntE", "alert_wizE", "alert_syndiE", "alert_ianE",
];
export const IMG = {}; // sprite name -> loaded image (index.js fills it)

/** draw frame `frame` of sprite `name` at x, y, `scale` times its 32 px size; the frame number wraps round */
export function spr(c, name, x, y, scale = 1, frame = 0) {
	const frames = ANIMATED[name] ?? 1;
	c.drawImage(IMG[name], 32 * (frame % frames), 0, 32, 32, Math.round(x), Math.round(y), 32 * scale, 32 * scale);
}

/** fill the canvas from x0, y0 down to y1 with a sprite as tiles */
export function tiles(c, name, x0, y0, y1 = W, scale = 1) {
	for (let x = x0; x < W; x += 32 * scale) {
		for (let y = y0; y < y1; y += 32 * scale) spr(c, name, x, y, scale);
	}
}

/** a repeatable random number generator: the same seed gives the same numbers, between 0 and 1 */
export function rng(seed) {
	return () => {
		seed = (seed * 16807) % 2147483647;
		return seed / 2147483647;
	};
}

// 260 stars at fixed places; z is depth (near stars are brighter, bigger and faster), tw the twinkle phase
const random = rng(7);
const STARS = Array.from({ length: 260 }, () => ({ x: random() * W, y: random() * W, z: random(), tw: random() * 6 }));

/** black sky with the stars drifting in direction dx, dy and twinkling */
export function starfield(c, t, speed = 6, dx = -1, dy = 0) {
	c.fillStyle = "#000";
	c.fillRect(0, 0, W, W);
	for (const s of STARS) {
		const sp = speed * (0.15 + s.z);
		const x = ((s.x + dx * t * sp) % W + W) % W;
		const y = ((s.y + dy * t * sp) % W + W) % W;
		const alpha = 0.35 + 0.65 * s.z * (0.7 + 0.3 * Math.sin(t * 2 + s.tw));
		c.fillStyle = `rgba(${200 + 55 * s.z | 0},${210 + 45 * s.z | 0},255,${alpha})`;
		const size = s.z > 0.93 ? 2 : 1;
		c.fillRect(x | 0, y | 0, size, size);
	}
}

/** a dark line every 3 px down the whole picture, like an old screen */
export function scanlines(c, alpha) {
	c.fillStyle = `rgba(0,0,0,${alpha})`;
	for (let y = 0; y < W; y += 3) c.fillRect(0, y, W, 1);
}

/** darken the edges: clear inside radius `inner` from the centre, `alpha` black at radius `outer` */
export function vignette(c, inner, outer, alpha) {
	const g = c.createRadialGradient(W / 2, W / 2, inner, W / 2, W / 2, outer);
	g.addColorStop(0, "rgba(0,0,0,0)");
	g.addColorStop(1, `rgba(0,0,0,${alpha})`);
	c.fillStyle = g;
	c.fillRect(0, 0, W, W);
}

// text drawn once in white with hard pixel edges (no blur), then tinted per colour; both kept for reuse
const whiteText = {}, tintedText = {};
function textCanvas(text, px, colour) {
	let white = whiteText[text + px];
	if (!white) {
		white = whiteText[text + px] = document.createElement("canvas");
		const g = white.getContext("2d"), font = `bold ${px}px "DejaVu Sans Mono",monospace`;
		g.font = font;
		white.width = Math.ceil(g.measureText(text).width) + 2;
		white.height = px + 4;
		g.font = font; // resizing the canvas reset it
		g.fillStyle = "#fff";
		g.textBaseline = "top";
		g.fillText(text, 1, 1);
		const d = g.getImageData(0, 0, white.width, white.height);
		for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0;
		g.putImageData(d, 0, 0);
	}
	const key = text + "|" + px + "|" + colour;
	let tinted = tintedText[key];
	if (!tinted) {
		tinted = tintedText[key] = document.createElement("canvas");
		tinted.width = white.width;
		tinted.height = white.height;
		const g = tinted.getContext("2d");
		g.drawImage(white, 0, 0);
		g.globalCompositeOperation = "source-in";
		g.fillStyle = colour;
		g.fillRect(0, 0, white.width, white.height);
	}
	return tinted;
}

/** big pixel text (the logo), font size `px` scaled up `scale` times, centred on cx with its top at y; `glow` is an optional glow colour */
export function pixText(c, text, cx, y, px, scale, colour, glow) {
	const o = textCanvas(text, px, colour);
	const w = o.width * scale, h = o.height * scale, x = Math.round(cx - w / 2);
	c.save();
	c.imageSmoothingEnabled = false;
	if (glow) {
		c.shadowColor = glow;
		c.shadowBlur = 14;
	}
	c.drawImage(o, x, y, w, h);
	if (glow) c.drawImage(o, x, y, w, h); // twice: a stronger glow
	c.restore();
}

/** a line of plain text (the tagline, labels) */
export function smallText(c, text, x, y, colour, align = "center", size = 12) {
	c.font = `${size}px "DejaVu Sans Mono",monospace`;
	c.textAlign = align;
	c.fillStyle = colour;
	c.fillText(text, x, y);
	c.textAlign = "left";
}

// how far up from the bottom of its 32 px sprite each crew member's feet are, where it isn't the bottom edge
const FEET_AT = { monkey: 24, secbot: 29 };

/** draw a crew sprite (like 'crew_ian_e') centred on cx with its feet on feetY, `hover` px up, with a shadow under it */
export function crwPut(c, name, cx, feetY, scale, frame = 0, shadow = true, hover = 0) {
	const who = name.replace(/^crew_/, "").replace(/_[sew]$/, "");
	if (shadow) {
		c.fillStyle = "rgba(0,0,0,.28)";
		c.beginPath();
		c.ellipse(Math.round(cx), Math.round(feetY), 11 * scale, 2.2 * scale, 0, 0, 7);
		c.fill();
	}
	spr(c, name, Math.round(cx) - 16 * scale, Math.round(feetY - (FEET_AT[who] || 32) * scale - hover), scale, frame);
}

/** the logo centred at the top (its top at y) and the tagline under it at tagY */
export function crwLogo(c, y, colour, glow, tagY, tagColour) {
	pixText(c, LOGO, W / 2, y, 16, 4, colour, glow);
	smallText(c, TAGLINE, W / 2, tagY, tagColour);
}
