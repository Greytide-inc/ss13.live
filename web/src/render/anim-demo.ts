// anim-demo - web/draw/index.html?scene=anim-demo. A small standalone page that proves
// out multi-frame icon_state animation (src/dmi/animation.ts's frameAtTime, wired into
// station-client.ts's drawLayer/drawAppearance and used live by client-scene.ts) against real .dmi
// files, independent of whatever happens to be in the current station/client JSON dumps.
//
// Why this page exists: as of this chunk, web/build/2g/station.json (idle round-start snapshot) and
// web/build/2i/client.json (a lobby ghost) both happen to contain ZERO multi-frame icon_states --
// checked directly (every icon referenced by either dump was loaded and scanned for any state with
// frames>1: none). Animated icon_states in tg mostly show up only once something is actively running
// (a processing protolathe, a walking mob, fire, gibbing) which neither snapshot captures. So the
// real client scene (?scene=client) has the animation code path wired in and correct (proven by the
// pure frameAtTime tests in tests/dmi/animation.test.ts) but nothing on it will actually be seen to
// move until a future dump captures something mid-animation. This page instead animates a couple of
// real, checked-in .dmi files directly, using the exact same production draw calls
// (loadIcon/drawLayer from station-client.ts), so there's something to look at by eye right now.
import type { Appearance } from "../appearance/appearance.js";
import { loadIcon, drawLayer, TILE_PX, type LoadedIcon } from "./station-client.js";
import { findState } from "./sprite-lookup.js";

const status = document.getElementById("status")!;
function setStatus(msg: string): void {
	status.textContent = msg;
}

interface Demo {
	label: string;
	icon: string;
	iconState: string;
	dir: number;
	note: string;
	/** Demo-only override of the state's parsed `loop` (none of the checked-in files happen to have
	 *  loop>0, since nothing in the current dumps sets it).
	 * Lets this page still show the loop>0 "starts fresh per object" behaviour. */
	loopOverride?: number;
	/** If set, this cell stays blank until this many deciseconds after page load, then starts its own
	 *  clock at frame 0 -- standing in for "when the object appears" (client-scene.ts/a live
	 *  renderer would set this from an atom's own first-shown moment instead of a fixed delay). */
	appearAfterDs?: number;
}

// Both are real, checked-in files (icons/mob/animal.dmi is the same file the dmi tests use
// for its "carp" example -- dirs=4, frames=3, delay=[3,4,3], rewind=true; icons/obj/machines/
// research.dmi's "protolathe_glass" is a real multi-frame overlay state, frames>1, no rewind/loop
// (i.e. loops forever), used here as the plain-loop counterpart to carp's rewind).
const DEMOS: Demo[] = [
	{
		label: "carp (icons/mob/animal.dmi)",
		icon: "icons/mob/animal.dmi",
		iconState: "carp",
		dir: 2, // SOUTH
		note: "dirs=4 frames=3 delay=[3,4,3] rewind=true -- forward 0,1,2 then back to 1, repeating forever (loop=0)",
	},
	{
		label: "protolathe_glass (icons/obj/machines/research.dmi)",
		icon: "icons/obj/machines/research.dmi",
		iconState: "protolathe_glass",
		dir: 2,
		note: "a real multi-frame overlay state (used when a protolathe is actively processing), no rewind -- plain forward loop",
	},
	{
		label: "carp, loop=2, appears 3s late (icons/mob/animal.dmi)",
		icon: "icons/mob/animal.dmi",
		iconState: "carp",
		dir: 2,
		loopOverride: 2,
		appearAfterDs: 30,
		note: "same sprite as the first cell, but with loop overridden to 2 and drawn blank for its first " +
			"3s. When it appears it starts fresh at frame 0 on its OWN clock -- watch it be out of step " +
			"with the always-running loop=0 carp above, then play 0,1,2,1 twice and freeze on frame " +
			"0 (rewind+loop stop rule), while the loop=0 carp keeps going forever.",
	},
];

function makeAppearance(icon: string, iconState: string, dir: number): Appearance {
	return {
		icon,
		iconState,
		dir,
		layer: 0,
		plane: 0,
		color: null,
		alpha: 255,
		transform: null,
		pixelX: 0,
		pixelY: 0,
		invisibility: 0,
		blendMode: 0,
		maptext: null,
		maptextWidth: 32,
		maptextHeight: 32,
		maptextX: 0,
		maptextY: 0,
	};
}

export async function main(): Promise<void> {
	setStatus(`loading ${DEMOS.length} demo .dmi files...`);
	const host = document.getElementById("anim-demo-host")!;
	host.innerHTML = "";

	const startMs = performance.now(); // shared clock (page load, loosely -- see tick() below)
	const scale = 6;
	// `appearAtDs` is null until the cell actually appears (page load for a plain demo, or
	// `appearAfterDs` deciseconds later); `objectStartMs` is set the moment it does, and is this
	// cell's own clock start for loop>0 states (animationElapsed picks it over the shared page-load
	// clock -- see src/dmi/animation.ts).
	const cells: {
		ctx: CanvasRenderingContext2D;
		icon: LoadedIcon;
		a: Appearance;
		appearAfterDs: number;
		objectStartMs: number | null;
	}[] = [];
	for (const demo of DEMOS) {
		const wrap = document.createElement("div");
		wrap.className = "anim-demo-cell";
		const title = document.createElement("div");
		title.textContent = demo.label;
		title.className = "anim-demo-title";
		const note = document.createElement("div");
		note.textContent = demo.note;
		note.className = "anim-demo-note";
		const canvas = document.createElement("canvas");
		canvas.width = TILE_PX * scale;
		canvas.height = TILE_PX * scale;
		canvas.className = "anim-demo-canvas";
		wrap.appendChild(title);
		wrap.appendChild(canvas);
		wrap.appendChild(note);
		host.appendChild(wrap);

		const loaded = await loadIcon(demo.icon);
		if (!loaded) {
			note.textContent += " -- FAILED TO LOAD";
			continue;
		}
		if (demo.loopOverride != null) {
			const state = findState(loaded.dmi, demo.iconState);
			if (state) state.loop = demo.loopOverride;
		}
		const ctx = canvas.getContext("2d")!;
		ctx.imageSmoothingEnabled = false;
		ctx.scale(scale, scale);
		cells.push({
			ctx,
			icon: loaded,
			a: makeAppearance(demo.icon, demo.iconState, demo.dir),
			appearAfterDs: demo.appearAfterDs ?? 0,
			objectStartMs: demo.appearAfterDs ? null : startMs, // no delay: appears with everything else
		});
	}

	setStatus(`animating ${cells.length}/${DEMOS.length} demo sprites, from page load. See the note under each for what it should do.`);

	function tick(nowMs: number): void {
		const frameTime = (nowMs - startMs) / 100; // shared clock, deciseconds since page load
		for (const cell of cells) {
			cell.ctx.clearRect(0, 0, TILE_PX, TILE_PX);
			if (cell.objectStartMs == null) {
				// Not appeared yet -- stays blank, same as an atom that hasn't spawned.
				if (nowMs - startMs >= cell.appearAfterDs * 100) cell.objectStartMs = nowMs;
				else continue;
			}
			const objectFrameTime = (nowMs - cell.objectStartMs) / 100; // this cell's own clock, from when it appeared
			const icons = new Map([[cell.a.icon!, cell.icon]]);
			drawLayer(cell.ctx, cell.a, icons, 0, 0, frameTime, objectFrameTime);
		}
		requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);
}
