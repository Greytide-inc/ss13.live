// split-sheets.test - The giant icon sheets cut per state (src/tools/split-sheets.ts) keep every pixel, frame and delay of the
// whole sheet, each cut sheet is inside the 4096 px limit of phone graphics chips, and the page's paths (src/render/split-sheets.ts)
// find them: a look and its overlays move to their state's sheet, a cut path moves to another state's, other sheets stay.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseDmiBytes, decodePng } from "../build/dist/src/dmi/dmi-node.js";
import { cellRect } from "../build/dist/src/dmi/dmi.js";
import { SPLIT_SHEETS, sheetFor, splitLook, isSplit } from "../build/dist/src/render/split-sheets.js";

const out = mkdtempSync(join(tmpdir(), "split-sheets-"));
try {
	const r = spawnSync(process.execPath, ["build/dist/src/tools/split-sheets.js", out], { encoding: "utf8" });
	assert.equal(r.status, 0, r.stderr);
	let n = 0;
	for (const sheet of SPLIT_SHEETS) {
		const f = readFileSync(join("..", sheet)), d = parseDmiBytes(f), p = decodePng(f);
		for (const st of d.states) {
			const g = readFileSync(join(out, sheetFor(sheet, st.name))), d2 = parseDmiBytes(g), p2 = decodePng(g), s2 = d2.states[0];
			assert.equal(d2.states.length, 1, `${sheet} ${st.name}: one state`);
			assert.deepEqual([s2.name, s2.dirs, s2.frames, s2.delay, s2.loop, s2.rewind, s2.hotspot], [st.name, st.dirs, st.frames, st.delay, st.loop, st.rewind, st.hotspot], `${sheet} ${st.name}: timing`);
			assert.ok(d2.imageWidth <= 4096 && d2.imageHeight <= 4096, `${sheet} ${st.name}: ${d2.imageWidth}x${d2.imageHeight}`);
			for (let di = 0; di < st.dirs; di++) for (let fr = 0; fr < st.frames; fr++) {
				const a = cellRect(d, st.cells[di][fr]), b = cellRect(d2, s2.cells[di][fr]);
				for (let y = 0; y < a.h; y++) {
					const ra = p.rgba.subarray(((a.y + y) * p.width + a.x) * 4, ((a.y + y) * p.width + a.x + a.w) * 4);
					const rb = p2.rgba.subarray(((b.y + y) * p2.width + b.x) * 4, ((b.y + y) * p2.width + b.x + b.w) * 4);
					if (Buffer.compare(ra, rb)) assert.fail(`${sheet} ${st.name} dir ${di} frame ${fr} row ${y}: pixels differ`);
				}
			}
			n++;
		}
	}
	assert.equal(n, 44);
} finally {
	rmSync(out, { recursive: true, force: true });
}

const film = "icons/effects/station_explosion.dmi";
assert.equal(sheetFor(film, "intro_nuke"), "icons/_split/effects/station_explosion/intro_nuke.dmi");
assert.equal(sheetFor(sheetFor(film, "intro_nuke"), "summary_cult"), "icons/_split/effects/station_explosion/summary_cult.dmi");
assert.equal(sheetFor(film, "../x"), "icons/_split/effects/station_explosion/-none-.dmi");
assert.equal(sheetFor("icons/obj/tools.dmi", "crowbar"), "icons/obj/tools.dmi");
assert.ok(isSplit(film) && isSplit(sheetFor(film, "x")) && !isSplit("icons/obj/tools.dmi"));
const plain = { icon: "icons/obj/tools.dmi", iconState: "crowbar", overlays: [] };
assert.equal(splitLook(plain), plain);
const look = splitLook({ icon: "icons/obj/tools.dmi", iconState: "", overlays: [{ icon: "icons/mob/screen_full.dmi", iconState: "oxydamageoverlay3" }, plain] });
assert.deepEqual(look.overlays.map((o) => o.icon), ["icons/_split/mob/screen_full/oxydamageoverlay3.dmi", "icons/obj/tools.dmi"]);
console.log("split-sheets: 44 cut states match their sheets; paths ok");
