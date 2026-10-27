// lobby-art - The lobby picture: one of the animated SS13.LIVE designs, picked at random each page load, drawn on a canvas over the map view
// while the player is in the lobby (plans/lobby-art.md). Each design is one file in designs/: {name, desc, draw(ctx, t)} on a 480x480 canvas,
// t in seconds. Sprites are cut from the game's own icons/ (plans/lobby-art/dmi.py), one PNG per strip in img/ (32 px frames side by side),
// fetched the first time the lobby shows. Shared drawing helpers are in helpers.js.
import { SPRITES, IMG, W } from "./helpers.js";
import crew from "./designs/2-the-crew.js";
import corridorCam from "./designs/2b-corridor-cam.js";
import lineUp from "./designs/2c-line-up.js";
import redAlert from "./designs/3-red-alert.js";
import corridorRun from "./designs/3a-corridor-run.js";
import aiTerminal from "./designs/5-ai-terminal.js";
import malfunction from "./designs/5a-malfunction.js";

// all text on the lobby canvas: bold DejaVu Sans Mono with hard pixel edges (no blur), same look as the logo. Patched on the one context only.
function crispText(ctx) {
	const raw = CanvasRenderingContext2D.prototype.fillText, cache = new Map();
	ctx.fillText = function (s, x, y) {
		if (typeof this.fillStyle !== "string") return raw.apply(this, arguments);
		const size = Math.round(parseFloat((this.font.match(/([\d.]+)px/) || [0, 12])[1])); s = String(s);
		const key = s + "|" + size + "|" + this.fillStyle + "|" + this.textBaseline; let o = cache.get(key);
		if (!o) {
			o = document.createElement("canvas"); const g = o.getContext("2d"), f = `bold ${size}px "DejaVu Sans Mono",monospace`;
			g.font = f; const w = Math.ceil(g.measureText(s).width) + 4; o.width = w; o.height = size * 3; g.font = f; g.textBaseline = this.textBaseline; g.fillStyle = "#fff"; g.fillText(s, 2, Math.round(size * 1.5));
			const d = g.getImageData(0, 0, o.width, o.height); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0; g.putImageData(d, 0, 0);
			g.globalCompositeOperation = "source-in"; g.fillStyle = this.fillStyle; g.fillRect(0, 0, o.width, o.height); o.tw = w - 4;
			if (cache.size > 3000) cache.clear(); cache.set(key, o);
		}
		const al = this.textAlign, dx = al === "center" ? -o.tw / 2 : (al === "right" || al === "end") ? -o.tw : 0;
		const sm = this.imageSmoothingEnabled; this.imageSmoothingEnabled = false; this.drawImage(o, Math.round(x + dx - 2), Math.round(y - size * 1.5)); this.imageSmoothingEnabled = sm;
	};
}


const designs = [crew, corridorCam, lineUp, redAlert, corridorRun, aiTerminal, malfunction];
designs.sort((a,b)=>a.name<b.name?-1:1);
export const DESIGNS = designs;

let loading = null;
/** fetch every sprite once; resolves when all are decoded */
export function loadLobbyArt(base = new URL("img/", import.meta.url)) {
	return loading ??= Promise.all(SPRITES.map((k) => { const i = new Image(); i.src = new URL(k + ".png", base).href; IMG[k] = i; return i.decode(); }));
}

/** The overlay over `host` (the map window). show(true) in the lobby; show(false) once the player has a body or observes: the canvas fades
 *  out over FADE_MS (tg's join splash fade, /obj/screen/splash Fade: 3 s), then goes and the animation stops. One design per page load
 *  (Math.random, not the game's RNG); `pick` (a design name prefix) is for tests. */
export const FADE_MS = 3000;
export function createLobbyArt(host, pick) {
	const d = (pick && designs.find((x) => x.name.startsWith(pick))) || designs[Math.floor(Math.random() * designs.length)];
	let cv = null, raf = 0, t0 = 0, on = false, fading = 0;
	const frame = () => {
		raf = requestAnimationFrame(frame);
		const c = cv.getContext("2d"); c.imageSmoothingEnabled = false; c.save(); d.draw(c, (performance.now() - t0) / 1000); c.restore();
	};
	const drop = () => { clearTimeout(fading); fading = 0; cancelAnimationFrame(raf); raf = 0; cv?.remove(); cv = null; };
	return {
		design: d.name,
		menuY: d.menuY ?? 176, // where the lobby menu (lobby-menu.js) sits on this picture, in its 480 px: below a logo or countdown in the middle
		get shown() { return !!cv; },
		get wanted() { return on; },
		show(want) {
			if (want === on) return;
			on = want;
			if (!want) {
				if (!cv) return;
				cv.style.transition = `opacity ${FADE_MS}ms linear`; cv.style.opacity = "0";
				fading = setTimeout(drop, FADE_MS);
				return;
			}
			if (fading) drop(); // back in the lobby mid-fade: start over
			loadLobbyArt().then(() => {
				if (!on || cv) return;
				cv = document.createElement("canvas"); cv.width = cv.height = W; cv.className = "lobby-art";
				crispText(cv.getContext("2d"));
				host.append(cv); t0 = performance.now(); frame();
			}, () => {}); // sprites didn't load: tg's own lobby picture stays
		},
	};
}
