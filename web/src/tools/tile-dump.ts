// tile-dump - One map tile as the list of appearances a living player would see there, in appearance-dump's
// per-tile format ({x, y, appearances}). Shared by station-dump.ts (the whole station) and
// client-dump.ts (the tiles around a client's eye).

import type { VM } from "../vm/interpreter.js";
import type { DMAtom } from "../vm/world.js";
import { DMObject, live } from "../vm/objects.js";
import { buildAppearance, type BuiltAppearance } from "../appearance/appearance.js";

// SEE_INVISIBLE_LIVING (code/__DEFINES/sight.dm) = 25: what a normal (non-ghost) player sees. An
// atom with invisibility above that (INVISIBILITY_LIGHTING objects are 20, still included;
// INVISIBILITY_ABSTRACT/landmarks etc. are 101, excluded) is left out, matching what BYOND would
// actually show a living player standing there -- not hidden or added beyond that rule.
export const SEE_INVISIBLE_LIVING = 25;

export interface Tile {
	x: number;
	y: number;
	appearances: BuiltAppearance[];
}

function invisibilityOf(a: DMAtom): number {
	const v = a.getVar("invisibility");
	return typeof v === "number" ? v : 0;
}

/** The tile at (x, y, z), or null if there is no turf there. `counts` (optional) is incremented
 *  with how many objs/mobs were drawn and how many were hidden by invisibility. `withArea` also adds
 *  the turf's area (BYOND draws an area on each of its turfs; tg's areas are invisibility 20, and
 *  unlit ones carry a /obj/effect/fullbright overlay on the lighting plane). */
export function buildTile(vm: VM, x: number, y: number, z: number, counts?: { drawn: number; hidden: number }, withArea = false): Tile | null {
	const turf = vm.map.turfAt(x, y, z);
	if (!turf) return null;
	const appearances: BuiltAppearance[] = [buildAppearance(turf)];
	const area = withArea ? live(vm.getField(turf, "loc")) : null;
	if (area instanceof DMObject && invisibilityOf(area as DMAtom) <= SEE_INVISIBLE_LIVING) appearances.push(buildAppearance(area));
	for (const c of turf.contents) {
		if (invisibilityOf(c) > SEE_INVISIBLE_LIVING) {
			if (counts) counts.hidden++;
			continue;
		}
		appearances.push(buildAppearance(c));
		if (counts) counts.drawn++;
	}
	appearances.sort((a, b) => a.plane - b.plane || a.layer - b.layer);
	return { x, y, appearances };
}
