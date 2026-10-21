// draw-client - Browser entry for the drawing page (web/draw/index.html). Loads
// web/build/2c/appearances.json (written by `npm run appearance-dump`), loads every referenced
// .dmi with the browser DMI loader (src/dmi/dmi-browser.ts), and draws with PixiJS:
//  - a labelled grid of the single atoms, at 2x scale, crisp (nearest-neighbour) pixels;
//  - the 5x5 scene, each tile's atoms drawn in (plane, layer) order (appearance-dump.ts already
//    sorted each tile's list, so this file just draws in the order given).
//
// Only the first animation frame is drawn (cells[dirIndex][0]) -- no animation timeline here yet,
// that's the gallery's job (src/tools/gallery-client.ts) for now.
//
// ?scene=station routes to station-client.ts instead -- the whole Box Station view, a
// separate plain-canvas renderer (not PixiJS: see that file's header for why). ?scene=client
// routes to client-scene.ts -- the connected player's own view (map window + HUD). See
// the bottom of this file for the routing switch.
//
// No bundler: pixi.js is loaded via the page's <script type="importmap"> pointing at
// node_modules/pixi.js/dist/pixi.mjs, and this file is compiled by the project's plain `tsc -p .`
// (module: NodeNext) -- a bare `import ... from "pixi.js"` is left as-is in the emitted JS, which
// only works because the browser resolves it through that import map, not through Node.

import * as PIXI from "pixi.js";
import { cellRect, dirIndex, type Dmi } from "../dmi/dmi.js";
import { parseDmiUrl } from "../dmi/dmi-browser.js";
import type { Appearance, BuiltAppearance } from "../appearance/appearance.js";
import { findState } from "./sprite-lookup.js";
import { byondMatrixToCanvas } from "./byond-transform.js";

interface AtomEntry {
	id: string;
	label: string;
	appearance: BuiltAppearance;
}
interface SceneTile {
	x: number;
	y: number;
	appearances: BuiltAppearance[];
}
interface Dump {
	builtAt: string;
	atoms: AtomEntry[];
	scene: { width: number; height: number; tiles: SceneTile[] };
}

const status = document.getElementById("status")!;

function setStatus(msg: string): void {
	status.textContent = msg;
}

/** One loaded icon sheet: its parsed metadata plus a Pixi texture source wrapping the raw image. */
interface LoadedIcon {
	dmi: Dmi;
	source: PIXI.TextureSource;
}

async function loadIcon(iconPath: string): Promise<LoadedIcon | null> {
	const url = "/" + iconPath;
	const dmi = await parseDmiUrl(url);
	if (!dmi) return null;
	const img = new Image();
	img.src = url;
	await img.decode();
	const texture = PIXI.Texture.from(img);
	texture.source.scaleMode = "nearest"; // crisp pixels, no smoothing, at any zoom
	return { dmi, source: texture.source };
}

function collectIcons(dump: Dump): Set<string> {
	const icons = new Set<string>();
	const add = (a: Appearance) => {
		if (a.icon) icons.add(a.icon);
	};
	for (const a of dump.atoms) {
		add(a.appearance);
		for (const o of a.appearance.overlays) add(o);
	}
	for (const t of dump.scene.tiles) {
		for (const a of t.appearances) {
			add(a);
			for (const o of a.overlays) add(o);
		}
	}
	return icons;
}

/** Builds a Pixi sprite for one drawable layer (an atom's own appearance, or a flattened overlay).
 *  Returns null if its icon didn't load (missing file, etc). Draws only the first animation frame. */
function spriteFor(a: Appearance, icons: Map<string, LoadedIcon>): PIXI.Sprite | null {
	if (!a.icon) return null;
	const loaded = icons.get(a.icon);
	if (!loaded) return null;
	const state = findState(loaded.dmi, a.iconState);
	if (!state) return null;
	const di = dirIndex(state.dirs, a.dir);
	const cell = state.cells[di]?.[0] ?? state.cells[0][0];
	const rect = cellRect(loaded.dmi, cell);
	const texture = new PIXI.Texture({
		source: loaded.source,
		frame: new PIXI.Rectangle(rect.x, rect.y, rect.w, rect.h),
	});
	const sprite = new PIXI.Sprite(texture);
	// BYOND pixel_x/pixel_y are in BYOND's y-up world space; Pixi's y grows downward, so pixel_y
	// flips sign. icon anchored at its bottom-left in BYOND (a 32x32 icon's origin is its own
	// bottom-left corner on the tile); Pixi sprites anchor top-left by default, so shift up by the
	// icon's own height once, then apply pixel offsets on top.
	const topLeftX = a.pixelX;
	const topLeftY = -a.pixelY - (rect.h - 32); // a >32px icon (e.g. the 96x96 tree) extends
	// upward/leftward from its 32x32 tile footprint, matching BYOND's bottom-left anchoring.
	if (a.transform) {
		// Re-anchor to the icon's own centre and apply the BYOND matrix (converted to Pixi/canvas's
		// y-down, x'=a*x+c*y+e convention -- see byond-transform.ts) as a full local transform: the
		// icon's centre itself translates by the matrix's own e,f on top of the normal pixel-offset
		// centre, matching BYOND's "transform applied around the icon's centre" rule (see
		// byond-transform.ts's header for the derivation and worked examples).
		sprite.anchor.set(0.5, 0.5);
		const cx = topLeftX + rect.w / 2;
		const cy = topLeftY + rect.h / 2;
		const [ca, cb, cc, cd, ce, cf] = byondMatrixToCanvas(a.transform);
		sprite.setFromMatrix(new PIXI.Matrix(ca, cb, cc, cd, cx + ce, cy + cf));
	} else {
		sprite.x = topLeftX;
		sprite.y = topLeftY;
	}
	sprite.alpha = a.alpha / 255;
	if (typeof a.color === "string") {
		try {
			sprite.tint = a.color;
		} catch {
			/* not a valid CSS color (e.g. a BYOND color name Pixi doesn't know) -- leave untinted */
		}
	}
	// a.color as a raw color-matrix (number[]) isn't representable as a simple Pixi tint; left
	// unhandled here (a known gotcha) -- a real renderer would need a color-matrix
	// filter.
	return sprite;
}

/** Draws one atom's full appearance (its own sprite + overlays, in the given (plane,layer) order
 *  the appearance already carries) into a container, all layers anchored at the same tile origin. */
function drawAppearance(a: BuiltAppearance, icons: Map<string, LoadedIcon>): PIXI.Container {
	const c = new PIXI.Container();
	const base = spriteFor(a, icons);
	if (base) c.addChild(base);
	for (const o of a.overlays) {
		const s = spriteFor(o, icons);
		if (!s) continue;
		// Overlay pixel offsets are relative to the parent's (BYOND adds them).
		s.x += a.pixelX;
		s.y -= a.pixelY;
		c.addChild(s);
	}
	return c;
}

function label(text: string, size = 11): PIXI.Text {
	return new PIXI.Text({ text, style: { fontFamily: "monospace", fontSize: size, fill: 0xaaaaaa } });
}

async function main(): Promise<void> {
	setStatus("loading appearances.json...");
	const dump = (await (await fetch("/web/build/2c/appearances.json")).json()) as Dump;

	setStatus(`loading ${collectIcons(dump).size} .dmi files...`);
	const icons = new Map<string, LoadedIcon>();
	for (const path of collectIcons(dump)) {
		const loaded = await loadIcon(path);
		if (loaded) icons.set(path, loaded);
		else console.warn(`failed to load ${path}`);
	}

	setStatus("building scene...");
	const app = new PIXI.Application();
	await app.init({ background: "#1e1e1e", resizeTo: undefined, width: 1200, height: 1600, antialias: false });
	document.getElementById("canvas-host")!.appendChild(app.canvas);

	const SCALE = 2;
	const TILE = 32 * SCALE;
	const root = new PIXI.Container();
	app.stage.addChild(root);

	// ---- atom gallery: a labelled grid, 2x scale ----
	const COLS = 6;
	const CELL_W = TILE + 20;
	const CELL_H = TILE + 34;
	const galleryTitle = label("Single atoms (2x scale)", 15);
	galleryTitle.x = 8;
	galleryTitle.y = 8;
	root.addChild(galleryTitle);

	dump.atoms.forEach((entry, i) => {
		const col = i % COLS;
		const row = Math.floor(i / COLS);
		const cell = new PIXI.Container();
		cell.x = 8 + col * CELL_W;
		cell.y = 34 + row * CELL_H;
		root.addChild(cell);

		// checkerboard background so alpha/transparency is visible
		const bg = new PIXI.Graphics();
		for (let by = 0; by < TILE; by += 8) {
			for (let bx = 0; bx < TILE; bx += 8) {
				const light = ((bx / 8 + by / 8) % 2) === 0;
				bg.rect(bx, by, 8, 8).fill(light ? 0x333333 : 0x2a2a2a);
			}
		}
		cell.addChild(bg);

		const drawable = drawAppearance(entry.appearance, icons);
		drawable.scale.set(SCALE);
		drawable.x = 0;
		drawable.y = 0; // drawAppearance already puts a 32x32 icon's top at the tile's top (bigger icons extend up)
		cell.addChild(drawable);

		const lbl = label(entry.id);
		lbl.x = 0;
		lbl.y = TILE + 4;
		cell.addChild(lbl);
	});

	const galleryRows = Math.ceil(dump.atoms.length / COLS);
	const sceneY = 34 + galleryRows * CELL_H + 24;

	// ---- 5x5 scene ----
	const sceneTitle = label("5x5 scene (floor, wall, door, stacked tile)", 15);
	sceneTitle.x = 8;
	sceneTitle.y = sceneY;
	root.addChild(sceneTitle);

	const sceneContainer = new PIXI.Container();
	sceneContainer.x = 8;
	sceneContainer.y = sceneY + 26;
	root.addChild(sceneContainer);

	for (const tile of dump.scene.tiles) {
		const tx = (tile.x - 1) * TILE;
		// flip y: BYOND y grows upward (row 1 at the bottom), screen y grows downward.
		const ty = (dump.scene.height - tile.y) * TILE;
		for (const a of tile.appearances) {
			const sprite = drawAppearance(a, icons);
			sprite.scale.set(SCALE);
			sprite.x = tx;
			sprite.y = ty; // ty is already this row's top edge on screen
			sceneContainer.addChild(sprite);
		}
	}

	setStatus(`drew ${dump.atoms.length} atoms and ${dump.scene.tiles.length} scene tiles (built ${dump.builtAt}).`);
}

// Routing: ?scene=station shows the whole-station view instead of the atom gallery / 5x5
// scene. A separate entry (station-client.ts, dynamically imported) so the station view -- and its
// whole-station JSON fetch -- never loads unless asked for, and vice versa: this file's own main()
// below never runs in station mode, so it doesn't also fetch the small appearances.json.
const scene = new URLSearchParams(location.search).get("scene");
if (scene === "station") {
	document.body.classList.add("station-mode");
	import("./station-client.js")
		.then((m) => m.main())
		.catch((err) => {
			console.error(err);
			setStatus(`error: ${(err as Error).message}`);
		});
} else if (scene === "client") {
	document.body.classList.add("client-mode");
	import("./client-scene.js")
		.then((m) => m.main())
		.catch((err) => {
			console.error(err);
			setStatus(`error: ${(err as Error).message}`);
		});
} else if (scene === "anim-demo") {
	document.body.classList.add("anim-demo-mode");
	import("./anim-demo.js")
		.then((m) => m.main())
		.catch((err) => {
			console.error(err);
			setStatus(`error: ${(err as Error).message}`);
		});
} else if (scene === "maptext-demo") {
	document.body.classList.add("anim-demo-mode"); // reuses the same grid-of-cells layout/CSS
	import("./maptext-demo.js")
		.then((m) => m.main())
		.catch((err) => {
			console.error(err);
			setStatus(`error: ${(err as Error).message}`);
		});
} else if (scene === "layers-demo") {
	import("./layers-demo.js")
		.then((m) => m.main())
		.catch((err) => {
			console.error(err);
			setStatus(`error: ${(err as Error).message}`);
		});
} else {
	main().catch((err) => {
		console.error(err);
		setStatus(`error: ${(err as Error).message}`);
	});
}
