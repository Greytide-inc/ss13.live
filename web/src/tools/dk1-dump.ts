// dk1-dump - One line per turf of the whole world (type, colour, area, flags, opacity, atmos neighbours, air, non-mob contents),
// for comparing what the arrivals shuttle dock leaves behind between two builds. boot.ts calls it when DK_DUMP=FILE is set,
// at the first tick boundary at or after world.time DK_DUMP_AT.
import type { VM } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { Kind, type DMAtom } from "../vm/world.js";
import { jsonEncode } from "../vm/natives-text.js";
import type { Value } from "../vm/value.js";

const s = (v: Value): string => (v === null || v === undefined ? "" : typeof v === "object" && v instanceof DMObject && !(v instanceof DMList) ? `<${v.type.path}>` : v instanceof DMList ? jsonEncode(v) : String(v));

export function dumpWorld(vm: VM): string {
	const out: string[] = [];
	const m = vm.map;
	for (let z = 1; z <= m.maxz; z++) for (let y = 1; y <= m.maxy; y++) for (let x = 1; x <= m.maxx; x++) {
		const t = m.turfAt(x, y, z);
		if (!t) continue;
		const area = t.loc as DMAtom | null;
		const adj = live(t.getVar("atmos_adjacent_turfs"));
		const adjS = adj instanceof DMList ? adj.items.map((a) => { const q = live(a) as DMAtom; return `${q.x},${q.y}`; }).sort().join(" ") : "";
		const air = live(t.getVar("air"));
		const airS = air instanceof DMObject ? `${s(air.getVar("temperature"))} ${s(air.getVar("gases"))}` : "";
		const objs = t.contents.filter((c) => c.kind !== Kind.Mob).map((c) => `${c.type.path}:${s(c.getVar("name"))}:${s(c.getVar("dir"))}:${s(c.getVar("icon_state"))}:${s(c.getVar("color"))}`).sort().join(";");
		out.push([`${x},${y},${z}`, t.type.path, s(t.getVar("color")), area?.type.path ?? "", s(t.getVar("flags")), s(t.getVar("opacity")), adjS, s(t.getVar("baseturf")), s(t.getVar("dir")), s(t.getVar("icon_state")), airS, objs].join("|"));
	}
	return out.join("\n") + "\n";
}
