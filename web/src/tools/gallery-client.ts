// gallery-client - Browser entry point for the sprite gallery (web/gallery/index.html). Fetches a
// .dmi via the DMI browser loader (src/dmi/dmi-browser.ts), and renders every state animating in
// all its directions at its real per-frame delays, with a text line of dirs/frames/delay/loop/
// rewind/movement under each state.
//
// Loaded as a plain ES module <script> by index.html (compiled JS only, no bundler): see
// gallery-server.ts for how it's served.

import { type Dmi, type DmiState, cellRect } from "../dmi/dmi.js";
import { parseDmiUrl } from "../dmi/dmi-browser.js";

const DIR_LABELS = ["S", "N", "E", "W", "SE", "SW", "NE", "NW"];
const SCALE = 3;

const searchInput = document.getElementById("search") as HTMLInputElement;
const loadButton = document.getElementById("load") as HTMLButtonElement;
const statusEl = document.getElementById("status") as HTMLElement;
const statesEl = document.getElementById("states") as HTMLElement;

async function loadIconList(): Promise<void> {
	const res = await fetch("/api/icons");
	const paths: string[] = await res.json();
	const datalist = document.getElementById("icon-list") as HTMLDataListElement;
	for (const p of paths) {
		const opt = document.createElement("option");
		opt.value = p;
		datalist.appendChild(opt);
	}
	statusEl.textContent = `${paths.length} .dmi files found under icons/. Type a path (autocomplete works) and press Load.`;
}

/** One (frame, duration-in-deciseconds) step per loop of the animation, honoring rewind ping-pong. */
function buildTimeline(state: DmiState): { frame: number; duration: number }[] {
	const delay = state.delay.length ? state.delay : new Array(state.frames).fill(1);
	const steps: { frame: number; duration: number }[] = [];
	for (let f = 0; f < state.frames; f++) steps.push({ frame: f, duration: delay[f] ?? 1 });
	if (state.rewind && state.frames > 2) {
		for (let f = state.frames - 2; f > 0; f--) steps.push({ frame: f, duration: delay[f] ?? 1 });
	}
	return steps;
}

interface AnimCanvas {
	ctx: CanvasRenderingContext2D;
	cells: number[]; // sheet cell index per frame, for this direction
	timeline: { frame: number; duration: number }[];
	totalDs: number;
	loop: number; // 0 = infinite
}

function renderStates(dmi: Dmi, sheet: HTMLImageElement, path: string): AnimCanvas[] {
	statesEl.innerHTML = "";
	const anims: AnimCanvas[] = [];
	for (const state of dmi.states) {
		const section = document.createElement("div");
		section.className = "state";

		const title = document.createElement("div");
		title.className = "state-title";
		title.textContent = state.name === "" ? "(unnamed default state)" : `"${state.name}"`;
		section.appendChild(title);

		const info = document.createElement("div");
		info.className = "state-info";
		const bits = [`dirs=${state.dirs}`, `frames=${state.frames}`];
		if (state.frames > 1) bits.push(`delay=${state.delay.join(",")}`);
		if (state.loop) bits.push(`loop=${state.loop}`);
		if (state.rewind) bits.push("rewind");
		if (state.movement) bits.push("movement");
		if (state.hotspot) bits.push(`hotspot=${state.hotspot.x},${state.hotspot.y},${state.hotspot.frame}`);
		info.textContent = bits.join("  ");
		section.appendChild(info);

		const row = document.createElement("div");
		row.className = "dir-row";
		const timeline = buildTimeline(state);
		const totalDs = timeline.reduce((s, t) => s + t.duration, 0);
		for (let d = 0; d < state.dirs; d++) {
			const cellW = dmi.width, cellH = dmi.height;
			const wrap = document.createElement("div");
			wrap.className = "dir-cell";
			const canvas = document.createElement("canvas");
			canvas.width = cellW * SCALE;
			canvas.height = cellH * SCALE;
			const ctx = canvas.getContext("2d")!;
			ctx.imageSmoothingEnabled = false;
			wrap.appendChild(canvas);
			const label = document.createElement("div");
			label.className = "dir-label";
			label.textContent = DIR_LABELS[d] ?? "?";
			wrap.appendChild(label);
			row.appendChild(wrap);
			anims.push({ ctx, cells: state.cells[d], timeline, totalDs, loop: state.loop });
		}
		section.appendChild(row);
		statesEl.appendChild(section);
	}
	statusEl.textContent = `${path}: ${dmi.imageWidth}x${dmi.imageHeight} sheet, ${dmi.width}x${dmi.height} icons, ${dmi.states.length} states.`;

	const draw = (canvas: AnimCanvas, cellIndex: number) => {
		const rect = cellRect(dmi, cellIndex);
		canvas.ctx.clearRect(0, 0, canvas.ctx.canvas.width, canvas.ctx.canvas.height);
		canvas.ctx.drawImage(sheet, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w * SCALE, rect.h * SCALE);
	};

	const start = performance.now();
	function tick() {
		const elapsedDs = (performance.now() - start) / 100;
		for (const a of anims) {
			if (a.timeline.length <= 1) {
				draw(a, a.cells[a.timeline[0]?.frame ?? 0]);
				continue;
			}
			let posDs = elapsedDs;
			if (a.loop > 0) {
				const played = Math.floor(elapsedDs / a.totalDs);
				if (played >= a.loop) {
					draw(a, a.cells[a.timeline[a.timeline.length - 1].frame]);
					continue;
				}
			}
			posDs = posDs % a.totalDs;
			let frame = a.timeline[0].frame;
			for (const step of a.timeline) {
				if (posDs < step.duration) {
					frame = step.frame;
					break;
				}
				posDs -= step.duration;
			}
			draw(a, a.cells[frame]);
		}
		requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);
	return anims;
}

async function load(): Promise<void> {
	const path = searchInput.value.trim();
	if (!path) return;
	statusEl.textContent = `Loading ${path}...`;
	try {
		const dmi = await parseDmiUrl("/" + path);
		if (!dmi) {
			statusEl.textContent = `${path}: not a readable PNG/.dmi`;
			return;
		}
		const img = new Image();
		img.src = "/" + path;
		await img.decode();
		renderStates(dmi, img, path);
	} catch (err) {
		statusEl.textContent = `Error loading ${path}: ${(err as Error).message}`;
	}
}

loadButton.addEventListener("click", () => void load());
searchInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") void load();
});

void loadIconList();
