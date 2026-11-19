// client-view-dump - What a connected player would see, as plain data (split out of client-dump.ts so
// the browser worker can build it too; no Node imports). For each client: its mob, eye (ref and x/y/z),
// view, client.screen (type, screen_loc and the appearance in station.json's format), client.images
// count, and the messages sent to it (counts by type, plus the first few of each type in full).
// Also eyeTile {x,y,z}: the turf client.eye is on, and viewTiles: every tile within `view`
// of it (a (2*view+1) square, clipped at the map edge) in station.json's tile format (tile-dump.ts).
// Split out of client-view.ts, which keeps the per-tick view updates.

import type { VM } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { refOf } from "../vm/refs.js";
import { stringify } from "../vm/value.js";
import { DMAtom } from "../vm/world.js";
import { buildAppearance } from "../appearance/appearance.js";
import type { OutMsg } from "../vm/clients.js";
import { baseViewOf, viewAround } from "./view-sight.js";

const FIRST_OF_EACH = 3;
const MAX_TEXT = 2000;

function trim(m: OutMsg): OutMsg {
	const out = { ...m };
	for (const k of ["text", "html", "params"]) {
		const v = out[k];
		if (typeof v === "string" && v.length > MAX_TEXT) out[k] = v.slice(0, MAX_TEXT) + `... (${v.length} chars)`;
	}
	return out;
}

function atomInfo(vm: VM, v: unknown) {
	const a = live(v as never);
	if (!(a instanceof DMObject)) return null;
	const info: Record<string, unknown> = { ref: refOf(a), type: a.type.path, name: stringify(a) };
	if (a instanceof DMAtom) {
		info.x = vm.getField(a, "x");
		info.y = vm.getField(a, "y");
		info.z = vm.getField(a, "z");
	}
	return info;
}

/** Every connected client's view, as client.json's data (JSON-safe, structured-clone-safe). Icon
 *  paths of runtime-built icons (vm.runtimeIcons keys) are left as they are; client-dump.ts turns them into files. */
export function buildClientView(vm: VM): { builtAt: string; worldTime: number; clients: Record<string, unknown>[] } {
	const clients = vm.clients.list.map((c) => {
		const ck = stringify(c.getVar("ckey"));
		const screen = live(c.getVar("screen"));
		const images = live(c.getVar("images"));
		const screenObjs = screen instanceof DMList
			? screen.items.map((x) => {
				const o = live(x);
				if (!(o instanceof DMObject)) return { value: String(o) };
				return { type: o.type.path, screen_loc: o.hasVar("screen_loc") ? live(o.getVar("screen_loc")) : null, appearance: buildAppearance(o) };
			})
			: [];
		const mine = vm.clients.outbox.filter((m) => m.client === ck);
		const counts: Record<string, number> = {};
		const firsts: OutMsg[] = [];
		for (const m of mine) {
			counts[m.type] = (counts[m.type] ?? 0) + 1;
			if (counts[m.type] <= FIRST_OF_EACH) firsts.push(trim(m));
		}
		const view = live(c.getVar("view"));
		// The mob's sight vars: which invisibility levels, and how far in the dark, it sees.
		const m = live(c.getVar("mob"));
		const sight = m instanceof DMObject
			? Object.fromEntries(["see_invisible", "see_in_dark", "sight"].map((k) => [k, live(vm.getField(m, k))]))
			: null;
		const { eyeTile, viewTiles } = viewAround(vm, c);
		return {
			key: c.getVar("key"),
			ckey: ck,
			mob: atomInfo(vm, c.getVar("mob")),
			eye: atomInfo(vm, c.getVar("eye")),
			view,
			baseView: baseViewOf(vm, c),
			eyeTile,
			perspective: live(c.getVar("perspective")),
			sight,
			holder: atomInfo(vm, c.hasVar("holder") ? c.getVar("holder") : null),
			screenCount: screenObjs.length,
			screen: screenObjs,
			imagesCount: images instanceof DMList ? images.len : 0,
			outbox: { total: mine.length, counts, first: firsts },
			viewTiles,
		};
	});
	return { builtAt: new Date().toISOString(), worldTime: vm.sched.time, clients };
}
