// sprite-lookup - one shared helper, used by both draw-client.ts (atom gallery / 5x5 scene, PixiJS)
// and station-client.ts (the whole-station view, plain canvas): finds the DmiState for an
// appearance's icon_state. Split out so both files can share it without station-client.ts pulling
// in draw-client.ts's own top-level `main().catch(...)` (which would eagerly fetch appearances.json).

import type { Dmi } from "../dmi/dmi.js";

/** BYOND allows duplicate state names (e.g. a movement-flagged variant); this takes the
 *  first match. A name that isn't in the sheet falls back to the sheet's "" state, as BYOND does
 *  (OpenDream DMIParser.GetStateOrDefault); only with no "" state either is it undefined (draw nothing).
 *  tg's /obj/effect/fullbright is alphacolors.dmi "white", which has no "white" state: its white
 *  comes from the "" state, and without the fallback every fullbright (space) tile stayed black on the
 *  lighting plane, hiding the parallax behind it. Most tg doors/machines set icon_state "" and draw
 *  through overlays; those sheets have their own "" state or none. */
export function findState(dmi: Dmi, iconState: string) {
	return dmi.states.find((s) => s.name === iconState) ?? dmi.states.find((s) => s.name === "");
}
