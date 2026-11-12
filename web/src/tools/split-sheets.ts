// split-sheets - Cuts each sheet in SPLIT_SHEETS (src/render/split-sheets.ts) into one small .dmi per state, under
// OUT/icons/_split/ (the page then loads the one state it draws, not the whole sheet). Each small sheet keeps its
// state's lines of the Description as they were; its cells sit in a near-square grid, so the biggest
// (station_corrupted, 54 frames of 512x512) is 4096x3584, inside the 4096 limit of phone graphics chips.
// Run by tools/build-static.mjs. Usage (from web/): node build/dist/src/tools/split-sheets.js OUT

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { deflateSync, inflateSync } from "node:zlib";
import { repoRoot } from "./repo-root.js";
import { readPngChunks } from "../dmi/dmi.js";
import { decodePng, parseDmiBytes } from "../dmi/dmi-node.js";
import { encodePng } from "../dmi/png.js";
import { SPLIT_SHEETS, sheetFor } from "../render/split-sheets.js";

const out = process.argv[2];
if (!out) throw new Error("usage: split-sheets.js OUT");
let files = 0, bytes = 0;
for (const sheet of SPLIT_SHEETS) {
	const file = readFileSync(join(repoRoot, sheet));
	const dmi = parseDmiBytes(file), png = decodePng(file), z = readPngChunks(file)?.compressedDescription;
	if (!dmi || !png || !z) throw new Error(`${sheet}: not a readable .dmi`);
	const desc = inflateSync(Buffer.from(z)).toString("latin1").split("\n");
	const head = desc.slice(0, desc.findIndex((l) => l.startsWith("state ="))).filter((l) => l !== "# END DMI");
	const starts = desc.flatMap((l, i) => (l.startsWith("state =") ? [i] : []));
	const seen = new Set<string>();
	dmi.states.forEach((st, si) => {
		if (!/^[\w-]+$/.test(st.name) || seen.has(st.name)) throw new Error(`${sheet}: state "${st.name}" is not a plain, unique word (sheetFor can't name it)`);
		seen.add(st.name);
		const lines = desc.slice(starts[si], starts[si + 1] ?? desc.findIndex((l) => l === "# END DMI"));
		const first = Math.min(...st.cells.flat()), n = st.dirs * st.frames;
		const cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols), w = dmi.width, h = dmi.height;
		const rgba = new Uint8Array(cols * w * rows * h * 4);
		for (let c = 0; c < n; c++) {
			const sx = ((first + c) % dmi.columns) * w, sy = Math.floor((first + c) / dmi.columns) * h, dx = (c % cols) * w, dy = Math.floor(c / cols) * h;
			for (let y = 0; y < h; y++) rgba.set(png.rgba.subarray(((sy + y) * png.width + sx) * 4, ((sy + y) * png.width + sx + w) * 4), ((dy + y) * cols * w + dx) * 4);
		}
		const body = encodePng(cols * w, rows * h, rgba, (d) => deflateSync(d), [...head, ...lines, "# END DMI", ""].join("\n"));
		const to = join(out, sheetFor(sheet, st.name));
		mkdirSync(dirname(to), { recursive: true });
		writeFileSync(to, body);
		files++;
		bytes += body.length;
	});
}
console.log(`split-sheets: ${SPLIT_SHEETS.length} sheets cut into ${files} state sheets (${(bytes / 1048576).toFixed(1)} MB) under ${join(out, "icons/_split")}`);
