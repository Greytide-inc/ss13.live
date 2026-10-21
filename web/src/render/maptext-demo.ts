// maptext-demo - web/draw/index.html?scene=maptext-demo. A small standalone page with a
// handful of hand-made maptext examples, drawn with the exact production call (drawMaptext, wired
// into station-client.ts's drawLayer/drawAppearance and used live by client-scene.ts), the same
// "make a page that's guaranteed to show something" pattern anim-demo used for
// animation. No JSON dump involved -- every example here is a plain string, several lifted straight
// from real tg source (see each label) to compare this page's rendering against the real
// DM string that produces it.

import { drawMaptext, maptextBoxRect } from "./maptext.js";

const status = document.getElementById("status")!;
function setStatus(msg: string): void {
	status.textContent = msg;
}

interface Demo {
	label: string;
	note: string;
	maptext: string;
	maptextWidth: number;
	maptextHeight: number;
	maptextX: number;
	maptextY: number;
}

const DEMOS: Demo[] = [
	{
		label: "plain text",
		note: "no tags at all",
		maptext: "Hello",
		maptextWidth: 32, maptextHeight: 32, maptextX: 0, maptextY: 0,
	},
	{
		label: "<br> line break",
		note: "two explicit lines",
		maptext: "Line one<br>Line two",
		maptextWidth: 64, maptextHeight: 32, maptextX: 0, maptextY: 0,
	},
	{
		label: "<font color> (real tg: blob health, blob_mobs.dm:255, div align+valign)",
		note: "div align=center valign=middle apply (BYOND 511 screenshot, 2p); position:relative is ignored; inner <font color> works",
		maptext: "<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#e36600'>75%</font></div>",
		maptextWidth: 32, maptextHeight: 32, maptextX: 0, maptextY: 0,
	},
	{
		label: "<span style=\"color;font-size\">",
		note: "bigger red text via span style",
		maptext: "<span style=\"color:#ff4444;font-size:12px\">BIG</span>",
		maptextWidth: 40, maptextHeight: 20, maptextX: 0, maptextY: 0,
	},
	{
		label: "<b>bold</b> + plain",
		note: "bold run followed by a normal run",
		maptext: "<b>Bold</b> normal",
		maptextWidth: 64, maptextHeight: 16, maptextX: 0, maptextY: 0,
	},
	{
		label: "text-align: center",
		note: "whole box centered: BYOND uses the alignment in effect at the first character (2p screenshot)",
		maptext: "<span style=\"text-align:center\">mid</span>",
		maptextWidth: 32, maptextHeight: 16, maptextX: 0, maptextY: 0,
	},
	{
		label: "text-align: right",
		note: "whole box right-aligned",
		maptext: "<span style=\"text-align:right\">R</span>",
		maptextWidth: 32, maptextHeight: 16, maptextX: 0, maptextY: 0,
	},
	{
		label: "maptext_x/maptext_y offset (real tg: GPS coords, gps.dm:198)",
		note: "box shifted right 8px and up 10px from the tile's bottom-left (y-up, like pixel_x/y)",
		maptext: "128,64,2",
		maptextWidth: 48, maptextHeight: 16, maptextX: 8, maptextY: 10,
	},
	{
		label: "unsupported tag only (real tg: explosion marker, explosion.dm:356)",
		note: "no supported tags at all -- shown as its own plain text",
		maptext: "Heavy",
		maptextWidth: 32, maptextHeight: 16, maptextX: 0, maptextY: 0,
	},
	{
		label: "word wrap (2o)",
		note: "long text wraps at word boundaries inside maptext_width=32; box is tall enough for all lines -- should sit flush with the box's BOTTOM edge (see maptext.ts header)",
		maptext: "The quick brown fox jumps",
		maptextWidth: 32, maptextHeight: 32, maptextX: 0, maptextY: 0,
	},
	{
		label: "word wrap + overflow, bottom-anchored (2o)",
		note: "same text but the box is too short for every wrapped line -- the EARLIEST lines should clip off the top; the last line(s) stay flush with the bottom",
		maptext: "The quick brown fox jumps over",
		maptextWidth: 32, maptextHeight: 16, maptextX: 0, maptextY: 0,
	},
	{
		label: "force-split a too-long word (2o)",
		note: "one unbroken word wider than maptext_width=24 -- breaks mid-word where it overflows, per OpenDream's WordWrap",
		maptext: "Supercalifragilisticexpialidocious",
		maptextWidth: 24, maptextHeight: 32, maptextX: 0, maptextY: 0,
	},
];

const TILE_PX = 32;
const SCALE = 4;

export async function main(): Promise<void> {
	// Reuses anim-demo's host div/CSS (grid of labelled cells) -- see draw-client.ts's routing,
	// which adds the "anim-demo-mode" body class for this scene too.
	const host = document.getElementById("anim-demo-host")!;
	host.innerHTML = "";

	for (const demo of DEMOS) {
		const wrap = document.createElement("div");
		wrap.className = "anim-demo-cell";
		const title = document.createElement("div");
		title.textContent = demo.label;
		title.className = "anim-demo-title";
		const note = document.createElement("div");
		note.textContent = demo.note;
		note.className = "anim-demo-note";
		const raw = document.createElement("div");
		raw.textContent = demo.maptext;
		raw.className = "anim-demo-note";
		raw.style.wordBreak = "break-all";

		const canvasSize = TILE_PX * SCALE;
		const canvas = document.createElement("canvas");
		canvas.width = canvasSize;
		canvas.height = canvasSize;
		canvas.className = "anim-demo-canvas";
		wrap.appendChild(title);
		wrap.appendChild(canvas);
		wrap.appendChild(note);
		wrap.appendChild(raw);
		host.appendChild(wrap);

		const ctx = canvas.getContext("2d")!;
		ctx.imageSmoothingEnabled = false;
		// A checkerboard tile background, and a marker outline for the atom's 32x32 tile footprint
		// and the maptext box itself, so the box's anchoring (bottom-left + maptext_x/y) is visible.
		ctx.scale(SCALE, SCALE);
		for (let by = 0; by < TILE_PX; by += 8) {
			for (let bx = 0; bx < TILE_PX; bx += 8) {
				const light = ((bx / 8 + by / 8) % 2) === 0;
				ctx.fillStyle = light ? "#333" : "#2a2a2a";
				ctx.fillRect(bx, by, 8, 8);
			}
		}
		ctx.strokeStyle = "#555";
		ctx.lineWidth = 1 / SCALE;
		ctx.strokeRect(0, 0, TILE_PX, TILE_PX);

		const box = maptextBoxRect(demo, 0, 0, TILE_PX);
		ctx.strokeStyle = "#4a4";
		ctx.strokeRect(box.x + 0.5 / SCALE, box.y + 0.5 / SCALE, box.w, box.h);

		drawMaptext(ctx, demo, 0, 0, TILE_PX);
	}

	setStatus(`drew ${DEMOS.length} hand-made maptext example(s). Grey checkerboard = the atom's 32x32 tile; green outline = the maptext box (maptext_width x maptext_height, anchored at the tile's bottom-left plus maptext_x/maptext_y).`);
}
